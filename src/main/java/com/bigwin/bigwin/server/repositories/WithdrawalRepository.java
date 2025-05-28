package com.bigwin.bigwin.server.repositories;

import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.domain.entities.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {
    List<Withdrawal> findByUser(User user);
}
