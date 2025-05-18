package com.pi.DTOs;

import jakarta.validation.constraints.*;

public class ItemVendaDTO {

	@NotNull
	private Long produtoId;

	@NotNull
	@Min(1)
	private Integer quantidade;

	public Long getProdutoId() {
		return produtoId;
	}

	public void setProdutoId(Long produtoId) {
		this.produtoId = produtoId;
	}

	public Integer getQuantidade() {
		return quantidade;
	}

	public void setQuantidade(Integer quantidade) {
		this.quantidade = quantidade;
	}


}
