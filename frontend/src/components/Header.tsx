import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 shadow-md p-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-sky-400">
          Bienvenido, {user?.name}
        </h1>
        <button 
          onClick={logout} 
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default Header;