package com.DigitalDairy.DigitalDairy.Services;

import com.DigitalDairy.DigitalDairy.DTOs.MilkRatesDTO;
import com.DigitalDairy.DigitalDairy.Entity.Dairy;
import com.DigitalDairy.DigitalDairy.Entity.MilkRates;
import com.DigitalDairy.DigitalDairy.Repo.DairyRepository;
import com.DigitalDairy.DigitalDairy.Repo.MilkRatesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MilkRatesService {

    @Autowired
    private DairyRepository dairyRepository;

    @Autowired
    private MilkRatesRepository milkRatesRepository;

    public MilkRatesDTO createMilkRate(MilkRatesDTO dto) {
        Dairy dairy = dairyRepository.findById(dto.getDairyId())
                .orElseThrow(() -> new RuntimeException("Dairy not found"));

        MilkRates milkRate = MilkRates.builder()
                .dairy(dairy)
                .pricePerFat(dto.getPricePerFat())
                .effectiveFrom(dto.getEffectiveFrom())
                .build();

        MilkRates saved = milkRatesRepository.save(milkRate);
        return convertToDTO(saved);
    }

    public List<MilkRatesDTO> getAllRates(){
        return milkRatesRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MilkRatesDTO getRateById(Long id){
        MilkRates rate = milkRatesRepository.findById(id).orElseThrow(() -> new RuntimeException("Rate not Found"));
        return convertToDTO(rate);
    }

    public List<MilkRatesDTO> getRatesByDairyId(Long dairyId) {
        return milkRatesRepository.findByDairy_DairyId(dairyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MilkRatesDTO getRateByEffectiveDate(Long dairyId, LocalDate date) {
        MilkRates rate =  milkRatesRepository
                .findTopByDairy_DairyIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(dairyId, date)
                .orElseThrow(() -> new RuntimeException("No effective milk rate found for this date."));
        return convertToDTO(rate);
    }

    private MilkRatesDTO convertToDTO(MilkRates rate) {
        return MilkRatesDTO.builder()
                .rateId(rate.getRateId())
                .dairyId(rate.getDairy().getDairyId())
                .pricePerFat(rate.getPricePerFat())
                .effectiveFrom(rate.getEffectiveFrom())
                .build();
    }
}
