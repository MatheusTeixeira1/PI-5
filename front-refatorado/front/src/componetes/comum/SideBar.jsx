import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import inicio from "../../assets/inicio.svg";
import categoria from "../../assets/categorias.svg";
import produtos from "../../assets/produtos.svg";
import carrinho from "../../assets/carrinho.svg";
import vendas from "../../assets/vendas.svg";
import "../../css/SideBar.css";

function SideBar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");

  // Atualiza o link ativo quando a localização muda
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  return (
    <aside>
      <ul>
        <NavLink 
          to="/categorias" 
          className={({ isActive }) => isActive ? "active-link" : ""}
        >
          <li className={activeLink === "/categorias" ? "active" : ""}>
            <img src={categoria} alt="Categorias" />
            <h3>Categorias</h3>
          </li>
        </NavLink>
        
        <NavLink 
          to="/produtos" 
          className={({ isActive }) => isActive ? "active-link" : ""}
        >
          <li className={activeLink === "/produtos" ? "active" : ""}>
            <img src={produtos} alt="Produtos" />
            <h3>Produtos</h3>
          </li>
        </NavLink>
        
        <NavLink 
          to="/venda/criar" 
          className={({ isActive }) => isActive ? "active-link" : ""}
        >
          <li className={activeLink === "/venda/criar" ? "active" : ""}>
            <img src={carrinho} alt="Carrinho" />
            <h3>Carrinho</h3>
          </li>
        </NavLink>
        
        <NavLink 
          to="/vendas" 
          className={({ isActive }) => isActive ? "active-link" : ""}
        >
          <li className={activeLink === "/vendas" ? "active" : ""}>
            <img src={vendas} alt="Vendas" />
            <h3>Vendas</h3>
          </li>
        </NavLink>
      </ul>
    </aside>
  );
}

export default SideBar;