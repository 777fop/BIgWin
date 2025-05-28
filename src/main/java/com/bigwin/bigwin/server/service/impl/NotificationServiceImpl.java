package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.entities.Notification;
import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.domain.dto.request.NotificationRequest;
import com.bigwin.bigwin.server.repositories.NotificationRepository;
import com.bigwin.bigwin.server.repositories.UserRepository;
import com.bigwin.bigwin.server.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public void sendNotification(NotificationRequest request) {
        if (request.isToAll()) {
            List<User> users = userRepository.findAll();
            users.forEach(user -> {
                Notification notification = Notification.builder()
                        .title(request.getTitle())
                        .content(request.getContent())
                        .sentToAll(true)
                        .sentAt(LocalDateTime.now())
                        .user(user)
                        .build();
                notificationRepository.save(notification);
            });
        } else {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Notification notification = Notification.builder()
                    .title(request.getTitle())
                    .content(request.getContent())
                    .sentToAll(false)
                    .sentAt(LocalDateTime.now())
                    .user(user)
                    .build();
            notificationRepository.save(notification);
        }
    }

    @Override
    public List<Notification> getMyNotifications(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Notification> personal = notificationRepository.findByUser(user);
        List<Notification> broadcast = notificationRepository.findBySentToAllTrue();
        personal.addAll(broadcast);
        return personal;
    }
}
