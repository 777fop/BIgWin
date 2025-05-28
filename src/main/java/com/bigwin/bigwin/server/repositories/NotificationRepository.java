package com.bigwin.bigwin.server.repositories;

import com.bigwin.bigwin.server.domain.entities.Notification;
import com.bigwin.bigwin.server.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser(User user);
    List<Notification> findBySentToAllTrue();
}
