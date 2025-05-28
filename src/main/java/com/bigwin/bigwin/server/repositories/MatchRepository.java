package com.bigwin.bigwin.server.repositories;

import com.bigwin.bigwin.server.domain.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {
    Optional<Match> findByApiMatchId(Long apiMatchId);
}
