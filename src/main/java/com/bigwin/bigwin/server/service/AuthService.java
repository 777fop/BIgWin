package com.bigwin.bigwin.server.service;


import com.bigwin.bigwin.server.domain.dto.request.AuthRequest;
import com.bigwin.bigwin.server.domain.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(AuthRequest request);
}
