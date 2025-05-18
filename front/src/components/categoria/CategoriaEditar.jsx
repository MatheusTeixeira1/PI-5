import "../../css/FormCriar.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function CategoriasEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    isAtivo: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await fetch(`http://localhost:8080/categorias/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar categoria");
        const data = await response.json();
        setFormData({
          nome: data.nome || "",
          descricao: data.descricao || "",
          isAtivo: data.isAtivo,
        });
        setLoading(false);
      } catch (error) {
        alert(error.message);
        setLoading(false);
      }
    };
    fetchCategoria();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "isAtivo") {
      setFormData({ ...formData, isAtivo: value === "ativo" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/categorias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Erro ao atualizar categoria");
      navigate("/categorias");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div>Carregando categoria...</div>;

  return (
    <div className="componente-criar">
      <div className="container-titulo">
        <h4>Editar Categoria</h4>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            name="descricao"
            rows="4"
            value={formData.descricao}
            onChange={handleChange}
            className="descricao-textarea"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="isAtivo"
            value={formData.isAtivo ? "ativo" : "inativo"}
            onChange={handleChange}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-salvar">Salvar</button>
          <button type="button" className="btn-cancelar" onClick={() => navigate("/categorias")}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default CategoriasEditar;
    