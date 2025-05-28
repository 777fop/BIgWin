package com.bigwin.bigwin.server.service;

import com.bigwin.bigwin.server.domain.entities.DailyReward;

import java.util.List;

public interface DailyRewardService {
    DailyReward claimReward(String email);
    List<DailyReward> getUserRewards(String email);
}
