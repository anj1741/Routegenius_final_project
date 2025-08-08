package com.routegenius.backend.util;

import com.routegenius.backend.entity.Parcel;
import com.routegenius.backend.entity.User;
import com.routegenius.backend.exception.ResourceNotFoundException;
import com.routegenius.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ParcelSecurity {

    private final UserRepository userRepository; // Inject UserRepository

    /**
     * Checks if the authenticated user is either the sender or the recipient of the parcel.
     * This is used to authorize access to parcel details for non-admin users.
     *
     * @param parcel The parcel to check access for.
     * @return true if the current user is the sender or recipient, false otherwise.
     */
    public boolean isSenderOrRecipient(Parcel parcel) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() instanceof String) {
            // Not authenticated, or anonymous user. Admins will be handled by @PreAuthorize.
            return false;
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String userEmail = userDetails.getUsername(); // Get email from UserDetails

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        // Check if the current user's ID matches senderId or recipientId
        return currentUser.getId().equals(parcel.getSenderId()) || currentUser.getId().equals(parcel.getRecipientId());
    }
}
