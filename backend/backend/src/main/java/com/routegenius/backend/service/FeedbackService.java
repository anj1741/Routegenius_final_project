package com.routegenius.backend.service;

import com.routegenius.backend.dto.FeedbackRequest;
import com.routegenius.backend.dto.FeedbackResponse;

import java.util.List;
import java.util.Optional; // Import Optional for methods that might return null

public interface FeedbackService {

    /**
     * Submits new feedback for a parcel by a specific user.
     * @param request The FeedbackRequest DTO containing parcelId, rating, and comment.
     * @param userId The ID of the user submitting the feedback (from authenticated context).
     * @return FeedbackResponse DTO of the created feedback.
     */
    FeedbackResponse submitFeedback(FeedbackRequest request, Long userId);

    /**
     * Retrieves feedback for a specific parcel.
     * @param parcelId The ID of the parcel.
     * @return Optional FeedbackResponse if feedback exists for the parcel, otherwise empty.
     */
    Optional<FeedbackResponse> getFeedbackByParcelId(Long parcelId);

    /**
     * Retrieves all feedback entries. (Typically for Admin use).
     * @return A list of FeedbackResponse DTOs.
     */
    List<FeedbackResponse> getAllFeedback();

    /**
     * Deletes a feedback entry by its ID. (Typically for Admin use).
     * @param feedbackId The ID of the feedback to delete.
     */
    void deleteFeedback(Long feedbackId);
}
