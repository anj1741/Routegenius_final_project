package com.routegenius.backend.service;

import com.routegenius.backend.dto.ParcelRequest;
import com.routegenius.backend.dto.ParcelResponse;
import com.routegenius.backend.entity.Parcel;
import com.routegenius.backend.entity.TrackingEvent;

import java.util.List;

public interface ParcelService {
    ParcelResponse createParcel(ParcelRequest request);
    ParcelResponse getParcelById(Long id);
    ParcelResponse getParcelByTrackingId(String trackingId);
    List<ParcelResponse> getAllParcels();
    ParcelResponse updateParcel(Long id, ParcelRequest request);
    void deleteParcel(Long id);
    List<ParcelResponse> getMyParcels(Long userId); // For authenticated users to see their parcels
    List<TrackingEvent> getParcelTrackingHistory(Long parcelId);
}
