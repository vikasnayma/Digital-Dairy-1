package com.DigitalDairy.DigitalDairy.DTOs;

import com.DigitalDairy.DigitalDairy.Enum.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private Role role;
}
