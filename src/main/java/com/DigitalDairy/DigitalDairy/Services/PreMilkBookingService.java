package com.DigitalDairy.DigitalDairy.Services;

import com.DigitalDairy.DigitalDairy.DTOs.PreMilkBookingDTO;
import com.DigitalDairy.DigitalDairy.Entity.Dairy;
import com.DigitalDairy.DigitalDairy.Entity.PreMilkBooking;
import com.DigitalDairy.DigitalDairy.Entity.User;
import com.DigitalDairy.DigitalDairy.Repo.DairyRepository;
import com.DigitalDairy.DigitalDairy.Repo.PreMilkBookingRepository;
import com.DigitalDairy.DigitalDairy.Repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PreMilkBookingService {

    private final PreMilkBookingRepository preMilkBookingRepository;
    private final UserRepo userRepo;
    private final DairyRepository dairyRepository;

    public PreMilkBookingDTO createPreBooking(PreMilkBookingDTO dto) {
        User farmer = userRepo.findById(dto.getFarmerId()).orElseThrow();
        Dairy dairy = dairyRepository.findById(dto.getDairyId()).orElseThrow();

        PreMilkBooking booking = PreMilkBooking.builder()
                .farmer(farmer)
                .dairy(dairy)
                .bookingDate(dto.getBookingDate())
                .shift(PreMilkBooking.Shift.valueOf(dto.getShift().toString()))
                .quantityLitres(dto.getQuantityLitres())
                .paymentStatus(PreMilkBooking.PaymentStatus.unpaid)
                .status(PreMilkBooking.Status.pending)
                .build();

        PreMilkBooking savedBooking = preMilkBookingRepository.save(booking);
        return toDTO(savedBooking);
    }

    public List<PreMilkBookingDTO> getAllPreBookings() {
        return preMilkBookingRepository.findAll()
                .stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PreMilkBookingDTO updateStatus(Long id , PreMilkBooking.Status status){
        PreMilkBooking booking = preMilkBookingRepository.findById(id).orElseThrow();
        booking.setStatus(status);
        PreMilkBooking savedBooking = preMilkBookingRepository.save(booking);
        return toDTO(savedBooking);
    }

    public PreMilkBookingDTO updatePaymentStatus(Long id , PreMilkBooking.PaymentStatus paymentStatus){
        PreMilkBooking booking = preMilkBookingRepository.findById(id).orElseThrow();
        booking.setPaymentStatus(paymentStatus);
        PreMilkBooking savedBooking = preMilkBookingRepository.save(booking);
        return toDTO(savedBooking);
    }

        private PreMilkBookingDTO toDTO(PreMilkBooking b) {
            return PreMilkBookingDTO.builder()
                    .bookingId(b.getBookingId())
                    .farmerId(b.getFarmer().getUser_id())
                    .dairyId(b.getDairy().getDairyId())
                    .bookingDate(b.getBookingDate())
                    .shift(b.getShift())
                    .quantityLitres(b.getQuantityLitres())
                    .status(b.getStatus())
                    .paymentStatus(b.getPaymentStatus())
                    .build();
        }

    }

