import Header from "./Header";
import Navbar from "./Navbar";

import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <>
      <Header />
      <div className="parte-baixa">
        <Navbar />
        <div className="conteudo">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AppLayout;
