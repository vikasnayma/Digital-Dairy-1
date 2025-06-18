package com.DigitalDairy.DigitalDairy.Controller;

import com.DigitalDairy.DigitalDairy.Entity.User;
import com.DigitalDairy.DigitalDairy.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
}
