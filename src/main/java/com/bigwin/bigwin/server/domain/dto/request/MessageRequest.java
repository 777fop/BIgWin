package com.bigwin.bigwin.server.domain.dto.request;

import lombok.Data;

@Data
public class MessageRequest {
    private Long receiverId;     // Who to send the message to
    private String content;
    private boolean fromAdmin;   // Needed so we know if it's admin initiated
}
