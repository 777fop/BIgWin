package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.entities.DailyReward;
import com.bigwin.bigwin.server.domain.entities.RewardPolicy;
import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.repositories.DailyRewardRepository;
import com.bigwin.bigwin.server.repositories.RewardPolicyRepository;
import com.bigwin.bigwin.server.repositories.UserRepository;
import com.bigwin.bigwin.server.service.DailyRewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyRewardServiceImpl implements DailyRewardService {

    private final DailyRewardRepository dailyRewardRepository;
    private final UserRepository userRepository;
    private final RewardPolicyRepository rewardPolicyRepository;

    @Override
    public DailyReward claimReward(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();

        LocalDate today = LocalDate.now();
        dailyRewardRepository.findByUserAndDateClaimed(user, today).ifPresent(r -> {
            throw new RuntimeException("You have already claimed today's reward.");
        });

        RewardPolicy policy = rewardPolicyRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Reward policy not set by admin."));

        DailyReward reward = DailyReward.builder()
                .user(user)
                .dateClaimed(today)
                .amount(policy.getDailyAmount())
                .build();

        return dailyRewardRepository.save(reward);
    }

    @Override
    public List<DailyReward> getUserRewards(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return dailyRewardRepository.findByUser(user);
    }
}
