package com.routegenius.backend.dto;

import com.routegenius.backend.entity.ParcelStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParcelResponse {
    private Long id;
    private String trackingId;
    private Long senderId;
    private String senderFirstName;
    private String senderEmail;
    private String senderAddress;
    private String senderPhone; // ADDED
    private Long recipientId;
    private String recipientFirstName;
    private String recipientEmail;
    private String recipientAddress;
    private String recipientPhone; // ADDED
    private String description;
    private Double weight;
    private Double dimensionsLength;
    private Double dimensionsWidth;
    private Double dimensionsHeight;
    private ParcelStatus status;
    private LocalDateTime estimatedDeliveryDate;
    private LocalDateTime actualDeliveryDate;
    private String currentLocation;
    private String currentCity;
    private String currentCountry;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdatedAt;
}
