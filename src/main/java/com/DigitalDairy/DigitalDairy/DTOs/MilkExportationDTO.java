package com.DigitalDairy.DigitalDairy.DTOs;

import com.DigitalDairy.DigitalDairy.Entity.MilkExportation;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MilkExportationDTO {

    private Long exportId;
    private Long clientId;
    private Long dairyId;
    private LocalDate date;
    private Long paymentId;
    private MilkExportation.Shift shift;
    private BigDecimal quantityLitres;
    private BigDecimal fatContent;
    private String qualityGrade;
    private BigDecimal rateApplied;
    private BigDecimal totalAmount;
}

