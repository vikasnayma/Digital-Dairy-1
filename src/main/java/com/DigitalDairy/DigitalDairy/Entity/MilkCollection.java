package com.DigitalDairy.DigitalDairy.Entity;


import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "milk_collections")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class MilkCollection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long collectionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User farmer;

    @ManyToOne
    @JoinColumn(name = "dairy_id", nullable = false)
    private Dairy dairy;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private Shift shift;

    private BigDecimal quantityLitres;
    private BigDecimal fatContent;
    private String qualityGrade;

    private BigDecimal rateApplied;
    private BigDecimal totalAmount;

    public enum Shift {
        MORNING, EVENING
    }
}

