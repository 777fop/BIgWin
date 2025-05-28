package com.bigwin.bigwin.server.service;

import com.bigwin.bigwin.server.domain.entities.AviatorGame;

import java.util.List;

public interface AviatorService {
    AviatorGame playGame(String email, double betAmount);
    List<AviatorGame> getUserGameHistory(String email);
}
