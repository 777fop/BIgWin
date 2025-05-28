package com.bigwin.bigwin.server.web;

import com.bigwin.bigwin.server.domain.entities.DailyReward;
import com.bigwin.bigwin.server.service.DailyRewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/daily-rewards")
@RequiredArgsConstructor
public class DailyRewardController {

    private final DailyRewardService dailyRewardService;

    @PostMapping("/claim")
    public DailyReward claimTodayReward(@AuthenticationPrincipal UserDetails user) {
        return dailyRewardService.claimReward(user.getUsername());
    }

    @GetMapping
    public List<DailyReward> getMyRewards(@AuthenticationPrincipal UserDetails user) {
        return dailyRewardService.getUserRewards(user.getUsername());
    }
}
