package com.routegenius.backend.controller;

import com.routegenius.backend.dto.RegisterRequest;
import com.routegenius.backend.dto.UserDto;
import com.routegenius.backend.dto.ParcelRequest;
import com.routegenius.backend.dto.ParcelResponse;
import com.routegenius.backend.entity.User;
import com.routegenius.backend.service.AuthService;
import com.routegenius.backend.service.ParcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // Keep this for now, though global CORS should handle it
public class AdminController {

    private final AuthService authService;
    private final ParcelService parcelService;

    // --- User Management Endpoints ---

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers(@RequestParam(required = false) String searchTerm) {
        System.out.println("DEBUG (AdminController): getAllUsers method called. Search term: '" + searchTerm + "'");

        // Get current authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            System.out.println("DEBUG (AdminController): Authenticated user: " + authentication.getName());
            System.out.println("DEBUG (AdminController): User Authorities: " + authentication.getAuthorities()); // CRITICAL LOG
        } else {
            System.out.println("DEBUG (AdminController): No authenticated user found in SecurityContextHolder.");
        }

        List<User> users = authService.getAllUsers(searchTerm);
        System.out.println("DEBUG (AdminController): Fetched " + users.size() + " users from AuthService.");
        List<UserDto> userDtos = users.stream()
                .map(user -> UserDto.builder()
                        .id(user.getId())
                        .firstName(user.getFirstName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .build())
                .collect(Collectors.toList());
        System.out.println("DEBUG (AdminController): Mapped " + userDtos.size() + " users to DTOs.");
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        System.out.println("DEBUG (AdminController): getUserById method reached for ID: " + id);
        User user = authService.getUserById(id);
        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/users")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody RegisterRequest request) {
        System.out.println("DEBUG (AdminController): createUser method reached for email: " + request.getEmail());
        User newUser = authService.createUser(request);
        UserDto userDto = UserDto.builder()
                .id(newUser.getId())
                .firstName(newUser.getFirstName())
                .email(newUser.getEmail())
                .role(newUser.getRole().name())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody RegisterRequest request) {
        System.out.println("DEBUG (AdminController): updateUser method reached for ID: " + id);
        User updatedUser = authService.updateUser(id, request);
        UserDto userDto = UserDto.builder()
                .id(updatedUser.getId())
                .firstName(updatedUser.getFirstName())
                .email(updatedUser.getEmail())
                .role(updatedUser.getRole().name())
                .build();
        return ResponseEntity.ok(userDto);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        System.out.println("DEBUG (AdminController): deleteUser method reached for ID: " + id);
        authService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully.");
    }

    // --- Parcel Management Endpoints (Admin specific) ---
    @GetMapping("/parcels")
    public ResponseEntity<List<ParcelResponse>> getAllParcelsAdmin() {
        System.out.println("DEBUG (AdminController): getAllParcelsAdmin method reached.");
        List<ParcelResponse> parcels = parcelService.getAllParcels();
        return ResponseEntity.ok(parcels);
    }

    @PostMapping("/parcels")
    public ResponseEntity<ParcelResponse> createParcelAdmin(@Valid @RequestBody ParcelRequest request) {
        System.out.println("DEBUG (AdminController): createParcelAdmin method reached.");
        ParcelResponse newParcel = parcelService.createParcel(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(newParcel);
    }

    @PutMapping("/parcels/{id}")
    public ResponseEntity<ParcelResponse> updateParcelAdmin(@PathVariable Long id, @Valid @RequestBody ParcelRequest request) {
        System.out.println("DEBUG (AdminController): updateParcelAdmin method reached.");
        ParcelResponse updatedParcel = parcelService.updateParcel(id, request);
        return ResponseEntity.ok(updatedParcel);
    }

    @DeleteMapping("/parcels/{id}")
    public ResponseEntity<Void> deleteParcelAdmin(@PathVariable Long id) {
        System.out.println("DEBUG (AdminController): deleteParcelAdmin method reached.");
        parcelService.deleteParcel(id);
        return ResponseEntity.noContent().build();
    }
}
