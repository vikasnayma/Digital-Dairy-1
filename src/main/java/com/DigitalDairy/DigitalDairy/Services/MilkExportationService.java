package com.DigitalDairy.DigitalDairy.Services;


import com.DigitalDairy.DigitalDairy.DTOs.MilkExportationDTO;
import com.DigitalDairy.DigitalDairy.Entity.Dairy;
import com.DigitalDairy.DigitalDairy.Entity.MilkExportation;
import com.DigitalDairy.DigitalDairy.Entity.PaymentEntity;
import com.DigitalDairy.DigitalDairy.Entity.User;
import com.DigitalDairy.DigitalDairy.Repo.DairyRepository;
import com.DigitalDairy.DigitalDairy.Repo.MilkExportationRepository;
import com.DigitalDairy.DigitalDairy.Repo.PaymentRepository;
import com.DigitalDairy.DigitalDairy.Repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MilkExportationService {

    private final MilkExportationRepository milkExportationRepository;
    private final UserRepo userRepository;
    private final DairyRepository dairyRepository;
    private final PaymentRepository paymentRepository;

    public MilkExportationDTO createExportation(MilkExportationDTO dto){
        User client = userRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Farmer not found with ID: " + dto.getClientId()));

        Dairy dairy = dairyRepository.findById(dto.getDairyId())
                .orElseThrow(() -> new RuntimeException("Dairy not found with ID: " + dto.getDairyId()));

        PaymentEntity paymentEntity = null;
        if (dto.getPaymentId() != null) {
            paymentEntity = paymentRepository.findById(dto.getPaymentId())
                    .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + dto.getPaymentId()));
        }

        BigDecimal totalAmount = dto.getQuantityLitres().multiply(dto.getRateApplied());

        MilkExportation milk = MilkExportation.builder()
                .client(client)
                .dairy(dairy)
                .date(dto.getDate())
                .fatContent(dto.getFatContent())
                .qualityGrade(dto.getQualityGrade())
                .quantityLitres(dto.getQuantityLitres())
                .rateApplied(dto.getRateApplied())
                .totalAmount(totalAmount)
                .payment(paymentEntity)
                .shift(MilkExportation.Shift.valueOf(dto.getShift().toString()))
                .build();

        MilkExportation createdMilk = milkExportationRepository.save(milk);

        return mapToDTO(createdMilk);
    }


    public List<MilkExportationDTO> getAllExportationByClient(Long clientId){
        return milkExportationRepository.findByClient_UserId(clientId)
                .stream().map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MilkExportationDTO> getAllExportationByDairy(Long dairyId){
        return milkExportationRepository.findByDairy_DairyId(dairyId)
                .stream().map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private MilkExportationDTO mapToDTO(MilkExportation entity) {
        return MilkExportationDTO.builder()
                .exportId(entity.getExportId())
                .clientId(entity.getClient().getUser_id())
                .dairyId(entity.getDairy().getDairyId())
                .date(entity.getDate())
                .shift(entity.getShift())
                .quantityLitres(entity.getQuantityLitres())
                .paymentId(entity.getPayment() != null ? entity.getPayment().getPaymentId() : null)
                .fatContent(entity.getFatContent())
                .qualityGrade(entity.getQualityGrade())
                .rateApplied(entity.getRateApplied())
                .totalAmount(entity.getTotalAmount())
                .build();
    }


}
