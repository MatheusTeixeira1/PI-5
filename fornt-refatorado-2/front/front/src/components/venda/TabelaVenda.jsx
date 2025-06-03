import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/tabela.css";

const TabelaVenda = () => {
  const [vendas, setVendas] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendas();
  }, []);

  const fetchVendas = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://localhost:8080/venda", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar vendas");
      }

      const data = await response.json();
      setVendas(data);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const handleVerMais = (id) => {
    navigate(`/DetalhesVenda/${id}`);
  };

  

  const handleCriarVenda = () => {
    navigate("/Carrinho");
  };

  // Formatar data para exibição
  const formatarData = (dataHora) => {
    const data = new Date(dataHora);
    return data.toLocaleString("pt-BR");
  };

  // Paginação
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const vendasPaginadas = vendas.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(vendas.length / itensPorPagina);

  return (
    <div className="tabela-container">
      <div className="topo-tabela">
        <h2>Lista de Vendas</h2>
        <button className="btn btn-acao" onClick={handleCriarVenda}>Nova Venda</button>
      </div>

      <table id="tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data/Hora</th>
            <th>Valor Total</th>
            <th>Itens</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vendasPaginadas.map((venda) => (
            <tr key={venda.id}>
              <td>{venda.id}</td>
              <td>{formatarData(venda.dataHora)}</td>
              <td>R$ {venda.valorTotal.toFixed(2)}</td>
              <td>{venda.itens.length} itens</td>
              <td>
                <button className="btn-acao btn-ver" onClick={() => handleVerMais(venda.id)}>Ver Detalhes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="paginacao">
        <button
          onClick={() => setPaginaAtual(paginaAtual - 1)}
          disabled={paginaAtual === 1}
        >
          Anterior
        </button>

        <span>Página {paginaAtual} de {totalPaginas}</span>

        <button
          onClick={() => setPaginaAtual(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default TabelaVenda;