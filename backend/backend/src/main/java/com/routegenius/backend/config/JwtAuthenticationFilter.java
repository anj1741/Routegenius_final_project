package com.routegenius.backend.config;

import com.routegenius.backend.service.JwtService;
import com.routegenius.backend.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        System.out.println("DEBUG (JwtAuthFilter): Processing request for URL: " + request.getRequestURI());

        // Check if Authorization header is present and starts with "Bearer "
        if (StringUtils.isEmpty(authHeader) || !StringUtils.startsWith(authHeader, "Bearer ")) {
            System.out.println("DEBUG (JwtAuthFilter): No Bearer token found in Authorization header. Continuing filter chain.");
            filterChain.doFilter(request, response); // Continue filter chain if no JWT
            return;
        }

        // Extract JWT token (remove "Bearer " prefix)
        jwt = authHeader.substring(7);
        System.out.println("DEBUG (JwtAuthFilter): Bearer token found. JWT: " + jwt.substring(0, Math.min(jwt.length(), 20)) + "..."); // Print first 20 chars

        try {
            // Extract username (email) from JWT
            userEmail = jwtService.extractUserName(jwt);
            System.out.println("DEBUG (JwtAuthFilter): User email extracted from JWT: " + userEmail);

            // If userEmail is not empty and no authentication is currently set in SecurityContext
            if (StringUtils.isNotEmpty(userEmail)
                    && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Load UserDetails by username (email)
                UserDetails userDetails = userService.userDetailsService()
                        .loadUserByUsername(userEmail);
                System.out.println("DEBUG (JwtAuthFilter): UserDetails loaded for: " + userDetails.getUsername());

                // Validate the token against UserDetails
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // IMPORTANT CHANGE: Explicitly set authentication in the context
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("DEBUG (JwtAuthFilter): Authentication SUCCESS for user: " + userDetails.getUsername());
                } else {
                    System.out.println("DEBUG (JwtAuthFilter): Token NOT valid for user: " + userEmail);
                }
            } else {
                System.out.println("DEBUG (JwtAuthFilter): User email is empty OR authentication already exists for: " + userEmail + ". Current Auth: " + SecurityContextHolder.getContext().getAuthentication());
            }
        } catch (Exception e) {
            System.err.println("ERROR (JwtAuthFilter): JWT processing failed: " + e.getMessage());
            // Do NOT throw the exception here, just log it. Spring Security's ExceptionTranslationFilter will handle it.
        }

        // Final check before continuing the filter chain
        if (SecurityContextHolder.getContext().getAuthentication() != null && SecurityContextHolder.getContext().getAuthentication().isAuthenticated()) {
            System.out.println("DEBUG (JwtAuthFilter): SecurityContextHolder has authenticated user: " + SecurityContextHolder.getContext().getAuthentication().getName());
        } else {
            System.out.println("DEBUG (JwtAuthFilter): SecurityContextHolder does NOT have an authenticated user before filter chain continues.");
        }

        filterChain.doFilter(request, response); // Continue filter chain
    }
}
