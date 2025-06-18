package com.DigitalDairy.DigitalDairy.Repo;

import com.DigitalDairy.DigitalDairy.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment , Long > {
}
