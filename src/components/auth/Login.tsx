import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      
      // Redirect based on role (handled in the login function)
      if (email === 'admin@example.com') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = () => {
    setEmail('admin@example.com');
    setPassword('admin123');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Login</h1>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-900/50 border border-red-800 rounded-md flex items-center gap-2 text-red-200">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : (
                <>
                  <LogIn size={18} />
                  <span>Sign in</span>
                </>
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300">
                Register
              </Link>
            </p>
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={handleAdminLogin}
              className="w-full btn-secondary text-sm"
            >
              Use Admin Credentials
            </button>
            <p className="mt-2 text-xs text-gray-500 text-center">
              For demo purposes only
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;