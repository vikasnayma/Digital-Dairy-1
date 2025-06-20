package com.DigitalDairy.DigitalDairy.Repo;

import com.DigitalDairy.DigitalDairy.DTOs.PaymentDTO;
import com.DigitalDairy.DigitalDairy.Entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long > {
    List<PaymentEntity> findByPayee_UserId(Long userId);

}
