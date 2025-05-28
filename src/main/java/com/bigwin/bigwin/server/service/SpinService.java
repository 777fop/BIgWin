package com.bigwin.bigwin.server.service;

import com.bigwin.bigwin.server.domain.entities.GameSpin;

import java.util.List;

public interface SpinService {
    GameSpin spin(String email);
    List<GameSpin> getUserSpinHistory(String email);
}
