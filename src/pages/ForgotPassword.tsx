
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    try {
      await resetPassword(email);
      setCodeSent(true);
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-taskace-dark">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="absolute top-0 left-0 w-32 h-32 circle-bg opacity-20 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 circle-bg opacity-10 translate-y-1/3"></div>
        
        <Logo className="mb-6" />
        
        <div className="w-full max-w-md space-y-6">
          <div className="w-full h-1 bg-gray-800 rounded-full mb-6"></div>
          
          <h2 className="text-white text-center text-xl font-semibold">
            {codeSent ? 'Verification Code has been sent to' : 'Reset Password'}
          </h2>
          
          {codeSent && (
            <p className="text-primary text-center">{email}</p>
          )}
          
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
                  disabled={codeSent}
                />
              </div>
              
              {codeSent && (
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <img src="/lovable-uploads/db97e3e6-097d-452f-acd0-8689bc8c75fa.png" alt="Verification Code" className="w-6 h-6" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Verification Code"
                    className="bg-transparent border-none text-white placeholder:text-gray-500 focus-visible:ring-0"
                  />
                </div>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white"
              disabled={loading}
            >
              {loading ? 'Sending...' : (codeSent ? 'Verify Code' : 'Send Code')}
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-gray-400">
              Remember your password? <Button variant="link" className="p-0 text-primary" onClick={() => navigate('/login')}>Log in</Button>
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

export default ForgotPassword;
