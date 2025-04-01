
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  User,
  CalendarDays 
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/schedules', icon: Calendar, label: 'Schedules' },
    { path: '/calendar', icon: CalendarDays, label: 'Calendar' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const NavContent = () => (
    <div className="flex flex-col space-y-4 p-4">
      <h2 className="text-lg font-semibold text-primary mb-4">TaskAce</h2>
      {navItems.map((item) => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? "default" : "ghost"}
          className={`flex items-center justify-start ${
            isActive(item.path) ? "bg-primary text-[#1F2A39]" : "text-gray-400"
          }`}
          onClick={() => navigate(item.path)}
        >
          <item.icon className="mr-2 h-5 w-5" />
          {item.label}
        </Button>
      ))}
    </div>
  );

  // Use Drawer for mobile devices and Sheet for desktop
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-10">
            <Calendar className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-[#1F2A39] text-white">
          <NavContent />
          <DrawerClose className="absolute top-4 right-4">
            <Button variant="ghost" size="icon">
              <span className="sr-only">Close</span>
              &times;
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-4 left-4 z-10 bg-[#283445] border-[#3D4A5C] text-white"
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-[#1F2A39] text-white border-[#3D4A5C] w-64">
        <NavContent />
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
