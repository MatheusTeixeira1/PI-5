package com.pi.controller;

import com.pi.DTOs.VendaDTO;
import com.pi.entity.ItemVenda;
import com.pi.entity.Venda;
import com.pi.service.VendaService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/venda")
public class VendaController {

	@Autowired
	private VendaService vendaService;

	@PostMapping
	public ResponseEntity<Venda> criar(@RequestBody @Valid VendaDTO dto) {
		Venda salvo = vendaService.criarVenda(dto);
		return ResponseEntity.ok(salvo);
	}

	@GetMapping
	public ResponseEntity<List<Venda>> listar() {
		List<Venda> vendas = vendaService.listarTodasVendas();
		return ResponseEntity.ok(vendas);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Venda> buscarPorId(@PathVariable Long id) {
		return vendaService.buscarVendaPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PutMapping("/{id}")
	public ResponseEntity<Venda> atualizar(@PathVariable Long id, @RequestBody Venda novaVenda) {
		return vendaService.atualizarVenda(id, novaVenda).map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/{id}/itens")
	public ResponseEntity<?> listarItensDaVenda(@PathVariable Long id) {
		try {
			List<ItemVenda> itens = vendaService.listarItensDaVenda(id);
			return ResponseEntity.ok(itens);
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id) {
		try {
			vendaService.deletarVenda(id);
			return ResponseEntity.noContent().build();
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}
}