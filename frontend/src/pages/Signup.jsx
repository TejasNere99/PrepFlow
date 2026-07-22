import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-20">
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-50">Sign Up</h1>
          <p className="text-sm text-zinc-400">Create a new student account</p>
        </div>
        
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300">Name</label>
            <input 
              type="text"
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full">Sign Up</Button>
          
          <div className="text-center mt-4">
            <span className="text-sm text-zinc-400">Already have an account? </span>
            <Link to="/login" className="text-sm text-zinc-300 hover:text-white underline">Log In</Link>
          </div>
        </form>
      </div>
    </Card>
  );
}

export default Signup;
