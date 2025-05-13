package com.pi.DTOs;

import com.pi.entity.UserRole;

public record RegisterDTO(String username, String nome, String password, UserRole role) {

}
