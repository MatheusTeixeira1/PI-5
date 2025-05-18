package com.pi.controller;

import com.pi.entity.Produto;
import com.pi.repository.ProdutoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    // Criar produto
    @PostMapping
    public ResponseEntity<Produto> criar(@RequestBody Produto produto) {
        Produto salvo = produtoRepository.save(produto);
        return ResponseEntity.ok(salvo);
    }

    // Buscar todos os produtos
    @GetMapping
    public ResponseEntity<List<Produto>> listar() {
        List<Produto> produtos = produtoRepository.findAll();
        return ResponseEntity.ok(produtos);
    }

    // Buscar produto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        Optional<Produto> produto = produtoRepository.findById(id);
        return produto.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Atualizar produto
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @RequestBody Produto novoProduto) {
        return produtoRepository.findById(id)
                .map(produto -> {
                    produto.setNome(novoProduto.getNome());
                    produto.setDescricao(novoProduto.getDescricao());
                    produto.setPreco(novoProduto.getPreco());
                    produto.setQuantidadeEstoque(novoProduto.getQuantidadeEstoque());
                    produto.setCategoria(novoProduto.getCategoria());
                    produto.setIsAtivo(novoProduto.getIsAtivo());
                    Produto atualizado = produtoRepository.save(produto);
                    return ResponseEntity.ok(atualizado);
                }).orElse(ResponseEntity.notFound().build());
    }

    // Deletar produto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (produtoRepository.existsById(id)) {
            produtoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
