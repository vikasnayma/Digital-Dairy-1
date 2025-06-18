package com.DigitalDairy.DigitalDairy.Controller;

import com.DigitalDairy.DigitalDairy.DTOs.PaymentRequestDTO;
import com.DigitalDairy.DigitalDairy.DTOs.PaymentResponseDTO;
import com.DigitalDairy.DigitalDairy.Entity.PaymentEntity;
import com.DigitalDairy.DigitalDairy.Repo.PaymentRepository;
import com.DigitalDairy.DigitalDairy.Repo.UserRepo;
import com.DigitalDairy.DigitalDairy.Services.PaypalService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaypalService payPalService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepo userRepository;

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPayment(
            @RequestBody PaymentRequestDTO paymentRequest) {
        try {
            String cancelUrl = "http://localhost:3000/payment/cancel";
            String successUrl = "http://localhost:3000/payment/success";

            Payment payment = payPalService.createPayment(
                    paymentRequest.getAmount().doubleValue(),
                    "USD",
                    "paypal",
                    "sale",
                    "Payment for " + paymentRequest.getPaymentFor(),
                    cancelUrl,
                    successUrl);

            Map<String, String> response = new HashMap<>();
            response.put("id", payment.getId()); // PayPal order/payment ID
            return ResponseEntity.ok(response);

        } catch (PayPalRESTException e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @GetMapping("/execute")
    public ResponseEntity<PaymentResponseDTO> executePayment(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId,
            @RequestParam("payerId") Long payerUserId,
            @RequestParam("payeeId") Long payeeUserId,
            @RequestParam("amount") BigDecimal amount,
            @RequestParam("paymentFor") String paymentFor,
            @RequestParam("referenceId") Long referenceId) {
        try {
            Payment payment = payPalService.executePayment(paymentId, payerId);

            if(payment.getState().equals("approved")) {
                // Save payment details to database
                PaymentEntity paymentEntity = PaymentEntity.builder()
                        .payer(userRepository.findById(payerUserId).orElseThrow())
                        .payee(userRepository.findById(payeeUserId).orElseThrow())
                        .paymentFor(paymentFor)
                        .referenceId(referenceId)
                        .amount(amount)
                        .paymentDate(LocalDate.now())
                        .status("COMPLETED")
                        .invoiceLink(payment.getLinks().stream()
                                .filter(link -> link.getRel().equals("self"))
                                .findFirst()
                                .map(Links::getHref)
                                .orElse(null))
                        .build();

                paymentRepository.save(paymentEntity);

                PaymentResponseDTO response = PaymentResponseDTO.builder()
                        .status("success")
                        .paymentId(paymentId)
                        .amount(amount)
                        .build();

                return ResponseEntity.ok(response);
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
