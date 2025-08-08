package com.routegenius.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tracking_events")
public class TrackingEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // IMPORTANT: This was changed to FetchType.EAGER to fix the "no Session" error
    // when fetching tracking history. This is necessary for the backend to send
    // complete TrackingEvent data to the frontend.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parcel_id", nullable = false)
    private Parcel parcel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParcelStatus status; // The status at the time of this event

    @Column(nullable = true)
    private String locationDescription; // e.g., "Departed Warehouse A", "Arrived at Sorting Hub B"

    @Column(nullable = true)
    private String city; // City of the event
    @Column(nullable = true)
    private String country; // Country of the event

    @Column(nullable = false)
    private LocalDateTime timestamp; // When this event occurred

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }
}
