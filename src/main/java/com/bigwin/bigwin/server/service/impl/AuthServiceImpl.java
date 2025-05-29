package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.dto.request.AuthRequest;
import com.bigwin.bigwin.server.domain.dto.response.AuthResponse;
import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.domain.enums.UserRole;
import com.bigwin.bigwin.server.repositories.UserRepository;
import com.bigwin.bigwin.server.security.JwtUtil;
import com.bigwin.bigwin.server.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtils;

    @Override
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtils.generateToken(user);
        return new AuthResponse(token);
    }

    @Override
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User newUser = User.builder()
                .email(request.getEmail())
                .username(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // hash password
                .role(UserRole.USER)
                .enabled(false)
                .approved(false)
                .referralCode(UUID.randomUUID().toString().substring(0, 8))
                .build();

        userRepository.save(newUser);

        String token = jwtUtils.generateToken(newUser);
        return new AuthResponse(token);
    }
}
