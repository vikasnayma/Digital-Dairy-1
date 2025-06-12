package com.DigitalDairy.DigitalDairy.Repo;


import com.DigitalDairy.DigitalDairy.Entity.MilkCollection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MilkCollectionRepository extends JpaRepository<MilkCollection , Long> {


    MilkCollection save(MilkCollection milkCollection);

    List<MilkCollection> findAll();

    // Custom query to get collections by farmer ID
    List<MilkCollection> findByFarmer_userId(Long user_id);

    // Optionally, by dairy
    List<MilkCollection> findByDairy_dairyId(Long dairyId);
}
