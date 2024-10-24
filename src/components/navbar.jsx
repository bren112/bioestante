import React, { useState } from 'react';
import './navbar.css';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [active, setActive] = useState('nav__menu');
  const [toggleIcon, setToggleIcon] = useState('nav__toggler'); 
  const location = useLocation();

  const navToggle = () => {
    active === 'nav__menu' ? setActive('nav__menu nav__active') : setActive('nav__menu');
    toggleIcon === 'nav__toggler' ? setToggleIcon('nav__toggler toggle') : setToggleIcon('nav__toggler');
  };

  return (
    <nav className="nav">
      <div className="logo">
        <Link to="/" className="nav__brand" id="logo">BioEstante</Link>
      </div>
      <ul id="links" className={active}>
        <li className="nav__item"><Link to="/inicio" className="nav__link">Home</Link></li>
        <li className="nav__item">
          <Link to="/login" className="nav__link">
            {location.pathname === '/noticias' ? 'Estante' : 'Login'}
          </Link>
        </li>
        <li className="nav__item"><Link to="/cadastrar" className="nav__link">Cadastrar</Link></li>
      </ul>
      <div onClick={navToggle} className={toggleIcon}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
    </nav>
  );
}

export default Navbar;
