import Header from "./Header";
import SideBar from "./SideBar";

import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <>
      <Header />
      <div className="parte-baixa">
        <SideBar />
        <div className="conteudo">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AppLayout;
