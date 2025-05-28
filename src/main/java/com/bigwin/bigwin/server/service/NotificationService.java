package com.bigwin.bigwin.server.service;

import com.bigwin.bigwin.server.domain.entities.Notification;
import com.bigwin.bigwin.server.domain.dto.request.NotificationRequest;

import java.util.List;

public interface NotificationService {
    void sendNotification(NotificationRequest request);
    List<Notification> getMyNotifications(String email);
}
