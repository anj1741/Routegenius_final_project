package com.routegenius.backend.entity;

public enum ParcelStatus {
    PENDING,
    DISPATCHED, // Added from DB schema
    IN_TRANSIT,
    DELIVERED,
    EXCEPTION, // Added from DB schema
    RETURNED,
    CANCELLED
}
