package com.bigwin.bigwin.server.repositories;

import com.bigwin.bigwin.server.domain.entities.AviatorGame;
import com.bigwin.bigwin.server.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AviatorGameRepository extends JpaRepository<AviatorGame, Long> {
    List<AviatorGame> findByUser(User user);
}
