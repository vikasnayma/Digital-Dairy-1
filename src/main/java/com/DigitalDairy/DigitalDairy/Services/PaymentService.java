package com.DigitalDairy.DigitalDairy.Services;


import com.DigitalDairy.DigitalDairy.DTOs.PaymentDTO;
import com.DigitalDairy.DigitalDairy.Entity.PaymentEntity;
import com.DigitalDairy.DigitalDairy.Repo.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

   private final PaymentRepository paymentRepository;

    public List<PaymentDTO> getAllPaymentsByPayee(Long payeeId){
        return paymentRepository.findByPayee_UserId(payeeId)
                .stream().map(this::toDTO)
                .collect(Collectors.toList());
    }



    private PaymentDTO toDTO(PaymentEntity payment) {
        return PaymentDTO.builder()
                .payerId(payment.getPayer() != null ? payment.getPayer().getUser_id() : null)
                .payeeId(payment.getPayee() != null ? payment.getPayee().getUser_id(): null)
                .paymentFor(payment.getPaymentFor())
                .paymentDate(payment.getPaymentDate())
                .referenceIds(payment.getReferenceIds())
                .amount(payment.getAmount())
                .build();
    }

}
