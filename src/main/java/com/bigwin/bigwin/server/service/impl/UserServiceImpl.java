package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.entities.Referral;
import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.domain.dto.request.LoginRequest;
import com.bigwin.bigwin.server.domain.dto.request.RegisterRequest;
import com.bigwin.bigwin.server.domain.dto.response.AuthResponse;
import com.bigwin.bigwin.server.domain.enums.UserRole;
import com.bigwin.bigwin.server.repositories.ReferralRepository;
import com.bigwin.bigwin.server.repositories.UserRepository;
import com.bigwin.bigwin.server.security.JwtService;
import com.bigwin.bigwin.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ReferralRepository referralRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    private final String ADMIN_SECRET = "Admin$123@bigwin";

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        UserRole role = UserRole.USER;
        if (ADMIN_SECRET.equals(request.getAdminSecret())) {
            role = UserRole.ADMIN;
        }

        String generatedCode = UUID.randomUUID().toString().substring(0, 8);

        User newUser = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .referralCode(generatedCode)
                .build();

        if (request.getReferralCode() != null) {
            userRepository.findByReferralCode(request.getReferralCode())
                    .ifPresent(referrer -> {
                        newUser.setReferredBy(referrer);
                        referralRepository.save(Referral.builder()
                                .referrer(referrer)
                                .referredEmail(request.getEmail())
                                .dateReferred(LocalDate.now())
                                .build());
                    });
        }

        userRepository.save(newUser);
        String token = jwtService.generateToken(newUser);
        return new AuthResponse(token);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User approveUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setApproved(true);
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }
}
