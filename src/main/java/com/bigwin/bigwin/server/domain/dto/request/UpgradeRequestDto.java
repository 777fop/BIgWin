package com.bigwin.bigwin.server.domain.dto.request;

import com.bigwin.bigwin.server.domain.entities.User;
import com.bigwin.bigwin.server.domain.enums.UpgradeStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpgradeRequestDto {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String plan; // e.g. SILVER, GOLD, PLATINUM

    @Enumerated(EnumType.STRING)
    private UpgradeStatus status;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
