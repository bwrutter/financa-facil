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
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center mb-4">Finança Fácil</h2>
          <p className="text-center mb-6">Gerencie suas finanças de forma simples e eficiente</p>
          <button 
            className="btn btn-primary w-full"
            onClick={loginWithGoogle}
          >
            Entrar com Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
