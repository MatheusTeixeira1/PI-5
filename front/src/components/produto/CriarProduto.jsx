import React, { useState, useEffect } from "react";
import "../../styles/formulario.css";

const CriarProduto = () => {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    quantidadeEstoque: "",
    isAtivo: "",
    categoriaId: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/categorias", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Não autorizado.");
        if (res.status === 403) throw new Error("Acesso proibido.");
        if (!res.ok) throw new Error("Erro ao carregar categorias.");
        return res.json();
      })
      .then((data) => setCategorias(data))
      .catch((error) => {
        console.error("Erro ao buscar categorias:", error);
        setErro(error.message);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    if (!form.categoriaId) {
      setErro("Selecione uma categoria.");
      return;
    }

    const payload = {
      nome: form.nome,
      descricao: form.descricao,
      preco: parseFloat(form.preco),
      quantidadeEstoque: parseInt(form.quantidadeEstoque),
      isAtivo: form.isAtivo === "true",
      categoria: { id: Number(form.categoriaId) },
    };

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:8080/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        setErro("Sessão expirada. Faça login novamente.");
      } else if (response.status === 403) {
        setErro("Você não tem permissão para cadastrar produtos.");
      } else if (response.ok) {
        setMensagem("Produto cadastrado com sucesso!");
        setForm({
          nome: "",
          descricao: "",
          preco: "",
          quantidadeEstoque: "",
          isAtivo: "",
          categoriaId: "",
        });
      } else {
        const errorText = await response.text();
        console.error("Erro ao cadastrar produto:", errorText);
        setErro("Falha ao cadastrar produto.");
      }
    } catch (error) {
      console.error("Erro de conexão com o servidor:", error);
      setErro("Erro na conexão com o servidor.");
    }
  };

  return (
    <section id="formulario">
      <h2>Cadastrar Produto</h2>

      {erro && <div className="alert alert-error">{erro}</div>}
      {mensagem && <div className="alert alert-success">{mensagem}</div>}

      <form id="form" onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="nome">Nome *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            maxLength="1000"
            value={form.descricao}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label htmlFor="preco">Preço *</label>
          <input
            type="number"
            id="preco"
            name="preco"
            min="0"
            step="0.01"
            value={form.preco}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="quantidadeEstoque">Estoque *</label>
          <input
            type="number"
            id="quantidadeEstoque"
            name="quantidadeEstoque"
            min="0"
            value={form.quantidadeEstoque}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="isAtivo">Está ativo? *</label>
          <select
            id="isAtivo"
            name="isAtivo"
            value={form.isAtivo}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>

        <div className="campo">
          <label htmlFor="categoriaId">Categoria *</label>
          <select
            id="categoriaId"
            name="categoriaId"
            value={form.categoriaId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Selecione a categoria
            </option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Salvar Produto</button>
      </form>
    </section>
  );
};

export default CriarProduto;
