package com.routegenius.backend.controller;

import com.routegenius.backend.dto.ParcelRequest;
import com.routegenius.backend.dto.ParcelResponse;
import com.routegenius.backend.entity.User; // ADD THIS IMPORT
import com.routegenius.backend.service.ParcelService;
import com.routegenius.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/parcels")
@RequiredArgsConstructor
public class ParcelController {

    private final ParcelService parcelService;
    private final UserService userService;

    // Admin-only: Get all parcels
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<ParcelResponse>> getAllParcels() {
        List<ParcelResponse> parcels = parcelService.getAllParcels();
        return ResponseEntity.ok(parcels);
    }

    // Admin-only: Create a new parcel
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ParcelResponse> createParcel(@Valid @RequestBody ParcelRequest request) {
        ParcelResponse newParcel = parcelService.createParcel(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(newParcel);
    }

    // Public/Authenticated: Track a parcel by tracking ID
    @GetMapping("/track/{trackingId}")
    public ResponseEntity<ParcelResponse> trackParcel(@PathVariable String trackingId) {
        ParcelResponse parcel = parcelService.getParcelByTrackingId(trackingId);
        return ResponseEntity.ok(parcel);
    }

    // Authenticated User: Get parcels related to the current authenticated user (sender or recipient)
    @GetMapping("/my-parcels")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ParcelResponse>> getMyParcels() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
        User currentUser = userService.getUserByEmail(userEmail); // This line needs the User import

        List<ParcelResponse> parcels = parcelService.getMyParcels(currentUser.getId());
        return ResponseEntity.ok(parcels);
    }

    // Admin-only: Update a parcel
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ParcelResponse> updateParcel(@PathVariable Long id, @Valid @RequestBody ParcelRequest request) {
        ParcelResponse updatedParcel = parcelService.updateParcel(id, request);
        return ResponseEntity.ok(updatedParcel);
    }

    // Admin-only: Delete a parcel
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteParcel(@PathVariable Long id) {
        parcelService.deleteParcel(id);
        return ResponseEntity.noContent().build();
    }
}
