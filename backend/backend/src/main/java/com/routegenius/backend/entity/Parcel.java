package com.routegenius.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "parcels")
public class Parcel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String trackingId;

    @Column(nullable = false)
    private Long senderId;

    @Column(nullable = false)
    private Long recipientId;

    @Column(nullable = false)
    private String senderAddress;

    @Column(nullable = false)
    private String recipientAddress;

    @Column(nullable = false)
    private String senderPhone; // ADDED: To match DB schema
    @Column(nullable = false)
    private String recipientPhone; // ADDED: To match DB schema

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double weight; // Matches 'weight' in DB

    @Column(nullable = false)
    private Double dimensionsLength;
    @Column(nullable = false)
    private Double dimensionsWidth;
    @Column(nullable = false)
    private Double dimensionsHeight;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParcelStatus status;

    @Column(nullable = true)
    private LocalDateTime estimatedDeliveryDate;

    @Column(nullable = true)
    private LocalDateTime actualDeliveryDate;

    @Column(nullable = false)
    private String currentLocation;
    @Column(nullable = false)
    private String currentCity;
    @Column(nullable = false)
    private String currentCountry;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime lastUpdatedAt; // Matches 'last_updated_at' (Hibernate convention)

    // Note: The 'user_id' column in your DB CREATE TABLE is problematic.
    // It's likely from an old mapping where a parcel belonged to a single user.
    // With senderId and recipientId, it's redundant and causing FK issues.
    // We will drop this column from the DB.

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.lastUpdatedAt == null) {
            this.lastUpdatedAt = LocalDateTime.now();
        }
        if (this.trackingId == null || this.trackingId.isEmpty()) {
            this.trackingId = UUID.randomUUID().toString().substring(0, 10).toUpperCase();
        }
        if (this.status == null) {
            this.status = ParcelStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastUpdatedAt = LocalDateTime.now();
    }
}
