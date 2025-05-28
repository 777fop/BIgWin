package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.*;
import com.bigwin.bigwin.server.domain.Match;
import com.bigwin.bigwin.server.domain.dto.request.PlaceBetRequest;
import com.bigwin.bigwin.server.domain.entities.Bet;
import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.repositories.BetRepository;
import com.bigwin.bigwin.server.repositories.MatchRepository;
import com.bigwin.bigwin.server.repositories.UserRepository;
import com.bigwin.bigwin.server.service.BetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BetServiceImpl implements BetService {

    private final BetRepository betRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    @Override
    public Bet placeBet(String email, PlaceBetRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Match match = matchRepository.findById(request.getMatchId()).orElseThrow();

        if (!"scheduled".equalsIgnoreCase(match.getStatus())) {
            throw new RuntimeException("You can only bet on scheduled matches.");
        }

        Bet bet = Bet.builder()
                .user(user)
                .match(match)
                .prediction(request.getPrediction())
                .amount(request.getAmount())
                .won(false)
                .settled(false)
                .placedAt(LocalDateTime.now())
                .build();

        return betRepository.save(bet);
    }

    @Override
    public List<Bet> getUserBets(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return betRepository.findByUser(user);
    }

    @Override
    public void settleBetsBasedOnResults() {
        List<Bet> unsettledBets = betRepository.findAll().stream()
                .filter(bet -> !bet.isSettled() && !"scheduled".equalsIgnoreCase(bet.getMatch().getStatus()))
                .toList();

        for (Bet bet : unsettledBets) {
            Match match = bet.getMatch();
            String outcome;

            if (match.getHomeScore() > match.getAwayScore()) {
                outcome = "HOME";
            } else if (match.getHomeScore() < match.getAwayScore()) {
                outcome = "AWAY";
            } else {
                outcome = "DRAW";
            }

            bet.setWon(outcome.equalsIgnoreCase(bet.getPrediction()));
            bet.setSettled(true);
            betRepository.save(bet);
        }
    }

    @Override
    public void settleBetsForMatch(Match match) {
        List<Bet> bets = betRepository.findByMatch(match);

        for (Bet bet : bets) {
            if (match.getHomeScore() == null || match.getAwayScore() == null) continue;

            boolean won = false;
            switch (bet.getPrediction()) {
                case "HOME":
                    won = match.getHomeScore() > match.getAwayScore();
                    break;
                case "AWAY":
                    won = match.getAwayScore() > match.getHomeScore();
                    break;
                case "DRAW":
                    won = match.getHomeScore().equals(match.getAwayScore());
                    break;
            }

            bet.setResult(won ? "WON" : "LOST");
            betRepository.save(bet);
        }
    }
}
