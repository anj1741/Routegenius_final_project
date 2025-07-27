package com.routegenius.backend.controller;

import com.routegenius.backend.dto.RegisterRequest;
import com.routegenius.backend.dto.UserDto;
import com.routegenius.backend.entity.User;
import com.routegenius.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
// FIX: Changed 'ROLE_ADMIN' to 'ADMIN' to match Role.ADMIN.name() from User.java
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final AuthService authService;

    // Get all users (Admin only)
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = authService.getAllUsers();
        List<UserDto> userDtos = users.stream()
                .map(user -> UserDto.builder()
                        .id(user.getId())
                        .firstName(user.getFirstName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    // Get user by ID (Admin only)
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        User user = authService.getUserById(id);
        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
        return ResponseEntity.ok(userDto);
    }

    // Create a new user (Admin only)
    @PostMapping("/users")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody RegisterRequest request) {
        User newUser = authService.createUser(request);
        UserDto userDto = UserDto.builder()
                .id(newUser.getId())
                .firstName(newUser.getFirstName())
                .email(newUser.getEmail())
                .role(newUser.getRole().name())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
    }

    // Update user (Admin only)
    @PutMapping("/users/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody RegisterRequest request) {
        User updatedUser = authService.updateUser(id, request);
        UserDto userDto = UserDto.builder()
                .id(updatedUser.getId())
                .firstName(updatedUser.getFirstName())
                .email(updatedUser.getEmail())
                .role(updatedUser.getRole().name())
                .build();
        return ResponseEntity.ok(userDto);
    }

    // Delete user (Admin only)
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully.");
    }
}
