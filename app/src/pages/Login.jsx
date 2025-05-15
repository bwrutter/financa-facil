import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/contas');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 px-4">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-full p-8">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">Finança Fácil</h1>
        <p className="text-center text-gray-600 mb-10">
          Gerencie suas finanças de forma simples e eficiente
        </p>
        <button
          onClick={loginWithGoogle}
          className="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md py-3 w-full transition-shadow shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M21.805 10.023h-9.814v3.953h5.713c-.246 1.6-1.64 4.692-5.713 4.692-3.443 0-6.245-2.87-6.245-6.412 0-3.544 2.802-6.41 6.245-6.41 1.96 0 3.273.832 4.032 1.552l2.746-2.645C17.04 5.5 15.067 4.6 12 4.6 6.648 4.6 2.4 8.938 2.4 14.27c0 5.332 4.248 9.67 9.6 9.67 5.523 0 9.188-3.873 9.188-9.326 0-.63-.067-1.127-.383-1.59z" />
          </svg>
          Entrar com Google
        </button>
      </div>
    </div>
  );
};

export default Login;
