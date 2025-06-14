package com.DigitalDairy.DigitalDairy.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "pre_milk_bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreMilkBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @ManyToOne
    @JoinColumn(name = "dairy_id", nullable = false)
    private Dairy dairy;

    private LocalDate bookingDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Shift shift;

    private BigDecimal quantityLitres;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status = Status.pending;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 20)
    private PaymentStatus paymentStatus = PaymentStatus.unpaid;

    public enum Shift {
       morning , evening
    }

    public enum Status {
        pending, confirmed, rejected
    }

    public enum PaymentStatus {
        unpaid , paid
    }
}
