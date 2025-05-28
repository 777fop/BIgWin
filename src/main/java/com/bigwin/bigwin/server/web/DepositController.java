package com.bigwin.bigwin.server.web;

import com.bigwin.bigwin.server.domain.entities.Deposit;
import com.bigwin.bigwin.server.domain.dto.request.DepositRequest;
import com.bigwin.bigwin.server.service.DepositService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/deposits")
@RequiredArgsConstructor
public class DepositController {

    private final DepositService depositService;

    @PostMapping("/request")
    public Deposit requestDeposit(Principal principal, @RequestBody DepositRequest request) {
        return depositService.requestDeposit(principal.getName(), request);
    }

    @GetMapping("/my")
    public List<Deposit> getMyDeposits(Principal principal) {
        return depositService.getUserDeposits(principal.getName());
    }

    @GetMapping("/all") // Admin only
    public List<Deposit> getAllDeposits() {
        return depositService.getAllDeposits();
    }

    @PutMapping("/{id}/status") // Admin only
    public Deposit updateStatus(@PathVariable Long id, @RequestParam String status) {
        return depositService.updateDepositStatus(id, status);
    }
}
