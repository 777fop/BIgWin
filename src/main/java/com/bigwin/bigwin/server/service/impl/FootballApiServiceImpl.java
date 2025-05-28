package com.bigwin.bigwin.server.service.impl;

import com.bigwin.bigwin.server.domain.Match;
import com.bigwin.bigwin.server.repositories.MatchRepository;
import com.bigwin.bigwin.server.service.BetService;
import com.bigwin.bigwin.server.service.FootballApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FootballApiServiceImpl implements FootballApiService { // ✅ Implements interface

    private final MatchRepository matchRepository;
    private final BetService betService; // ✅ Injected via interface
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${api.football.key}")
    private String apiKey;

    private static final String BASE_URL = "https://v3.football.api-sports.io/";

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-apisports-key", apiKey);
        return headers;
    }

    @Override
    @Scheduled(cron = "0 0 1 * * *")
    public void fetchUpcomingMatches() {
        String date = LocalDate.now().plusDays(1).toString();
        String url = BASE_URL + "fixtures?date=" + date;

        HttpEntity<String> entity = new HttpEntity<>(getHeaders());
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            List<Map<String, Object>> fixtures = (List<Map<String, Object>>) response.getBody().get("response");

            for (Map<String, Object> fixtureData : fixtures) {
                Map<String, Object> fixture = (Map<String, Object>) fixtureData.get("fixture");
                Map<String, Object> teams = (Map<String, Object>) fixtureData.get("teams");
                Map<String, Object> league = (Map<String, Object>) fixtureData.get("league");

                Long apiMatchId = Long.valueOf(String.valueOf(fixture.get("id")));
                String leagueName = (String) league.get("name");
                String homeTeam = (String) ((Map<String, Object>) teams.get("home")).get("name");
                String awayTeam = (String) ((Map<String, Object>) teams.get("away")).get("name");
                String dateTimeStr = (String) fixture.get("date");
                LocalDateTime matchDate = LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ISO_DATE_TIME);

                matchRepository.findByApiMatchId(apiMatchId).ifPresentOrElse(existingMatch -> {
                    existingMatch.setLeagueName(leagueName);
                    existingMatch.setHomeTeam(homeTeam);
                    existingMatch.setAwayTeam(awayTeam);
                    existingMatch.setMatchDate(matchDate);
                    existingMatch.setStatus("scheduled");
                    matchRepository.save(existingMatch);
                }, () -> {
                    Match newMatch = Match.builder()
                            .apiMatchId(apiMatchId)
                            .leagueName(leagueName)
                            .homeTeam(homeTeam)
                            .awayTeam(awayTeam)
                            .matchDate(matchDate)
                            .status("scheduled")
                            .build();
                    matchRepository.save(newMatch);
                });
            }
        }
    }

    @Override
    @Scheduled(cron = "0 */10 * * * *")
    public void updateMatchResults() {
        List<Match> scheduledMatches = matchRepository.findAll();

        for (Match match : scheduledMatches) {
            String url = BASE_URL + "fixtures?id=" + match.getApiMatchId();

            HttpEntity<String> entity = new HttpEntity<>(getHeaders());
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> responses = (List<Map<String, Object>>) response.getBody().get("response");
                if (responses.isEmpty()) continue;

                Map<String, Object> fixtureData = responses.get(0);
                Map<String, Object> fixture = (Map<String, Object>) fixtureData.get("fixture");
                Map<String, Object> goals = (Map<String, Object>) fixtureData.get("goals");
                String status = (String) ((Map<String, Object>) fixture.get("status")).get("short");

                Integer homeScore = goals.get("home") != null ? (Integer) goals.get("home") : null;
                Integer awayScore = goals.get("away") != null ? (Integer) goals.get("away") : null;

                match.setStatus(status.toLowerCase());
                match.setHomeScore(homeScore);
                match.setAwayScore(awayScore);

                matchRepository.save(match);

                // ✅ Settle bets after updating match
                betService.settleBetsForMatch(match);
            }
        }
    }
}
