package com.routegenius.backend.controller;

import com.routegenius.backend.entity.User;
import com.routegenius.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @GetMapping("/me") // Get details of the currently authenticated user
    @PreAuthorize("isAuthenticated()") // Any authenticated user can access their own details
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalEmail = authentication.getName(); // This will be the user's email

        // Fetch user by email from AuthService
        // A direct findByEmail in AuthService would be more efficient, but this works for now
        User user = authService.getAllUsers().stream()
                .filter(u -> u.getEmail().equals(currentPrincipalEmail))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in DB. This should not happen."));

        return ResponseEntity.ok(user);
    }

    // Get user by ID. Only an admin or the user themselves can access this.
    // The 'authentication.principal.id' refers to the ID of the currently logged-in User object.
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or (#id == authentication.principal.id)")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = authService.getUserById(id);
        return ResponseEntity.ok(user);
    }
}