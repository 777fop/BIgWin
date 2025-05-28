package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.domain.dto.request.AuthRequest;
import com.bigwin.bigwin.server.domain.dto.response.AuthResponse;
import com.bigwin.bigwin.server.repositories.UserRepository;
import com.bigwin.bigwin.server.security.JwtUtil;
import com.bigwin.bigwin.server.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse login(AuthRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token);
    }
}
