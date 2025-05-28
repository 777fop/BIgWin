package com.bigwin.bigwin.server.service;

import com.bigwin.bigwin.server.domain.entities.Deposit;
import com.bigwin.bigwin.server.domain.dto.request.DepositRequest;

import java.util.List;

public interface DepositService {
    Deposit requestDeposit(String email, DepositRequest request);
    List<Deposit> getUserDeposits(String email);
    List<Deposit> getAllDeposits(); // For admin
    Deposit updateDepositStatus(Long id, String status); // For admin
}
