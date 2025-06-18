package com.DigitalDairy.DigitalDairy.DTOs;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {
    private Long payerId;
    private Long payeeId;
    private String paymentFor;
    private Long referenceId;
    private BigDecimal amount;
}