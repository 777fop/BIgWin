package com.bigwin.bigwin.server.repositories;

import com.bigwin.bigwin.server.domain.entities.DailyReward;
import com.bigwin.bigwin.server.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyRewardRepository extends JpaRepository<DailyReward, Long> {
    Optional<DailyReward> findByUserAndDateClaimed(User user, LocalDate date);
    List<DailyReward> findByUser(User user);
}
