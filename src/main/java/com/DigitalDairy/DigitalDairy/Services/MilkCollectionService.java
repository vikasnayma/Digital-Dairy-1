package com.DigitalDairy.DigitalDairy.Services;

import com.DigitalDairy.DigitalDairy.DTOs.MilkCollectionDTO;
import com.DigitalDairy.DigitalDairy.Entity.*;
import com.DigitalDairy.DigitalDairy.Repo.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MilkCollectionService {

    private final MilkCollectionRepository milkCollectionRepository;
    private final UserRepo userRepository;
    private final DairyRepository dairyRepository;
    private final PaymentRepository paymentRepository;
    private final MilkRatesRepository milkRatesRepository;


    public MilkCollectionDTO addMilkCollection(MilkCollectionDTO dto) {
        User farmer = userRepository.findById(dto.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found with ID: " + dto.getFarmerId()));

        Dairy dairy = dairyRepository.findById(dto.getDairyId())
                .orElseThrow(() -> new RuntimeException("Dairy not found with ID: " + dto.getDairyId()));

        PaymentEntity paymentEntity = null;
        if (dto.getPaymentId() != null) {
            paymentEntity = paymentRepository.findById(dto.getPaymentId())
                    .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + dto.getPaymentId()));
        }

        // ⬇️ Fetch effective rate for the date
        LocalDate date = dto.getDate();
        MilkRates effectiveRate = milkRatesRepository
                .findTopByDairy_DairyIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(dto.getDairyId(), date)
                .orElseThrow(() -> new RuntimeException("No effective milk rate found for the provided date."));

        // ⬇️ Calculate rate applied and total amount
        BigDecimal rateApplied = effectiveRate.getPricePerFat().multiply(dto.getFatContent());
        BigDecimal totalAmount = rateApplied.multiply(dto.getQuantityLitres());

        MilkCollection milkCollection = MilkCollection.builder()
                .farmer(farmer)
                .dairy(dairy)
                .date(dto.getDate())
                .shift(MilkCollection.Shift.valueOf(dto.getShift().toString()))
                .quantityLitres(dto.getQuantityLitres())
                .fatContent(dto.getFatContent())
                .payment(paymentEntity)
                .qualityGrade(dto.getQualityGrade())
                .rateApplied(rateApplied)
                .totalAmount(totalAmount)
                .build();

        MilkCollection savedCollection = milkCollectionRepository.save(milkCollection);
        return toDTO(savedCollection);
    }

    public List<MilkCollectionDTO> getAllMilkCollection() {
        return milkCollectionRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MilkCollectionDTO getMilkCollectionByID(Long collectionId){
        return milkCollectionRepository.findById(collectionId)
                .map(this::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("Milk collection not found with ID: " + collectionId));
    }

    public List<MilkCollectionDTO> getCollectionsByFarmer(Long farmerId) {
        return milkCollectionRepository.findByFarmer_UserId(farmerId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<MilkCollectionDTO> getCollectionByDairy(Long dairyID){
        return milkCollectionRepository.findByDairy_DairyId(dairyID)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private MilkCollectionDTO toDTO(MilkCollection m) {
        return MilkCollectionDTO.builder()
                .collectionId(m.getCollectionId())
                .farmerId(m.getFarmer().getUser_id())
                .dairyId(m.getDairy().getDairyId())
                .date(m.getDate())
                .shift(m.getShift())
                .paymentId(m.getPayment() != null ? m.getPayment().getPaymentId() : null)
                .quantityLitres(m.getQuantityLitres())
                .fatContent(m.getFatContent())
                .qualityGrade(m.getQualityGrade())
                .rateApplied(m.getRateApplied())
                .totalAmount(m.getTotalAmount())
                .build();
    }
}
