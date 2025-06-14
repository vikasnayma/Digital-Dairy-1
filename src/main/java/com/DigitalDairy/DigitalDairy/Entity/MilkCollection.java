package com.DigitalDairy.DigitalDairy.Entity;

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
public class MilkCollection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "collection_id")
    private Long collectionId;

    @ManyToOne
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @ManyToOne
    @JoinColumn(name = "dairy_id", nullable = false)
    private Dairy dairy;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Shift shift;

    @Column(name = "quantity_litres", precision = 10, scale = 2)
    private BigDecimal quantityLitres;

    @Column(name = "fat_content", precision = 5, scale = 2)
    private BigDecimal fatContent;

    @Column(name = "quality_grade", length = 20)
    private String qualityGrade;

    @Column(name = "rate_applied", precision = 10, scale = 2)
    private BigDecimal rateApplied;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    public enum Shift {
        morning,
        evening
    }
}


