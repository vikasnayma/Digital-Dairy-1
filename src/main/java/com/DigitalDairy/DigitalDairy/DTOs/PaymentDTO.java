package com.DigitalDairy.DigitalDairy.DTOs;



import lombok.*;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentDTO {
    private Long payerId;
    private Long payeeId;
    private String paymentFor;
    private Long referenceId;
    private BigDecimal amount;
}

