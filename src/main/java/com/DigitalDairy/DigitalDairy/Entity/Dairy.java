package com.DigitalDairy.DigitalDairy.Entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dairies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dairy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dairyId;

    private String name;
    private String location;

    @ManyToOne
    @JoinColumn(name = "operator_id")
    private User operator_id;
}
