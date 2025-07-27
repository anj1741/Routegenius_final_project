package com.routegenius.backend.service;

import com.routegenius.backend.dto.JwtAuthResponse;
import com.routegenius.backend.dto.LoginRequest;
import com.routegenius.backend.dto.RegisterRequest;
import com.routegenius.backend.entity.User;

import java.util.List;

public interface AuthService {
    JwtAuthResponse register(RegisterRequest request); // This is for public registration with JWT
    JwtAuthResponse login(LoginRequest request);

    // New method for admin to create users without immediately returning a JWT
    User createUser(RegisterRequest request); // <--- ADD THIS LINE

    List<User> getAllUsers();
    User getUserById(Long id);
    User updateUser(Long id, RegisterRequest request);
    void deleteUser(Long id);
}