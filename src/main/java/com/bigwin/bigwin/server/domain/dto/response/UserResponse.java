package com.bigwin.bigwin.server.domain.dto.response;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private String id;
    private String username;
    private String email;
    private String referralCode;
    private String plan;
    private boolean isAdmin;
    private double balance;
}
