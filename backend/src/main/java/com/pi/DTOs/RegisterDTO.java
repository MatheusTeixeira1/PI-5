package com.pi.DTOs;

import com.pi.entity.UserRole;

public record RegisterDTO(String nome, String username, String password, UserRole role) {
}
