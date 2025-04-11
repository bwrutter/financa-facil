import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="drawer lg:drawer-open">
      <input 
        id="drawer" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={isDrawerOpen}
        onChange={() => setIsDrawerOpen(!isDrawerOpen)}
      />
      
      <div className="drawer-content">
        <div className="navbar bg-base-100 lg:hidden">
          <div className="flex-none">
            <label 
              htmlFor="drawer" 
              className="btn btn-square btn-ghost"
              onClick={() => setIsDrawerOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">Finança Fácil</a>
          </div>
        </div>
        
        <div className="p-4">
          <Outlet />
        </div>
      </div>
      
      <div className="drawer-side">
        <label 
          htmlFor="drawer" 
          className="drawer-overlay"
          onClick={() => setIsDrawerOpen(false)}
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li className="mb-4">
            <a className="btn btn-ghost text-xl">Finança Fácil</a>
          </li>
          <li>
            <Link to="/contas">Cadastro de Contas</Link>
          </li>
          <li>
            <Link to="/graficos">Gráficos</Link>
          </li>
          <li className="mt-auto">
            <button 
              className="btn btn-error"
              onClick={logout}
            >
              Sair
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MainLayout; 