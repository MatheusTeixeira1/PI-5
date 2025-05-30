import { useEffect, useState } from "react";

function Tabela({
  mostrarExcluir = true,
  mostrarEditar = true,
  mostrarVer = true,
  mostrarCriar = true, // Novo parâmetro adicionado
  entidade = "",
}) {
  const colunasParaExibir = [
    "id",
    "nome",
    "descricao",
    "preco",
    "quantidadeEstoque",
    "isAtivo",
    "categoria",
    "valorTotal",
    "dataHora"
  ];

  const traducoes = {
    id: "ID",
    nome: "Nome",
    descricao: "Descrição",
    preco: "Preço",
    quantidadeEstoque: "Estoque",
    isAtivo: "Status",
    categoria: "Categoria",
    valorTotal: "Valor Total",
    dataHora: "Data/Hora"
  };

  const formatadores = {
    preco: (valor) => `R$ ${Number(valor).toFixed(2).replace(".", ",")}`,
    valorTotal: (valor) => `R$ ${Number(valor).toFixed(2).replace(".", ",")}`,
    isAtivo: (valor) => (
      <span style={{ color: valor ? "green" : "red", fontWeight: "bold" }}>
        {valor ? "Ativo" : "Inativo"}
      </span>
    ),
    quantidadeEstoque: (valor) =>
      valor > 0 ? valor : <span style={{ color: "red" }}>ESGOTADO</span>,
    categoria: (valor) => valor?.nome || "Sem categoria",
    dataHora: (valor) => {
      if (!valor) return "-";
      const date = new Date(valor);
      return date.toLocaleString('pt-BR');
    }
  };

  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  const getAuthToken = () => localStorage.getItem("authToken");

  const fetchAutenticado = async (url, options = {}) => {
    const token = getAuthToken();
    if (!token) throw new Error("Token de autenticação não encontrado");

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    return fetch(url, { ...options, headers });
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      const response = await fetchAutenticado(
        `http://localhost:8080/${entidade}`
      );
      if (!response.ok) throw new Error("Erro ao carregar dados");
      const data = await response.json();
      setDados(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [entidade]);

  const deveExibirColuna = (coluna) => colunasParaExibir.includes(coluna);
  const traduzirColuna = (chave) => traducoes[chave] || chave;
  const formatarValor = (chave, valor) =>
    formatadores[chave] ? formatadores[chave](valor) : valor ?? "-";

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    try {
      const response = await fetchAutenticado(
        `http://localhost:8080/${entidade}/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Erro ao excluir");
      await carregarDados();
      setPaginaAtual(1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = (id) =>
    (window.location.href = `/${entidade}/editar/${id}`);
  const handleVer = (id) => (window.location.href = `/${entidade}/${id}`);
  const handleCriar = () => (window.location.href = `/${entidade}/novo`);

  const todasChaves =
    dados.length > 0
      ? Object.keys(dados[0]).filter(deveExibirColuna)
      : [];

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const dadosPaginados = dados.slice(
    indiceInicial,
    indiceInicial + itensPorPagina
  );
  const totalPaginas = Math.ceil(dados.length / itensPorPagina);

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">Erro: {error}</div>;
  if (dados.length === 0)
    return <div className="empty">Nenhum item encontrado</div>;

  return (
    <div>
      <div id="tabela-container" className="tabela-container">
        <table className="tabela">
          <thead>
            <tr>
              {todasChaves.map((chave) => (
                <th key={chave}>{traduzirColuna(chave)}</th>
              ))}
              {(mostrarExcluir || mostrarEditar || mostrarVer || mostrarCriar) && (
                <th className="btn-container-horizontal">
                  {mostrarCriar && (
                    <button onClick={handleCriar} className="btn-criar">
                      Criar
                    </button>
                  )}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {dadosPaginados.map((item, index) => (
              <tr key={index}>
                {todasChaves.map((chave) => (
                  <td key={chave}>{formatarValor(chave, item[chave])}</td>
                ))}
                {(mostrarExcluir || mostrarEditar || mostrarVer) && (
                  <td className="btn-container-horizontal">
                    {mostrarExcluir && (
                      <button
                        onClick={() => handleExcluir(item.id)}
                        className="btn-excluir"
                      >
                        Excluir
                      </button>
                    )}
                    {mostrarEditar && (
                      <button
                        onClick={() => handleEditar(item.id)}
                        className="btn-editar"
                      >
                        Editar
                      </button>
                    )}
                    {mostrarVer && (
                      <button
                        onClick={() => handleVer(item.id)}
                        className="btn-ver"
                      >
                        Ver
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="paginacao">
        <button onClick={() => setPaginaAtual(1)} disabled={paginaAtual === 1}>
          {"<<"}
        </button>
        <button
          onClick={() => setPaginaAtual((p) => p - 1)}
          disabled={paginaAtual === 1}
        >
          {"<"}
        </button>
        <span>
          Página {paginaAtual} de {totalPaginas}
        </span>
        <button
          onClick={() => setPaginaAtual((p) => p + 1)}
          disabled={paginaAtual === totalPaginas}
        >
          {">"}
        </button>
        <button
          onClick={() => setPaginaAtual(totalPaginas)}
          disabled={paginaAtual === totalPaginas}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}

export default Tabela;