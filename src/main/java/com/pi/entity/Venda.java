package com.pi.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

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

    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemVenda> itens;

    public Venda() {
        this.dataHora = LocalDateTime.now();
    }
    @PrePersist
    protected void onCreate() {
    	dataHora = LocalDateTime.now();
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

