package com.bigwin.bigwin.server.domain.dto.request;

import lombok.Data;

@Data
public class UpdateMatchResultRequest {
    private Long matchId;
    private Integer homeScore;
    private Integer awayScore;
    private String status; // e.g. "finished", "cancelled", "postponed"
}
