package com.routegenius.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponse {
    private Long id;
    private Long parcelId;
    private String parcelTrackingId; // Added for convenience in frontend
    private Long userId;
    private String userEmail; // Added for convenience in frontend
    private String userFirstName; // Added for convenience in frontend
    private Integer rating;
    private String comment;
    private LocalDateTime timestamp;
}
