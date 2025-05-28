package com.bigwin.bigwin.server.domain.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameSpin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double rewardAmount;

    private LocalDateTime spunAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
