package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.domain.entities.Withdrawal;
import com.bigwin.bigwin.server.domain.dto.request.WithdrawalRequest;
import com.bigwin.bigwin.server.domain.enums.WithdrawalStatus;
import com.bigwin.bigwin.server.repositories.UserRepository;
import com.bigwin.bigwin.server.repositories.WithdrawalRepository;
import com.bigwin.bigwin.server.service.WithdrawalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WithdrawalServiceImpl implements WithdrawalService {

    private final WithdrawalRepository withdrawalRepository;
    private final UserRepository userRepository;

    @Override
    public Withdrawal requestWithdrawal(String email, WithdrawalRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Withdrawal withdrawal = Withdrawal.builder()
                .amount(request.getAmount())
                .status(WithdrawalStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        return withdrawalRepository.save(withdrawal);
    }

    @Override
    public List<Withdrawal> getUserWithdrawals(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return withdrawalRepository.findByUser(user);
    }

    @Override
    public List<Withdrawal> getAllWithdrawals() {
        return withdrawalRepository.findAll();
    }

    @Override
    public Withdrawal updateWithdrawalStatus(Long id, String status) {
        Withdrawal withdrawal = withdrawalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Withdrawal not found"));

        WithdrawalStatus newStatus = WithdrawalStatus.valueOf(status.toUpperCase());
        withdrawal.setStatus(newStatus);
        return withdrawalRepository.save(withdrawal);
    }
}
