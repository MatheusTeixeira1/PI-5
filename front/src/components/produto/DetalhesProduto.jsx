import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/detalhe.css";

const DetalhesProduto = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    fetch(`http://localhost:8080/produtos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar produto");
        return res.json();
      })
      .then((data) => setProduto(data))
      .catch((err) => {
        console.error(err);
        alert("Não foi possível carregar o produto.");
      });
  }, [id]);

  if (!produto) return <p>Carregando...</p>;

  return (
    <div className="detalhes">
      <h2>Detalhes do Produto</h2>

      <div className="campo">
        <strong>ID:</strong>
        <span>{produto.id}</span>
      </div>

      <div className="campo">
        <strong>Nome:</strong>
        <span>{produto.nome}</span>
      </div>

      <div className="campo">
        <strong>Descrição:</strong>
        <span>{produto.descricao}</span>
      </div>

      <div className="campo">
        <strong>Preço:</strong>
        <span>R$ {Number(produto.preco).toFixed(2)}</span>
      </div>

      <div className="campo">
        <strong>Quantidade:</strong>
        <span>{produto.quantidadeEstoque}</span>
      </div>

      <div className="campo">
        <strong>Categoria:</strong>
        <span>{produto.categoria?.nome || "Sem categoria"}</span>
      </div>

      {/* <div className="campo">
        <strong>Data de Cadastro:</strong>
        <span>{new Date(produto.createdAt).toLocaleString("pt-BR")}</span>
      </div> */}

      <div className={`status ${produto.isAtivo ? "ativo" : "inativo"}`}>
        Produto {produto.isAtivo ? "Ativo" : "Inativo"}
      </div>
    </div>
  );
};

export default DetalhesProduto;
