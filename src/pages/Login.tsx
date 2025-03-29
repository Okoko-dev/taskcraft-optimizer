
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-taskace-dark">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="absolute top-0 left-0 w-32 h-32 circle-bg opacity-20 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 circle-bg opacity-10 translate-y-1/3"></div>
        
        <Logo className="mb-6" />
        
        <div className="w-full max-w-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-taskace-gray p-6 rounded-lg space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <img src="/lovable-uploads/6036f38f-be67-4a02-90ac-c4df3c0f61ea.png" alt="Email" className="w-6 h-6" />
                </div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none text-white placeholder:text-gray-500 focus-visible:ring-0"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <img src="/lovable-uploads/db97e3e6-097d-452f-acd0-8689bc8c75fa.png" alt="Password" className="w-6 h-6" />
                </div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-none text-white placeholder:text-gray-500 focus-visible:ring-0"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="link"
                className="p-0 text-primary"
                type="button"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </Button>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-gray-400">
              Not a member? <Button variant="link" className="p-0 text-primary" onClick={() => navigate('/signup')}>Sign up now</Button>
            </p>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-6">
            By using TaskAce, you are agreeing to our
            <Button variant="link" className="p-0 text-primary text-xs">Terms of Service</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
