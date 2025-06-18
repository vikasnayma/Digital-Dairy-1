package com.DigitalDairy.DigitalDairy.Repo;

import com.DigitalDairy.DigitalDairy.Entity.User;
import com.DigitalDairy.DigitalDairy.Enum.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long > {
    Optional<User> findByEmail(String email);

    List<User> findByDairyIdAndRole(Long dairyId, Role role);

}

