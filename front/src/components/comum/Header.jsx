import { useNavigate } from "react-router-dom";
import "../../css/Navegacao.css";
import sair from "../../assets/sair.svg";
import logo from "../../assets/logo-kissorvete.svg";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token de autenticação
    navigate("/auth/register"); // Redireciona para a página de registro
  };

  return (
    <header>
      <div>
        <a href="/auth/register">
          <img src={logo} alt="Logo" />
        </a>
        <h1>KISSORVETE</h1>
      </div>
      <img src={sair} alt="Sair" style={{ cursor: "pointer" }} onClick={handleLogout} />
    </header>
  );
}

export default Header;
