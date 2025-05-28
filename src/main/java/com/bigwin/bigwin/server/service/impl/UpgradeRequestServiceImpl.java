package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.entities.UpgradeRequest;
import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.domain.dto.request.UpgradeRequestDto;
import com.bigwin.bigwin.server.domain.enums.UpgradeStatus;
import com.bigwin.bigwin.server.repositories.UpgradeRequestRepository;
import com.bigwin.bigwin.server.repositories.UserRepository;
import com.bigwin.bigwin.server.service.UpgradeRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UpgradeRequestServiceImpl implements UpgradeRequestService {

    private final UpgradeRequestRepository upgradeRequestRepository;
    private final UserRepository userRepository;

    @Override
    public UpgradeRequest submitUpgradeRequest(String email, UpgradeRequestDto request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        UpgradeRequest upgrade = UpgradeRequest.builder()
                .plan(request.getPlan())
                .status(UpgradeStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        return upgradeRequestRepository.save(upgrade);
    }

    @Override
    public List<UpgradeRequest> getUserUpgradeRequests(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return upgradeRequestRepository.findByUser(user);
    }

    @Override
    public List<UpgradeRequest> getAllUpgradeRequests() {
        return upgradeRequestRepository.findAll();
    }

    @Override
    public UpgradeRequest updateUpgradeStatus(Long id, String status) {
        UpgradeRequest upgrade = upgradeRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Upgrade request not found"));

        UpgradeStatus newStatus = UpgradeStatus.valueOf(status.toUpperCase());
        upgrade.setStatus(newStatus);
        return upgradeRequestRepository.save(upgrade);
    }
}
