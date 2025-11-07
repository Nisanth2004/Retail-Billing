package com.nisanth.billingsoftware.service;

import com.nisanth.billingsoftware.io.UserRequest;
import com.nisanth.billingsoftware.io.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);
    String getUserRole(String email);

    List<UserResponse> readUsers();

   void deleteUser(String id);
}
