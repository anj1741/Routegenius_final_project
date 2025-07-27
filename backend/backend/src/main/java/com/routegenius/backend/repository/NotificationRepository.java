package com.routegenius.backend.repository;

import com.routegenius.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByTimestampDesc(Long userId);
    List<Notification> findByUserIdAndIsReadFalseOrderByTimestampDesc(Long userId);
    Optional<Notification> findByIdAndUserId(Long notificationId, Long userId);
}