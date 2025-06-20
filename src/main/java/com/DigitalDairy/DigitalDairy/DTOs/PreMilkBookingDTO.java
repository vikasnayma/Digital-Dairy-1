package com.DigitalDairy.DigitalDairy.DTOs;

import com.DigitalDairy.DigitalDairy.Entity.PreMilkBooking;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreMilkBookingDTO {
    private Long bookingId;
    private Long farmerId;
    private Long dairyId;
    private Long amount;
    private LocalDate bookingDate;
    private PreMilkBooking.Shift shift;
    private BigDecimal quantityLitres;
    private PreMilkBooking.Status status;
    private PreMilkBooking.PaymentStatus paymentStatus;
}
