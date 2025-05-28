package com.bigwin.bigwin.server.controller;

import com.bigwin.bigwin.server.domain.entities.UpgradeRequest;
import com.bigwin.bigwin.server.domain.dto.request.UpgradeRequestDto;
import com.bigwin.bigwin.server.service.UpgradeRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/upgrades")
@RequiredArgsConstructor
public class UpgradeRequestController {

    private final UpgradeRequestService upgradeService;

    @PostMapping("/request")
    public UpgradeRequest submitUpgrade(Principal principal, @RequestBody UpgradeRequestDto request) {
        return upgradeService.submitUpgradeRequest(principal.getName(), request);
    }

    @GetMapping("/my")
    public List<UpgradeRequest> getMyUpgrades(Principal principal) {
        return upgradeService.getUserUpgradeRequests(principal.getName());
    }

    @GetMapping("/all") // Admin-only
    public List<UpgradeRequest> getAllUpgrades() {
        return upgradeService.getAllUpgradeRequests();
    }

    @PutMapping("/{id}/status") // Admin-only
    public UpgradeRequest updateStatus(@PathVariable Long id, @RequestParam String status) {
        return upgradeService.updateUpgradeStatus(id, status);
    }
}
