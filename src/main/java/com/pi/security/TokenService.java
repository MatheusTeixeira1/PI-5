package com.pi.security;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.pi.entity.Usuario;


@Service
public class TokenService {
	
	//@Value("${api.security.token.secret}")
	private String secret = "my-secret-key";
	
	public String generateToken(Usuario user) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			String token = JWT.create()
					.withIssuer("site-animes")
					.withSubject(user.getUsername())
					.withExpiresAt(genExpirationDate())
					.withClaim("role", user.getUserRole().toString())
					.withClaim("id", user.getId())
					.withClaim("nome", user.getNome())
					.withClaim("username", user.getUsername())
					.sign(algorithm);
			return token;
		} catch (JWTCreationException e) {
			throw new RuntimeException("Error while generating token", e);
		}
	}
	
	public String validateToken(String token) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			return JWT.require(algorithm)
					.withIssuer("site-animes")
					.build()
					.verify(token)
					.getSubject();
		} catch (JWTVerificationException e) {
			throw new IllegalArgumentException("Token inválido ou expirado", e);
		}
	}
	
	private Instant genExpirationDate() {
		return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
	}
}
