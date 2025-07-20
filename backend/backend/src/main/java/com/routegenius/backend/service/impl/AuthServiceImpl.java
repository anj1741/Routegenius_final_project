package com.routegenius.backend.service.impl;

import com.routegenius.backend.dto.JwtAuthResponse;
import com.routegenius.backend.dto.LoginRequest;
import com.routegenius.backend.dto.RegisterRequest;
import com.routegenius.backend.entity.Role;
import com.routegenius.backend.entity.User;
import com.routegenius.backend.repository.UserRepository;
import com.routegenius.backend.service.AuthService;
import com.routegenius.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public User register(RegisterRequest registerRequest) {
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
//        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.USER); // Default role
        // CHANGE THIS LINE:
//        user.setRole(Role.ADMIN); // <<< Make this change ONLY for this step
        return userRepository.save(user);
    }

    @Override
    public JwtAuthResponse login(LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        var user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        var jwt = jwtService.generateToken(user);

        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
        jwtAuthResponse.setToken(jwt);
        jwtAuthResponse.setRole(user.getRole().name());
        return jwtAuthResponse;
    }
}