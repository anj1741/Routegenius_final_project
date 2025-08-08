package com.routegenius.backend.controller;

import com.routegenius.backend.dto.FeedbackRequest;
import com.routegenius.backend.dto.FeedbackResponse;
import com.routegenius.backend.entity.User; // Import User entity
import com.routegenius.backend.exception.ResourceNotFoundException; // Import ResourceNotFoundException
import com.routegenius.backend.repository.UserRepository; // Import UserRepository
import com.routegenius.backend.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final UserRepository userRepository; // NEW: Inject UserRepository

    /**
     * Endpoint for users to submit feedback for a delivered parcel.
     * Requires authentication. The user ID is extracted from the authenticated context.
     *
     * @param request The FeedbackRequest DTO.
     * @param userDetails The authenticated user's details.
     * @return ResponseEntity with the created FeedbackResponse.
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FeedbackResponse> submitFeedback(
            @Valid @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Safely retrieve the User entity to get the ID
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found", "email", userDetails.getUsername()));
        Long userId = currentUser.getId();

        System.out.println("DEBUG (FeedbackController): Received feedback submission for Parcel ID: " + request.getParcelId() + " from User ID: " + userId + " (" + currentUser.getEmail() + ")");
        FeedbackResponse response = feedbackService.submitFeedback(request, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Endpoint to retrieve feedback for a specific parcel.
     * Accessible by any authenticated user (sender, recipient, or admin).
     *
     * @param parcelId The ID of the parcel.
     * @return ResponseEntity with the FeedbackResponse (if found) or 404.
     */
    @GetMapping("/parcel/{parcelId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FeedbackResponse> getFeedbackByParcelId(@PathVariable Long parcelId) {
        System.out.println("DEBUG (FeedbackController): Request to get feedback for Parcel ID: " + parcelId);
        Optional<FeedbackResponse> feedback = feedbackService.getFeedbackByParcelId(parcelId);
        return feedback.map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Endpoint to retrieve all feedback entries.
     * Accessible only by users with the 'ADMIN' role.
     *
     * @return ResponseEntity with a list of all FeedbackResponse DTOs.
     */
    @GetMapping("/admin")
    // IMPORTANT FIX: Change hasRole('ADMIN') to hasAuthority('ADMIN')
    // Your User entity's getAuthorities() returns new SimpleGrantedAuthority(role.name()),
    // where role.name() is "ADMIN" or "USER". So, you need to check for authority, not role.
    @PreAuthorize("hasAuthority('ADMIN')") // Fixed for correct role check
    public ResponseEntity<List<FeedbackResponse>> getAllFeedback() {
        System.out.println("DEBUG (FeedbackController): Request to get all feedback (Admin).");
        List<FeedbackResponse> feedbackList = feedbackService.getAllFeedback();
        return ResponseEntity.ok(feedbackList);
    }

    /**
     * Endpoint to delete a feedback entry by ID.
     * Accessible only by users with the 'ADMIN' role.
     *
     * @param feedbackId The ID of the feedback to delete.
     * @return ResponseEntity with HTTP status 204 (No Content).
     */
    @DeleteMapping("/{feedbackId}")
    @PreAuthorize("hasAuthority('ADMIN')") // Fixed for correct role check
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long feedbackId) {
        System.out.println("DEBUG (FeedbackController): Request to delete feedback with ID: " + feedbackId + " (Admin).");
        feedbackService.deleteFeedback(feedbackId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
