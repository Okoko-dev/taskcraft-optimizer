
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Home, CheckSquare, Calendar, User, LogOut, CalendarDays } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Logo from './Logo';

interface SidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/schedules', label: 'Schedules', icon: Calendar },
    { path: '/calendar', label: 'Calendar', icon: CalendarDays },
    { path: '/profile', label: 'Profile', icon: User },
  ];
  
  const handleNavigation = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };
  
  const handleLogout = () => {
    // Handle logout functionality here
    // For now, just navigate to login page
    navigate('/login');
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 w-[280px] sm:max-w-[280px] bg-[#1F2A39] border-r border-[#3D4A5C] text-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-[#3D4A5C]">
            <Logo />
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white">
              <X size={24} />
            </Button>
          </div>
          
          <div className="flex flex-col flex-1 py-6 space-y-4">
            {menuItems.map(item => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center px-6 py-3 text-left transition-colors ${
                  isActive(item.path) ? 'text-[#41E0B5]' : 'text-white hover:text-[#41E0B5]/80'
                }`}
              >
                <item.icon className="mr-3" size={20} />
                <span className="text-lg">{item.label}</span>
              </button>
            ))}
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center px-6 py-3 text-left text-[#FB836F] hover:text-[#FB836F]/80 transition-colors mt-auto mb-8"
          >
            <LogOut className="mr-3" size={20} />
            <span className="text-lg">Logout</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SidePanel;
