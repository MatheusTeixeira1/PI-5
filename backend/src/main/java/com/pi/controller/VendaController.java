package com.pi.controller;

import com.pi.DTOs.VendaDTO;
import com.pi.entity.Venda;
import com.pi.repository.VendaRepository;
import com.pi.service.VendaService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/venda")
public class VendaController {

    @Autowired
    private VendaRepository repository;

    // Criar produto
    @Autowired
    private VendaService vendaService;

    @PostMapping
    public ResponseEntity<Venda> criar(@RequestBody @Valid VendaDTO dto) {
        Venda salvo = vendaService.criarVenda(dto);
        return ResponseEntity.ok(salvo);
    }



    
    // Buscar todos os produtos
    @GetMapping
    public ResponseEntity<List<Venda>> listar() {
        List<Venda> vendas = repository.findAll();
        return ResponseEntity.ok(vendas);
    }

    // Buscar produto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Venda> buscarPorId(@PathVariable Long id) {
        Optional<Venda> venda = repository.findById(id);
        return venda.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Atualizar produto
    @PutMapping("/{id}")
    public ResponseEntity<Venda> atualizar(@PathVariable Long id, @RequestBody Venda novaVenda) {
        return repository.findById(id)
                .map(venda -> {
                	venda.setDataHora(LocalDateTime.now());
                	venda.setItens(novaVenda.getItens());
                	venda.setValorTotal(novaVenda.getValorTotal());
                    Venda atualizado = repository.save(venda);
                    return ResponseEntity.ok(atualizado);
                }).orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/{id}/itens")
    public ResponseEntity<?> listarItensDaVenda(@PathVariable Long id) {
        Optional<Venda> vendaOptional = repository.findById(id);
        if (vendaOptional.isPresent()) {
            return ResponseEntity.ok(vendaOptional.get().getItens());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    // Deletar produto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
