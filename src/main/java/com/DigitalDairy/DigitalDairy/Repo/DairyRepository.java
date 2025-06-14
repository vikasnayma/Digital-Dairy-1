package com.DigitalDairy.DigitalDairy.Repo;

import com.DigitalDairy.DigitalDairy.Entity.Dairy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DairyRepository extends JpaRepository<Dairy, Long> {
    // No need to re-declare findById
}
