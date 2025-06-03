import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/detalhe.css";

const DetalhesCategoria = () => {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    fetch(`http://localhost:8080/categorias/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar categoria");
        return res.json();
      })
      .then((data) => setCategoria(data))
      .catch((err) => {
        console.error(err);
        alert("Não foi possível carregar a categoria.");
      });
  }, [id]);

  if (!categoria) return <p>Carregando...</p>;

  return (
    <div className="detalhes">
      <h2>Detalhes da Categoria</h2>

      <div className="campo">
        <strong>ID:</strong>
        <span>{categoria.id}</span>
      </div>

      <div className="campo">
        <strong>Nome:</strong>
        <span>{categoria.nome}</span>
      </div>

      <div className="campo">
        <strong>Descrição:</strong>
        <span>{categoria.descricao || "Nenhuma descrição fornecida"}</span>
      </div>

      {/* <div className="campo">
        <strong>Data de Cadastro:</strong>
        <span>{new Date(categoria.createdAt).toLocaleString("pt-BR")}</span>
      </div> */}

      <div className={`status ${categoria.isAtivo ? "ativo" : "inativo"}`}>
        Categoria {categoria.isAtivo ? "Ativa" : "Inativa"}
      </div>
    </div>
  );
};

export default DetalhesCategoria;