package com.routegenius.backend.repository;

import com.routegenius.backend.entity.Parcel;
import com.routegenius.backend.entity.TrackingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrackingEventRepository extends JpaRepository<TrackingEvent, Long> {
    // Find all tracking events for a given parcel, ordered by timestamp
    List<TrackingEvent> findByParcelOrderByTimestampAsc(Parcel parcel);
}
    