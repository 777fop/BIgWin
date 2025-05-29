package com.bigwin.bigwin.server.repositories;

import com.bigwin.bigwin.server.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    Optional<User> findByReferralCode(String referralCode);

}
