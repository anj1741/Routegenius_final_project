package com.routegenius.backend.service.impl;

import com.routegenius.backend.dto.ParcelRequest;
import com.routegenius.backend.dto.ParcelResponse;
import com.routegenius.backend.entity.Parcel;
import com.routegenius.backend.entity.ParcelStatus;
import com.routegenius.backend.entity.TrackingEvent;
import com.routegenius.backend.entity.User;
import com.routegenius.backend.exception.ResourceNotFoundException;
import com.routegenius.backend.repository.ParcelRepository;
import com.routegenius.backend.repository.TrackingEventRepository;
import com.routegenius.backend.repository.UserRepository;
import com.routegenius.backend.service.ParcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParcelServiceImpl implements ParcelService {

    private final ParcelRepository parcelRepository;
    private final UserRepository userRepository;
    private final TrackingEventRepository trackingEventRepository;

    @Override
    @Transactional
    public ParcelResponse createParcel(ParcelRequest request) {
        System.out.println("DEBUG (ParcelServiceImpl): createParcel method called for description: " + request.getDescription());

        userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found with ID: " + request.getSenderId()));
        userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with ID: " + request.getRecipientId()));

        Parcel parcel = Parcel.builder()
                .senderId(request.getSenderId())
                .recipientId(request.getRecipientId())
                .senderAddress(request.getSenderAddress())
                .recipientAddress(request.getRecipientAddress())
                .senderPhone(request.getSenderPhone())
                .recipientPhone(request.getRecipientPhone())
                .description(request.getDescription())
                .weight(request.getWeight())
                .dimensionsLength(request.getDimensionsLength())
                .dimensionsWidth(request.getDimensionsWidth())
                .dimensionsHeight(request.getDimensionsHeight())
                .status(request.getStatus() != null ? request.getStatus() : ParcelStatus.PENDING)
                .estimatedDeliveryDate(request.getEstimatedDeliveryDate())
                .actualDeliveryDate(request.getActualDeliveryDate()) // Include actual delivery date in creation
                .currentLocation(request.getCurrentLocation())
                .currentCity(request.getCurrentCity())
                .currentCountry(request.getCurrentCountry())
                .build();

        Parcel savedParcel = parcelRepository.save(parcel);
        System.out.println("DEBUG (ParcelServiceImpl): Parcel saved to repository with ID: " + savedParcel.getId() + ", Tracking ID: " + savedParcel.getTrackingId());

        // Create initial tracking event for the new parcel
        createTrackingEvent(
                savedParcel,
                savedParcel.getStatus(),
                "Parcel created at " + (savedParcel.getCurrentLocation() != null ? savedParcel.getCurrentLocation() : "N/A") + ", " + (savedParcel.getCurrentCity() != null ? savedParcel.getCurrentCity() : "N/A"),
                savedParcel.getCurrentCity(),
                savedParcel.getCurrentCountry()
        );
        System.out.println("DEBUG (ParcelServiceImpl): createTrackingEvent called for initial event.");

        return mapToParcelResponse(savedParcel);
    }

    @Override
    public ParcelResponse getParcelById(Long id) {
        Parcel parcel = parcelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parcel not found with ID: " + id));
        return mapToParcelResponse(parcel);
    }

    @Override
    public ParcelResponse getParcelByTrackingId(String trackingId) {
        Parcel parcel = parcelRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new ResourceNotFoundException("Parcel not found with Tracking ID: " + trackingId));
        return mapToParcelResponse(parcel);
    }

    @Override
    public List<ParcelResponse> getAllParcels() {
        return parcelRepository.findAll().stream()
                .map(this::mapToParcelResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ParcelResponse updateParcel(Long id, ParcelRequest request) {
        System.out.println("DEBUG (ParcelServiceImpl): updateParcel method called for ID: " + id);
        Parcel existingParcel = parcelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parcel not found with ID: " + id));

        // Store old values to detect changes for tracking events
        ParcelStatus oldStatus = existingParcel.getStatus();
        String oldLocation = existingParcel.getCurrentLocation();
        String oldCity = existingParcel.getCurrentCity();
        String oldCountry = existingParcel.getCurrentCountry();
        LocalDateTime oldActualDeliveryDate = existingParcel.getActualDeliveryDate(); // Track old actual delivery date

        // Update parcel fields
        if (request.getSenderId() != null && !request.getSenderId().equals(existingParcel.getSenderId())) {
            userRepository.findById(request.getSenderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sender not found with ID: " + request.getSenderId()));
            existingParcel.setSenderId(request.getSenderId());
        }
        if (request.getRecipientId() != null && !request.getRecipientId().equals(existingParcel.getRecipientId())) {
            userRepository.findById(request.getRecipientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with ID: " + request.getRecipientId()));
            existingParcel.setRecipientId(request.getRecipientId());
        }

        if (request.getSenderAddress() != null) existingParcel.setSenderAddress(request.getSenderAddress());
        if (request.getRecipientAddress() != null) existingParcel.setRecipientAddress(request.getRecipientAddress());
        if (request.getSenderPhone() != null) existingParcel.setSenderPhone(request.getSenderPhone());
        if (request.getRecipientPhone() != null) existingParcel.setRecipientPhone(request.getRecipientPhone());
        if (request.getDescription() != null) existingParcel.setDescription(request.getDescription());
        if (request.getWeight() != null) existingParcel.setWeight(request.getWeight());
        if (request.getDimensionsLength() != null) existingParcel.setDimensionsLength(request.getDimensionsLength());
        if (request.getDimensionsWidth() != null) existingParcel.setDimensionsWidth(request.getDimensionsWidth());
        if (request.getDimensionsHeight() != null) existingParcel.setDimensionsHeight(request.getDimensionsHeight());
        // Only update status if the request provides a non-null status
        if (request.getStatus() != null) existingParcel.setStatus(request.getStatus());
        if (request.getEstimatedDeliveryDate() != null) existingParcel.setEstimatedDeliveryDate(request.getEstimatedDeliveryDate());
        if (request.getActualDeliveryDate() != null) existingParcel.setActualDeliveryDate(request.getActualDeliveryDate());
        if (request.getCurrentLocation() != null) existingParcel.setCurrentLocation(request.getCurrentLocation());
        if (request.getCurrentCity() != null) existingParcel.setCurrentCity(request.getCurrentCity());
        if (request.getCurrentCountry() != null) existingParcel.setCurrentCountry(request.getCurrentCountry());

        Parcel updatedParcel = parcelRepository.save(existingParcel);
        System.out.println("DEBUG (ParcelServiceImpl): Parcel updated and saved to repository with ID: " + updatedParcel.getId());

        // Create tracking event if status or location/city/country changed
        boolean statusChanged = !Objects.equals(oldStatus, updatedParcel.getStatus());
        boolean locationChanged = !Objects.equals(oldLocation, updatedParcel.getCurrentLocation());
        boolean cityChanged = !Objects.equals(oldCity, updatedParcel.getCurrentCity());
        boolean countryChanged = !Objects.equals(oldCountry, updatedParcel.getCurrentCountry());
        boolean actualDeliveryDateChanged = !Objects.equals(oldActualDeliveryDate, updatedParcel.getActualDeliveryDate());


        if (statusChanged || locationChanged || cityChanged || countryChanged || actualDeliveryDateChanged) {
            String eventDescription = "";
            if (statusChanged) {
                eventDescription = "Status changed to " + updatedParcel.getStatus().name().replace("_", " ");
            }
            // Append location changes if they occurred
            if (locationChanged || cityChanged || countryChanged) {
                if (!eventDescription.isEmpty()) {
                    eventDescription += " and "; // Add "and" if status also changed
                }
                eventDescription += "Location updated to " +
                        (updatedParcel.getCurrentLocation() != null ? updatedParcel.getCurrentLocation() : "N/A") + ", " +
                        (updatedParcel.getCurrentCity() != null ? updatedParcel.getCurrentCity() : "N/A") + ", " +
                        (updatedParcel.getCurrentCountry() != null ? updatedParcel.getCurrentCountry() : "N/A");
            }
            // Add event for actual delivery date being set
            if (actualDeliveryDateChanged && updatedParcel.getActualDeliveryDate() != null) {
                if (!eventDescription.isEmpty()) {
                    eventDescription += " and ";
                }
                eventDescription += "Delivered on " + updatedParcel.getActualDeliveryDate().toLocalDate();
            }

            if (eventDescription.isEmpty()) {
                eventDescription = "Parcel details updated"; // Fallback if only minor, non-tracked changes occurred
            }

            createTrackingEvent(
                    updatedParcel,
                    updatedParcel.getStatus(),
                    eventDescription,
                    updatedParcel.getCurrentCity(),
                    updatedParcel.getCurrentCountry()
            );
            System.out.println("DEBUG (ParcelServiceImpl): createTrackingEvent called for update event.");
        }

        return mapToParcelResponse(updatedParcel);
    }

    @Override
    @Transactional
    public void deleteParcel(Long id) {
        System.out.println("DEBUG (ParcelServiceImpl): deleteParcel method called for ID: " + id);
        if (!parcelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Parcel not found with ID: " + id);
        }
        Parcel parcelToDelete = parcelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parcel not found with ID: " + id));
        trackingEventRepository.deleteAll(trackingEventRepository.findByParcelOrderByTimestampAsc(parcelToDelete));
        parcelRepository.deleteById(id);
        System.out.println("DEBUG (ParcelServiceImpl): Parcel and associated tracking events deleted for ID: " + id);
    }

    @Override
    public List<ParcelResponse> getMyParcels(Long userId) {
        // IMPORTANT: Add more logging here
        System.out.println("DEBUG (ParcelServiceImpl): getMyParcels method called for User ID: " + userId);
        List<Parcel> parcels = parcelRepository.findBySenderIdOrRecipientId(userId, userId);
        System.out.println("DEBUG (ParcelServiceImpl): Found " + parcels.size() + " parcels for user ID: " + userId + ". Parcels: " + parcels.stream().map(Parcel::getTrackingId).collect(Collectors.joining(", ")));
        return parcels.stream()
                .map(this::mapToParcelResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TrackingEvent> getParcelTrackingHistory(Long parcelId) {
        System.out.println("DEBUG (ParcelServiceImpl): getParcelTrackingHistory method called for Parcel ID: " + parcelId);
        Parcel parcel = parcelRepository.findById(parcelId)
                .orElseThrow(() -> new ResourceNotFoundException("Parcel not found with ID: " + parcelId));
        List<TrackingEvent> events = trackingEventRepository.findByParcelOrderByTimestampAsc(parcel);
        System.out.println("DEBUG (ParcelServiceImpl): Found " + events.size() + " tracking events for parcel ID: " + parcelId);
        return events;
    }

    private ParcelResponse mapToParcelResponse(Parcel parcel) {
        User sender = userRepository.findById(parcel.getSenderId()).orElse(null);
        User recipient = userRepository.findById(parcel.getRecipientId()).orElse(null);

        return ParcelResponse.builder()
                .id(parcel.getId())
                .trackingId(parcel.getTrackingId())
                .senderId(parcel.getSenderId())
                .senderFirstName(sender != null ? sender.getFirstName() : "Unknown Sender")
                .senderEmail(sender != null ? sender.getEmail() : "unknown@example.com")
                .senderAddress(parcel.getSenderAddress())
                .senderPhone(parcel != null ? parcel.getSenderPhone() : null)
                .recipientId(parcel.getRecipientId())
                .recipientFirstName(recipient != null ? recipient.getFirstName() : "Unknown Recipient")
                .recipientEmail(recipient != null ? recipient.getEmail() : "unknown@example.com")
                .recipientAddress(parcel.getRecipientAddress())
                .recipientPhone(parcel != null ? parcel.getRecipientPhone() : null)
                .description(parcel.getDescription())
                .weight(parcel.getWeight())
                .dimensionsLength(parcel.getDimensionsLength())
                .dimensionsWidth(parcel.getDimensionsWidth())
                .dimensionsHeight(parcel.getDimensionsHeight())
                .status(parcel.getStatus())
                .estimatedDeliveryDate(parcel.getEstimatedDeliveryDate())
                .actualDeliveryDate(parcel.getActualDeliveryDate())
                .currentLocation(parcel.getCurrentLocation())
                .currentCity(parcel.getCurrentCity())
                .currentCountry(parcel.getCurrentCountry())
                .createdAt(parcel.getCreatedAt())
                .lastUpdatedAt(parcel.getLastUpdatedAt())
                .build();
    }

    private void createTrackingEvent(Parcel parcel, ParcelStatus status, String description, String city, String country) {
        System.out.println("DEBUG (ParcelServiceImpl): Attempting to create tracking event for parcel " + parcel.getTrackingId() + " with status " + status + " and description: " + description);
        TrackingEvent event = TrackingEvent.builder()
                .parcel(parcel)
                .status(status)
                .locationDescription(description)
                .city(city)
                .country(country)
                .timestamp(LocalDateTime.now())
                .build();
        trackingEventRepository.save(event);
        System.out.println("DEBUG (ParcelServiceImpl): Successfully created tracking event for parcel " + parcel.getTrackingId() + ".");
    }
}
