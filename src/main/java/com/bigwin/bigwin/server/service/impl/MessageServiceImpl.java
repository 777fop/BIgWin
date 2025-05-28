package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.dto.request.MessageRequest;
import com.bigwin.bigwin.server.domain.entities.Message;
import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.repositories.MessageRepository;
import com.bigwin.bigwin.server.repositories.UserRepository;
import com.bigwin.bigwin.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Override
    public void sendMessage(String senderEmail, MessageRequest request) {
        User sender = userRepository.findByEmail(senderEmail).orElseThrow();
        User receiver = userRepository.findById(request.getReceiverId()).orElseThrow();

        Message message = Message.builder()
                .content(request.getContent())
                .sentAt(LocalDateTime.now())
                .fromAdmin(request.isFromAdmin())
                .sender(sender)
                .receiver(receiver)
                .build();

        messageRepository.save(message);
    }

    @Override
    public List<Message> getConversation(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return messageRepository.findBySenderOrReceiver(user, user);
    }
}
