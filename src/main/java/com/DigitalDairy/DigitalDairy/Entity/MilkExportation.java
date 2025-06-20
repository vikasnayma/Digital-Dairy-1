package com.DigitalDairy.DigitalDairy.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "milk_exportations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MilkExportation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long exportId;

    @ManyToOne
    @JoinColumn(name = "payment_id")
    private PaymentEntity payment;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;  // references users(user_id)

    @ManyToOne
    @JoinColumn(name = "dairy_id", nullable = false)
    private Dairy dairy;   // references dairies(dairy_id)

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Shift shift;

    private BigDecimal quantityLitres;
    private BigDecimal fatContent;
    private String qualityGrade;
    private BigDecimal rateApplied;
    private BigDecimal totalAmount;

    public enum Shift {
        morning,
        evening
    }
}
