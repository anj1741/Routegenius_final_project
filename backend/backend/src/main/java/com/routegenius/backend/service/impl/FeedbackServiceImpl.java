package com.routegenius.backend.service.impl;

import com.routegenius.backend.dto.FeedbackRequest;
import com.routegenius.backend.dto.FeedbackResponse;
import com.routegenius.backend.entity.Feedback;
import com.routegenius.backend.entity.Parcel;
import com.routegenius.backend.entity.User;
import com.routegenius.backend.exception.ResourceNotFoundException;
import com.routegenius.backend.repository.FeedbackRepository;
import com.routegenius.backend.repository.ParcelRepository;
import com.routegenius.backend.repository.UserRepository;
import com.routegenius.backend.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.routegenius.backend.entity.ParcelStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Lombok annotation to auto-generate constructor for final fields
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ParcelRepository parcelRepository;
    private final UserRepository userRepository;

    /**
     * Submits new feedback for a parcel by a specific user.
     * @param request The FeedbackRequest DTO containing parcelId, rating, and comment.
     * @param userId The ID of the user submitting the feedback (from authenticated context).
     * @return FeedbackResponse DTO of the created feedback.
     */
    @Override
    @Transactional // Ensures the entire method runs as a single database transaction
    public FeedbackResponse submitFeedback(FeedbackRequest request, Long userId) {
        System.out.println("DEBUG (FeedbackServiceImpl): Submitting feedback for Parcel ID: " + request.getParcelId() + " by User ID: " + userId);

        // 1. Find the Parcel
        Parcel parcel = parcelRepository.findById(request.getParcelId())
                .orElseThrow(() -> new ResourceNotFoundException("Parcel", "id", request.getParcelId()));

        // 2. Find the User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // 3. Optional: Check if feedback already exists for this parcel (per user, or any feedback)
        // For simplicity, we'll allow only one feedback per parcel for now.
        // If you want one feedback per user per parcel, you'd need a more complex query.
        if (feedbackRepository.findByParcel(parcel).isPresent()) {
            throw new IllegalArgumentException("Feedback already submitted for this parcel.");
        }

        // Ensure the user submitting feedback is either the sender or recipient of the parcel
        if (!parcel.getSenderId().equals(userId) && !parcel.getRecipientId().equals(userId)) {
            throw new IllegalArgumentException("User is not associated with this parcel as sender or recipient.");
        }

        // Ensure feedback can only be submitted for DELIVERED parcels
        if (!parcel.getStatus().equals(ParcelStatus.DELIVERED)) {
            throw new IllegalArgumentException("Feedback can only be submitted for DELIVERED parcels.");
        }


        // 4. Build the Feedback entity
        Feedback feedback = Feedback.builder()
                .parcel(parcel)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .timestamp(LocalDateTime.now())
                .build();

        // 5. Save the feedback
        Feedback savedFeedback = feedbackRepository.save(feedback);
        System.out.println("DEBUG (FeedbackServiceImpl): Feedback saved with ID: " + savedFeedback.getId());

        // 6. Map to Response DTO
        return mapToFeedbackResponse(savedFeedback);
    }

    /**
     * Retrieves feedback for a specific parcel.
     * @param parcelId The ID of the parcel.
     * @return Optional FeedbackResponse if feedback exists for the parcel, otherwise empty.
     */
    @Override
    @Transactional // ADDED: Ensures the session is open for the entire method call
    public Optional<FeedbackResponse> getFeedbackByParcelId(Long parcelId) {
        System.out.println("DEBUG (FeedbackServiceImpl): Getting feedback for Parcel ID: " + parcelId);
        Parcel parcel = parcelRepository.findById(parcelId)
                .orElseThrow(() -> new ResourceNotFoundException("Parcel", "id", parcelId)); // Ensure parcel exists

        Optional<Feedback> feedback = feedbackRepository.findByParcel(parcel);
        System.out.println("DEBUG (FeedbackServiceImpl): Found feedback for Parcel ID " + parcelId + ": " + feedback.isPresent());
        return feedback.map(this::mapToFeedbackResponse); // Map to DTO if present
    }

    /**
     * Retrieves all feedback entries. (Typically for Admin use).
     * @return A list of FeedbackResponse DTOs.
     */
    @Override
    @Transactional
    public List<FeedbackResponse> getAllFeedback() {
        System.out.println("DEBUG (FeedbackServiceImpl): Getting all feedback.");
        return feedbackRepository.findAll().stream()
                .map(this::mapToFeedbackResponse)
                .collect(Collectors.toList());
    }

    /**
     * Deletes a feedback entry by its ID. (Typically for Admin use).
     * @param feedbackId The ID of the feedback to delete.
     */
    @Override
    @Transactional
    public void deleteFeedback(Long feedbackId) {
        System.out.println("DEBUG (FeedbackServiceImpl): Deleting feedback with ID: " + feedbackId);
        if (!feedbackRepository.existsById(feedbackId)) {
            throw new ResourceNotFoundException("Feedback", "id", feedbackId);
        }
        feedbackRepository.deleteById(feedbackId);
        System.out.println("DEBUG (FeedbackServiceImpl): Feedback with ID " + feedbackId + " deleted successfully.");
    }

    /**
     * Helper method to map Feedback entity to FeedbackResponse DTO.
     * @param feedback The Feedback entity.
     * @return The FeedbackResponse DTO.
     */
    private FeedbackResponse mapToFeedbackResponse(Feedback feedback) {
        // Fetch sender and recipient details for convenience in the response
        User user = feedback.getUser();
        Parcel parcel = feedback.getParcel();

        return FeedbackResponse.builder()
                .id(feedback.getId())
                .parcelId(parcel.getId())
                .parcelTrackingId(parcel.getTrackingId())
                .userId(user.getId())
                .userEmail(user.getEmail())
                .userFirstName(user.getFirstName())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .timestamp(feedback.getTimestamp())
                .build();
    }
}
