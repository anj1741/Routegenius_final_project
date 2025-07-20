package com.routegenius.backend.dto;

import lombok.Data;

@Data
public class JwtAuthResponse {
    private String token;
    private String role;
}
