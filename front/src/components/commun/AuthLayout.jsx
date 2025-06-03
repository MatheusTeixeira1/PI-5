import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="" id="auth-container">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
