import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/formulario.css";

const EditarCategoria = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        isAtivo: "true",
    });

    const [erro, setErro] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        // Carrega dados da categoria
        fetch(`http://localhost:8080/categorias/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Categoria não encontrada");
                return res.json();
            })
            .then(data => {
                setForm({
                    nome: data.nome,
                    descricao: data.descricao,
                    isAtivo: data.isAtivo.toString(),
                });
            })
            .catch(err => {
                console.error("Erro ao carregar categoria:", err);
                setErro("Erro ao carregar os dados da categoria.");
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
        setErro("");

        const payload = {
            nome: form.nome,
            descricao: form.descricao,
            isAtivo: form.isAtivo === "true",
        };

        try {
            const token = localStorage.getItem("authToken");

            const response = await fetch(`http://localhost:8080/categorias/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Categoria atualizada com sucesso!");
                navigate("/TabelaCategorias"); // redireciona para a lista
            } else {
                const errorData = await response.json();
                console.error("Erro ao atualizar categoria:", errorData);
                setErro(errorData.message || "Erro ao atualizar a categoria");
            }
        } catch (error) {
            console.error("Erro:", error);
            setErro("Erro na conexão com o servidor");
        }
    };

    return (
        <section id="formulario">
            <h2>Editar Categoria</h2>
            {erro && <div className="erro-mensagem">{erro}</div>}
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
                    <label htmlFor="isAtivo">Ativo *</label>
                    <select
                        id="isAtivo"
                        name="isAtivo"
                        value={form.isAtivo}
                        onChange={handleChange}
                        required
                    >
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select>
                </div>

                <button type="submit">Atualizar Categoria</button>
            </form>
        </section>
    );
};

export default EditarCategoria;