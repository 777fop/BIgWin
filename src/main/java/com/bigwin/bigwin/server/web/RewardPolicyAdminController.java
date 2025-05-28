package com.bigwin.bigwin.server.web;

import com.bigwin.bigwin.server.domain.entities.RewardPolicy;
import com.bigwin.bigwin.server.repositories.RewardPolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reward-policy")
@RequiredArgsConstructor
public class RewardPolicyAdminController {

    private final RewardPolicyRepository rewardPolicyRepository;

    @PostMapping("/set")
    public RewardPolicy setPolicy(@RequestParam double amount) {
        RewardPolicy policy = rewardPolicyRepository.findAll().stream().findFirst()
                .orElse(RewardPolicy.builder().build());

        policy.setDailyAmount(amount);
        return rewardPolicyRepository.save(policy);
    }

    @GetMapping
    public RewardPolicy getPolicy() {
        return rewardPolicyRepository.findAll().stream().findFirst()
                .orElse(null);
    }
}
