import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../../styles/navbar.css';
import categoriesIcon from '../../assets/categorias.svg';
import productsIcon from '../../assets/produtos.svg';
import cartIcon from '../../assets/carrinho.svg';
import salesIcon from '../../assets/vendas.svg';

const Navigation = () => {
  const [activeLink, setActiveLink] = useState(null);
  const location = useLocation();

  const navItems = [
    { id: 1, icon: categoriesIcon, label: 'CATEGORIAS', link: '/TabelaCategorias' },
    { id: 2, icon: productsIcon, label: 'PRODUTOS', link: '/TabelaProdutos' },
    { id: 3, icon: cartIcon, label: 'CARRINHO', link: '/Carrinho' },
    { id: 4, icon: salesIcon, label: 'VENDAS', link: '/TabelaVenda' }
  ];

  // Atualiza o link ativo quando a rota muda
  useEffect(() => {
    const currentItem = navItems.find(item => location.pathname.includes(item.link));
    if (currentItem) {
      setActiveLink(currentItem.id);
    }
  }, [location]);

  const handleClick = (id) => {
    setActiveLink(id);
  };

  return (
    <nav id="navegacao">
      <ul>
        {navItems.map((item) => (
          <li 
            key={item.id}
            className={activeLink === item.id ? 'ativo' : 'desativo'}
          >
            <NavLink 
              to={item.link}
              onClick={() => handleClick(item.id)}
              activeClassName="ativo"
              exact
            >
              <img src={item.icon} alt={item.label} />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;