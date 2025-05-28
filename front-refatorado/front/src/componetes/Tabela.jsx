import { useEffect, useState } from "react";

function Tabela({
  mostrarExcluir = true,
  mostrarEditar = true,
  mostrarVer = true,
  entidade = "",
}) {
  // Colunas que devem ser exibidas
  const colunasParaExibir = [
    "id",
    "nome",
    "descricao",
    "preco",
    "quantidadeEstoque",
    "isAtivo",
    "categoria",
  ];

  // Dicionário de tradução
  const traducoes = {
    id: "ID",
    nome: "Nome",
    descricao: "Descrição",
    preco: "Preço",
    quantidadeEstoque: "Estoque",
    isAtivo: "Status",
    categoria: "Categoria",
  };

  // Formatação especial para tipos específicos
  const formatadores = {
    preco: (valor) => `R$ ${Number(valor).toFixed(2).replace(".", ",")}`,
    isAtivo: (valor) => (
      <span style={{ color: valor ? "green" : "red", fontWeight: "bold" }}>
        {valor ? "Ativo" : "Inativo"}
      </span>
    ),
    quantidadeEstoque: (valor) =>
      valor > 0 ? valor : <span style={{ color: "red" }}>ESGOTADO</span>,
    categoria: (valor) => valor?.nome || "Sem categoria",
  };

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/${entidade}`);
        if (!response.ok) {
          throw new Error("Erro ao carregar dados");
        }
        const data = await response.json();
        setProdutos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deveExibirColuna = (coluna) => colunasParaExibir.includes(coluna);
  const traduzirColuna = (chave) =>
    traducoes[chave] || chave.charAt(0).toUpperCase() + chave.slice(1);

  // Função para formatar o valor da célula
  const formatarValor = (chave, valor) => {
    if (formatadores[chave]) {
      return formatadores[chave](valor);
    }
    return valor !== null && valor !== undefined ? valor.toString() : "-";
  };

  // Funções de ação para os botões
  const handleExcluir = (produtoId) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      console.log(`Excluir produto com ID: ${produtoId}`);
      // Implemente a lógica de exclusão aqui
      // Exemplo: chamada à API para deletar o produto
    }
  };

  const handleEditar = (produtoId) => {
    console.log(`Editar produto com ID: ${produtoId}`);
    // Implemente a lógica de edição aqui
  };

  const handleVer = (produtoId) => {
    console.log(`Visualizar produto com ID: ${produtoId}`);
    // Implemente a lógica de visualização aqui
  };

  const todasChaves =
    produtos.length > 0
      ? Object.keys(produtos[0]).filter((chave) => deveExibirColuna(chave))
      : [];

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (produtos.length === 0) return <div>Nenhum produto encontrado</div>;

  return (
    <div id="tabela-container" className="tabela-container">
      <table className="tabela">
        <thead>
          <tr>
            {todasChaves.map((chave) => (
              <th key={chave}>{traduzirColuna(chave)}</th>
            ))}
            <th className="btn-container-horizontal">
              <button className="btn-criar">Criar</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto, index) => (
            <tr key={index}>
              {todasChaves.map((chave) => (
                <td key={`${index}-${chave}`}>
                  {formatarValor(chave, produto[chave])}
                </td>
              ))}
              <td className="btn-container-horizontal">
                {mostrarExcluir && (
                  <button
                    onClick={() => handleExcluir(produto.id)}
                    className="btn-excluir"
                  >
                    Excluir
                  </button>
                )}
                {mostrarEditar && (
                  <button
                    onClick={() => handleEditar(produto.id)}
                    className="btn-editar"
                  >
                    Editar
                  </button>
                )}
                {mostrarVer && (
                  <button
                    onClick={() => handleVer(produto.id)}
                    className="btn-ver"
                  >
                    Ver
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Tabela;