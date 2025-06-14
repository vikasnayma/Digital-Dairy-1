package com.DigitalDairy.DigitalDairy.Controller;

import com.DigitalDairy.DigitalDairy.DTOs.MilkRatesDTO;
import com.DigitalDairy.DigitalDairy.Entity.MilkRates;
import com.DigitalDairy.DigitalDairy.Services.MilkRatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/milk-rates")
public class MilkRatesController {

    @Autowired
    private MilkRatesService milkRatesService;

    @PostMapping
    public MilkRatesDTO createMilkRate(@RequestBody MilkRatesDTO dto){
        return milkRatesService.createMilkRate(dto);
    }

    @GetMapping
    public List<MilkRatesDTO> getAllRates(){
        return milkRatesService.getAllRates();
    }

    @GetMapping("/{Id}")
    public MilkRatesDTO getRateById(@PathVariable Long Id){
        return milkRatesService.getRateById(Id);
    }

    @GetMapping("/dairy/{dairyId}")
    public List<MilkRatesDTO> getRateByDairy(@PathVariable Long dairyId){
        return milkRatesService.getRatesByDairyId(dairyId);
    }
}
