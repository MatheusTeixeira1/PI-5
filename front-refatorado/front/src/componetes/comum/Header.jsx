import { useNavigate } from "react-router-dom";
import "../../css/Header.css";
import sair from "../../assets/sair.svg";
import logo from "../../assets/logo-kissorvete.svg";

function Header() {
  return (
    <header>
      <div>
        <a href="/auth/register">
          <img src={logo} alt="Logo" />
        </a>
        <h1>KISSORVETE</h1>
      </div>
      <img src={sair} alt="Sair" style={{ cursor: "pointer" }} />
    </header>
  );
}

export default Header;
