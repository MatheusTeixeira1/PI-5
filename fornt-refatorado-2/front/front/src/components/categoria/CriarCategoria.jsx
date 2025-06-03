import React, { useState } from "react";
import "../../styles/formulario.css";

const CriarCategoria = () => {
    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        isAtivo: "true", // Definindo "true" como valor padrão
    });

    const [erro, setErro] = useState("");

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

            const response = await fetch("http://localhost:8080/categorias", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Categoria cadastrada com sucesso!");
                setForm({
                    nome: "",
                    descricao: "",
                    isAtivo: "true",
                });
            } else {
                const errorData = await response.json();
                console.error("Erro ao cadastrar categoria:", errorData);
                setErro(errorData.message || "Erro ao cadastrar a categoria");
            }
        } catch (error) {
            console.error("Erro:", error);
            setErro("Erro na conexão com o servidor");
        }
    };

    return (
        <section id="formulario">
            <h2>Cadastrar Categoria</h2>
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

                <button type="submit">Salvar Categoria</button>
            </form>
        </section>
    );
};

export default CriarCategoria;