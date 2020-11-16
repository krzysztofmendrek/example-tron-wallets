import React from 'react';
import menu from '../../Assets/menu.svg';
import logo from '../../Assets/logo.svg';
import './Nav.css';

function Nav() {
  return (
    <nav>
      <div className='container'>
        <img className='logo' src={logo} alt='Logo' />
        <img className='menu-icon' src={menu} alt='Menu icon' />
      </div>
    </nav>
  );
}

export default Nav;
