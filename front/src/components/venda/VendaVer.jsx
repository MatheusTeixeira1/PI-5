import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function formatarMoeda(valor) {
  return valor?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function VendaVer() {
  const { id } = useParams();
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarItens = async () => {
      try {
        const resposta = await fetch(
          `http://localhost:8080/venda/${id}/itens`
        );
        if (!resposta.ok) {
          throw new Error("Erro ao buscar itens da venda");
        }
        const dados = await resposta.json();
        setItens(dados);
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    buscarItens();
  }, [id]);

  if (loading) return <div>Carregando itens da venda...</div>;
  if (erro) return <div>Erro: {erro}</div>;
  if (!itens.length) return <div>Nenhum item encontrado para esta venda.</div>;

  return (
    <div className="container-geral-tabelas">
      <div className="container-titulo">
        <h4>Itens da Venda #{id}</h4>
      </div>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço Unitário</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item, index) => (
            <tr key={index}>
              <td>{item.produto?.nome || "N/A"}</td>
              <td>{item.quantidade}</td>
              <td>{formatarMoeda(item.precoUnitario)}</td>
              <td>{formatarMoeda(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VendaVer;
