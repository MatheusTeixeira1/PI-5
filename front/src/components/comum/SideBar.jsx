import "../../css/Navegacao.css";
import inicio from "../../assets/inicio.svg";
import categoria from "../../assets/categorias.svg";
import produtos from "../../assets/produtos.svg";
import carrinho from "../../assets/carrinho.svg";
import vendas from "../../assets/vendas.svg";

function SideBar() {
  return (
    <aside>
      <ul>
        <a href="/categorias">
          <li>
            <img src={categoria} alt="" />
            <h3>Categorias</h3>
          </li>
        </a>
        <a href="/produtos">
          <li>
            <img src={produtos} alt="" />
            <h3>Produtos</h3>
          </li>
        </a>
        <a href="/venda/criar">
          <li>
            <img src={carrinho} alt="" />
            <h3>Carrinho</h3>
          </li>
        </a>
        <a href="/vendas">
          <li>
            <img src={vendas} alt="" />
            <h3>Vendas</h3>
          </li>
        </a>
      </ul>
    </aside>
  );
}

export default SideBar;
