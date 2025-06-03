import { BrowserRouter, Routes, Route } from "react-router-dom";
import TabelaProdutos from "./components/produto/TabelaProdutos";
import CriarProduto from "./components/produto/CriarProduto";
import AppLayout from "./components/commun/AppLayout";
import AuthLayout from "./components/commun/AuthLayout";
import EditarProduto from "./components/produto/EditarProduto";
import ProtectedRout from "./components/commun/ProtectedRoute";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import DetalhesProduto from "./components/produto/DetalhesProduto";
import TabelaCategorias from "./components/categoria/TabelaCategoria";
import CriarCategoria from "./components/categoria/CriarCategoria";
import EditarCategoria from "./components/categoria/EditarCategoria";
import DetalhesCategoria from "./components/categoria/DetalhesCategoria";
import Carrinho from "./components/venda/Carrinho";
import TabelaVenda from "./components/venda/TabelaVenda";
import TabelaProdutosVenda from "./components/venda/TabelaProdutosVenda";


function App() {
  return (
    <div className="App">
      {/* <Header />
      <Navbar /> */}


      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
          </Route>

          <Route element={<ProtectedRout />}>
            <Route element={<AppLayout />}>

              <Route path="/TabelaCategorias" element={<TabelaCategorias />} />
              <Route path="/TabelaProdutos" element={<TabelaProdutos />} />
              <Route path="/Carrinho" element={<Carrinho />} />
              <Route path="/TabelaVenda" element={<TabelaVenda />} />

              <Route path="/CriarProduto" element={<CriarProduto />} />
              <Route path="/EditarProduto/:id" element={<EditarProduto />} />
              <Route path="/DetalhesProduto/:id" element={<DetalhesProduto />} />
              <Route path="/CriarCategoria" element={<CriarCategoria />} />
              <Route path="/EditarCategoria/:id" element={<EditarCategoria />} />
              <Route path="/DetalhesCategoria/:id" element={<DetalhesCategoria />} />

              <Route path="/DetalhesVenda/:id" element={<TabelaProdutosVenda />} />
              
            </Route>
          </Route>
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </BrowserRouter>



      
    </div>
  );
}

export default App;
