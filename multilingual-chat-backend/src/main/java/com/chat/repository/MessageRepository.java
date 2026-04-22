package com.chat.repository;

import com.chat.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE " +
           "(m.senderId = :userId1 AND m.receiverId = :userId2) OR " +
           "(m.senderId = :userId2 AND m.receiverId = :userId1) " +
           "ORDER BY m.timestamp ASC")
    List<Message> findChatHistory(@Param("userId1") Long userId1,
                                  @Param("userId2") Long userId2);

    @Query("SELECT COUNT(m) FROM Message m WHERE " +
           "m.senderId = :senderId AND m.receiverId = :receiverId AND m.status != 'read'")
    long countUnreadMessages(@Param("senderId") Long senderId,
                             @Param("receiverId") Long receiverId);

    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.status = 'read' WHERE " +
           "m.senderId = :senderId AND m.receiverId = :receiverId AND m.status != 'read'")
    int markMessagesAsRead(@Param("senderId") Long senderId,
                           @Param("receiverId") Long receiverId);

    @Query("SELECT m FROM Message m WHERE " +
           "((m.senderId = :userId1 AND m.receiverId = :userId2) OR " +
           "(m.senderId = :userId2 AND m.receiverId = :userId1)) " +
           "ORDER BY m.timestamp DESC LIMIT 1")
    Optional<Message> findLastMessage(@Param("userId1") Long userId1,
                                      @Param("userId2") Long userId2);
}
