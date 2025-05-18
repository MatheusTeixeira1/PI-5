import "../../css/FormCriar.css";
import React, { useState } from "react";

function CategoriasCriar() {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    status: "ativo",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoriaDTO = {
      nome: formData.nome,
      descricao: formData.descricao,
      isAtivo: formData.status === "ativo",
    };

    try {
      const response = await fetch("http://localhost:8080/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoriaDTO),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar categoria");
      }

      alert("Categoria salva com sucesso!");
      window.location.href = "/categorias";
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  return (
    <div className="componente-criar">
      <div className="container-titulo">
        <h4>Gestão de Categorias</h4>
      </div>
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
          <button type="submit" className="btn-salvar">Salvar</button>
          <a href="/categorias">
            <button type="button" className="btn-cancelar">Cancelar</button>
          </a>
        </div>
      </form>
    </div>
  );
}

export default CategoriasCriar;
