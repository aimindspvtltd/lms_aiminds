package com.lms.config;

import com.lms.domain.user.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (!userRepository.existsByEmailAndDeletedAtIsNull(adminEmail)) {
            User admin = User.builder()
                    .email(adminEmail)
                    .name("Platform Admin")
                    .role(Role.ADMIN)
                    .passwordHash(passwordEncoder.encode(adminPassword))
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(admin);
            log.info("Admin user seeded: {}", adminEmail);
        }
    }
}
