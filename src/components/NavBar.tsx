
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Calendar, User, Plus } from 'lucide-react';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-2 px-4 shadow-lg">
      <div className="flex justify-around items-center">
        <button 
          onClick={() => navigate('/dashboard')} 
          className={`flex flex-col items-center p-2 ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button 
          onClick={() => navigate('/tasks')} 
          className={`flex flex-col items-center p-2 ${isActive('/tasks') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <CheckSquare size={24} />
          <span className="text-xs mt-1">Tasks</span>
        </button>
        
        <button 
          onClick={() => navigate('/create-task')} 
          className="flex flex-col items-center"
        >
          <div className="bg-primary rounded-full p-3 -mt-8 shadow-lg">
            <Plus size={24} className="text-primary-foreground" />
          </div>
        </button>
        
        <button 
          onClick={() => navigate('/schedules')} 
          className={`flex flex-col items-center p-2 ${isActive('/schedules') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Calendar size={24} />
          <span className="text-xs mt-1">Schedules</span>
        </button>
        
        <button 
          onClick={() => navigate('/profile')} 
          className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
