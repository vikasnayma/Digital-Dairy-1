package com.DigitalDairy.DigitalDairy.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "milk_rates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MilkRates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rate_id")
    private Long rateId;

    @ManyToOne
    @JoinColumn(name = "dairy_id", nullable = false)
    private Dairy dairy;

    @Column(name = "fat_content", precision = 5, scale = 2)
    private BigDecimal fatContent;

    @Column(name = "quality_grade", length = 20)
    private String qualityGrade;

    @Column(name = "price_per_litre", precision = 10, scale = 2)
    private BigDecimal pricePerLitre;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;
}
