package com.DigitalDairy.DigitalDairy.DTOs;



import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentDTO {
    private Long payerId;
    private Long payeeId;
    private String paymentFor;
    private LocalDate paymentDate;
    private List<Long> referenceIds;
    private BigDecimal amount;
}

