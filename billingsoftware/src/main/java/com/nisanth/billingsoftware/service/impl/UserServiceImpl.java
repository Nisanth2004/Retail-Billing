package com.nisanth.billingsoftware.service.impl;

import com.nisanth.billingsoftware.entity.UserEntity;
import com.nisanth.billingsoftware.io.UserRequest;
import com.nisanth.billingsoftware.io.UserResponse;
import com.nisanth.billingsoftware.repository.UserRepository;
import com.nisanth.billingsoftware.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public UserResponse createUser(UserRequest request) {
      UserEntity newUser= convertToEntity(request);
      newUser.setPassword(passwordEncoder.encode(request.getPassword()));
      newUser = userRepository.save(newUser);
        return convertToResponse(newUser);
    }



    @Override
    public String getUserRole(String email) {
       UserEntity existingUser= userRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("User not foud with this emailId: "+email));

        return existingUser.getRole();
    }

    @Override
    public List<UserResponse> readUsers() {
        return userRepository.findAll()
                .stream()
                .map(user->convertToResponse(user))
                .collect(Collectors.toList());

    }

    @Override
    public void deleteUser(String id) {
       UserEntity existingUser= userRepository.findByUserId(id)
                .orElseThrow(()->new UsernameNotFoundException("User  not found with this Id: "+id));
       userRepository.delete(existingUser);

    }


    private UserResponse convertToResponse(UserEntity newUser) {
        return UserResponse.builder()
                .userId(newUser.getUserId())
                .email(newUser.getEmail())
                .name(newUser.getName())
                .createdAt(newUser.getCreatedAt())
                .updatedAt(newUser.getUpdatedAt())
                .role(newUser.getRole())
                .build();
    }

    private UserEntity convertToEntity(UserRequest request) {
        return UserEntity.builder()
                .userId(UUID.randomUUID().toString())
                .email(request.getEmail())
                .password(request.getPassword())
                .name(request.getName())
                .role(request.getRole().toUpperCase())
                .build();

    }
}
