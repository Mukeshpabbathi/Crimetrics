import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';
import { AiOutlineUser } from 'react-icons/ai';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useState } from 'react';

import { links } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';


const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();
  const [isLoggedIn, setIsLoggedIn] = useState(window.localStorage.getItem("loggedin") === "TRUE");

  const handleLogout = () => {
    // Perform logout actions
    alert("Logged Out Successfully!!!")
    window.localStorage.removeItem("loggedin");
    setIsLoggedIn(false);
  };
  
  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
              <SiShopware /> <span>Crimetrics</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10 ">
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={`/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    {link.icon}
                    <span className="capitalize ">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}
            <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                 USER
                </p>
            {!isLoggedIn && (
              <NavLink to="/login" onClick={handleCloseSideBar} className={normalLink}>
                <AiOutlineUser />
                <span className="capitalize">Login</span>
              </NavLink>
            )}
            {isLoggedIn && (
              <button onClick={handleLogout} className={normalLink}>
                <AiOutlineUser />
                <span className="capitalize">Logout</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
