package com.bigwin.bigwin.server.web;

import com.bigwin.bigwin.server.domain.dto.request.PlaceBetRequest;
import com.bigwin.bigwin.server.domain.entities.Bet;
import com.bigwin.bigwin.server.service.BetService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bets")
@RequiredArgsConstructor
public class BetController {

    private final BetService betService;

    @PostMapping
    public Bet placeBet(@AuthenticationPrincipal UserDetails userDetails,
                        @RequestBody PlaceBetRequest request) {
        return betService.placeBet(userDetails.getUsername(), request);
    }

    @GetMapping
    public List<Bet> getUserBets(@AuthenticationPrincipal UserDetails userDetails) {
        return betService.getUserBets(userDetails.getUsername());
    }
}
