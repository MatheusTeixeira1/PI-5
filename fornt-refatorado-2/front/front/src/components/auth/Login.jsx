import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../../css/login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.email,
          password: formData.senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      if (data.token) {
        localStorage.setItem("authToken", data.token); // Alterado para 'authToken' para consistência
        navigate("/TabelaProdutos", { replace: true });
      } else {
        throw new Error("Token de autenticação não recebido");
      }
    } catch (err) {
      setMensagem(err.message);
      console.error("Erro no login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        
        {mensagem && (
          <div className={`alert ${mensagem.includes("Erro") ? "alert-error" : "alert-success"}`}>
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha:</label>
            <input
              id="senha"
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;