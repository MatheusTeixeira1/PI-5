package com.pi.service;

import com.pi.entity.Usuario;
import com.pi.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Transactional
    public Usuario criarUsuario(Usuario usuario) {
        // Criptografa a senha antes de salvar
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Optional<Usuario> atualizarUsuario(Long id, Usuario newUsuario) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setUsername(newUsuario.getUsername());
                    usuario.setNome(newUsuario.getNome());
                    usuario.setUserRole(newUsuario.getUserRole());
                    // Não atualiza a senha diretamente aqui (use o método específico)
                    return usuarioRepository.save(usuario);
                });
    }

    @Transactional
    public boolean deletarUsuario(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public Optional<Usuario> atualizarUsername(Long id, String newUsername, String password) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    if (password == null || password.trim().isEmpty() || 
                        !passwordEncoder.matches(password, usuario.getPassword())) {
                        throw new SecurityException("Senha inválida");
                    }

                    if (newUsername == null || newUsername.trim().isEmpty()) {
                        throw new IllegalArgumentException("Novo username não pode ser vazio");
                    }

                    usuario.setUsername(newUsername);
                    return usuarioRepository.save(usuario);
                });
    }

    @Transactional
    public Optional<Usuario> atualizarSenha(Long id, String newPassword, String currentPassword) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    if (currentPassword == null || currentPassword.trim().isEmpty() || 
                        !passwordEncoder.matches(currentPassword, usuario.getPassword())) {
                        throw new SecurityException("Senha atual inválida");
                    }

                    if (newPassword == null || newPassword.trim().isEmpty()) {
                        throw new IllegalArgumentException("Nova senha não pode ser vazia");
                    }

                    usuario.setPassword(passwordEncoder.encode(newPassword));
                    return usuarioRepository.save(usuario);
                });
    }
}