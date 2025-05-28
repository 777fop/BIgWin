package com.bigwin.bigwin.server.web;

import com.bigwin.bigwin.server.domain.Match;
import com.bigwin.bigwin.server.domain.dto.request.UpdateMatchResultRequest;
import com.bigwin.bigwin.server.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping
    public List<Match> getAllMatches() {
        return matchService.getAllMatches();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update-result")
    public Match updateMatchResult(@RequestBody UpdateMatchResultRequest request) {
        return matchService.updateMatchResult(request);
    }

}
