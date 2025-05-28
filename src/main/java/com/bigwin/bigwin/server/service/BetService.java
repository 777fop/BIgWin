package com.bigwin.bigwin.server.service;

import com.bigwin.bigwin.server.domain.Match;
import com.bigwin.bigwin.server.domain.dto.request.PlaceBetRequest;
import com.bigwin.bigwin.server.domain.entities.Bet;

import java.util.List;

public interface BetService {
    Bet placeBet(String email, PlaceBetRequest request);
    List<Bet> getUserBets(String email);
    void settleBetsBasedOnResults();
    void settleBetsForMatch(Match match);
}
