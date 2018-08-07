import React from 'react';
import './Header.css';

const Header = props => {
  return (
    <header className='teal-theme'>
      <div className='header-container'>
        <div>Here is our awesome logo</div>
        <nav>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Profile</li>
            <li>Help</li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header;
