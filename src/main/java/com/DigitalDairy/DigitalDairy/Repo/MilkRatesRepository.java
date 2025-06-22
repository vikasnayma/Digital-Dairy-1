package com.DigitalDairy.DigitalDairy.Repo;

import com.DigitalDairy.DigitalDairy.Entity.MilkRates;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MilkRatesRepository extends JpaRepository<MilkRates, Long> {

    // Get all rates for a specific dairy
    List<MilkRates> findByDairy_DairyId(Long dairyId);

    Optional<MilkRates> findTopByDairy_DairyIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(Long dairyId, LocalDate date);

}
