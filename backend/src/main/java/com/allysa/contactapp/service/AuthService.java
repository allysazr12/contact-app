package com.allysa.contactapp.service;

import com.allysa.contactapp.dto.LoginRequest;
import com.allysa.contactapp.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}
