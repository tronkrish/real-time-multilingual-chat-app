package com.chat.controller;

import com.chat.dto.ChatMessageDTO;
import com.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final ChatService chatService;

    @GetMapping("/{userId1}/{userId2}")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(
            @PathVariable Long userId1,
            @PathVariable Long userId2) {
        return ResponseEntity.ok(chatService.getChatHistory(userId1, userId2));
    }

    @PutMapping("/read/{senderId}/{receiverId}")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long senderId,
            @PathVariable Long receiverId) {
        chatService.markMessagesAsRead(senderId, receiverId);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping("/unread/{senderId}/{receiverId}")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @PathVariable Long senderId,
            @PathVariable Long receiverId) {
        long count = chatService.getUnreadCount(senderId, receiverId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
