
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Mail, Lock } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-taskace-dark">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute top-0 left-0 w-32 h-32 circle-bg opacity-20 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 circle-bg opacity-10 translate-y-1/3"></div>
        
        <Logo className="mb-6" />
        
        <h1 className="text-3xl font-bold mb-2 text-white">
          Get Started now
        </h1>
        
        <p className="text-gray-400 mb-8 max-w-md">
          Create an account or log in to explore our AI-driven study planner
        </p>
        
        <div className="w-full max-w-md space-y-6">
          <div className="w-full h-1 bg-gray-800 rounded-full mb-6"></div>
          
          <div className="grid grid-cols-2 gap-2 mb-6">
            <Button 
              variant="outline" 
              className="w-full bg-white text-black hover:bg-gray-100"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-transparent hover:bg-gray-800 border-gray-700"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </div>
          
          <div className="bg-taskace-gray p-6 rounded-lg space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <p className="text-gray-300">Email</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <p className="text-gray-300">Password</p>
            </div>
          </div>
          
          <Button 
            className="w-full bg-primary hover:bg-primary-dark text-white"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
          
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

export default Index;
