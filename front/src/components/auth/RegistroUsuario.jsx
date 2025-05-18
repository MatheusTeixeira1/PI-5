import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/FormularioRegistrar.css"; // Certifique-se de que o arquivo existe

function RegistroUsuario() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    numeroTelefone: "",
    senha: "",
  });

  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dadosParaEnviar = {
      nome: formData.nome,
      username: formData.email,
      password: formData.senha,
      role: "USER", // ou "ADMIN"
    };

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (!response.ok) {
        const erro = await response.text();
        throw new Error(erro || "Erro ao registrar usuário");
      }

      const resultado = await response.json();

      if (resultado && resultado.token) {
        localStorage.setItem("token", resultado.token);
        navigate("/produtos");
      } else {
        throw new Error("Token de autenticação não recebido.");
      }
    } catch (err) {
      setMensagem(`Erro: ${err.message}`);
    }
  };

  return (
    <div id="container-formulario-registrar">
      {mensagem && <div className="mensagem">{mensagem}</div>}
      <div className="container-titulo">
        <h2>Registro de Usuário</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="form-group-1">
            <label>
              Nome:
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="form-group-1">
            <label>
              Telefone:
              <input
                type="text"
                name="numeroTelefone"
                value={formData.numeroTelefone}
                onChange={handleChange}
              />
            </label>

            <label>
              Senha:
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        </div>

        <button className="btn btn-criar" id="botao-registrar" type="submit">
          Registrar
        </button>
      </form>
    </div>
  );
}

export default RegistroUsuario;
