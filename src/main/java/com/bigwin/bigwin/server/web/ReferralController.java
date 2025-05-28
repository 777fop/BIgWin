package com.bigwin.bigwin.server.web;

import com.bigwin.bigwin.server.domain.entities.Referral;
import com.bigwin.bigwin.server.service.ReferralService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/referrals")
@RequiredArgsConstructor
public class ReferralController {

    private final ReferralService referralService;

    @GetMapping
    public List<Referral> getMyReferrals(@AuthenticationPrincipal UserDetails user) {
        return referralService.getMyReferrals(user.getUsername());
    }
}
