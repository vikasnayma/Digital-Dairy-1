package com.DigitalDairy.DigitalDairy.DTOs;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DairyDTO {
    private Long dairyId;
    private String name;
    private String location;
    private UserDTO operator;  // Embed operator info using UserDTO
}

