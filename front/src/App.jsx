import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tabela from "./components/comum/Tabela";
import CategoriasCriar from "./components/categoria/CategoriaCriar";
import CategoriasEditar from "./components/categoria/CategoriaEditar";
import ProdutosCriar from "./components/produto/ProdutoCriar";
import ProdutosEditar from "./components/produto/ProdutoEditar";
import VendaVer from "./components/venda/VendaVer";
import VendaCriar from "./components/venda/VendaCriar";
import RegistroUsuario from "./components/auth/RegistroUsuario";
import AppLayout from "./components/comum/AppLayout";
import AuthLayout from "./components/comum/AuthLayout";
import LoginUsuario from "./components/auth/Login";
import ProtectedRoute from "./components/comum/ProtectedRoute"; // Importe o novo componente

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROTAS PROTEGIDAS - requerem autenticação */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/categorias" element={<Tabela entidade="categorias" />} />
            <Route path="/categorias/criar" element={<CategoriasCriar />} />
            <Route path="/categorias/editar/:id" element={<CategoriasEditar />} />
            <Route path="/vendas" element={<Tabela entidade="venda" />} />
            <Route path="/venda/:id/itens" element={<VendaVer />} />
            <Route path="/venda/criar" element={<VendaCriar />} />
            <Route path="/produtos" element={<Tabela entidade="produtos" />} />
            <Route path="/produtos/criar" element={<ProdutosCriar />} />
            <Route path="/produtos/editar/:id" element={<ProdutosEditar />} />
          </Route>
        </Route>

        {/* ROTAS PÚBLICAS - não requerem autenticação */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/register" element={<RegistroUsuario />} />
          <Route path="/auth/login" element={<LoginUsuario />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;