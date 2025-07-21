package com.DigitalDairy.DigitalDairy.Controller;

import com.DigitalDairy.DigitalDairy.Entity.User;
import com.DigitalDairy.DigitalDairy.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@CrossOrigin
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        return userService.authenticateUser(user);
    }

    @GetMapping("/farmers/{dairyId}")
    public List<User> getFarmersByDairy(@PathVariable Long dairyId) {
        return userService.getFarmersByDairyId(dairyId);
    }

    @PutMapping("/users/{userId}/update-dairy-id")
    public ResponseEntity<?> updateDairyId(@PathVariable Long userId, @RequestBody Map<String, Long> payload) {
        Long dairyId = payload.get("dairyId");
        try {
            userService.updateDairyIdForUser(userId, dairyId);
            return ResponseEntity.ok("Dairy ID updated successfully.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }


}
