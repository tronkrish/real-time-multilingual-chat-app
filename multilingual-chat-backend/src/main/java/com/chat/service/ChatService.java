package com.chat.service;

import com.chat.dto.ChatMessageDTO;
import com.chat.model.Message;
import com.chat.model.User;
import com.chat.repository.MessageRepository;
import com.chat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final TranslationService translationService;
    private final SimpMessagingTemplate messagingTemplate;

    private static final DateTimeFormatter TS_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Process an incoming chat message:
     * 1. Look up sender & receiver
     * 2. Translate into receiver's language
     * 3. Persist to DB
     * 4. Deliver translated message to receiver via WebSocket
     * 5. Send confirmation back to sender
     */
    @SuppressWarnings("null")
    public void processMessage(ChatMessageDTO dto) {

        Long senderId = Objects.requireNonNull(dto.getSenderId(), "Sender ID must not be null");
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Long receiverId = Objects.requireNonNull(dto.getReceiverId(), "Receiver ID must not be null");
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        String originalMessage = dto.getContent();
        String senderLang = sender.getPreferredLanguage();
        String receiverLang = receiver.getPreferredLanguage();

        // Translate
        String translatedMessage = translationService.translate(
                originalMessage, senderLang, receiverLang);

        // Persist
        Message message = Message.builder()
                .senderId(sender.getId())
                .receiverId(receiver.getId())
                .originalMessage(originalMessage)
                .translatedMessage(translatedMessage)
                .senderLanguage(senderLang)
                .receiverLanguage(receiverLang)
                .timestamp(LocalDateTime.now())
                .status("sent")
                .build();

        Message savedMessage = messageRepository.save(message);

        String ts = savedMessage.getTimestamp().format(TS_FORMAT);

        // Send translated message to receiver
        ChatMessageDTO receiverMsg = ChatMessageDTO.builder()
                .senderId(sender.getId())
                .receiverId(receiver.getId())
                .senderName(sender.getName())
                .content(translatedMessage)
                .originalMessage(originalMessage)
                .translatedMessage(translatedMessage)
                .senderLanguage(senderLang)
                .receiverLanguage(receiverLang)
                .timestamp(ts)
                .status("delivered")
                .type("message")
                .build();

        messagingTemplate.convertAndSend(
                "/topic/messages/" + receiver.getId(), receiverMsg);

        // Send confirmation back to sender
        ChatMessageDTO senderMsg = ChatMessageDTO.builder()
                .senderId(sender.getId())
                .receiverId(receiver.getId())
                .senderName(sender.getName())
                .content(originalMessage)
                .originalMessage(originalMessage)
                .translatedMessage(translatedMessage)
                .senderLanguage(senderLang)
                .receiverLanguage(receiverLang)
                .timestamp(ts)
                .status("sent")
                .type("message")
                .build();

        messagingTemplate.convertAndSend(
                "/topic/messages/" + sender.getId(), senderMsg);
    }

    /**
     * Relay typing indicator via WebSocket — no DB persistence needed.
     */
    public void relayTypingIndicator(ChatMessageDTO dto) {
        ChatMessageDTO typingMsg = ChatMessageDTO.builder()
                .senderId(dto.getSenderId())
                .receiverId(dto.getReceiverId())
                .type("typing")
                .build();

        messagingTemplate.convertAndSend(
                "/topic/messages/" + dto.getReceiverId(), typingMsg);
    }

    /**
     * Mark all messages from senderId to receiverId as "read"
     * and notify the sender via WebSocket.
     */
    public void markMessagesAsRead(Long senderId, Long receiverId) {
        int updated = messageRepository.markMessagesAsRead(senderId, receiverId);
        if (updated > 0) {
            log.info("Marked {} messages as read (from {} to {})", updated, senderId, receiverId);

            // Notify sender that their messages were read
            ChatMessageDTO readReceipt = ChatMessageDTO.builder()
                    .senderId(receiverId) // the reader
                    .receiverId(senderId) // the original sender
                    .type("read")
                    .build();

            messagingTemplate.convertAndSend(
                    "/topic/messages/" + senderId, readReceipt);
        }
    }

    /**
     * Get unread message count from a specific sender to receiver.
     */
    public long getUnreadCount(Long senderId, Long receiverId) {
        return messageRepository.countUnreadMessages(senderId, receiverId);
    }

    /**
     * Retrieve chat history between two users.
     */
    public List<ChatMessageDTO> getChatHistory(Long userId1, Long userId2) {
        List<Message> messages = messageRepository.findChatHistory(userId1, userId2);

        return messages.stream().map(m -> {
            String ts = m.getTimestamp().format(TS_FORMAT);

            return ChatMessageDTO.builder()
                    .senderId(m.getSenderId())
                    .receiverId(m.getReceiverId())
                    .content(m.getOriginalMessage())
                    .originalMessage(m.getOriginalMessage())
                    .translatedMessage(m.getTranslatedMessage())
                    .senderLanguage(m.getSenderLanguage())
                    .receiverLanguage(m.getReceiverLanguage())
                    .timestamp(ts)
                    .status(m.getStatus())
                    .type("message")
                    .build();
        }).collect(Collectors.toList());
    }
}