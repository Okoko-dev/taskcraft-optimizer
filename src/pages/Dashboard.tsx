
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTaskManager } from '@/context/TaskContext';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import TaskCard from '@/components/TaskCard';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tasks, scheduledTasks, points, completeTask } = useTaskManager();
  
  // Calculate task completion stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Data for pie chart
  const data = [
    { name: 'Completed', value: completedTasks },
    { name: 'Remaining', value: totalTasks - completedTasks },
  ];
  const COLORS = ['#2ED1A2', '#494C57'];

  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(today);

  return (
    <div className="min-h-screen bg-taskace-dark text-white pb-24">
      <Header />
      
      <main className="p-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Hi {user?.name.split(' ')[0] || 'User'}!</h1>
            <div className="flex items-center text-gray-400 space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <img 
            src={user?.avatar || "/lovable-uploads/7156323a-9b42-44ad-89f9-d6477e9a511a.png"} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">{points} points</h2>
            <Button variant="link" className="text-primary text-sm p-0">claim free points</Button>
          </div>
          <ProgressBar progress={Math.min((points / 500) * 100, 100)} />
          
          <div className="bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-xl p-4 mt-4">
            <h3 className="text-sm text-gray-300 mb-2">Milestone</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary/20 rounded-md flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <span className="text-white">50 points</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary/20 rounded-md flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <span className="text-white">100 points</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-taskace-gray/30 rounded-md flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-gray-500" />
                </div>
                <span className="text-gray-400">500 points</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Today's stats</h2>
          <div className="bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-xl p-4">
            <div className="flex justify-around items-center">
              <div className="text-center">
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center">
                  <p className="text-sm text-gray-300">Task Completed</p>
                  <p className="text-xl font-bold text-white">{completionRate}%</p>
                </div>
              </div>
              
              <div className="text-center">
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Remaining', value: 100 - completionRate },
                        { name: 'Completed', value: completionRate },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={40}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      <Cell fill="#494C57" />
                      <Cell fill="#FFFFFF" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center">
                  <p className="text-sm text-gray-300">Task Incomplete</p>
                  <p className="text-xl font-bold text-white">{100 - completionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">AI Scheduled Tasks</h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-primary text-sm flex items-center"
              onClick={() => navigate('/tasks')}
            >
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {scheduledTasks.length > 0 ? (
              scheduledTasks.slice(0, 3).map(({ task, timeSlot }) => (
                <div key={task.id} className="task-card">
                  <div className="text-xs text-gray-400 mb-1">{timeSlot}</div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-300 line-clamp-1">{task.description}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded-full w-8 h-8 p-0"
                      onClick={() => completeTask(task.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400">
                <p>No tasks scheduled for today</p>
                <Button 
                  variant="link" 
                  className="text-primary"
                  onClick={() => navigate('/create-task')}
                >
                  Add a new task
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <NavBar />
    </div>
  );
};

export default Dashboard;
