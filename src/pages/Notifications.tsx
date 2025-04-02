
import React from 'react';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import { useTaskManager } from '@/context/TaskContext';
import { format } from 'date-fns';
import { Calendar, Bell, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const { tasks } = useTaskManager();
  const navigate = useNavigate();
  
  // Get tasks that are due soon (within 3 days)
  const dueSoonTasks = tasks.filter(task => {
    if (task.completed) return false;
    
    const today = new Date();
    const deadline = new Date(task.deadline);
    const differenceInDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    return differenceInDays <= 3 && differenceInDays > 0;
  }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  
  // Get overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (task.completed) return false;
    
    const today = new Date();
    const deadline = new Date(task.deadline);
    return deadline < today;
  }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  return (
    <div className="min-h-screen bg-taskace-dark text-white pb-24">
      <Header />
      
      <main className="p-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Bell className="w-6 h-6 text-primary" />
        </div>
        
        {overdueTasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-red-400 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Overdue Tasks
            </h2>
            
            <div className="space-y-3">
              {overdueTasks.map(task => (
                <div 
                  key={task.id} 
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg cursor-pointer"
                  onClick={() => navigate('/tasks')}
                >
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{task.title}</h3>
                    <span className="text-xs bg-red-500 px-2 py-1 rounded-full text-white">
                      Overdue
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{task.description}</p>
                  <div className="flex items-center mt-2 text-xs text-red-300">
                    <Calendar className="w-3 h-3 mr-1" />
                    Due {format(new Date(task.deadline), 'PPP')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {dueSoonTasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-yellow-400 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Due Soon
            </h2>
            
            <div className="space-y-3">
              {dueSoonTasks.map(task => {
                const today = new Date();
                const deadline = new Date(task.deadline);
                const differenceInDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
                
                let statusColor = 'bg-yellow-500';
                let statusText = `${differenceInDays} days left`;
                
                if (differenceInDays === 0) {
                  statusColor = 'bg-red-500';
                  statusText = 'Due today';
                } else if (differenceInDays === 1) {
                  statusColor = 'bg-orange-500';
                  statusText = 'Due tomorrow';
                }
                
                return (
                  <div 
                    key={task.id} 
                    className="bg-[#283445] p-4 rounded-lg border border-[#3D4A5C] cursor-pointer"
                    onClick={() => navigate('/tasks')}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{task.title}</h3>
                      <span className={`text-xs ${statusColor} px-2 py-1 rounded-full text-white`}>
                        {statusText}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{task.description}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-300">
                      <Calendar className="w-3 h-3 mr-1" />
                      Due {format(new Date(task.deadline), 'PPP')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {overdueTasks.length === 0 && dueSoonTasks.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-400">All Caught Up!</h2>
            <p className="text-gray-500 mt-2">You don't have any upcoming deadlines.</p>
            <Button 
              className="mt-6 bg-primary"
              onClick={() => navigate('/create-task')}
            >
              Create New Task
            </Button>
          </div>
        )}
      </main>
      
      <NavBar />
    </div>
  );
};

export default Notifications;
