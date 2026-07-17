import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-20">
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-50">Login</h1>
          <p className="text-sm text-zinc-400">Sign in to access dashboard</p>
        </div>
        
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300">Email</label>
            <input 
              type="email"
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300">Password</label>
            <input 
              type="password"
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
      </div>
    </Card>
  );
}

export default Login;
