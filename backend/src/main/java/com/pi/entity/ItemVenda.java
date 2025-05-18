package com.pi.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
    @JsonBackReference
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

    public ItemVenda() {
    	
    }
    
    public ItemVenda(ItemVenda itemVenda) {
    	this.id = itemVenda.getId();
		this.produto = itemVenda.getProduto();
		this.venda = itemVenda.getVenda();
		this.quantidade = itemVenda.getQuantidade();
		
		this.precoUnitario = itemVenda.getProduto().getPreco();
		this.subtotal = itemVenda.getProduto().getPreco() * quantidade;
    }
    
	public ItemVenda(Long id, Produto produto, Venda venda,
			@NotNull @Min(value = 1, message = "Quantidade deve ser no mínimo 1") Integer quantidade) {
		super();
		this.id = id;
		this.produto = produto;
		this.venda = venda;
		this.quantidade = quantidade;
		
		this.precoUnitario = produto.getPreco();
		this.subtotal = produto.getPreco() * quantidade;
	}



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

