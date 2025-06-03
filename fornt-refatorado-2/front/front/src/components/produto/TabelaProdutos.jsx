import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/tabela.css";

const TabelaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://localhost:8080/produtos", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }

      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const handleEditar = (id) => {
    navigate(`/EditarProduto/${id}`);
  };

  const handleVerMais = (id) => {
    navigate(`/DetalhesProduto/${id}`);
  };

  const handleExcluir = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmacao) return;

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`http://localhost:8080/produtos/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao excluir produto");

      fetchProdutos();
      alert("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Falha ao excluir produto");
    }
  };

  const handleCriarProduto = () => {
    navigate("/CriarProduto");
  };

  // Paginação
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const produtosPaginados = produtos.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(produtos.length / itensPorPagina);

  return (
    <div className="tabela-container">
      <div className="topo-tabela">
        <h2>Lista de Produtos</h2>
        <button className="btn-acao" onClick={handleCriarProduto}>Criar Produto</button>
      </div>

      <table id="tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosPaginados.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>R$ {produto.preco.toFixed(2)}</td>
              <td>{produto.quantidadeEstoque}</td>
              <td>
                <button className="btn-acao btn-editar" onClick={() => handleEditar(produto.id)}>Editar</button>
                <button className="btn-acao btn-ver" onClick={() => handleVerMais(produto.id)}>Ver Mais</button>
                <button className="btn-acao btn-excluir" onClick={() => handleExcluir(produto.id)}>Excluir</button>
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

export default TabelaProdutos;
