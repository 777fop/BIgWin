package com.bigwin.bigwin.server.web;

import com.bigwin.bigwin.server.domain.dto.request.AuthRequest;
import com.bigwin.bigwin.server.domain.dto.response.AuthResponse;
import com.bigwin.bigwin.server.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
