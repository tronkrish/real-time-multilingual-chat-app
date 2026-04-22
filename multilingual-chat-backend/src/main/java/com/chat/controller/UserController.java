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
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }
}
