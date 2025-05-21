import React from 'react';
import { NavLink } from 'react-router-dom';
import { WalletCards, BarChart3, Coins, LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="bg-white w-64 flex flex-col shadow-lg z-10 transition-all duration-300 ease-in-out">
      <div className="bg-blue-600 py-6">
        <div className="flex items-center justify-center gap-2">
          <Coins className="h-8 w-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Finança Fácil</h1>
        </div>
      </div>
      
      <div className="flex-1 py-6">
        <nav className="px-4">
          <NavLink 
            to="/bills" 
            className={({isActive}) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-2 ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <WalletCards className="h-5 w-5" />
            <span>Contas a pagar</span>
          </NavLink>
          
          <NavLink 
            to="/charts" 
            className={({isActive}) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <BarChart3 className="h-5 w-5" />
            <span>Gráficos</span>
          </NavLink>
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">SAIR</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;