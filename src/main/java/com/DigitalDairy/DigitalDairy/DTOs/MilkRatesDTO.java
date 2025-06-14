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
    private Long dairyId; // Only ID here, not full Dairy object
    private BigDecimal fatContent;
    private String qualityGrade;
    private BigDecimal pricePerLitre;
    private LocalDate effectiveFrom;
}
