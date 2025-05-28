package com.bigwin.bigwin.server.web;

import com.bigwin.bigwin.server.domain.Match;
import com.bigwin.bigwin.server.repositories.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchesController {

    private final MatchRepository matchRepository;

    @GetMapping("/upcoming")
    public List<Match> getUpcomingMatches() {
        return matchRepository.findAll(); // You can filter by status="scheduled" if needed
    }
}
