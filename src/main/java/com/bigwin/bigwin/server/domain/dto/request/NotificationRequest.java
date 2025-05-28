package com.bigwin.bigwin.server.domain.dto.request;

import lombok.Data;

@Data
public class NotificationRequest {
    private String title;
    private String content;
    private boolean toAll;
    private Long userId; // Only used if toAll = false
}
