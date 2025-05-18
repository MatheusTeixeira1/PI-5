package com.pi.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Venda implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime dataHora;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Double valorTotal;

    @JsonManagedReference
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemVenda> itens;

    public Venda() {
        this.dataHora = LocalDateTime.now();
        this.valorTotal = 0.0;
    }
    
    public Venda(Venda venda) {
        this();
        this.id = venda.getId();
        this.dataHora = LocalDateTime.now();
        calcularValorTotal();
        this.itens = venda.getItens();
    }
    
    @PrePersist
    protected void onCreate() {
    	dataHora = LocalDateTime.now();
    }
    
    public void calcularValorTotal() {
        this.valorTotal = itens.stream()
                .mapToDouble(ItemVenda::getSubtotal)
                .sum();
    }
    
	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public LocalDateTime getDataHora() { return dataHora; }
	public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

	public Double getValorTotal() { return valorTotal; }
	public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }

	public List<ItemVenda> getItens() { return itens; }
	public void setItens(List<ItemVenda> itens) { this.itens = itens; }

    
}

