package com.routegenius.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "feedback") // Defines the table name in the database
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increments the ID
    private Long id;

    // ManyToOne relationship with Parcel: Many feedback entries can belong to one parcel
    // The 'parcel_id' column in the 'feedback' table will store the ID of the associated Parcel
    @ManyToOne(fetch = FetchType.LAZY) // FetchType.LAZY means load Parcel object only when explicitly accessed
    @JoinColumn(name = "parcel_id", nullable = false) // Foreign key column in 'feedback' table, cannot be null
    private Parcel parcel;

    // ManyToOne relationship with User: Many feedback entries can be from one user
    // The 'user_id' column in the 'feedback' table will store the ID of the user who submitted feedback
    @ManyToOne(fetch = FetchType.LAZY) // FetchType.LAZY means load User object only when explicitly accessed
    @JoinColumn(name = "user_id", nullable = false) // Foreign key column in 'feedback' table, cannot be null
    private User user;

    @Column(nullable = false)
    private Integer rating; // Rating, e.g., 1 to 5 stars, cannot be null

    @Column(length = 500) // Max length for the comment, can be null (default)
    private String comment; // Optional text comment

    @Column(nullable = false)
    private LocalDateTime timestamp; // When the feedback was submitted, cannot be null
}
