import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/formulario.css";

const EditarProduto = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        preco: "",
        quantidadeEstoque: "",
        isAtivo: "",
        categoriaId: "",
    });

    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        // Carrega categorias
        fetch("http://localhost:8080/categorias", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => setCategorias(data))
            .catch(err => {
                console.error("Erro ao carregar categorias:", err);
                alert("Erro ao carregar categorias.");
            });

        // Carrega dados do produto
        fetch(`http://localhost:8080/produtos/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Produto não encontrado");
                return res.json();
            })
            .then(data => {
                setForm({
                    nome: data.nome,
                    descricao: data.descricao,
                    preco: data.preco,
                    quantidadeEstoque: data.quantidadeEstoque,
                    isAtivo: data.isAtivo.toString(),
                    categoriaId: data.categoria?.id?.toString() || "",
                });
            })
            .catch(err => {
                console.error("Erro ao carregar produto:", err);
                alert("Erro ao carregar os dados do produto.");
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.categoriaId) {
            alert("Selecione uma categoria.");
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

            const response = await fetch(`http://localhost:8080/produtos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Produto atualizado com sucesso!");
                navigate("/TabelaProdutos"); // redireciona para a lista
            } else {
                const errorText = await response.text();
                console.error("Erro ao atualizar produto:", errorText);
                alert("Erro ao atualizar o produto:\n" + errorText);
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro na conexão com o servidor.");
        }
    };

    return (
        <section id="formulario">
            <h2>Editar Produto</h2>
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

                <button type="submit">Atualizar Produto</button>
            </form>
        </section>
    );
};

export default EditarProduto;
