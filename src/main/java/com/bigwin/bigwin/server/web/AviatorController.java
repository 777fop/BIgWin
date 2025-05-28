package com.bigwin.bigwin.server.web;

import com.bigwin.bigwin.server.domain.entities.AviatorGame;
import com.bigwin.bigwin.server.service.AviatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/aviator")
@RequiredArgsConstructor
public class AviatorController {

    private final AviatorService aviatorService;

    @PostMapping("/play")
    public AviatorGame play(@RequestParam double betAmount, Principal principal) {
        return aviatorService.playGame(principal.getName(), betAmount);
    }

    @GetMapping("/history")
    public List<AviatorGame> history(Principal principal) {
        return aviatorService.getUserGameHistory(principal.getName());
    }
}
