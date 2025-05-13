package com.pi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pi.DTOs.AuthenticationDTO;
import com.pi.DTOs.LoginResponseDTO;
import com.pi.DTOs.RegisterDTO;
import com.pi.entity.Usuario;
import com.pi.repository.UsuarioRepository;
import com.pi.security.TokenService;
import com.pi.service.AuthorizationService;
import jakarta.validation.Valid;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthorizationService authorizationService;
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private UsuarioRepository userRepository;
	
	@Autowired
	private TokenService tokenService;

    AuthenticationController(AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody @Valid AuthenticationDTO data) {
		var usernamePassword = new UsernamePasswordAuthenticationToken(data.username(), data.password());
		var auth = this.authenticationManager.authenticate(usernamePassword);
		var token = tokenService.generateToken((Usuario) auth.getPrincipal());
		return ResponseEntity.ok(new LoginResponseDTO(token));
	}
	
	@PostMapping(value = "/register")
	public ResponseEntity<?> register(@RequestBody RegisterDTO registerData) {
	    System.out.println(registerData.username());

	    System.out.println("-------------------------------------");
	    if (this.userRepository.findByEmail(registerData.username()) == null) {
	        String encryptedPassword = new BCryptPasswordEncoder().encode(registerData.password());
	        Usuario newUser = new Usuario(registerData.nome(), registerData.username(), encryptedPassword, registerData.role());
	        this.userRepository.save(newUser);

	        ResponseEntity<?> logar = loginInterno(new AuthenticationDTO(registerData.username(), registerData.password()));
	        return logar;
	    } else {
	        return ResponseEntity.badRequest().build();
	    }
	}

	
	public ResponseEntity<?> loginInterno(AuthenticationDTO data) {
		var usernamePassword = new UsernamePasswordAuthenticationToken(data.username(), data.password());
		var auth = this.authenticationManager.authenticate(usernamePassword);
		var token = tokenService.generateToken((Usuario) auth.getPrincipal());
		return ResponseEntity.ok(new LoginResponseDTO(token));
	}
	
	
	
}
