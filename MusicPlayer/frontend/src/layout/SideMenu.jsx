import React from 'react';
import { AiOutlineHome, AiOutlineSearch, AiOutlineHeart } from "react-icons/ai";

const SideMenu = () => {
  return (
    <aside className='sidemenu-root'>
      <div className='sidemenu-header'>
        <img src='' alt='project-logo' className='sidemenu-logo-img' />
        <h2 className='sidemenu-logo-title'>Muzic</h2>
      </div>
      <nav className='sidemenu-nav' aria-label='Main Navigation'>
        <ul className='sidemenu-nav-list'>
          <li>
            <button className='sidemenu-nv-btn-active'>
              <AiOutlineHome className="sidemenu-nav-icon" size={18} />
            </button>
            <span>Home</span>
          </li>
          <li>
            <button className='sidemenu-nv-btn-active'>
              <AiOutlineSearch className="sidemenu-nav-icon" size={18} />
            </button>
            <span>Search</span>
          </li>
          <li>
            <button className='sidemenu-nv-btn-active'>
              <AiOutlineHeart className="sidemenu-nav-icon" size={18} />
            </button>
            <span>Favourites</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideMenu;
