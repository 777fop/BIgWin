package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.entities.Deposit;
import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.domain.dto.request.DepositRequest;
import com.bigwin.bigwin.server.domain.enums.DepositStatus;
import com.bigwin.bigwin.server.repositories.DepositRepository;
import com.bigwin.bigwin.server.repositories.UserRepository;
import com.bigwin.bigwin.server.service.DepositService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepositServiceImpl implements DepositService {

    private final DepositRepository depositRepository;
    private final UserRepository userRepository;

    @Override
    public Deposit requestDeposit(String email, DepositRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Deposit deposit = Deposit.builder()
                .amount(request.getAmount())
                .status(DepositStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        return depositRepository.save(deposit);
    }

    @Override
    public List<Deposit> getUserDeposits(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return depositRepository.findByUser(user);
    }

    @Override
    public List<Deposit> getAllDeposits() {
        return depositRepository.findAll();
    }

    @Override
    public Deposit updateDepositStatus(Long id, String status) {
        Deposit deposit = depositRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deposit not found"));

        DepositStatus newStatus = DepositStatus.valueOf(status.toUpperCase());
        deposit.setStatus(newStatus);
        return depositRepository.save(deposit);
    }
}
