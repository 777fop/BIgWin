package com.bigwin.bigwin.server.repositories;

import com.bigwin.bigwin.server.domain.entities.Referral;
import com.bigwin.bigwin.server.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReferralRepository extends JpaRepository<Referral, Long> {
    List<Referral> findByReferrer(User referrer);
}
