package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.entities.AviatorGame;
import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.repositories.AviatorGameRepository;
import com.bigwin.bigwin.server.repositories.UserRepository;
import com.bigwin.bigwin.server.service.AviatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AviatorServiceImpl implements AviatorService {

    private final AviatorGameRepository aviatorGameRepository;
    private final UserRepository userRepository;

    private final Random random = new Random();

    @Override
    public AviatorGame playGame(String email, double betAmount) {
        User user = userRepository.findByEmail(email).orElseThrow();

        double multiplier = 1 + (random.nextDouble() * 4); // 1.0x to 5.0x
        double winnings = betAmount * multiplier;

        AviatorGame game = AviatorGame.builder()
                .user(user)
                .betAmount(betAmount)
                .multiplier(Math.round(multiplier * 100.0) / 100.0) // 2 decimal places
                .winnings(Math.round(winnings * 100.0) / 100.0)
                .playedAt(LocalDateTime.now())
                .build();

        return aviatorGameRepository.save(game);
    }

    @Override
    public List<AviatorGame> getUserGameHistory(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return aviatorGameRepository.findByUser(user);
    }
}
