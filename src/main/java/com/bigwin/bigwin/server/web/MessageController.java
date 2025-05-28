package com.bigwin.bigwin.server.web;

import com.bigwin.bigwin.server.domain.dto.request.MessageRequest;
import com.bigwin.bigwin.server.domain.entities.Message;
import com.bigwin.bigwin.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/send")
    public void sendMessage(@RequestBody MessageRequest request, Principal principal) {
        messageService.sendMessage(principal.getName(), request);
    }

    @GetMapping("/conversation")
    public List<Message> getMessages(Principal principal) {
        return messageService.getConversation(principal.getName());
    }
}
