package com.bigwin.bigwin.server.domain.dto.request;

import lombok.Data;

@Data
public class PlaceBetRequest {
    private Long matchId;
    private String prediction; // "HOME", "AWAY", "DRAW"
    private Double amount;
}
