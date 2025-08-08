package com.routegenius.backend.service.impl;

import com.routegenius.backend.dto.ContactRequest;
import com.routegenius.backend.service.ContactService;
import com.routegenius.backend.service.MailService; // Corrected: Import your existing MailService
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final MailService mailService; // Corrected: Inject your existing MailService

    @Value("${spring.mail.username}") // Assuming you want to send to your own email configured for sending
    private String supportEmailRecipient;

    /**
     * Sends a contact message received from the frontend.
     * This typically involves formatting the message and sending it via email.
     * @param request The ContactRequest DTO containing sender details and message.
     */
    @Override
    public void sendContactMessage(ContactRequest request) { // FIXED: Removed extra 'void'
        System.out.println("DEBUG (ContactServiceImpl): Preparing to send contact message from " + request.getEmail());

        String to = supportEmailRecipient;
        String subject = "[RouteMax Support] " + request.getSubject();
        String body = String.format(
                "New Contact Message from RouteMax:\n\n" +
                        "Sender Name: %s\n" +
                        "Sender Email: %s\n" +
                        "Subject: %s\n" +
                        "Message:\n%s",
                request.getName(),
                request.getEmail(),
                request.getSubject(),
                request.getMessage()
        );

        try {
            mailService.sendEmail(to, subject, body); // Corrected: Call mailService.sendEmail
            System.out.println("DEBUG (ContactServiceImpl): Contact message sent successfully to " + to);
        } catch (Exception e) {
            System.err.println("ERROR (ContactServiceImpl): Failed to send contact message: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send contact message", e);
        }
    }
}
