package com.bigwin.bigwin.server.repositories;


import com.bigwin.bigwin.server.domain.entities.Message;
import com.bigwin.bigwin.server.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderOrReceiver(User sender, User receiver);
}
