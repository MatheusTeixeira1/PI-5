package com.pi.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;

@Entity
public class ItemVenda implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "venda_id")
    private Venda venda;

    @NotNull
    @Min(value = 1, message = "Quantidade deve ser no mínimo 1")
    @Column(nullable = false)
    private Integer quantidade;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Double precoUnitario;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Double subtotal;

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	
	public Produto getProduto() { return produto; }
	public void setProduto(Produto produto) { this.produto = produto; }

	public Venda getVenda() { return venda; }
	public void setVenda(Venda venda) { this.venda = venda; }

	public Integer getQuantidade() { return quantidade; }
	public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

	public Double getPrecoUnitario() { return precoUnitario; }
	public void setPrecoUnitario(Double precoUnitario) { this.precoUnitario = precoUnitario; }

	public Double getSubtotal() { return subtotal; }
	public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    
}

