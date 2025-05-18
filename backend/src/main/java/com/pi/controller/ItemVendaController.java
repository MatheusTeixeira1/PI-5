package com.pi.controller;

import com.pi.entity.ItemVenda;
import com.pi.repository.ItemVendaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/itemVenda")
public class ItemVendaController {

    @Autowired
    private ItemVendaRepository repository;

    // Criar item de venda
    @PostMapping
    public ResponseEntity<ItemVenda> criar(@RequestBody ItemVenda itemVenda) {
        ItemVenda salvo = repository.save(itemVenda);
        return ResponseEntity.ok(salvo);
    }

    // Buscar todos os itens de venda
    @GetMapping
    public ResponseEntity<List<ItemVenda>> listar() {
        List<ItemVenda> itensVenda = repository.findAll();
        return ResponseEntity.ok(itensVenda);
    }

    // Buscar item de venda por ID
    @GetMapping("/{id}")
    public ResponseEntity<ItemVenda> buscarPorId(@PathVariable Long id) {
        Optional<ItemVenda> itemVenda = repository.findById(id);
        return itemVenda.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Atualizar item de venda
    @PutMapping("/{id}")
    public ResponseEntity<ItemVenda> atualizar(@PathVariable Long id, @RequestBody ItemVenda novoItemVenda) {
        return repository.findById(id)
                .map(itemVenda -> {
                    itemVenda.setProduto(novoItemVenda.getProduto());
                    itemVenda.setVenda(novoItemVenda.getVenda());
                    itemVenda.setQuantidade(novoItemVenda.getQuantidade());
                    itemVenda.setPrecoUnitario(novoItemVenda.getPrecoUnitario());
                    itemVenda.setSubtotal(novoItemVenda.getSubtotal());
                    ItemVenda atualizado = repository.save(itemVenda);
                    return ResponseEntity.ok(atualizado);
                }).orElse(ResponseEntity.notFound().build());
    }

    // Deletar item de venda
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}