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

    /**
     * Add a new milk collection record
     * POST /api/milk-collections
     */
    @PostMapping
    public ResponseEntity<MilkCollectionDTO> addMilkCollection(@RequestBody MilkCollectionDTO dto) {
        try {
            MilkCollectionDTO saved = milkCollectionService.addMilkCollection(dto);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Get all milk collection records
     * GET /api/milk-collections
     */
    @GetMapping
    public ResponseEntity<List<MilkCollectionDTO>> getAllMilkCollections() {
        List<MilkCollectionDTO> collections = milkCollectionService.getAllMilkCollection();
        return ResponseEntity.ok(collections);
    }

    /**
     * Get milk collection records by farmer ID
     * GET /api/milk-collections/farmer/{id}
     */
    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<MilkCollectionDTO>> getCollectionsByFarmer(@PathVariable("farmerId") Long farmerId) {
        List<MilkCollectionDTO> collections = milkCollectionService.getCollectionsByFarmer(farmerId);
        return ResponseEntity.ok(collections);
    }
}
