package com.bigwin.bigwin.server.controller;

import com.bigwin.bigwin.server.domain.entities.Withdrawal;
import com.bigwin.bigwin.server.domain.dto.request.WithdrawalRequest;
import com.bigwin.bigwin.server.service.WithdrawalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/withdrawals")
@RequiredArgsConstructor
public class WithdrawalController {

    private final WithdrawalService withdrawalService;

    @PostMapping("/request")
    public Withdrawal requestWithdrawal(Principal principal, @RequestBody WithdrawalRequest request) {
        return withdrawalService.requestWithdrawal(principal.getName(), request);
    }

    @GetMapping("/my")
    public List<Withdrawal> getMyWithdrawals(Principal principal) {
        return withdrawalService.getUserWithdrawals(principal.getName());
    }

    @GetMapping("/all") // Admin-only
    public List<Withdrawal> getAllWithdrawals() {
        return withdrawalService.getAllWithdrawals();
    }

    @PutMapping("/{id}/status") // Admin-only
    public Withdrawal updateStatus(@PathVariable Long id, @RequestParam String status) {
        return withdrawalService.updateWithdrawalStatus(id, status);
    }
}
