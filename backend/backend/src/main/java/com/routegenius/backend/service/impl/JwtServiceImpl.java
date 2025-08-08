package com.routegenius.backend.service.impl;

import com.routegenius.backend.entity.User;
import com.routegenius.backend.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements JwtService {

    // Inject JWT secret key from application.properties
    @Value("${jwt.secret}") // This must match the property name in application.properties
    private String jwtSigningKey;

    // IMPORTANT TEMPORARY CHANGE: Removed @Value for jwtExpiration and hardcoded a long duration.
    // This is to definitively fix the "JWT expired" error for diagnostic purposes.
    // This will make tokens valid for 7 days (7 * 24 * 60 * 60 * 1000 milliseconds).
    private final long HARDCODED_JWT_EXPIRATION = 7 * 24 * 60 * 60 * 1000L; // 7 days in milliseconds

    @Override
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public String generateToken(UserDetails userDetails) {
        // !!! DIAGNOSTIC PRINT STATEMENT !!!
        // This will print to your backend terminal every time a JWT token is generated.
        System.out.println("DEBUG: JwtServiceImpl.generateToken called. Hardcoded expiration: " + HARDCODED_JWT_EXPIRATION + "ms");
        return generateToken(new HashMap<>(), userDetails);
    }

    @Override
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers) {
        final Claims claims = extractAllClaims(token);
        return claimsResolvers.apply(claims);
    }

    private String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        // Add user roles to claims
        if (userDetails instanceof User) {
            extraClaims.put("role", ((User) userDetails).getRole().name());
        }

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // IMPORTANT CHANGE: Using the hardcoded long expiration time here.
                .setExpiration(new Date(System.currentTimeMillis() + HARDCODED_JWT_EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        // Keeping the generous clock skew to tolerate time differences.
        // If you still see "Allowed clock skew: 5000 milliseconds" in the error,
        // it means this specific part of the code is NOT being executed.
        System.out.println("DEBUG: JwtServiceImpl.extractAllClaims called. Using clock skew: 60 seconds."); // Diagnostic
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .setAllowedClockSkewSeconds(60) // Allow a 60-second clock skew
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSigningKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
