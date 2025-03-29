
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Bell, Menu } from 'lucide-react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center p-4 bg-taskace-dark text-white">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-taskace-dark text-white">
          <div className="flex flex-col h-full py-6">
            <Logo className="mb-8" />
            <nav className="space-y-4">
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/tasks')}
                >
                  Tasks
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/schedules')}
                >
                  Schedules
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </Button>
              </SheetClose>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Logout
              </Button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      
      <Logo />

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
        </Button>
        
        {user && (
          <button 
            className="w-8 h-8 rounded-full overflow-hidden"
            onClick={() => navigate('/profile')}
          >
            <img 
              src={user.avatar || "/lovable-uploads/7156323a-9b42-44ad-89f9-d6477e9a511a.png"} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
