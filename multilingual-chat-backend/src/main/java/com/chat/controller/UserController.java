package com.chat.controller;

import com.chat.dto.UserDTO;
import com.chat.repository.UserRepository;
import com.chat.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        Long currentUserId = jwtUtil.getUserIdFromToken(token);

        List<UserDTO> users = userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(currentUserId))
                .map(u -> UserDTO.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .preferredLanguage(u.getPreferredLanguage())
                        .about(u.getAbout())
                        .profilePicture(u.getProfilePicture())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody com.chat.dto.UserUpdateDto request) {
        
        String token = authHeader.substring(7);
        Long currentUserId = jwtUtil.getUserIdFromToken(token);

        com.chat.model.User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getAbout() != null) {
            user.setAbout(request.getAbout().trim());
        }
        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }

        user = userRepository.save(user);

        return ResponseEntity.ok(UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .preferredLanguage(user.getPreferredLanguage())
                .about(user.getAbout())
                .profilePicture(user.getProfilePicture())
                .build());
    }
}
