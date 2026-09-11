package com.allysa.contactapp.controller;

import com.allysa.contactapp.entity.User;
import com.allysa.contactapp.repository.ContactRepository;
import com.allysa.contactapp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.security.crypto.password.PasswordEncoder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ContactControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        contactRepository.deleteAll();
        userRepository.deleteAll();

        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));

        userRepository.save(admin);
    }

    @Test
    void login_withValidCredentials_shouldReturnToken()
            throws Exception {

        mockMvc.perform(
                        post("/api/auth/login")
                                .contentType("application/json")
                                .content("""
                            {
                                "username": "admin",
                                "password": "admin123"
                            }
                            """)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.expiresIn").value(3600000));
    }

    @Test
    void getContacts_withoutToken_shouldReturnUnauthorized()
            throws Exception {

        mockMvc.perform(get("/api/contacts"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getContacts_withValidToken_shouldReturnOk()
            throws Exception {

        String loginResponse = mockMvc.perform(
                        post("/api/auth/login")
                                .contentType("application/json")
                                .content("""
                                {
                                    "username": "admin",
                                    "password": "admin123"
                                }
                                """)
                )
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode =
                objectMapper.readTree(loginResponse);

        String token = jsonNode.get("token").asText();

        mockMvc.perform(
                        get("/api/contacts")
                                .header(
                                        "Authorization",
                                        "Bearer " + token
                                )
                )
                .andExpect(status().isOk());
    }

    @Test
    void login_withInvalidPassword_shouldReturnUnauthorized()
            throws Exception {

        mockMvc.perform(
                        post("/api/auth/login")
                                .contentType("application/json")
                                .content("""
                                {
                                    "username": "admin",
                                    "password": "wrongpassword"
                                }
                                """)
                )
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message")
                        .value("Invalid username or password"));
    }

    @Test
    void createContact_withInvalidData_shouldReturnBadRequest()
            throws Exception {

        String loginResponse = mockMvc.perform(
                        post("/api/auth/login")
                                .contentType("application/json")
                                .content("""
                                {
                                    "username": "admin",
                                    "password": "admin123"
                                }
                                """)
                )
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(loginResponse);
        String token = jsonNode.get("token").asText();

        mockMvc.perform(
                        post("/api/contacts")
                                .header(
                                        "Authorization",
                                        "Bearer " + token
                                )
                                .contentType("application/json")
                                .content("""
                                {
                                    "name": "",
                                    "email": "invalid-email",
                                    "phone": "",
                                    "subject": "",
                                    "message": ""
                                }
                                """)
                )
                .andExpect(status().isBadRequest());
    }
}
