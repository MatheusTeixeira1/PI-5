package com.pi.service;

//ItemVendaService.java
import org.springframework.stereotype.Service;

import com.pi.entity.ItemVenda;
import com.pi.repository.ItemVendaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ItemVendaService {

 private final ItemVendaRepository itemVendaRepository;

 public ItemVendaService(ItemVendaRepository itemVendaRepository) {
     this.itemVendaRepository = itemVendaRepository;
 }

 public List<ItemVenda> listarTodos() {
     return itemVendaRepository.findAll();
 }

 public Optional<ItemVenda> buscarPorId(Long id) {
     return itemVendaRepository.findById(id);
 }

 public ItemVenda salvar(ItemVenda itemVenda) {
     return itemVendaRepository.save(itemVenda);
 }

 public void deletar(Long id) {
     itemVendaRepository.deleteById(id);
 }
}

