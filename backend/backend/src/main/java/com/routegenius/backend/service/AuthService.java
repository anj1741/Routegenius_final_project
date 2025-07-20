package com.routegenius.backend.service;

import com.routegenius.backend.dto.JwtAuthResponse;
import com.routegenius.backend.dto.LoginRequest;
import com.routegenius.backend.dto.RegisterRequest;
import com.routegenius.backend.entity.User;

public interface AuthService {
    User register(RegisterRequest registerRequest);
    JwtAuthResponse login(LoginRequest loginRequest);
}