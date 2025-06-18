package com.DigitalDairy.DigitalDairy.Repo;

import com.DigitalDairy.DigitalDairy.Entity.MilkExportation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MilkExportationRepository extends JpaRepository<MilkExportation , Long> {
    List<MilkExportation> findByClient_UserId(Long userId);
    List<MilkExportation> findByDairy_DairyId(Long dairyId);
}
