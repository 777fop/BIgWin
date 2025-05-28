package com.bigwin.bigwin.server.web;

import com.bigwin.bigwin.server.domain.entities.Notification;
import com.bigwin.bigwin.server.domain.dto.request.NotificationRequest;
import com.bigwin.bigwin.server.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send") // Admin only
    public void send(@RequestBody NotificationRequest request) {
        notificationService.sendNotification(request);
    }

    @GetMapping("/my")
    public List<Notification> getMyNotifications(Principal principal) {
        return notificationService.getMyNotifications(principal.getName());
    }
}
