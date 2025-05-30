import { useNavigate } from "react-router-dom";
import "../../css/Header.css";
import sair from "../../assets/sair.svg";
import logo from "../../assets/logo-kissorvete.svg";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove o token de autenticação do localStorage
    localStorage.removeItem("authToken");
    
    // Redireciona para a página de login
    navigate("/login");
    
    // Recarrega a página para limpar qualquer estado da aplicação
    window.location.reload();
  };

  return (
    <header>
      <div>
        <a href="/auth/register">
          <img src={logo} alt="Logo" />
        </a>
        <h1>KISSORVETE</h1>
      </div>
      <img 
        src={sair} 
        alt="Sair" 
        style={{ cursor: "pointer" }} 
        onClick={handleLogout}
        title="Sair do sistema"
      />
    </header>
  );
}

export default Header;