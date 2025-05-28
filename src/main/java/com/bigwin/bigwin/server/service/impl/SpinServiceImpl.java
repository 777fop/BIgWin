package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.entities.GameSpin;
import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.repositories.GameSpinRepository;
import com.bigwin.bigwin.server.repositories.UserRepository;
import com.bigwin.bigwin.server.service.SpinService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SpinServiceImpl implements SpinService {

    private final GameSpinRepository gameSpinRepository;
    private final UserRepository userRepository;

    private final Random random = new Random();

    @Override
    public GameSpin spin(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();

        // Simple random reward logic (e.g. 0, 5, 10, 20)
        double[] rewardOptions = {0.0, 5.0, 10.0, 20.0};
        double reward = rewardOptions[random.nextInt(rewardOptions.length)];

        GameSpin spin = GameSpin.builder()
                .user(user)
                .rewardAmount(reward)
                .spunAt(LocalDateTime.now())
                .build();

        return gameSpinRepository.save(spin);
    }

    @Override
    public List<GameSpin> getUserSpinHistory(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return gameSpinRepository.findByUser(user);
    }
}
