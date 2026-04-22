package com.chat.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDTO {
    private Long senderId;
    private Long receiverId;
    private String content;
    private String senderName;
    private String originalMessage;
    private String translatedMessage;
    private String senderLanguage;
    private String receiverLanguage;
    private String timestamp;
    private String status;
    private String type; // "message", "typing", "read"
}
