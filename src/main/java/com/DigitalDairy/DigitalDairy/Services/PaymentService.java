package com.DigitalDairy.DigitalDairy.Services;


import com.DigitalDairy.DigitalDairy.DTOs.PaymentDTO;
import com.DigitalDairy.DigitalDairy.Entity.MilkCollection;
import com.DigitalDairy.DigitalDairy.Entity.PaymentEntity;
import com.DigitalDairy.DigitalDairy.Repo.MilkCollectionRepository;
import com.DigitalDairy.DigitalDairy.Repo.PaymentRepository;
import com.DigitalDairy.DigitalDairy.Utility.InvoiceGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

   private final PaymentRepository paymentRepository;
   private final MilkCollectionRepository milkCollectionRepository;
   private final InvoiceGenerator invoiceGenerator;

    public List<PaymentDTO> getAllPaymentsByPayee(Long payeeId){
        return paymentRepository.findByPayee_UserId(payeeId)
                .stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    private PaymentDTO toDTO(PaymentEntity payment) {
        return PaymentDTO.builder()
                .payerId(payment.getPayer() != null ? payment.getPayer().getUser_id() : null)
                .payeeId(payment.getPayee() != null ? payment.getPayee().getUser_id(): null)
                .paymentId(payment.getPaymentId())
                .paymentFor(payment.getPaymentFor())
                .paymentDate(payment.getPaymentDate())
                .referenceIds(payment.getReferenceIds())
                .amount(payment.getAmount())
                .build();
    }


    public String generateInvoice(Long paymentId) throws Exception {
        PaymentEntity payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentId));

        // No need to check payment type if invoice is for all types now.
        String invoicePath = invoiceGenerator.generateInvoice(payment);

        payment.setInvoiceLink(invoicePath);
        paymentRepository.save(payment);

        return invoicePath;
    }


}
