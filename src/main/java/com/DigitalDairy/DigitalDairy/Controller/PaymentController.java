
package com.DigitalDairy.DigitalDairy.Controller;

import com.DigitalDairy.DigitalDairy.DTOs.PaymentDTO;
import com.DigitalDairy.DigitalDairy.DTOs.PaymentRequestDTO;
import com.DigitalDairy.DigitalDairy.DTOs.PaymentResponseDTO;
import com.DigitalDairy.DigitalDairy.Entity.MilkCollection;
import com.DigitalDairy.DigitalDairy.Entity.MilkExportation;
import com.DigitalDairy.DigitalDairy.Entity.PaymentEntity;
import com.DigitalDairy.DigitalDairy.Entity.PreMilkBooking;
import com.DigitalDairy.DigitalDairy.Repo.*;
import com.DigitalDairy.DigitalDairy.Services.PaymentService;
import com.DigitalDairy.DigitalDairy.Services.PaypalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final PaypalService paypalService;
    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final UserRepo userRepository;
    private  final MilkCollectionRepository milkCollectionRepo;
    private  final MilkExportationRepository milkExportationRepository;
    private final PreMilkBookingRepository preMilkBookingRepository;

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createOrder(@RequestBody PaymentRequestDTO requestDTO) {
        try {
            String orderId = paypalService.createOrder(requestDTO.getAmount().doubleValue(), "USD");
            return ResponseEntity.ok(Map.of("id", orderId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Order creation failed"));
        }
    }

    @PostMapping("/capture")
    public ResponseEntity<PaymentResponseDTO> captureOrder(
            @RequestParam("orderId") String orderId,
            @RequestBody PaymentRequestDTO dto) {

        try {
            boolean success = paypalService.captureOrder(orderId);

            if (success) {
                PaymentEntity paymentEntity = PaymentEntity.builder()
                        .payer(userRepository.findById(dto.getPayerId()).orElseThrow())
                        .payee(userRepository.findById(dto.getPayeeId()).orElseThrow())
                        .paymentFor(dto.getPaymentFor())
                        .referenceIds(dto.getReferenceIds())
                        .amount(dto.getAmount())
                        .paymentDate(LocalDate.now())
                        .status("COMPLETED")
                        .invoiceLink("https://www.paypal.com/activity/payment/" + orderId)
                        .build();

                paymentRepository.save(paymentEntity);

                // Assign payment ID to each collection
                List<MilkCollection> collections = milkCollectionRepo.findAllById(dto.getReferenceIds());
                collections.forEach(c -> c.setPayment(paymentEntity));
                milkCollectionRepo.saveAll(collections);

                return ResponseEntity.ok(PaymentResponseDTO.builder()
                        .status("success")
                        .paymentId(orderId)
                        .amount(dto.getAmount())
                        .build());


            } else {
                return ResponseEntity.badRequest().body(PaymentResponseDTO.builder()
                        .status("failed")
                        .paymentId(orderId)
                        .build());
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(PaymentResponseDTO.builder()
                    .status("error")
                    .paymentId(orderId)
                    .build());
        }
    }


    @PostMapping("/pre-booking-payment/capture")
    public ResponseEntity<PaymentResponseDTO> capturePreBookingOrder(
            @RequestParam("orderId") String orderId,
            @RequestBody PaymentRequestDTO dto) {

        try {
            boolean success = paypalService.captureOrder(orderId);

            if (success) {
                PaymentEntity paymentEntity = PaymentEntity.builder()
                        .payer(userRepository.findById(dto.getPayerId()).orElseThrow())
                        .payee(userRepository.findById(dto.getPayeeId()).orElseThrow())
                        .paymentFor(dto.getPaymentFor())
                        .referenceIds(dto.getReferenceIds())
                        .amount(dto.getAmount())
                        .paymentDate(LocalDate.now())
                        .status("COMPLETED")
                        .invoiceLink("https://www.paypal.com/activity/payment/" + orderId)
                        .build();

                paymentRepository.save(paymentEntity);

                // Assign payment ID to each collection
                List<MilkCollection> collections = milkCollectionRepo.findAllById(dto.getReferenceIds());
                collections.forEach(c -> c.setPayment(paymentEntity));
                milkCollectionRepo.saveAll(collections);

                // Update pre-booking payment status
                List<PreMilkBooking> bookings = preMilkBookingRepository.findAllById(dto.getReferenceIds());
                bookings.forEach(b -> b.setPaymentStatus(PreMilkBooking.PaymentStatus.paid));
                preMilkBookingRepository.saveAll(bookings);

                return ResponseEntity.ok(PaymentResponseDTO.builder()
                        .status("success")
                        .paymentId(orderId)
                        .amount(dto.getAmount())
                        .build());


            } else {
                return ResponseEntity.badRequest().body(PaymentResponseDTO.builder()
                        .status("failed")
                        .paymentId(orderId)
                        .build());
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(PaymentResponseDTO.builder()
                    .status("error")
                    .paymentId(orderId)
                    .build());
        }
    }


    @PostMapping("/exportation-payment/capture")
    public ResponseEntity<PaymentResponseDTO> captureOrderExportation(
            @RequestParam("orderId") String orderId,
            @RequestBody PaymentRequestDTO dto) {

        try {
            boolean success = paypalService.captureOrder(orderId);

            if (success) {
                PaymentEntity paymentEntity = PaymentEntity.builder()
                        .payer(userRepository.findById(dto.getPayerId()).orElseThrow())
                        .payee(userRepository.findById(dto.getPayeeId()).orElseThrow())
                        .paymentFor(dto.getPaymentFor())
                        .referenceIds(dto.getReferenceIds())
                        .amount(dto.getAmount())
                        .paymentDate(LocalDate.now())
                        .status("COMPLETED")
                        .invoiceLink("https://www.paypal.com/activity/payment/" + orderId)
                        .build();

                paymentRepository.save(paymentEntity);

                // Assign payment ID to each collection
                List<MilkExportation> exportations = milkExportationRepository.findAllById(dto.getReferenceIds());
                exportations.forEach(c -> c.setPayment(paymentEntity));
                milkExportationRepository.saveAll(exportations);

                return ResponseEntity.ok(PaymentResponseDTO.builder()
                        .status("success")
                        .paymentId(orderId)
                        .amount(dto.getAmount())
                        .build());


            } else {
                return ResponseEntity.badRequest().body(PaymentResponseDTO.builder()
                        .status("failed")
                        .paymentId(orderId)
                        .build());
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(PaymentResponseDTO.builder()
                    .status("error")
                    .paymentId(orderId)
                    .build());
        }
    }


    @GetMapping("/payee-payments/{payeeId}")
    public List<PaymentDTO> getAllPaymentsByPayee(@PathVariable Long payeeId){
        return paymentService.getAllPaymentsByPayee(payeeId);
    }
}


