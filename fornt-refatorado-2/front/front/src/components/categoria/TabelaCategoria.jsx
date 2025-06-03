import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/tabela.css";

const TabelaCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://localhost:8080/categorias", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar categorias");
      }

      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Erro:", error);
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

    try {
      const response = await fetch(`http://localhost:8080/categorias/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao excluir categoria");

      fetchCategorias();
      alert("Categoria excluída com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Falha ao excluir categoria");
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