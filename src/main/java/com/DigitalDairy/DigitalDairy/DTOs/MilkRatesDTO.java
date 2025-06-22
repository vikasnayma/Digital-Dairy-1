package com.DigitalDairy.DigitalDairy.DTOs;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MilkRatesDTO {
    private Long rateId;
    private Long dairyId;
    private BigDecimal pricePerFat;
    private LocalDate effectiveFrom;
}
