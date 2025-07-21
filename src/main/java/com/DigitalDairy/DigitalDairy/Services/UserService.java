package com.DigitalDairy.DigitalDairy.Services;

import com.DigitalDairy.DigitalDairy.DTOs.UserDTO;
import com.DigitalDairy.DigitalDairy.Entity.User;
import com.DigitalDairy.DigitalDairy.Enum.Role;
import com.DigitalDairy.DigitalDairy.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepo userRepository;


    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public Map<String, Object> registerUser(User user) {
        Map<String, Object> response = new HashMap<>();

        if (user.getEmail() == null || !user.getEmail().contains("@")) {
            response.put("status", "error");
            response.put("message", "Invalid email");
            return response;
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            response.put("status", "error");
            response.put("message", "Email already registered");
            return response;
        }

        // Save new user
        user.setPassword(encoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        // Generate token
        String token = jwtService.generateToken(savedUser);

        // Build DTO
        UserDTO dto = UserDTO.builder()
                .userId(savedUser.getUser_id())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .role(savedUser.getRole())
                .dairyId(savedUser.getDairyId())
                .build();

        // Build success response
        response.put("token", token);
        response.put("user", dto);
        return response;
    }

    public Map<String, Object> authenticateUser(User loginRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            if (auth.isAuthenticated()) {
                User user = userRepository.findByEmail(loginRequest.getEmail()).get();
                String token = jwtService.generateToken(user);

                UserDTO dto = new UserDTO();
                dto.setUserId(user.getUser_id());
                dto.setName(user.getName());
                dto.setEmail(user.getEmail());
                dto.setPhone(user.getPhone());
                dto.setRole(user.getRole());
                dto.setDairyId(user.getDairyId());

                Map<String, Object> result = new HashMap<>();
                result.put("token", token);
                result.put("user", dto);
                return result;
            }

        } catch (BadCredentialsException e) {
            return Map.of("status", "error", "message", "Invalid credentials");
        }

        return Map.of("status", "error", "message", "Authentication failed");
    }

    public List<User> getFarmersByDairyId(Long dairyId) {
        return userRepository.findByDairyIdAndRole(dairyId , Role.farmer);
    }

    public void updateDairyIdForUser(Long userId, Long dairyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        user.setDairyId(dairyId);
        userRepository.save(user);
    }
}
