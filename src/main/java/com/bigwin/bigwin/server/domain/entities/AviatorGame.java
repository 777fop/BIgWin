package com.bigwin.bigwin.server.domain.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AviatorGame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double betAmount;

    private double multiplier;

    private double winnings;

    private LocalDateTime playedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
