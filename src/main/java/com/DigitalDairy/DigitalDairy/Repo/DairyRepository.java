package com.DigitalDairy.DigitalDairy.Repo;

import com.DigitalDairy.DigitalDairy.Entity.Dairy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DairyRepository extends JpaRepository <Dairy , Long>{

    Optional<Dairy> findById(Long dairy_id);
}