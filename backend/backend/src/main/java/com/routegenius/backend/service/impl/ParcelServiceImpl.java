package com.routegenius.backend.service.impl;

import com.routegenius.backend.dto.ParcelRequest;
import com.routegenius.backend.dto.ParcelResponse;
import com.routegenius.backend.entity.Parcel;
import com.routegenius.backend.entity.User;
import com.routegenius.backend.exception.ResourceNotFoundException;
import com.routegenius.backend.repository.ParcelRepository;
import com.routegenius.backend.repository.UserRepository;
import com.routegenius.backend.service.ParcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParcelServiceImpl implements ParcelService {

    private final ParcelRepository parcelRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ParcelResponse createParcel(ParcelRequest request) {
        userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found with ID: " + request.getSenderId()));
        userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with ID: " + request.getRecipientId()));

        Parcel parcel = Parcel.builder()
                .senderId(request.getSenderId())
                .recipientId(request.getRecipientId())
                .senderAddress(request.getSenderAddress())
                .recipientAddress(request.getRecipientAddress())
                .senderPhone(request.getSenderPhone()) // ADDED
                .recipientPhone(request.getRecipientPhone()) // ADDED
                .description(request.getDescription())
                .weight(request.getWeight())
                .dimensionsLength(request.getDimensionsLength())
                .dimensionsWidth(request.getDimensionsWidth())
                .dimensionsHeight(request.getDimensionsHeight())
                .status(request.getStatus() != null ? request.getStatus() : com.routegenius.backend.entity.ParcelStatus.PENDING)
                .estimatedDeliveryDate(request.getEstimatedDeliveryDate())
                .currentLocation(request.getCurrentLocation())
                .currentCity(request.getCurrentCity())
                .currentCountry(request.getCurrentCountry())
                .build();

        Parcel savedParcel = parcelRepository.save(parcel);
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
        Parcel existingParcel = parcelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parcel not found with ID: " + id));

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
        if (request.getSenderPhone() != null) existingParcel.setSenderPhone(request.getSenderPhone()); // ADDED
        if (request.getRecipientPhone() != null) existingParcel.setRecipientPhone(request.getRecipientPhone()); // ADDED
        if (request.getDescription() != null) existingParcel.setDescription(request.getDescription());
        if (request.getWeight() != null) existingParcel.setWeight(request.getWeight());
        if (request.getDimensionsLength() != null) existingParcel.setDimensionsLength(request.getDimensionsLength());
        if (request.getDimensionsWidth() != null) existingParcel.setDimensionsWidth(request.getDimensionsWidth());
        if (request.getDimensionsHeight() != null) existingParcel.setDimensionsHeight(request.getDimensionsHeight());
        if (request.getStatus() != null) existingParcel.setStatus(request.getStatus());
        if (request.getEstimatedDeliveryDate() != null) existingParcel.setEstimatedDeliveryDate(request.getEstimatedDeliveryDate());
        if (request.getActualDeliveryDate() != null) existingParcel.setActualDeliveryDate(request.getActualDeliveryDate());
        if (request.getCurrentLocation() != null) existingParcel.setCurrentLocation(request.getCurrentLocation());
        if (request.getCurrentCity() != null) existingParcel.setCurrentCity(request.getCurrentCity());
        if (request.getCurrentCountry() != null) existingParcel.setCurrentCountry(request.getCurrentCountry());

        Parcel updatedParcel = parcelRepository.save(existingParcel);
        return mapToParcelResponse(updatedParcel);
    }

    @Override
    @Transactional
    public void deleteParcel(Long id) {
        if (!parcelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Parcel not found with ID: " + id);
        }
        parcelRepository.deleteById(id);
    }

    @Override
    public List<ParcelResponse> getMyParcels(Long userId) {
        return parcelRepository.findBySenderIdOrRecipientId(userId, userId).stream()
                .map(this::mapToParcelResponse)
                .collect(Collectors.toList());
    }

    // Helper method to map Parcel entity to ParcelResponse DTO
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
                .senderPhone(parcel.getSenderPhone()) // ADDED
                .recipientId(parcel.getRecipientId())
                .recipientFirstName(recipient != null ? recipient.getFirstName() : "Unknown Recipient")
                .recipientEmail(recipient != null ? recipient.getEmail() : "unknown@example.com")
                .recipientAddress(parcel.getRecipientAddress())
                .recipientPhone(parcel.getRecipientPhone()) // ADDED
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
}
