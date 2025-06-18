package com.DigitalDairy.DigitalDairy.DTOs;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {
    private String status;
    private String paymentId;
    private BigDecimal amount;
}
