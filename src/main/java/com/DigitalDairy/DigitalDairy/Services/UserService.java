package com.DigitalDairy.DigitalDairy.Services;

import com.DigitalDairy.DigitalDairy.DTOs.UserDTO;
import com.DigitalDairy.DigitalDairy.Entity.User;
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

    public Map<String, String> registerUser(User user) {
        Map<String, String> response = new HashMap<>();

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

        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);

        response.put("status", "success");
        response.put("message", "User registered successfully");
        return response;
    }

    public Map<String, Object> authenticateUser(User loginRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            if (auth.isAuthenticated()) {
                User user = userRepository.findByEmail(loginRequest.getEmail()).get();
                String token = jwtService.generateToken(user.getEmail());

                UserDTO dto = new UserDTO();
                dto.setUser_id(user.getUser_id());
                dto.setName(user.getName());
                dto.setEmail(user.getEmail());
                dto.setPhone(user.getPhone());
                dto.setRole(user.getRole());

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
}
