package com.routegenius.backend.service;

import com.routegenius.backend.entity.Notification;
import com.routegenius.backend.entity.ParcelStatus;

import java.util.List;

public interface NotificationService {
    Notification createNotification(Long userId, Long parcelId, String message, ParcelStatus relatedStatus);
    List<Notification> getUserNotifications(Long userId);
    Notification markNotificationAsRead(Long notificationId);
    void deleteNotification(Long notificationId);
    void generateNotificationForParcelStatusChange(Long parcelId, ParcelStatus newStatus); // Ensure this method is present
}
