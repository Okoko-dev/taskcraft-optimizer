
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, ListTodo, User, Bell } from 'lucide-react';
import { useTaskManager } from '@/context/TaskContext';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tasks } = useTaskManager();
  
  // Count due soon and overdue tasks for notification badge
  const notificationCount = tasks.filter(task => {
    if (task.completed) return false;
    
    const today = new Date();
    const deadline = new Date(task.deadline);
    const differenceInDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    // Count overdue tasks or tasks due within 3 days
    return differenceInDays <= 3 || deadline < today;
  }).length;
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Schedule', path: '/schedules' },
    { icon: ListTodo, label: 'Tasks', path: '/tasks' },
    { icon: Bell, label: 'Notifications', path: '/notifications', badge: notificationCount },
    { icon: User, label: 'Profile', path: '/profile' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-taskace-dark border-t border-gray-800">
      <div className="max-w-lg mx-auto px-4 py-2 flex justify-between">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`flex flex-col items-center py-2 px-3 relative ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
              
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NavBar;
