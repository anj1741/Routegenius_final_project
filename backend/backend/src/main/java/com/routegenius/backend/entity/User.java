package com.routegenius.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data // Lombok annotation to generate getters, setters, toString, equals, and hashCode
@Builder // Lombok annotation to provide a builder pattern for object creation
@NoArgsConstructor // Lombok annotation to generate a no-argument constructor
@AllArgsConstructor // Lombok annotation to generate a constructor with all fields
@Entity // Marks this class as a JPA entity
@Table(name = "_user") // Specifies the table name in the database
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING) // Stores the enum as a String in the database
    private Role role;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime lastUpdatedAt;

    // PrePersist method to set createdAt before saving the entity for the first time
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.lastUpdatedAt = LocalDateTime.now();
    }

    // PreUpdate method to set lastUpdatedAt before updating the entity
    @PreUpdate
    protected void onUpdate() {
        this.lastUpdatedAt = LocalDateTime.now();
    }

    // --- UserDetails Interface Methods ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // IMPORTANT CHANGE: Ensure the authority string matches what hasAuthority() expects.
        // If your Role enum stores "ADMIN", then new SimpleGrantedAuthority("ADMIN") is correct.
        // If your Role enum stores "ROLE_ADMIN", then new SimpleGrantedAuthority("ROLE_ADMIN") is correct.
        // We are using hasAuthority("ADMIN") in SecurityConfig, so the authority string should be "ADMIN".
        return List.of(new SimpleGrantedAuthority(role.name())); // Assuming role.name() directly gives "ADMIN" or "USER"
    }

    @Override
    public String getUsername() {
        // In our case, email is the username
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Account is never expired
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Account is never locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credentials are never expired
    }

    @Override
    public boolean isEnabled() {
        return true; // User is always enabled
    }
}
