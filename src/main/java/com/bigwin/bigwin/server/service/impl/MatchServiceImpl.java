package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.Match;
import com.bigwin.bigwin.server.domain.dto.request.UpdateMatchResultRequest;
import com.bigwin.bigwin.server.repositories.MatchRepository;
import com.bigwin.bigwin.server.service.BetService;
import com.bigwin.bigwin.server.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final BetService betService;
    @Override
    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    @Override
    public Match updateMatchResult(UpdateMatchResultRequest request) {
        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found"));

        match.setHomeScore(request.getHomeScore());
        match.setAwayScore(request.getAwayScore());
        match.setStatus(request.getStatus().toLowerCase());

        Match updatedMatch = matchRepository.save(match);

        // Trigger bet settlement
        betService.settleBetsForMatch(updatedMatch);

        return updatedMatch;
    }
}
