package com.routegenius.backend.service;

import com.routegenius.backend.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {
    UserDetailsService userDetailsService();
    User getUserByEmail(String email); // Added this method
}
