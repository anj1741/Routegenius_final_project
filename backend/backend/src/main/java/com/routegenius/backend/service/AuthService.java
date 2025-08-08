package com.routegenius.backend.service;

import com.routegenius.backend.dto.JwtAuthResponse;
import com.routegenius.backend.dto.LoginRequest;
import com.routegenius.backend.dto.RegisterRequest;
import com.routegenius.backend.entity.User;

import java.util.List;

public interface AuthService {
    JwtAuthResponse register(RegisterRequest request);
    JwtAuthResponse login(LoginRequest request);

    // New method for admin to create users without immediately returning a JWT
    User createUser(RegisterRequest request);

    // Updated to accept an optional search term
    List<User> getAllUsers(String searchTerm);

    // New method to find a user by their email
    User findUserByEmail(String email);

    User getUserById(Long id);
    User updateUser(Long id, RegisterRequest request);
    void deleteUser(Long id);
}
