package com.chat.controller;

import com.chat.dto.ChatMessageDTO;
import com.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/sendMessage")
    public void sendMessage(@Payload ChatMessageDTO message) {
        chatService.processMessage(message);
    }

    @MessageMapping("/typing")
    public void typing(@Payload ChatMessageDTO message) {
        chatService.relayTypingIndicator(message);
    }

    @MessageMapping("/markRead")
    public void markRead(@Payload ChatMessageDTO message) {
        chatService.markMessagesAsRead(message.getSenderId(), message.getReceiverId());
    }
}
