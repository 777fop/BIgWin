package com.bigwin.bigwin.server.repositories;

import com.bigwin.bigwin.server.domain.entities.UpgradeRequest;
import com.bigwin.bigwin.server.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UpgradeRequestRepository extends JpaRepository<UpgradeRequest, Long> {
    List<UpgradeRequest> findByUser(User user);
}
