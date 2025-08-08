package com.routegenius.backend.dto;

import com.routegenius.backend.entity.ParcelStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParcelRequest {
    private Long id; // For updates, not for creation
    @NotNull(message = "Sender ID is required")
    private Long senderId;
    @NotNull(message = "Recipient ID is required")
    private Long recipientId;
    @NotBlank(message = "Sender address is required")
    private String senderAddress;
    @NotBlank(message = "Recipient address is required")
    private String recipientAddress;
    @NotBlank(message = "Sender phone is required") // ADDED
    private String senderPhone; // ADDED
    @NotBlank(message = "Recipient phone is required") // ADDED
    private String recipientPhone; // ADDED
    @NotBlank(message = "Description is required")
    private String description;
    @NotNull(message = "Weight is required")
    private Double weight;
    @NotNull(message = "Length is required")
    private Double dimensionsLength;
    @NotNull(message = "Width is required")
    private Double dimensionsWidth;
    @NotNull(message = "Height is required")
    private Double dimensionsHeight;
    private ParcelStatus status;
    private LocalDateTime estimatedDeliveryDate;
    private LocalDateTime actualDeliveryDate;
    @NotBlank(message = "Current location is required")
    private String currentLocation;
    @NotBlank(message = "Current city is required")
    private String currentCity;
    @NotBlank(message = "Current country is required")
    private String currentCountry;
}
