import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/tabela.css";

const TabelaCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [mensagem, setMensagem] = useState(""); // mensagem de sucesso
  const [erro, setErro] = useState(""); // mensagem de erro
  const itensPorPagina = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    const token = localStorage.getItem("authToken");
    setErro("");
    setMensagem("");

    try {
      const response = await fetch("http://localhost:8080/categorias", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErro("Sessão expirada. Faça login novamente.");
        } else if (response.status === 403) {
          setErro("Você não tem permissão para visualizar as categorias.");
        } else {
          setErro("Erro ao buscar categorias.");
        }
        return;
      }

      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Erro:", error);
      setErro("Erro de conexão. Verifique sua internet ou tente novamente.");
    }
  };

  const handleEditar = (id) => {
    navigate(`/EditarCategoria/${id}`);
  };

  const handleVerMais = (id) => {
    navigate(`/DetalhesCategoria/${id}`);
  };

  const handleExcluir = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir esta categoria?");
    if (!confirmacao) return;

    const token = localStorage.getItem("authToken");
    setErro("");
    setMensagem("");

    try {
      const response = await fetch(`http://localhost:8080/categorias/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErro("Sessão expirada. Faça login novamente.");
        } else if (response.status === 403) {
          setErro("Você não tem permissão para excluir esta categoria.");
        } else if (response.status >= 500) {
          setErro("Erro no servidor. Tente novamente mais tarde.");
        } else {
          const errorData = await response.json();
          setErro(errorData.message || "Erro ao excluir categoria.");
        }
        return;
      }

      setMensagem("Categoria excluída com sucesso!");
      fetchCategorias();
    } catch (error) {
      console.error("Erro:", error);
      setErro("Erro de conexão. Verifique sua internet ou tente novamente.");
    }
  };

  const handleCriarCategoria = () => {
    navigate("/CriarCategoria");
  };

  // Paginação
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const categoriasPaginadas = categorias.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(categorias.length / itensPorPagina);

  return (
    <div className="tabela-container">
      <div className="topo-tabela">
        <h2>Lista de Categorias</h2>
        <button className="btn-acao" onClick={handleCriarCategoria}>Criar Categoria</button>
      </div>

      {erro && <div className="alert alert-error">{erro}</div>}
      {mensagem && <div className="alert alert-success">{mensagem}</div>}

      <table id="tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categoriasPaginadas.map((categoria) => (
            <tr key={categoria.id}>
              <td>{categoria.nome}</td>
              <td>{categoria.descricao}</td>
              <td>{categoria.isAtivo ? "Ativo" : "Inativo"}</td>
              <td>
                <button className="btn-acao btn-editar" onClick={() => handleEditar(categoria.id)}>Editar</button>
                <button className="btn-acao btn-ver" onClick={() => handleVerMais(categoria.id)}>Ver Mais</button>
                <button className="btn-acao btn-excluir" onClick={() => handleExcluir(categoria.id)}>Excluir</button>
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

export default TabelaCategorias;
