import "../../css/FormCriar.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ProdutoEditar() {
  const { id } = useParams(); // id do produto a ser editado
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoriaId: "",
    quantidadeEstoque: "",
    preco: "",
    status: "ativo",
  });

  const [categoriasAtivas, setCategoriasAtivas] = useState([]);

  useEffect(() => {
    // Carregar categorias ativas
    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:8080/categorias");
        const data = await response.json();
        const ativas = data.filter((cat) => cat.isAtivo);
        setCategoriasAtivas(ativas);
      } catch (error) {
        alert("Erro ao carregar categorias: " + error.message);
      }
    };

    // Carregar dados do produto
    const fetchProduto = async () => {
      try {
        const response = await fetch(`http://localhost:8080/produtos/${id}`);
        if (!response.ok) throw new Error("Produto não encontrado");
        const produto = await response.json();

        setFormData({
          nome: produto.nome,
          descricao: produto.descricao,
          categoriaId: produto.categoria?.id?.toString() || "",
          quantidadeEstoque: produto.quantidadeEstoque.toString(),
          preco: produto.preco.toString(),
          status: produto.isAtivo ? "ativo" : "inativo",
        });
      } catch (error) {
        alert("Erro ao carregar produto: " + error.message);
      }
    };

    fetchCategorias();
    fetchProduto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const produtoDTO = {
      id: parseInt(id),
      nome: formData.nome,
      descricao: formData.descricao,
      quantidadeEstoque: parseInt(formData.quantidadeEstoque),
      preco: parseFloat(formData.preco),
      isAtivo: formData.status === "ativo",
      categoria: { id: parseInt(formData.categoriaId) },
    };

    try {
      const response = await fetch(`http://localhost:8080/produtos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produtoDTO),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar produto");
      }

      alert("Produto atualizado com sucesso!");
      window.location.href = "/produtos";
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  return (
    <div className="componente-criar">
      <div className="container-titulo">
        <h4>Editar Produto</h4>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            required
            value={formData.nome}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            name="descricao"
            rows="4"
            className="descricao-textarea"
            value={formData.descricao}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="categoriaId">Categoria:</label>
          <select
            id="categoriaId"
            name="categoriaId"
            required
            value={formData.categoriaId}
            onChange={handleChange}
          >
            <option value="">Selecione uma categoria</option>
            {categoriasAtivas.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantidadeEstoque">Quantidade em Estoque:</label>
          <input
            type="number"
            id="quantidadeEstoque"
            name="quantidadeEstoque"
            value={formData.quantidadeEstoque}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="preco">Preço (R$):</label>
          <input
            type="number"
            step="0.01"
            id="preco"
            name="preco"
            value={formData.preco}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-salvar">Atualizar</button>
          <a href="/produtos">
            <button type="button" className="btn-cancelar">Cancelar</button>
          </a>
        </div>
      </form>
    </div>
  );
}

export default ProdutoEditar;
