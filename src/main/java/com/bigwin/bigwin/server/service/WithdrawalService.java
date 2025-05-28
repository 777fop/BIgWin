package com.bigwin.bigwin.server.service;

import com.bigwin.bigwin.server.domain.entities.Withdrawal;
import com.bigwin.bigwin.server.domain.dto.request.WithdrawalRequest;

import java.util.List;

public interface WithdrawalService {
    Withdrawal requestWithdrawal(String email, WithdrawalRequest request);
    List<Withdrawal> getUserWithdrawals(String email);

    // Admin
    List<Withdrawal> getAllWithdrawals();
    Withdrawal updateWithdrawalStatus(Long id, String status);
}
