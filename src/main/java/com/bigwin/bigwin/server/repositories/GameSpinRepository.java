package com.bigwin.bigwin.server.repositories;

import com.bigwin.bigwin.server.domain.entities.GameSpin;
import com.bigwin.bigwin.server.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameSpinRepository extends JpaRepository<GameSpin, Long> {
    List<GameSpin> findByUser(User user);
}
