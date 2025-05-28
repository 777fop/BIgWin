package com.bigwin.bigwin.server.domain.entities;

import com.bigwin.bigwin.server.domain.entities.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private com.bigwin.bigwin.server.domain.Match match;

    private String prediction; // "HOME", "AWAY", or "DRAW"

    private Double amount;

    private boolean won;

    private boolean settled;

    private LocalDateTime placedAt;
    private String result;
}
