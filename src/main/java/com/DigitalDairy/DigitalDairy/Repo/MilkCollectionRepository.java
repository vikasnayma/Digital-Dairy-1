package com.DigitalDairy.DigitalDairy.Repo;

import com.DigitalDairy.DigitalDairy.DTOs.MilkCollectionDTO;
import com.DigitalDairy.DigitalDairy.Entity.MilkCollection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MilkCollectionRepository extends JpaRepository<MilkCollection, Long> {



    List<MilkCollection> findByFarmer_UserId(Long userId);

    List<MilkCollection> findByDairy_DairyId(Long dairyId);
}

