package com.DigitalDairy.DigitalDairy.Services;

import com.DigitalDairy.DigitalDairy.DTOs.MilkCollectionDTO;
import com.DigitalDairy.DigitalDairy.Entity.Dairy;
import com.DigitalDairy.DigitalDairy.Entity.MilkCollection;
import com.DigitalDairy.DigitalDairy.Entity.User;
import com.DigitalDairy.DigitalDairy.Repo.DairyRepository;
import com.DigitalDairy.DigitalDairy.Repo.MilkCollectionRepository;
import com.DigitalDairy.DigitalDairy.Repo.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MilkCollectionService {

    private final MilkCollectionRepository milkCollectionRepository;
    private final UserRepo userRepository;
    private final DairyRepository dairyRepository;

    public MilkCollectionDTO addMilkCollection(MilkCollectionDTO dto) {
        User farmer = userRepository.findById(dto.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found with ID: " + dto.getFarmerId()));

        Dairy dairy = dairyRepository.findById(dto.getDairyId())
                .orElseThrow(() -> new RuntimeException("Dairy not found with ID: " + dto.getDairyId()));

        BigDecimal totalAmount = dto.getQuantityLitres().multiply(dto.getRateApplied());

        MilkCollection milkCollection = MilkCollection.builder()
                .farmer(farmer)
                .dairy(dairy)
                .date(dto.getDate())
                .shift(MilkCollection.Shift.valueOf(dto.getShift().toString()))
                .quantityLitres(dto.getQuantityLitres())
                .fatContent(dto.getFatContent())
                .qualityGrade(dto.getQualityGrade())
                .rateApplied(dto.getRateApplied())
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
                .quantityLitres(m.getQuantityLitres())
                .fatContent(m.getFatContent())
                .qualityGrade(m.getQualityGrade())
                .rateApplied(m.getRateApplied())
                .totalAmount(m.getTotalAmount())
                .build();
    }
}
