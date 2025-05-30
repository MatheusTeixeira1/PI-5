import "../../css/Form.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditarCategoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    status: "ativo",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega os dados da categoria ao montar o componente
  useEffect(() => {
    const carregarCategoria = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:8080/categorias/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Categoria não encontrada");
        }
        
        const data = await response.json();
        
        setFormData({
          nome: data.nome,
          descricao: data.descricao || "",
          status: data.isAtivo ? "ativo" : "inativo",
        });
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    carregarCategoria();
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

    // Validação básica
    if (!formData.nome.trim()) {
      alert("O nome da categoria é obrigatório!");
      return;
    }

    const categoriaDTO = {
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim(),
      isAtivo: formData.status === "ativo",
    };

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8080/categorias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(categoriaDTO),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar categoria");
      }

      alert("Categoria atualizada com sucesso!");
      navigate("/categorias");
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
      <h2>Editar Categoria</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Digite o nome da categoria"
            required
            value={formData.nome}
            onChange={handleChange}
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            name="descricao"
            rows="4"
            placeholder="Digite a descrição da categoria"
            className="descricao-textarea"
            value={formData.descricao}
            onChange={handleChange}
            maxLength="500"
          ></textarea>
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
          <button type="submit" className="btn-salvar">
            Salvar Alterações
          </button>
          <button 
            type="button" 
            className="btn-cancelar"
            onClick={() => navigate("/categorias")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarCategoria;