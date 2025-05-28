package com.bigwin.bigwin.server.service;

import com.bigwin.bigwin.server.domain.dto.request.MessageRequest;
import com.bigwin.bigwin.server.domain.entities.Message;

import java.util.List;

public interface MessageService {
    void sendMessage(String senderEmail, MessageRequest request);
    List<Message> getConversation(String email);
}
