package com.routegenius.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data // Lombok annotation for getters, setters, toString, equals, hashCode
@Builder // Lombok annotation for builder pattern
@NoArgsConstructor // Lombok annotation for no-arg constructor
@AllArgsConstructor // Lombok annotation for all-arg constructor
@Entity // Marks this class as a JPA entity
@Table(name = "_user") // Specifies the table name in the database
public class User implements UserDetails { // Implement UserDetails interface

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates ID values
    private Long id;

    @Column(name = "first_name", nullable = false) // Maps to a column named 'first_name', cannot be null
    private String firstName;

    @Column(name = "email", unique = true, nullable = false) // Maps to 'email' column, must be unique and not null
    private String email;

    @Column(name = "password", nullable = false) // Maps to 'password' column, cannot be null
    private String password;

    @Enumerated(EnumType.STRING) // Stores the enum as a String in the database
    @Column(name = "role", nullable = false) // Maps to 'role' column, cannot be null
    private Role role; // User's role (e.g., USER, ADMIN)

    // --- UserDetails Interface Implementations ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Return a list of SimpleGrantedAuthority based on the user's role
        // Spring Security expects roles to be prefixed with "ROLE_" by default
        // However, if you use hasAuthority, it expects the exact string (e.g., "ADMIN")
        // Your SecurityConfig uses Role.ADMIN.name() which is "ADMIN", so we'll use that directly.
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        // Return the email as the username for authentication
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        // For simplicity, always return true. In a real app, manage account expiration.
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // For simplicity, always return true. In a real app, manage account locking.
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // For simplicity, always return true. In a real app, manage credential expiration.
        return true;
    }

    @Override
    public boolean isEnabled() {
        // For simplicity, always return true. In a real app, manage account enabled status.
        return true;
    }
}
