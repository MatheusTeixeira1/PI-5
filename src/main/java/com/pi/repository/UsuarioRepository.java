package com.pi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.pi.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
	UserDetails findByEmail(String email);
}
