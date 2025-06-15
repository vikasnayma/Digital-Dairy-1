package com.DigitalDairy.DigitalDairy.Repo;

import com.DigitalDairy.DigitalDairy.Entity.Dairy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;


@Repository
public interface DairyRepository extends JpaRepository<Dairy, Long> {
    // No need to re-declare findById
    Optional<Dairy> findByOperator_UserId(Long userId);
}
