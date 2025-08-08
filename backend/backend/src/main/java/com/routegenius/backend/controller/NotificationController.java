package com.routegenius.backend.controller;

import com.routegenius.backend.entity.Notification;
import com.routegenius.backend.entity.ParcelStatus;
import com.routegenius.backend.entity.User;
import com.routegenius.backend.service.NotificationService;
import com.routegenius.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController { // Removed @PreAuthorize from class level

    private final NotificationService notificationService;
    private final UserService userService;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() instanceof String) {
            throw new IllegalStateException("User is not authenticated.");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String userEmail = userDetails.getUsername();
        User currentUser = userService.getUserByEmail(userEmail);
        return currentUser.getId();
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')") // Allow both ADMIN and USER to get notifications
    public ResponseEntity<List<Notification>> getUserNotifications() {
        Long userId = getCurrentUserId();
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')") // Allow both ADMIN and USER
    public ResponseEntity<List<Notification>> getUnreadUserNotifications() {
        Long userId = getCurrentUserId();
        List<Notification> allNotifications = notificationService.getUserNotifications(userId);
        List<Notification> unreadNotifications = allNotifications.stream()
                .filter(notification -> !notification.isRead())
                .toList();
        return ResponseEntity.ok(unreadNotifications);
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')") // Allow both ADMIN and USER
    public ResponseEntity<Notification> markNotificationAsRead(@PathVariable Long id) {
        Notification updatedNotification = notificationService.markNotificationAsRead(id);
        return ResponseEntity.ok(updatedNotification);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')") // Allow both ADMIN and USER
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generate-draft")
    @PreAuthorize("hasAuthority('ADMIN')") // Only Admin can generate drafts
    public ResponseEntity<Map<String, String>> generateNotificationDraft(@RequestBody Map<String, Object> requestBody) {
        Long parcelId = Long.valueOf(requestBody.get("parcelId").toString());
        ParcelStatus status = ParcelStatus.valueOf(requestBody.get("status").toString());

        System.out.println("Backend DEBUG: NotificationController received request for parcelId: " + parcelId + ", status: " + status);

        notificationService.generateNotificationForParcelStatusChange(parcelId, status);

        return ResponseEntity.ok(Map.of("message", "Notification draft generation initiated successfully."));
    }
}
