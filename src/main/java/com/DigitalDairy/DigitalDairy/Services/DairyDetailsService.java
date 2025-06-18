package com.DigitalDairy.DigitalDairy.Services;

import com.DigitalDairy.DigitalDairy.DTOs.DairyDTO;
import com.DigitalDairy.DigitalDairy.DTOs.UserDTO;
import com.DigitalDairy.DigitalDairy.Entity.Dairy;
import com.DigitalDairy.DigitalDairy.Entity.User;
import com.DigitalDairy.DigitalDairy.Repo.DairyRepository;
import com.DigitalDairy.DigitalDairy.Repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DairyDetailsService {

    private final DairyRepository dairyRepository;
    private final UserRepo userRepo;


    public DairyDTO createDairy(DairyDTO dto , Long operatorId){
        User operator = userRepo.findById(operatorId).orElseThrow(() -> new RuntimeException("Operator not found"));

        Dairy newDairy = Dairy.builder()
                .name(dto.getName())
                .location(dto.getLocation())
                .operator(operator)
                .build();

        Dairy savedDairy = dairyRepository.save(newDairy);
        return convertToDTO(savedDairy);
    }

    public DairyDTO getDairyByOperatorId(Long operatorId){
        Dairy dairy = dairyRepository.findByOperator_UserId(operatorId)
                .orElseThrow(() -> new RuntimeException("Dairy not found"));

        return convertToDTO(dairy);
    }



    public DairyDTO updateDairyDetails(DairyDTO dto , Long operatorId){
        Dairy currentDairy = dairyRepository.findByOperator_UserId(operatorId).orElseThrow(() -> new RuntimeException("Dairy not found"));

        currentDairy.setName(dto.getName());
        currentDairy.setLocation(dto.getLocation());

        Dairy updatedDairy = dairyRepository.save(currentDairy);
        return convertToDTO(updatedDairy);
    }

    private DairyDTO convertToDTO(Dairy dairy) {
        return DairyDTO.builder()
                .dairyId(dairy.getDairyId())
                .name(dairy.getName())
                .location(dairy.getLocation())
                .operatorId(dairy.getOperator().getUser_id())
                .build();
    }

}
