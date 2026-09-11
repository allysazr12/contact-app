package com.allysa.contactapp.config;

import com.allysa.contactapp.entity.User;
import com.allysa.contactapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();

            admin.setUsername("admin");
            admin.setPassword(
                    passwordEncoder.encode("admin123")
            );

            userRepository.save(admin);
        }
    }
}
