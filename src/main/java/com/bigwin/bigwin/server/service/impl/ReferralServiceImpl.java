package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.entities.Referral;
import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.repositories.ReferralRepository;
import com.bigwin.bigwin.server.repositories.UserRepository;
import com.bigwin.bigwin.server.service.ReferralService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReferralServiceImpl implements ReferralService {

    private final UserRepository userRepository;
    private final ReferralRepository referralRepository;

    @Override
    public List<Referral> getMyReferrals(String email) {
        User referrer = userRepository.findByEmail(email).orElseThrow();
        return referralRepository.findByReferrer(referrer);
    }
}
