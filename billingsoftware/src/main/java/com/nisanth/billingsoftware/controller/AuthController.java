package com.nisanth.billingsoftware.controller;

import com.nisanth.billingsoftware.io.AuthRequest;
import com.nisanth.billingsoftware.io.AuthResponse;
import com.nisanth.billingsoftware.service.UserService;
import com.nisanth.billingsoftware.service.impl.AppUserDetailsService;
import com.nisanth.billingsoftware.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    private final AppUserDetailsService appUserDetailsService;
    private final UserService userService;

    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) throws Exception {
        System.out.println("Inside login controller"); // 👈 see if this logs
        authenticate(request.getEmail(),request.getPassword());

        // generate the token
        final UserDetails userDetails=appUserDetailsService.loadUserByUsername(request.getEmail());

        // jwt utils
       final String jwtToken= jwtUtil.generateToken(userDetails);
       //  fetch the role from repository
       String role= userService.getUserRole(request.getEmail());
       return new AuthResponse(request.getEmail(),jwtToken,role);


    }

    private void authenticate(String email, String password) throws Exception {
        try

        {

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email,password));
            System.out.println("Inside login authenticate controller"); // 👈 see if this logs

        }
        catch(DisabledException e)
        {
            throw new Exception("User disabled");

        }
        catch(BadCredentialsException e)
        {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Email or Password is incorrect");
        }
    }

    @PostMapping("/encode")
    public String encodePassword(@RequestBody Map<String,String> request)
    {
        return passwordEncoder.encode(request.get("password"));

    }
}
