import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('El password debe tener al menos 6 caracteres');
      return;
    }

    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      auth.login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.msg || 'Error durante el registro');
    }
  };

  return (
    <div className="bg-gray-900 h-screen flex justify-center items-center text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-sky-400">Crear Cuenta</h2>

        {error && <p className="bg-red-500 text-white p-2 rounded mb-4 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block mb-2" htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-sky-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-sky-400"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-sky-400"
            required
          />
        </div>

        <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold p-2 rounded-lg transition duration-200">
          Crear Cuenta
        </button>

        <p className="mt-4 text-center text-gray-400">
          Ya tienes cuenta? <Link to="/login" className="text-sky-400 hover:underline">Inicia Sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;