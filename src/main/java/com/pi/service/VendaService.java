package com.pi.service;
//VendaService.java
import org.springframework.stereotype.Service;

import com.pi.entity.Venda;
import com.pi.repository.VendaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class VendaService {

 private final VendaRepository vendaRepository;

 public VendaService(VendaRepository vendaRepository) {
     this.vendaRepository = vendaRepository;
 }

 public List<Venda> listarTodas() {
     return vendaRepository.findAll();
 }

 public Optional<Venda> buscarPorId(Long id) {
     return vendaRepository.findById(id);
 }

 public Venda salvar(Venda venda) {
     return vendaRepository.save(venda);
 }

 public void deletar(Long id) {
     vendaRepository.deleteById(id);
 }
}
