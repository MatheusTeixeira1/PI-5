import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/VendaCriar.css";

function VendaCriar() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [itensVenda, setItensVenda] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/produtos")
      .then((res) => setProdutos(res.data))
      .catch((err) => console.error("Erro ao buscar produtos", err));
  }, []);

  const handleAddItem = () => {
    const produto = produtos.find(p => p.id === parseInt(produtoSelecionado));
    if (!produto || quantidade < 1) return;

    const itemExistente = itensVenda.find(item => item.produtoId === produto.id);
    if (itemExistente) {
      const atualizados = itensVenda.map(item =>
        item.produtoId === produto.id
          ? { ...item, quantidade: item.quantidade + parseInt(quantidade) }
          : item
      );
      setItensVenda(atualizados);
    } else {
      const novoItem = {
        produtoId: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: parseInt(quantidade),
      };
      setItensVenda([...itensVenda, novoItem]);
    }

    setProdutoSelecionado("");
    setQuantidade(1);
  };

  const handleRemoverItem = (produtoId) => {
    setItensVenda(itensVenda.filter(item => item.produtoId !== produtoId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      itens: itensVenda.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade
      }))
    };

    axios.post("http://localhost:8080/venda", payload)
      .then(() => {
        alert("Venda criada com sucesso!");
        setItensVenda([]);
      })
      .catch(() => alert("Erro ao criar venda."));
  };

  return (
    <div className="componente-criar">
      <div className="container-titulo">
        <h4>Nova Venda</h4>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Produto:</label>
          <select
            value={produtoSelecionado}
            onChange={(e) => setProdutoSelecionado(e.target.value)}
          >
            <option value="">Selecione um produto</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} - R$ {p.preco.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantidade:</label>
          <input
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </div>

        <div className="form-buttons">
          <button type="button" className="btn-salvar" onClick={handleAddItem} >
            Adicionar
          </button>
        </div>

        {/* Tabela de itens */}
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Preço Unitário</th>
              <th>Quantidade</th>
              <th>Subtotal</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {itensVenda.map((item) => (
              <tr key={item.produtoId}>
                <td>{item.nome}</td>
                <td>R$ {item.preco.toFixed(2)}</td>
                <td>{item.quantidade}</td>
                <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                <td>
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => handleRemoverItem(item.produtoId)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botões finais */}
        <div className="form-buttons">
          <button type="submit" className="btn-salvar">
            Salvar Venda
          </button>
          <a href="/vendas">
            <button type="button" className="btn-cancelar">Cancelar</button>
          </a>
        </div>
      </form>
    </div>
  );
}

export default VendaCriar;
