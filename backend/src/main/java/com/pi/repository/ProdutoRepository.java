package com.pi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pi.entity.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Long>{
}
