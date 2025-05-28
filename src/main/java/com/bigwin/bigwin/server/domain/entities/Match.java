package com.bigwin.bigwin.server.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long apiMatchId; // ID from API-Football

    private String leagueName;

    private String homeTeam;

    private String awayTeam;

    private LocalDateTime matchDate;

    private String status; // e.g., "scheduled", "live", "finished"

    private Integer homeScore;

    private Integer awayScore;
}
