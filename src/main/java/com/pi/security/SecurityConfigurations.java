package com.pi.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {
	@Autowired
	SecurityFillter securityFillter;
	
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
		return httpSecurity
				.csrf(csrf -> csrf.disable())
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(authorize -> authorize
//						.requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
//						.requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
//						.requestMatchers(HttpMethod.POST, "/user").hasRole("ADMIM")
//						.requestMatchers(HttpMethod.POST, "/blueray").hasRole("ADMIN")
//						.requestMatchers(HttpMethod.PUT, "/blueray/{id}").hasRole("ADMIN")
//						.requestMatchers(HttpMethod.DELETE, "/blueray/{id}").hasRole("ADMIN")
						.requestMatchers(HttpMethod.GET, "/usuario").hasRole("ADMIN")
						.anyRequest().permitAll()
						
				)
				.addFilterBefore(securityFillter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();
	    configuration.addAllowedOrigin("http://127.0.0.1:5500"); // Origem permitida
	    configuration.addAllowedMethod("*"); // Permite todos os métodos (GET, POST, etc.)
	    configuration.addAllowedHeader("*"); // Permite todos os cabeçalhos
	    configuration.setAllowCredentials(true); // Permite o envio de cookies/sessões
	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", configuration); // Aplica as configurações a todos os endpoints
	    return source;
	}
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}
	
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
