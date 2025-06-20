package com.DigitalDairy.DigitalDairy.DTOs;

import com.DigitalDairy.DigitalDairy.Entity.MilkCollection;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MilkCollectionDTO {
    private Long collectionId;
    private Long farmerId;
    private Long dairyId;
    private Long paymentId;
    private LocalDate date;
    private MilkCollection.Shift shift;
    private BigDecimal quantityLitres;
    private BigDecimal fatContent;
    private String qualityGrade;
    private BigDecimal rateApplied;
    private BigDecimal totalAmount;
}
