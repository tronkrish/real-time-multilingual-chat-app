package com.chat.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;

    @Column(name = "original_message", columnDefinition = "TEXT", nullable = false)
    private String originalMessage;

    @Column(name = "translated_message", columnDefinition = "TEXT")
    private String translatedMessage;

    @Column(name = "sender_language")
    private String senderLanguage;

    @Column(name = "receiver_language")
    private String receiverLanguage;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String status;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
        if (status == null) {
            status = "sent";
        }
    }
}
