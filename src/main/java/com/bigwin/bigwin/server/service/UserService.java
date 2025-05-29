package com.bigwin.bigwin.server.service;


import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.domain.dto.request.LoginRequest;
import com.bigwin.bigwin.server.domain.dto.request.RegisterRequest;
import com.bigwin.bigwin.server.domain.dto.response.AuthResponse;

import java.util.List;

public interface UserService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);

    List<User> getAllUsers();
    User approveUser(Long id);
    void deleteUser(Long id);
    User getUserProfile(String email);
}
