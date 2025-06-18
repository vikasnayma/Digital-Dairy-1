package com.DigitalDairy.DigitalDairy.Repo;

import com.DigitalDairy.DigitalDairy.Entity.PreMilkBooking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PreMilkBookingRepository extends JpaRepository<PreMilkBooking , Long> {
    List<PreMilkBooking> findByDairy_DairyId(Long dairyId);
    List<PreMilkBooking> findByFarmer_UserId(Long userId);

}
