package com.bigwin.bigwin.server.service;

import com.bigwin.bigwin.server.domain.Match;
import com.bigwin.bigwin.server.domain.dto.request.UpdateMatchResultRequest;

import java.util.List;

public interface MatchService {
    List<Match> getAllMatches();
    Match updateMatchResult(UpdateMatchResultRequest request);
}
