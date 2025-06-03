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

						.requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
						.requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
						.requestMatchers(HttpMethod.GET, "/auth/registerAdm").hasRole("ADMIN")
//						
						.requestMatchers(HttpMethod.POST, "/categorias").hasRole("ADMIN")
						.requestMatchers(HttpMethod.GET, "/categorias").hasAnyRole("ADMIN", "USER")
						.requestMatchers(HttpMethod.GET, "/categorias/{id}").hasAnyRole("ADMIN", "USER")
						.requestMatchers(HttpMethod.PUT, "/categorias/{id}").hasRole("ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/categorias/{id}").hasRole("ADMIN")
//						
						.requestMatchers(HttpMethod.POST, "/produtos").hasRole("ADMIN")
						.requestMatchers(HttpMethod.GET, "/produtos").hasAnyRole("ADMIN", "USER")
						.requestMatchers(HttpMethod.GET, "/produtos/{id}").hasAnyRole("ADMIN", "USER")
						.requestMatchers(HttpMethod.PUT, "/produtos/{id}").hasRole("ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/produtos/{id}").hasRole("ADMIN")

//						.requestMatchers(HttpMethod.GET, "/produtos").permitAll()
//						.requestMatchers(HttpMethod.GET, "/produtos/{id}").permitAll()
//						
//						
						.requestMatchers(HttpMethod.POST, "/venda").hasAnyRole("ADMIN", "USER")
						.requestMatchers(HttpMethod.GET, "/venda").hasAnyRole("ADMIN", "USER")
						.requestMatchers(HttpMethod.GET, "/venda/{id}").hasAnyRole("ADMIN", "USER")
						.requestMatchers(HttpMethod.PUT, "/venda/{id}").hasRole("ADMIN")
						.requestMatchers(HttpMethod.GET, "/{id}/itens").hasRole("ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/venda/{id}").hasRole("ADMIN")
//						
						.requestMatchers("/usuario/**").hasRole("ADMIN")
//						
//						.requestMatchers(HttpMethod.GET, "/produtos").hasAnyRole("ADMIN", "USER")
//						.requestMatchers(HttpMethod.GET, "/produtos/{id}").hasAnyRole("ADMIN", "USER")
//						.requestMatchers(HttpMethod.POST, "/produtos").hasRole("ADMIN")
//						.requestMatchers(HttpMethod.PUT, "/produtos/{id}").hasRole("ADMIN")
//						.requestMatchers(HttpMethod.DELETE, "/produtos/{id}").hasRole("ADMIN")
						
//						.requestMatchers(HttpMethod.GET, "/produtos").authenticated()
//						.anyRequest().hasRole("ADMIN")
						.anyRequest().permitAll()
						
				)
				.addFilterBefore(securityFillter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();
	    configuration.addAllowedOrigin("http://localhost:5173"); 
	    configuration.addAllowedMethod("*"); 
	    configuration.addAllowedHeader("*"); 
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
