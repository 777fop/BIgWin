package com.bigwin.bigwin.server.web;
import com.bigwin.bigwin.server.domain.entities.GameSpin;
import com.bigwin.bigwin.server.service.SpinService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/spin")
@RequiredArgsConstructor
public class SpinController {

    private final SpinService spinService;

    @PostMapping
    public GameSpin spin(Principal principal) {
        return spinService.spin(principal.getName());
    }

    @GetMapping("/history")
    public List<GameSpin> history(Principal principal) {
        return spinService.getUserSpinHistory(principal.getName());
    }
}
