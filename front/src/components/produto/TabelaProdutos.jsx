import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/tabela.css";

const TabelaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const itensPorPagina = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    setErro("");
    setMensagem("");

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://localhost:8080/produtos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }

      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro:", error);
      setErro("Erro ao carregar produtos. Tente novamente.");
    }
  };

  const handleEditar = (id) => {
    navigate(`/EditarProduto/${id}`);
  };

  const handleVerMais = (id) => {
    navigate(`/DetalhesProduto/${id}`);
  };

  const handleExcluir = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmar) return;

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`http://localhost:8080/produtos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          setErro("Você não tem permissão para excluir este produto.");
        } else if (response.status === 404) {
          setErro("Produto não encontrado.");
        } else {
          throw new Error("Erro ao excluir produto");
        }
        return;
      }

      setMensagem("Produto excluído com sucesso!");
      fetchProdutos();
    } catch (error) {
      console.error("Erro:", error);
      setErro("Falha ao excluir produto. Verifique sua conexão.");
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
        <button className="btn-acao" onClick={handleCriarProduto}>
          Criar Produto
        </button>
      </div>

      {erro && <div className="alert alert-error">{erro}</div>}
      {mensagem && <div className="alert alert-success">{mensagem}</div>}

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
                <button className="btn-acao btn-editar" onClick={() => handleEditar(produto.id)}>
                  Editar
                </button>
                <button className="btn-acao btn-ver" onClick={() => handleVerMais(produto.id)}>
                  Ver Mais
                </button>
                <button className="btn-acao btn-excluir" onClick={() => handleExcluir(produto.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPaginas > 1 && (
        <div className="paginacao">
          <button onClick={() => setPaginaAtual(paginaAtual - 1)} disabled={paginaAtual === 1}>
            Anterior
          </button>

          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button onClick={() => setPaginaAtual(paginaAtual + 1)} disabled={paginaAtual === totalPaginas}>
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default TabelaProdutos;
