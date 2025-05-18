package com.pi.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.pi.entity.Usuario;
import com.pi.repository.UsuarioRepository;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5501")
public class UsuarioController {
	@Autowired
	private UsuarioRepository usuarioRepository;

	@RequestMapping(value = "/usuario", method = RequestMethod.GET)
	public List<Usuario> Get() {
		return usuarioRepository.findAll();
	}

	@RequestMapping(value = "usuario/{id}", method = RequestMethod.GET)
	public ResponseEntity<Usuario> GetById(@PathVariable(value = "id") long id) {
		Optional<Usuario> usuario = usuarioRepository.findById(id);
		if  (usuario.isPresent()) {
			return new ResponseEntity<Usuario> (usuario.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@RequestMapping(value = "/usuario", method = RequestMethod.POST)
	public Usuario Post(@RequestBody Usuario usuario) {
		return usuarioRepository.save (usuario);
	}

	@RequestMapping(value = "/usuario/{id}", method = RequestMethod.PUT)
	public ResponseEntity<Usuario> Put(@PathVariable(value = "id") long id, @RequestBody Usuario newUsuario) {
		Optional<Usuario> oldUsuario = usuarioRepository.findById(id);
		if (oldUsuario.isPresent()) {
			Usuario usuario = oldUsuario.get();
			usuario.setUsername(newUsuario.getUsername());
			usuario.setPassword(newUsuario.getPassword());
			usuario.setNome(newUsuario.getNome());
			usuario.setUserRole(newUsuario.getUserRole());
			
			usuarioRepository.save(usuario);
			return new ResponseEntity<Usuario> (usuario, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@RequestMapping(value = "/usuario/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Object> Delete(@PathVariable(value = "id") long id)
	{
	    Optional<Usuario> usuario = usuarioRepository.findById(id);
	    if  (usuario.isPresent()) {
	    	usuarioRepository.delete (usuario.get());
	        return new ResponseEntity<>(HttpStatus.OK);
	    } else {
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }
	}
	
	
	@RequestMapping(value = "/usuario/updateUsername/{id}", method = RequestMethod.PATCH)
	public ResponseEntity<Usuario> updateUsername(@PathVariable(value = "id") long id, @RequestBody Map<String, String> body) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();

            // Obtem o novo username e senha do corpo da requisição
            String newUsername = body.get("username");
            String password = body.get("password");

            if (password == null || password.trim().isEmpty() || !new BCryptPasswordEncoder().matches(password, usuario.getPassword())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            if (newUsername == null || newUsername.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            usuario.setUsername(newUsername);
            usuarioRepository.save(usuario);

            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
	

	
	@RequestMapping(value = "/user/updatePassword/{id}", method = RequestMethod.PATCH)
	public ResponseEntity<Usuario> updatePassword(@PathVariable(value = "id") long id, @RequestBody Map<String, String> body) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
		if (usuarioOptional.isPresent()) {
        	Usuario usuario = usuarioOptional.get();

            // Obtem o novo username e senha do corpo da requisição
            String newPassword = body.get("newPassword");
            String password = body.get("password");

            if (password == null || password.trim().isEmpty() || !new BCryptPasswordEncoder().matches(password, usuario.getPassword())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            if (newPassword == null || newPassword.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            String encryptedPassword = new BCryptPasswordEncoder().encode(newPassword);
            usuario.setPassword(encryptedPassword);
            usuarioRepository.save(usuario);

            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
