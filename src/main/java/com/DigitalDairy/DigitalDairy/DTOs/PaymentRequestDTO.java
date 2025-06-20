package com.DigitalDairy.DigitalDairy.DTOs;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {
    private Long payerId;
    private Long payeeId;
    private String paymentFor;
    private List<Long> referenceIds;
    private BigDecimal amount;
}