package com.DigitalDairy.DigitalDairy.Services;

import com.DigitalDairy.DigitalDairy.DTOs.MilkCollectionDTO;
import com.DigitalDairy.DigitalDairy.Entity.Dairy;
import com.DigitalDairy.DigitalDairy.Entity.MilkCollection;
import com.DigitalDairy.DigitalDairy.Entity.User;
import com.DigitalDairy.DigitalDairy.Repo.DairyRepository;
import com.DigitalDairy.DigitalDairy.Repo.MilkCollectionRepository;
import com.DigitalDairy.DigitalDairy.Repo.UserRepo;
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

    public MilkCollectionDTO addMilkCollection(MilkCollectionDTO dto) throws Throwable {
        User farmerId = userRepository.findById(dto.getFarmerId())
                .orElseThrow(() -> new RuntimeException("farmer not found with ID:" + dto.getFarmerId()));

        Dairy dairy = dairyRepository.findById(dto.getDairyId())
                .orElseThrow(() -> new RuntimeException("farmer not found with ID:" + dto.getFarmerId()));

        BigDecimal totalAmount = dto.getQuantityLitres().multiply(dto.getRateApplied());

        MilkCollection milkCollection = MilkCollection.builder()
                .farmer(farmerId)
                .dairy(dairy)
                .date(dto.getDate())
                .shift(MilkCollection.Shift.valueOf(dto.getShift().toUpperCase()))
                .quantityLitres(dto.getQuantityLitres())
                .fatContent(dto.getFatContent())
                .qualityGrade(dto.getQualityGrade())
                .rateApplied(dto.getRateApplied())
                .totalAmount(totalAmount)
                .build();

        MilkCollection collection = milkCollectionRepository.save(milkCollection);
        return toDTO(collection);
    }

    //Get all milkCollection
    public List<MilkCollectionDTO> getAllMilkCollection(){
        return milkCollectionRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    //get milkcollection by farmer id
    public List<MilkCollectionDTO> getCollectionsByFarmer(Long farmerId) {
        return milkCollectionRepository.findByFarmer_userId(farmerId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Convert Entity ➝ DTO
    private MilkCollectionDTO toDTO(MilkCollection m) {
        return MilkCollectionDTO.builder()
                .collectionId(m.getCollectionId())
                .farmerId(m.getFarmer().getUser_id())
                .farmerName(m.getFarmer().getName())
                .dairyId(m.getDairy().getDairyId())
                .dairyName(m.getDairy().getName())
                .date(m.getDate())
                .shift(m.getShift().name())
                .quantityLitres(m.getQuantityLitres())
                .fatContent(m.getFatContent())
                .qualityGrade(m.getQualityGrade())
                .rateApplied(m.getRateApplied())
                .totalAmount(m.getTotalAmount())
                .build();
    }
}
