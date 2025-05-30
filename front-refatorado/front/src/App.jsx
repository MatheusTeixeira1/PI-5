import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Tabela from "./componetes/Tabela";
import ProtectedRout from "./componetes/comum/ProtectedRoute";
import AppLayout from "./componetes/comum/AppLayout";
import Login from "./componetes/auth/Login";
import Register from "./componetes/auth/Register";
import AuthLayout from "./componetes/comum/AuthLayout";
import Header from "./componetes/comum/Header";
import SideBar from "./componetes/comum/SideBar";
import CriarCategoria from "./componetes/categoria/CriarCategoria";
import EditarCategoria from "./componetes/categoria/EditarCategoria";
import CriarProduto from "./componetes/produto/CriarProduto";
import EditarProduto from "./componetes/produto/EditarProduto";
import DetalhesProduto from "./componetes/produto/DetalhesProduto";
import VendaCriar from "./componetes/venda/VendaCriar";
import VendaVer from "./componetes/venda/VendaVer";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas (Autenticação) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
            <Route path="/dev" element={<CriarCategoria />} />
          </Route>

          {/* Rotas Protegidas */}
          <Route element={<ProtectedRout />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<div>Página Inicial</div>} />
              <Route
                path="/produtos"
                element={
                  <Tabela
                    mostrarEditar={true}
                    mostrarExcluir={true}
                    mostrarVer={true}
                    entidade="produtos"
                  />
                }
              />
              <Route
                path="/categorias"
                element={
                  <Tabela
                    mostrarEditar={true}
                    mostrarExcluir={true}
                    mostrarVer={false}
                    entidade="categorias"
                  />
                }
              />

              <Route path="/categorias/novo" element={<CriarCategoria />} />
              <Route path="/produtos/novo" element={<CriarProduto />} />
              <Route path="/produtos/:id" element={<DetalhesProduto />} />
              <Route path="/venda/criar" element={<VendaCriar />} />
              <Route path="/venda/:id" element={<VendaVer />} />

              <Route path="/produtos/editar/:id" element={<EditarProduto />} />
              <Route
                path="/categorias/editar/:id"
                element={<EditarCategoria />}
              />
              <Route
                path="/vendas"
                element={
                  <Tabela
                    mostrarEditar={false}
                    mostrarExcluir={false}
                    mostrarVer={true}
                    mostrarCriar={false}
                    entidade="venda"
                  />
                }
              />
              {/* Adicione outras rotas protegidas aqui */}
            </Route>
          </Route>

          {/* Rota de fallback (404) */}
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
