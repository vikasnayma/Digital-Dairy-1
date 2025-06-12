package com.DigitalDairy.DigitalDairy.Controller;


import com.DigitalDairy.DigitalDairy.DTOs.MilkCollectionDTO;
import com.DigitalDairy.DigitalDairy.Services.MilkCollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/milk-collections")
@RequiredArgsConstructor
public class MilkCollectionController {

    private final MilkCollectionService milkCollectionService;

    // Add new milk collection
    @PostMapping
    public ResponseEntity<MilkCollectionDTO> addMilkCollection(@RequestBody MilkCollectionDTO dto) {
        try {
            MilkCollectionDTO saved = milkCollectionService.addMilkCollection(dto);
            return ResponseEntity.ok(saved);
        } catch (Throwable e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Get all milk collections
    @GetMapping
    public ResponseEntity<List<MilkCollectionDTO>> getAllMilkCollections() {
        List<MilkCollectionDTO> collections = milkCollectionService.getAllMilkCollection();
        return ResponseEntity.ok(collections);
    }

    // Get milk collections by farmer ID
    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<MilkCollectionDTO>> getCollectionsByFarmer(@PathVariable Long farmerId) {
        List<MilkCollectionDTO> collections = milkCollectionService.getCollectionsByFarmer(farmerId);
        return ResponseEntity.ok(collections);
    }
}

