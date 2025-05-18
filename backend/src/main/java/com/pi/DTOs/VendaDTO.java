package com.pi.DTOs;

import java.util.List;

import jakarta.validation.constraints.*;

public class VendaDTO {

	@NotEmpty
	private List<ItemVendaDTO> itens;

	public List<ItemVendaDTO> getItens() {
		return itens;
	}

	public void setItens(List<ItemVendaDTO> itens) {
		this.itens = itens;
	}
}
