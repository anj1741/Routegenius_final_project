package com.routegenius.backend.repository;

import com.routegenius.backend.entity.Parcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParcelRepository extends JpaRepository<Parcel, Long> {
    Optional<Parcel> findByTrackingId(String trackingId);
    List<Parcel> findBySenderIdOrRecipientId(Long senderId, Long recipientId);
}
