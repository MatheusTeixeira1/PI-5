import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/tabela.css";

const Carrinho = () => {
  const [produtos, setProdutos] = useState([]);
  const [itensVenda, setItensVenda] = useState([]);
  const [valorTotal, setValorTotal] = useState(0.0);
  const navigate = useNavigate();

  useEffect(() => {
    buscarProdutos();
  }, []);

  useEffect(() => {
    calcularTotal();
  }, [itensVenda]);

  const buscarProdutos = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("http://localhost:8080/produtos", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar produtos");
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const adicionarAoCarrinho = (produto) => {
    const existente = itensVenda.find(item => item.produto.id === produto.id);
    if (existente) {
      const atualizado = itensVenda.map(item =>
        item.produto.id === produto.id
          ? {
            ...item,
            quantidade: item.quantidade + 1,
            subtotal: (item.quantidade + 1) * item.precoUnitario,
          }
          : item
      );
      setItensVenda(atualizado);
    } else {
      const novoItem = {
        produto,
        quantidade: 1,
        precoUnitario: produto.preco,
        subtotal: produto.preco,
      };
      setItensVenda([...itensVenda, novoItem]);
    }
  };

  const removerItem = (produtoId) => {
    const atualizado = itensVenda.filter(item => item.produto.id !== produtoId);
    setItensVenda(atualizado);
  };

  const calcularTotal = () => {
    const total = itensVenda.reduce((acc, item) => acc + item.subtotal, 0);
    setValorTotal(total);
  };

  const finalizarVenda = async () => {
    const token = localStorage.getItem("authToken");

    const venda = {
      itens: itensVenda.map(item => ({
        produtoId: item.produto.id ,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        subtotal: item.subtotal,
      })),
    };

    try {
      const response = await fetch("http://localhost:8080/venda", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venda),
      });

      if (!response.ok) throw new Error("Erro ao finalizar venda");

      alert("Venda finalizada com sucesso!");
      setItensVenda([]);
      setValorTotal(0);
      buscarProdutos();
    } catch (error) {
      console.error("Erro:", error);
      alert("Falha ao finalizar venda.");
    }
  };

  return (
    <div id="tabelas-do-carrinho" className="tabela-container">
      <h2>Produtos Disponíveis</h2>
      <table id="tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>R$ {produto.preco.toFixed(2)}</td>
              <td>{produto.quantidadeEstoque}</td>
              <td>
                <button
                  className="btn btn-acao"
                  onClick={() => adicionarAoCarrinho(produto)}
                >
                  Adicionar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Itens no Carrinho</h2>
      <table id="tabela">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd</th>
            <th>Preço Unitário</th>
            <th>Subtotal</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {itensVenda.map((item) => (
            <tr key={item.produto.id}>
              <td>{item.produto.nome}</td>
              <td>{item.quantidade}</td>
              <td>R$ {item.precoUnitario.toFixed(2)}</td>
              <td>R$ {item.subtotal.toFixed(2)}</td>
              <td>
                <button
                  className="btn-acao btn-excluir"
                  onClick={() => removerItem(item.produto.id)}
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
        Valor Total: R$ {valorTotal.toFixed(2)}
      </div>

      <button
        className="btn-criar"
        onClick={finalizarVenda}
        disabled={itensVenda.length === 0}
        style={{ marginTop: "1rem" }}
      >
        Finalizar Venda
      </button>
    </div>
  );
};

export default Carrinho;
