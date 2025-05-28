package com.bigwin.bigwin.server.repositories;

import com.bigwin.bigwin.server.domain.entities.Deposit;
import com.bigwin.bigwin.server.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepositRepository extends JpaRepository<Deposit, Long> {
    List<Deposit> findByUser(User user);
}
