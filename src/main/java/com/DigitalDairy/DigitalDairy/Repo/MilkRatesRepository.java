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

    // Get rates for a dairy that are effective on or before a given date, sorted by most recent
    List<MilkRates> findByDairy_DairyIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(
            Long dairyId, LocalDate date);



}
