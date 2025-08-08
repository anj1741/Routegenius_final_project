package com.routegenius.backend.service;

import com.routegenius.backend.dto.ContactRequest;

public interface ContactService {

    /**
     * Sends a contact message received from the frontend.
     * This typically involves formatting the message and sending it via email.
     * @param request The ContactRequest DTO containing sender details and message.
     */
    void sendContactMessage(ContactRequest request);
}
