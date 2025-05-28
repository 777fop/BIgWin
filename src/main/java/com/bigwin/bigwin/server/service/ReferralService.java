package com.bigwin.bigwin.server.service;

import com.bigwin.bigwin.server.domain.entities.Referral;

import java.util.List;

public interface ReferralService {
    List<Referral> getMyReferrals(String email);
}
