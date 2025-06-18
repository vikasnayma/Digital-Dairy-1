package com.DigitalDairy.DigitalDairy.Controller;

import com.DigitalDairy.DigitalDairy.DTOs.PreMilkBookingDTO;
import com.DigitalDairy.DigitalDairy.Entity.PreMilkBooking;
import com.DigitalDairy.DigitalDairy.Services.PreMilkBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pre-bookings")
public class PreMilkBookingController {

    @Autowired
    private PreMilkBookingService preMilkBookingService;

    @PostMapping
    public PreMilkBookingDTO createPreBooking(@RequestBody PreMilkBookingDTO dto){
        return preMilkBookingService.createPreBooking(dto);
    }

    @GetMapping("/{dairyId}")
    public List<PreMilkBookingDTO> getAllBookings(@PathVariable Long dairyId){
        return preMilkBookingService.getAllPreBookings(dairyId);
    }

    @GetMapping("/farmer/{farmerId}")
    public List<PreMilkBookingDTO> getAllBookingsByFarmer(@PathVariable Long farmerId){
        return preMilkBookingService.getAllPreBookingsByFarmer(farmerId);
    }

    @PutMapping("/{id}/status")
    public PreMilkBookingDTO updateStatus(@PathVariable Long id , @RequestParam("status") PreMilkBooking.Status status){
        return preMilkBookingService.updateStatus(id , status);
    }

    @PutMapping("/{id}/payment-status")
    public PreMilkBookingDTO updatePaymentStatus(@PathVariable Long id , @RequestParam("paymentStatus") PreMilkBooking.PaymentStatus paymentStatus){
        return preMilkBookingService.updatePaymentStatus(id , paymentStatus);
    }
}
