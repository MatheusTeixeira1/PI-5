import "../../css/FormCriar.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProdutoCriar() {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoriaId: "",
    quantidadeEstoque: "",
    preco: "",
    status: "ativo",
  });

  const [categoriasAtivas, setCategoriasAtivas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/auth/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/categorias", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Erro ao buscar categorias");
        }

        const data = await response.json();
        const ativas = data.filter((cat) => cat.isAtivo);
        setCategoriasAtivas(ativas);
      } catch (error) {
        alert("Erro ao carregar categorias: " + error.message);
      }
    };

    fetchCategorias();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sessão expirada. Faça login novamente.");
      navigate("/auth/login");
      return;
    }

    const produtoDTO = {
      nome: formData.nome,
      descricao: formData.descricao,
      quantidadeEstoque: parseInt(formData.quantidadeEstoque),
      preco: parseFloat(formData.preco),
      isAtivo: formData.status === "ativo",
      categoria: { id: parseInt(formData.categoriaId) },
    };

    try {
      const response = await fetch("http://localhost:8080/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(produtoDTO),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/auth/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao salvar produto");
      }

      alert("Produto salvo com sucesso!");
      navigate("/produtos");
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  return (
    <div className="componente-criar">
      <div className="container-titulo">
        <h4>Gestão de Produtos</h4>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Digite o nome do produto"
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
            placeholder="Digite a descrição do produto"
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
            required
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
            required
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
          <button type="submit" className="btn-salvar">Salvar</button>
          <a href="/produtos">
            <button type="button" className="btn-cancelar">Cancelar</button>
          </a>
        </div>
      </form>
    </div>
  );
}

export default ProdutoCriar;