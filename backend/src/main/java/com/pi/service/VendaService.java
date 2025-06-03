package com.pi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pi.DTOs.ItemVendaDTO;
import com.pi.DTOs.VendaDTO;
import com.pi.entity.ItemVenda;
import com.pi.entity.Produto;
import com.pi.entity.Venda;
import com.pi.repository.ProdutoRepository;
import com.pi.repository.VendaRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VendaService {

	@Autowired
	private ProdutoRepository produtoRepository;

	@Autowired
	private VendaRepository vendaRepository;

//	@Transactional
//	public Venda criarVenda(VendaDTO dto) {
//		Venda venda = new Venda();
//		venda.setDataHora(LocalDateTime.now());
//
//		List<ItemVenda> itens = new ArrayList<>();
//		double valorTotal = 0.0;
//
//		for (ItemVendaDTO itemDTO : dto.getItens()) {
//			Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
//					.orElseThrow(() -> new RuntimeException("Produto não encontrado: ID " + itemDTO.getProdutoId()));
//
//			double precoUnitario = produto.getPreco();
//			int qtd = itemDTO.getQuantidade();
//			double subtotal = precoUnitario * qtd;
//
//			ItemVenda item = new ItemVenda();
//			item.setProduto(produto);
//			item.setQuantidade(qtd);
//			item.setPrecoUnitario(precoUnitario);
//			item.setSubtotal(subtotal);
//			item.setVenda(venda);
//
//			itens.add(item);
//			valorTotal += subtotal;
//		}
//
//		venda.setItens(itens);
//		venda.setValorTotal(valorTotal);
//
//		return vendaRepository.save(venda);
//	}
	@Transactional
	public Venda criarVenda(VendaDTO dto) {
	    Venda venda = new Venda();
	    venda.setDataHora(LocalDateTime.now());

	    List<ItemVenda> itens = new ArrayList<>();
	    double valorTotal = 0.0;

	    for (ItemVendaDTO itemDTO : dto.getItens()) {
	        Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
	            .orElseThrow(() -> new RuntimeException("Produto não encontrado: ID " + itemDTO.getProdutoId()));

	        int quantidadeVendida = itemDTO.getQuantidade();

	        // Verificar se há estoque suficiente
	        if (produto.getQuantidadeEstoque() < quantidadeVendida) {
	            throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
	        }

	        // Atualizar o estoque
	        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - quantidadeVendida);
	        produtoRepository.save(produto); // necessário dependendo da configuração do JPA

	        double precoUnitario = produto.getPreco();
	        double subtotal = precoUnitario * quantidadeVendida;

	        ItemVenda item = new ItemVenda();
	        item.setProduto(produto);
	        item.setQuantidade(quantidadeVendida);
	        item.setPrecoUnitario(precoUnitario);
	        item.setSubtotal(subtotal);
	        item.setVenda(venda);

	        itens.add(item);
	        valorTotal += subtotal;
	    }

	    venda.setItens(itens);
	    venda.setValorTotal(valorTotal);

	    return vendaRepository.save(venda);
	}

	public List<Venda> listarTodasVendas() {
		return vendaRepository.findAll();
	}

	public Optional<Venda> buscarVendaPorId(Long id) {
		return vendaRepository.findById(id);
	}

	@Transactional
	public Optional<Venda> atualizarVenda(Long id, Venda novaVenda) {
		return vendaRepository.findById(id).map(venda -> {
			venda.setDataHora(LocalDateTime.now());
			venda.setItens(novaVenda.getItens());
			venda.setValorTotal(novaVenda.getValorTotal());
			return vendaRepository.save(venda);
		});
	}

	public List<ItemVenda> listarItensDaVenda(Long id) {
		return vendaRepository.findById(id).map(Venda::getItens)
				.orElseThrow(() -> new RuntimeException("Venda não encontrada: ID " + id));
	}

	@Transactional
	public void deletarVenda(Long id) {
		if (vendaRepository.existsById(id)) {
			vendaRepository.deleteById(id);
		} else {
			throw new RuntimeException("Venda não encontrada: ID " + id);
		}
	}
}