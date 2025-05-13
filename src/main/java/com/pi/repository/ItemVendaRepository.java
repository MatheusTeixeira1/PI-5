package com.pi.repository;

//ItemVendaRepository.java
import org.springframework.data.jpa.repository.JpaRepository;

import com.pi.entity.ItemVenda;

public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> {
}
