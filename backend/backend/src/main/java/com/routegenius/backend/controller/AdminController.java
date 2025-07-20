package com.routegenius.backend.controller;

import com.routegenius.backend.dto.UserDto;
import com.routegenius.backend.entity.Role;
import com.routegenius.backend.entity.User;
import com.routegenius.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // --- Internal DTO for Admin User Operations (Create/Update) ---
    public static class AdminUserRequest {
        public String firstName;
        // public String lastName; // DELETE THIS LINE
        public String email;
        public String password; // Optional for update, required for create
        public String role;
    }
    // -----------------------------------------------------------------


    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users")
    public ResponseEntity<UserDto> createUser(@RequestBody AdminUserRequest request) {
        if (userRepository.findByEmail(request.email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .build();
        }
        if (request.password == null || request.password.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User();
        user.setFirstName(request.firstName);
        // user.setLastName(request.lastName); // DELETE THIS LINE
        user.setEmail(request.email);
        user.setPassword(passwordEncoder.encode(request.password));
        try {
            user.setRole(Role.valueOf(request.role.toUpperCase()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedUser));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody AdminUserRequest request) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        user.setFirstName(request.firstName);
        // user.setLastName(request.lastName); // DELETE THIS LINE
        user.setEmail(request.email);

        if (request.password != null && !request.password.isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.password));
        }

        try {
            user.setRole(Role.valueOf(request.role.toUpperCase()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(convertToDto(updatedUser));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully.");
    }

    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        // userDto.setLastName(user.getLastName()); // DELETE THIS LINE (if it was uncommented)
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole().name());
        return userDto;
    }
}