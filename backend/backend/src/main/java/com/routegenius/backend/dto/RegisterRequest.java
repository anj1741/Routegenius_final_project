package com.routegenius.backend.dto;

import com.routegenius.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String firstName;
    private String email;
    private String password;
    private Role role; // Role can be set during registration (e.g., by admin)
}