package com.routegenius.backend.service.impl;

import com.routegenius.backend.dto.JwtAuthResponse;
import com.routegenius.backend.dto.LoginRequest;
import com.routegenius.backend.dto.RegisterRequest;
import com.routegenius.backend.entity.Role;
import com.routegenius.backend.entity.User;
import com.routegenius.backend.exception.ResourceNotFoundException;
import com.routegenius.backend.repository.UserRepository;
import com.routegenius.backend.service.AuthService;
import com.routegenius.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // IMPORTANT: Import this

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional // This is crucial for persistence!
    public JwtAuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists.");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.USER)
                .build();

        userRepository.save(user);
        System.out.println("DEBUG: User saved to repository: " + user.getEmail()); // ADD THIS LINE

        String jwt = jwtService.generateToken(user);
        return JwtAuthResponse.builder()
                .token(jwt)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .roles(Collections.singletonList(user.getRole().name()))
                .build();
    }

    @Override
    public JwtAuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        String jwt = jwtService.generateToken(user);
        return JwtAuthResponse.builder()
                .token(jwt)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .roles(Collections.singletonList(user.getRole().name()))
                .build();
    }

    // New implementation for creating user by admin
    @Override
    @Transactional // Add this annotation for database write operations
    public User createUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists.");
        }
        User user = User.builder()
                .firstName(request.getFirstName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.USER) // Admin can specify role, default to USER
                .build();
        User savedUser = userRepository.save(user);
        System.out.println("DEBUG: Admin created user saved: " + savedUser.getEmail()); // ADD THIS LINE
        return savedUser; // Directly return the saved User entity
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Override
    @Transactional // Add this annotation for database write operations
    public User updateUser(Long id, RegisterRequest request) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // Update fields
        existingUser.setFirstName(request.getFirstName());
        existingUser.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRole() != null) {
            existingUser.setRole(request.getRole());
        }
        User updatedUser = userRepository.save(existingUser);
        System.out.println("DEBUG: User updated: " + updatedUser.getEmail()); // ADD THIS LINE
        return updatedUser;
    }

    @Override
    @Transactional // Add this annotation for database write operations
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
        System.out.println("DEBUG: User deleted with ID: " + id); // ADD THIS LINE
    }
}
