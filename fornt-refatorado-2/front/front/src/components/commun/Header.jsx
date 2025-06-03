import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/header.css';
import logo from '../../assets/logo-kissorvete.svg';
import exitIcon from '../../assets/sair.svg';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Confirmação do usuário
    const confirmacao = window.confirm("Tem certeza que deseja sair do sistema?");
    if (!confirmacao) return;

    // Remove o token de autenticação
    localStorage.removeItem('authToken');
    
    // Redireciona para a página de login
    navigate('/login');
    
    // Opcional: Recarrega a página para limpar qualquer estado da aplicação
    window.location.reload();
  };

  return (
    <header id="cabecalho">
      <div className="parte">
        <img src={logo} alt="Logo da Kissorvete" />
        <span>KISSORVETE</span>
      </div>
      <div className="parte">
        <button 
          className="btn-logout" 
          onClick={handleLogout}
          aria-label="Sair do sistema"
        >
          <img src={exitIcon} alt="Sair" />
        </button>
      </div>
    </header>
  );
};

export default Header;