package com.bigwin.bigwin.server.repositories;


import com.bigwin.bigwin.server.domain.Match;
import com.bigwin.bigwin.server.domain.entities.Bet;
import com.bigwin.bigwin.server.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BetRepository extends JpaRepository<Bet, Long> {
    List<Bet> findByUser(User user);

    List<Bet> findByMatch(Match match);
}
