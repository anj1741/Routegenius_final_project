package com.routegenius.backend.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.routegenius.backend.entity.Notification;
import com.routegenius.backend.entity.Parcel;
import com.routegenius.backend.entity.ParcelStatus;
import com.routegenius.backend.entity.User;
import com.routegenius.backend.exception.ResourceNotFoundException;
import com.routegenius.backend.repository.NotificationRepository;
import com.routegenius.backend.repository.ParcelRepository;
import com.routegenius.backend.repository.UserRepository;
import com.routegenius.backend.service.MailService;
import com.routegenius.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final ParcelRepository parcelRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final MailService mailService;

    // Use @Value to inject API key from properties.
    // The default value is an empty string, which Canvas should override.
    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public Notification createNotification(Long userId, Long parcelId, String message, ParcelStatus relatedStatus) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        parcelRepository.findById(parcelId)
                .orElseThrow(() -> new ResourceNotFoundException("Parcel not found with ID: " + parcelId));

        Notification notification = Notification.builder()
                .userId(userId)
                .parcelId(parcelId)
                .message(message)
                .relatedStatus(relatedStatus)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    @Override
    @Transactional
    public Notification markNotificationAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void deleteNotification(Long notificationId) {
        if (!notificationRepository.existsById(notificationId)) {
            throw new ResourceNotFoundException("Notification not found with ID: " + notificationId);
        }
        notificationRepository.deleteById(notificationId);
    }

    @Override
    @Transactional
    public void generateNotificationForParcelStatusChange(Long parcelId, ParcelStatus newStatus) {
        System.out.println("DEBUG (NotificationServiceImpl): Entering generateNotificationForParcelStatusChange for parcelId: " + parcelId + ", status: " + newStatus);
        Parcel parcel = parcelRepository.findById(parcelId)
                .orElseThrow(() -> {
                    System.err.println("ERROR (NotificationServiceImpl): Parcel not found for notification generation: " + parcelId);
                    return new ResourceNotFoundException("Parcel not found with ID: " + parcelId);
                });

        User sender = userRepository.findById(parcel.getSenderId())
                .orElseThrow(() -> {
                    System.err.println("ERROR (NotificationServiceImpl): Sender not found for parcel ID: " + parcelId);
                    return new ResourceNotFoundException("Sender not found for parcel ID: " + parcelId);
                });
        User recipient = userRepository.findById(parcel.getRecipientId())
                .orElseThrow(() -> {
                    System.err.println("ERROR (NotificationServiceImpl): Recipient not found for parcel ID: " + parcelId);
                    return new ResourceNotFoundException("Recipient not found for parcel ID: " + parcelId);
                });

        System.out.println("DEBUG (NotificationServiceImpl): Successfully fetched parcel, sender, and recipient.");

        // --- START OF MODIFIED PROMPT ---
        String prompt = String.format(
                "Generate a single, concise, and professional notification message for a user. " +
                        "The parcel has a tracking ID: %s and a new status of: %s. " +
                        "The message should be customer-friendly and should not contain any options, markdown, or extra information. " +
                        "Example: 'Your parcel (ID: ABC123) is now in transit.'",
                parcel.getTrackingId(),
                newStatus.name().replace("_", " ")
        );
        // --- END OF MODIFIED PROMPT ---

        String generatedMessage = "Failed to generate notification content.";

        try {
            System.out.println("DEBUG (NotificationServiceImpl): Attempting to call Gemini API...");
            generatedMessage = callGeminiApi(prompt);
            System.out.println("DEBUG (NotificationServiceImpl): Gemini API call successful.");
        } catch (Exception e) {
            System.err.println("ERROR (NotificationServiceImpl): Exception during Gemini API call: " + e.getMessage());
            e.printStackTrace();
            // Keep the default error message
        }

        Long userIdToNotify = parcel.getRecipientId(); // Typically notify the recipient

        if (userIdToNotify != null) {
            System.out.println("DEBUG (NotificationServiceImpl): Creating notification for userId: " + userIdToNotify + " with message: " + generatedMessage);
            createNotification(userIdToNotify, parcel.getId(), generatedMessage, newStatus);
            System.out.println("DEBUG (NotificationServiceImpl): Notification created successfully.");

            // ADDED EMAIL SENDING LOGIC HERE
            User userToNotify = userRepository.findById(userIdToNotify)
                    .orElseThrow(() -> new ResourceNotFoundException("User to notify not found with ID: " + userIdToNotify));
            String recipientEmail = userToNotify.getEmail();
            String emailSubject = "RouteGenius Parcel Update: " + parcel.getTrackingId() + " - " + newStatus.name().replace("_", " ");

            mailService.sendEmail(recipientEmail, emailSubject, generatedMessage);
            System.out.println("DEBUG (NotificationServiceImpl): Email sending initiated for " + recipientEmail);
            // END ADDED EMAIL SENDING LOGIC
        } else {
            System.err.println("ERROR (NotificationServiceImpl): userIdToNotify is null, cannot create notification or send email.");
        }
    }

    private String callGeminiApi(String prompt) throws Exception {
        System.out.println("DEBUG (NotificationServiceImpl): Inside callGeminiApi method.");
        // --- START OF MODIFIED API URL ---
        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";
        // --- END OF MODIFIED API URL ---

        // Append API key if it's present. If not, the request will fail with 403.
        if (geminiApiKey != null && !geminiApiKey.isEmpty()) {
            apiUrl += "?key=" + geminiApiKey;
            System.out.println("DEBUG (NotificationServiceImpl): Gemini API Key (first 5 chars): " + geminiApiKey.substring(0, Math.min(geminiApiKey.length(), 5)) + "...");
        } else {
            System.err.println("ERROR (NotificationServiceImpl): Gemini API Key is NOT set. This will cause a 403 Forbidden error.");
            throw new RuntimeException("Gemini API Key is missing. Cannot call Gemini API.");
        }

        System.out.println("DEBUG (NotificationServiceImpl): Full Gemini API URL: " + apiUrl);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> chatHistory = new HashMap<>();
        chatHistory.put("role", "user");
        chatHistory.put("parts", List.of(Map.of("text", prompt)));

        Map<String, Object> payload = new HashMap<>();
        payload.put("contents", List.of(chatHistory));

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

        System.out.println("DEBUG (NotificationServiceImpl): Sending request to Gemini API...");
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(apiUrl, requestEntity, String.class);
        System.out.println("DEBUG (NotificationServiceImpl): Received response from Gemini API. Status: " + responseEntity.getStatusCode());

        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            String responseBody = responseEntity.getBody();
            System.out.println("DEBUG (NotificationServiceImpl): Gemini API Raw Response: " + responseBody);

            JsonNode rootNode = objectMapper.readTree(responseBody);
            JsonNode candidateNode = rootNode.path("candidates").get(0);
            JsonNode contentNode = candidateNode.path("content");
            JsonNode partsNode = contentNode.path("parts").get(0);
            JsonNode textNode = partsNode.path("text");

            System.out.println("DEBUG (NotificationServiceImpl): Successfully parsed Gemini API response.");
            return textNode.asText();
        } else {
            String errorBody = responseEntity.getBody();
            System.err.println("ERROR (NotificationServiceImpl): Gemini API call failed with status: " + responseEntity.getStatusCode() + " Body: " + errorBody);
            throw new RuntimeException("Gemini API call failed with status: " + responseEntity.getStatusCode() + " Body: " + errorBody);
        }
    }
}
