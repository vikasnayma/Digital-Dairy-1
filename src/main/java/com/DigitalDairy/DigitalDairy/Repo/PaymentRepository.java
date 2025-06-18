package com.DigitalDairy.DigitalDairy.Repo;

import com.DigitalDairy.DigitalDairy.Entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long > {
}
