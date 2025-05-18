package com.pi.entity;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Usuario implements UserDetails, Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    //Utilizado como username logo deve ser unico
    @NotBlank(message = "Email é obrigatório")
    @Column(unique = true)
    private String email;

    private String numeroTelefone;
    
    @NotBlank(message = "Senha é obrigatória")
    private String senha;

    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    // Construtor padrão exigido pelo JPA
    public Usuario() {}

    public Usuario(String nome, String email, String senha, UserRole userRole) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.userRole = userRole;
    }

    public Usuario(Long id, String nome, String email, String senha, UserRole userRole) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.userRole = userRole;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    @Override
    public String getUsername() { return email; }
    public void setUsername(String email) { this.email = email; }

    public String getNumeroTelefone() { return numeroTelefone; }
	public void setNumeroTelefone(String numeroTelefone) { this.numeroTelefone = numeroTelefone; }

	@Override
    public String getPassword() { return senha; }
    public void setPassword(String senha) { this.senha = senha; }

    public UserRole getUserRole() { return userRole; }
    public void setUserRole(UserRole userRole) { this.userRole = userRole; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return userRole == UserRole.ADMIN
            ? List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"))
            : List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
