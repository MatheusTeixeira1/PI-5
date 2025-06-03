import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/tabela.css";

const TabelaProdutosVenda = () => {
  const { id } = useParams();
  const [venda, setVenda] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenda();
  }, [id]);

  const fetchVenda = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`http://localhost:8080/venda/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar venda");
      }

      const data = await response.json();
      setVenda(data);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const handleVoltar = () => {
    navigate("/TabelaVenda");
  };

  const formatarData = (dataHora) => {
    const data = new Date(dataHora);
    return data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR");
  };

  if (!venda) return <div className="tabela-container">Carregando...</div>;

  return (
    <div className="tabela-container">
      <div className="topo-tabela">
        <h2>Detalhes da Venda #{venda.id}</h2>
        <button className="btn btn-acao" onClick={handleVoltar}>
          Voltar para Vendas
        </button>
      </div>

      <table id="tabela">
        <thead>
          <tr>
            <th>Data</th>
            <th>Valor Total</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço Unitário</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {venda.itens.map((item, index) => (
            <tr key={item.id}>
              {index === 0 && (
                <>
                  <td rowSpan={venda.itens.length}>{formatarData(venda.dataHora)}</td>
                  <td rowSpan={venda.itens.length}>R$ {venda.valorTotal.toFixed(2)}</td>
                </>
              )}
              <td>{item.produto.nome}</td>
              <td>{item.quantidade}</td>
              <td>R$ {item.precoUnitario.toFixed(2)}</td>
              <td>R$ {item.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaProdutosVenda;