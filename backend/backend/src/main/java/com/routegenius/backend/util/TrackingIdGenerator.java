package com.routegenius.backend.util;

import java.util.UUID;

public class TrackingIdGenerator {

    public static String generateTrackingId() {
        // Generates a UUID and removes hyphens to make it more compact
        return UUID.randomUUID().toString().replace("-", "").toUpperCase();
    }
}