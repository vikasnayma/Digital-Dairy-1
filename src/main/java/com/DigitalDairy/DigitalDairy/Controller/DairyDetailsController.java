package com.DigitalDairy.DigitalDairy.Controller;


import com.DigitalDairy.DigitalDairy.DTOs.DairyDTO;
import com.DigitalDairy.DigitalDairy.Services.DairyDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dairy-details")
public class DairyDetailsController {

    @Autowired
    DairyDetailsService dairyDetailsService;

    @PostMapping("/{operatorId}")
    public DairyDTO createDairy(@RequestBody DairyDTO dto ,  @PathVariable Long operatorId){
        return dairyDetailsService.createDairy(dto , operatorId);
    }

    @GetMapping("/{operatorId}")
    public DairyDTO getDairyByOperatorId(@PathVariable Long operatorId){
        return dairyDetailsService.getDairyByOperatorId(operatorId);
    }

    @PutMapping("/{operatorId}")
    public  DairyDTO updateDairyDetails(@RequestBody DairyDTO dto , @PathVariable Long operatorId){
        return dairyDetailsService.updateDairyDetails(dto , operatorId);
    }

}
