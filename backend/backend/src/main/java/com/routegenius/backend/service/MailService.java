package com.routegenius.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value; // Import Value annotation

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}") // Inject the configured email username
    private String fromEmail;

    /**
     * Sends a simple email.
     * This method is asynchronous to avoid blocking the main application thread.
     *
     * @param to The recipient's email address.
     * @param subject The subject line of the email.
     * @param text The body content of the email.
     */
    @Async // This annotation makes the method run in a separate thread
    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom(fromEmail); // Set the 'from' address from application.properties

            System.out.println("DEBUG (MailService): Attempting to send email to: " + to + " with subject: " + subject);
            javaMailSender.send(message);
            System.out.println("DEBUG (MailService): Email sent successfully to: " + to);
        } catch (MailException e) {
            System.err.println("ERROR (MailService): Failed to send email to " + to + ". Error: " + e.getMessage());
            e.printStackTrace();
            // In a real application, you might log this error to a monitoring system
            // or queue the email for a retry.
        }
    }
}
    