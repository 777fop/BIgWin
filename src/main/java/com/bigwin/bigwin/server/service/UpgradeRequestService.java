package com.bigwin.bigwin.server.service;

import com.bigwin.bigwin.server.domain.entities.UpgradeRequest;
import com.bigwin.bigwin.server.domain.dto.request.UpgradeRequestDto;

import java.util.List;

public interface UpgradeRequestService {
    UpgradeRequest submitUpgradeRequest(String email, UpgradeRequestDto request);
    List<UpgradeRequest> getUserUpgradeRequests(String email);

    // Admin
    List<UpgradeRequest> getAllUpgradeRequests();
    UpgradeRequest updateUpgradeStatus(Long id, String status);
}
