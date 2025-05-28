import "../../css/Formulario.css";
import React, { useState, useEffect, useMemo, useCallback } from "react";

const formatarData = (dataString) => {
  return new Date(dataString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const formatarMoeda = (valor) => {
  return valor?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const useFetchData = (entidade) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token de autenticação não encontrado");
        }

        const response = await fetch(`http://localhost:8080/${entidade}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/auth/login";
            return;
          }
          throw new Error(`Erro ao carregar ${entidade}`);
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entidade]);

  return { data, setData, loading, error };
};

const Paginacao = React.memo(({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próxima
      </button>
    </div>
  );
});

function Tabela({ entidade }) {
  const { data: objetos, setData, loading, error } = useFetchData(entidade);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { currentItems, totalPages } = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = objetos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(objetos.length / itemsPerPage);
    return { currentItems, totalPages };
  }, [objetos, currentPage]);

  const hasProperty = useCallback((obj, prop) => {
    return obj && Object.prototype.hasOwnProperty.call(obj, prop);
  }, []);

  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
    },
    [totalPages]
  );

  const handleDelete = async (id) => {
    const confirmacao = window.confirm(
      "Tem certeza que deseja excluir este item?"
    );
    if (!confirmacao) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = "/auth/login";
        return;
      }

      const response = await fetch(`http://localhost:8080/${entidade}/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/auth/login";
          return;
        }
        throw new Error("Erro ao excluir o item");
      }

      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div>Carregando {entidade}...</div>;
  if (error) {
    if (error.includes("Token de autenticação")) {
      return (
        <div>
          <p>{error}</p>
          <a href="/auth/login">Ir para a página de login</a>
        </div>
      );
    }
    return <div>Erro: {error}</div>;
  }
  if (!currentItems.length) return <div>Nenhum dado encontrado</div>;

  const sampleItem = currentItems[0];
  const columns = {
    hasId: hasProperty(sampleItem, "id"),
    hasNome: hasProperty(sampleItem, "nome"),
    hasQuantidadeEstoque: hasProperty(sampleItem, "quantidadeEstoque"),
    hasPreco: hasProperty(sampleItem, "preco"),
    hasIsAtivo: hasProperty(sampleItem, "isAtivo"),
    hasDataHora: hasProperty(sampleItem, "dataHora"),
    hasValorTotal: hasProperty(sampleItem, "valorTotal"),
  };

  return (
    <div className="container-geral-tabelas">
      <div className="container-titulo">
        <h4>Gestão de {entidade}</h4>
      </div>
      <table>
        <thead>
          <tr>
            {columns.hasId && <th>ID</th>}
            {columns.hasNome && <th>Nome</th>}
            {columns.hasQuantidadeEstoque && <th>Quantidade</th>}
            {columns.hasPreco && <th>Preço</th>}
            {columns.hasIsAtivo && <th>Status</th>}
            {columns.hasDataHora && <th>Data</th>}
            {columns.hasValorTotal && <th>Valor Total</th>}
            <th className="btns-conatiner">
              {entidade !== "venda" && (
                <a href={`/${entidade}/criar`}>
                  <button className="btn btn-criar">Criar</button>
                </a>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((objeto) => (
            <tr key={objeto.id}>
              {columns.hasId && <td>{objeto.id}</td>}
              {columns.hasNome && <td>{objeto.nome}</td>}
              {columns.hasQuantidadeEstoque && (
                <td>{objeto.quantidadeEstoque}</td>
              )}
              {columns.hasPreco && <td>{formatarMoeda(objeto.preco)}</td>}
              {columns.hasIsAtivo && (
                <td>{objeto.isAtivo ? "Ativo" : "Inativo"}</td>
              )}
              {columns.hasDataHora && <td>{formatarData(objeto.dataHora)}</td>}
              {columns.hasValorTotal && (
                <td>{formatarMoeda(objeto.valorTotal)}</td>
              )}
              <td className="conatiner-btns">
                {entidade !== "venda" && (
                  <>
                    <a href={`/${entidade}/editar/${objeto.id}`}>
                      <button className="btn btn-editar">Editar</button>
                    </a>
                    <button
                      className="btn btn-excluir"
                      onClick={() => handleDelete(objeto.id)}
                    >
                      Excluir
                    </button>
                  </>
                )}
                {entidade === "venda" && (
                  <a href={`/${entidade}/detalhes/${objeto.id}`}>
                    <button className="btn btn-editar">Ver mais</button>
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paginacao
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Tabela;