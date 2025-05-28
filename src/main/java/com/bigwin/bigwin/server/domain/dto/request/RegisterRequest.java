package com.bigwin.bigwin.server.domain.dto.request;



import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String adminSecret; // Only works for admin registration
    private String referralCode; // optional

}
