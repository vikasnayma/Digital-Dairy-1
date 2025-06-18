package com.DigitalDairy.DigitalDairy.Controller;


import com.DigitalDairy.DigitalDairy.DTOs.MilkExportationDTO;
import com.DigitalDairy.DigitalDairy.Services.MilkExportationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/milk-exportation")
public class MilkExportationController {

    @Autowired
    private MilkExportationService milkExportationService;

    @PostMapping
    public MilkExportationDTO createMilkExportation(@RequestBody MilkExportationDTO dto){
        return milkExportationService.createExportation(dto);
    }

    @GetMapping("/client/{clientId}")
    public List<MilkExportationDTO> getAllExportationByClient(@PathVariable Long clientId){
        return milkExportationService.getAllExportationByClient(clientId);
    }

    @GetMapping("/dairy/{dairyId}")
    public List<MilkExportationDTO> getAllExportationByDairy(@PathVariable Long dairyId){
        return milkExportationService.getAllExportationByDairy(dairyId);
    }
}
