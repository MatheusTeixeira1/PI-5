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

@Service
public class VendaService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private VendaRepository vendaRepository;

    @Transactional
    public Venda criarVenda(VendaDTO dto) {
        Venda venda = new Venda();
        venda.setDataHora(LocalDateTime.now());

        List<ItemVenda> itens = new ArrayList<>();
        double valorTotal = 0.0;

        for (ItemVendaDTO itemDTO : dto.getItens()) {
            Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado: ID " + itemDTO.getProdutoId()));

            double precoUnitario = produto.getPreco(); // pega o preço do banco
            int qtd = itemDTO.getQuantidade();
            double subtotal = precoUnitario * qtd;

            ItemVenda item = new ItemVenda();
            item.setProduto(produto);
            item.setQuantidade(qtd);
            item.setPrecoUnitario(precoUnitario); // agora nunca será null
            item.setSubtotal(subtotal);
            item.setVenda(venda);

            itens.add(item);
            valorTotal += subtotal;
        }


        venda.setItens(itens);
        venda.setValorTotal(valorTotal);

        return vendaRepository.save(venda);
    }
} 
