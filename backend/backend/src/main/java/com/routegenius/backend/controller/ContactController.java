package com.routegenius.backend.controller;

import com.routegenius.backend.dto.ContactRequest;
import com.routegenius.backend.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // Marks this class as a REST controller
@RequestMapping("/api/v1/contact") // Base path for all endpoints in this controller
@RequiredArgsConstructor // Lombok annotation for constructor injection of final fields
public class ContactController {

    private final ContactService contactService; // Inject the ContactService

    /**
     * Endpoint for users to submit a contact message.
     * This endpoint does NOT require authentication, allowing anyone to send a message.
     *
     * @param request The ContactRequest DTO containing name, email, subject, and message.
     * @return ResponseEntity with a success message and HTTP status 200 (OK).
     */
    @PostMapping // Handles POST requests to /api/v1/contact
    public ResponseEntity<String> submitContactMessage(@Valid @RequestBody ContactRequest request) {
        System.out.println("DEBUG (ContactController): Received contact message from: " + request.getEmail());
        try {
            contactService.sendContactMessage(request);
            return new ResponseEntity<>("Message sent successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            // Catch the RuntimeException thrown by ContactServiceImpl if email sending fails
            System.err.println("ERROR (ContactController): Failed to send contact message: " + e.getMessage());
            return new ResponseEntity<>("Failed to send message: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
