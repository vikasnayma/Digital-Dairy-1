package com.DigitalDairy.DigitalDairy.Entity;

import com.DigitalDairy.DigitalDairy.Enum.Role;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private Long dairyId;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String phone;

    private LocalDateTime created_at;

    public Long getDairyId() {
        return dairyId;
    }

    public void setDairyId(Long dairyId) {
        this.dairyId = dairyId;
    }

    @PrePersist
    public void onCreate() {
        this.created_at = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getUser_id() { return userId; }
    public void setUser_id(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDateTime getCreated_at() { return created_at; }

    @Override
    public String toString() {
        return "Users{" +
                "user_id=" + userId +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", phone='" + phone + '\'' +
                ", created_at=" + created_at +
                '}';
    }
}

