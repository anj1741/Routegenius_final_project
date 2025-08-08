package com.routegenius.backend.repository;

import com.routegenius.backend.entity.Feedback;
import com.routegenius.backend.entity.Parcel; // Import Parcel entity
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional; // Import Optional for methods that might not find a result

@Repository // Marks this interface as a Spring Data JPA repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // Custom method to find feedback by a specific parcel.
    // This is useful to check if a parcel already has feedback submitted.
    Optional<Feedback> findByParcel(Parcel parcel);

    // You can add more custom query methods here if needed later, e.g.:
    // List<Feedback> findByUser(User user);
    // List<Feedback> findByRatingGreaterThan(Integer rating);
}
