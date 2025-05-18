package com.pi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pi.entity.Categoria;


public interface CategoriaRepository extends JpaRepository<Categoria, Long>{
}

