import "../../css/Form.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditarProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: 0,
    quantidadeEstoque: 0,
    isAtivo: true,
    categoriaId: ""
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Carrega o produto e as categorias disponíveis
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        // Carrega categorias
        const categoriasResponse = await fetch("http://localhost:8080/categorias", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!categoriasResponse.ok) {
          throw new Error("Erro ao carregar categorias");
        }
        
        const categoriasData = await categoriasResponse.json();
        setCategorias(categoriasData);
        
        // Carrega o produto
        const produtoResponse = await fetch(`http://localhost:8080/produtos/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!produtoResponse.ok) {
          throw new Error("Produto não encontrado");
        }
        
        const produtoData = await produtoResponse.json();
        
        setFormData({
          nome: produtoData.nome,
          descricao: produtoData.descricao || "",
          preco: produtoData.preco,
          quantidadeEstoque: produtoData.quantidadeEstoque,
          isAtivo: produtoData.isAtivo,
          categoriaId: produtoData.categoria.id
        });
        
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "isAtivo" ? e.target.checked : value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nome.trim()) {
      errors.nome = "Nome é obrigatório";
    }
    
    if (formData.preco === "" || isNaN(formData.preco)) {
      errors.preco = "Preço é obrigatório";
    } else if (Number(formData.preco) < 0) {
      errors.preco = "Preço não pode ser negativo";
    }
    
    if (formData.quantidadeEstoque === "" || isNaN(formData.quantidadeEstoque)) {
      errors.quantidadeEstoque = "Quantidade em estoque é obrigatória";
    } else if (Number(formData.quantidadeEstoque) < 0) {
      errors.quantidadeEstoque = "Estoque não pode ser negativo";
    }
    
    if (!formData.categoriaId) {
      errors.categoriaId = "Categoria é obrigatória";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const produtoDTO = {
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim(),
      preco: Number(formData.preco),
      quantidadeEstoque: Number(formData.quantidadeEstoque),
      isAtivo: formData.isAtivo,
      categoria: { id: formData.categoriaId }
    };

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8080/produtos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(produtoDTO),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar produto");
      }

      alert("Produto atualizado com sucesso!");
      navigate("/produtos");
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div className="componente-editar">
      <h2>Editar Produto</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome*:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Digite o nome do produto"
            required
            value={formData.nome}
            onChange={handleChange}
            maxLength="255"
          />
          {formErrors.nome && <span className="error-message">{formErrors.nome}</span>}
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
            maxLength="1000"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="preco">Preço*:</label>
          <input
            type="number"
            id="preco"
            name="preco"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={formData.preco}
            onChange={handleChange}
          />
          {formErrors.preco && <span className="error-message">{formErrors.preco}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="quantidadeEstoque">Quantidade em Estoque*:</label>
          <input
            type="number"
            id="quantidadeEstoque"
            name="quantidadeEstoque"
            placeholder="0"
            min="0"
            value={formData.quantidadeEstoque}
            onChange={handleChange}
          />
          {formErrors.quantidadeEstoque && <span className="error-message">{formErrors.quantidadeEstoque}</span>}
        </div>

        <div className="form-group checkbox-group">
          <label htmlFor="isAtivo">Produto Ativo:</label>
          <input
            type="checkbox"
            id="isAtivo"
            name="isAtivo"
            checked={formData.isAtivo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoriaId">Categoria*:</label>
          <select
            id="categoriaId"
            name="categoriaId"
            value={formData.categoriaId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
          {formErrors.categoriaId && <span className="error-message">{formErrors.categoriaId}</span>}
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-salvar">
            Salvar Alterações
          </button>
          <button 
            type="button" 
            className="btn-cancelar"
            onClick={() => navigate("/produtos")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarProduto;