
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTaskManager } from '@/context/TaskContext';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CheckCircle, Clock, ArrowRight, Calendar, BrainCog, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import SidePanelTrigger from '@/components/SidePanelTrigger';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tasks, scheduledTasks, points, completeTask, userPreferences, rescheduleAllTasks } = useTaskManager();
  
  // State to toggle view between today and week
  const [viewMode, setViewMode] = useState<'today' | 'week'>('today');
  
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

  // Filter tasks for today
  const todaysTasks = scheduledTasks.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.toDateString() === today.toDateString();
  });

  // Group tasks by date for weekly view
  const groupedByDate = scheduledTasks.reduce((acc, task) => {
    const dateString = new Date(task.date).toDateString();
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(task);
    return acc;
  }, {} as Record<string, typeof scheduledTasks>);

  // Sort dates for the weekly view
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="min-h-screen bg-taskace-dark text-white pb-24">
      <Header />
      <SidePanelTrigger />
      
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
            <div className="flex items-center">
              <h2 className="text-lg font-semibold">AI Scheduled Tasks</h2>
              <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer" onClick={() => rescheduleAllTasks()}>
                <BrainCog className="w-3 h-3 mr-1" /> AI
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={viewMode === 'today' ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => setViewMode('today')}
              >
                Today
              </Button>
              <Button 
                variant={viewMode === 'week' ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-primary text-sm flex items-center"
                onClick={() => navigate('/tasks')}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {viewMode === 'today' ? (
            <div className="space-y-3">
              {todaysTasks.length > 0 ? (
                todaysTasks.map((scheduledTask, index) => (
                  <div key={`${scheduledTask.task.id}-${index}`} className="bg-[#283445] p-4 rounded-lg border border-[#3D4A5C]">
                    <div className="text-xs font-medium text-primary mb-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {scheduledTask.timeSlot}
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{scheduledTask.task.title}</h3>
                        <p className="text-sm text-gray-300 line-clamp-1">{scheduledTask.task.description}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <Badge variant="outline" className="text-[#C9E6FA] border-[#C9E6FA] text-xs">
                            {scheduledTask.task.category}
                          </Badge>
                          <Badge variant="outline" className={`text-xs
                            ${scheduledTask.task.priority === 'High' ? 'text-[#FB836F] border-[#FB836F]' : 
                             scheduledTask.task.priority === 'Medium' ? 'text-[#FFC107] border-[#FFC107]' : 
                            'text-[#41E0B5] border-[#41E0B5]'}`}
                          >
                            {scheduledTask.task.priority}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded-full w-8 h-8 p-0"
                        onClick={() => completeTask(scheduledTask.task.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 bg-[#283445] p-4 rounded-lg border border-[#3D4A5C]">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No tasks scheduled for today</p>
                  <p className="text-xs mt-1 text-gray-500">Add tasks or adjust your AI preferences</p>
                  <div className="flex justify-center mt-4 space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-primary border-primary hover:bg-primary/10"
                      onClick={() => navigate('/create-task')}
                    >
                      Add Task
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm" 
                      className="text-primary border-primary hover:bg-primary/10"
                      onClick={rescheduleAllTasks}
                    >
                      <BrainCog className="w-3 h-3 mr-1" /> Recalculate
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedDates.length > 0 ? (
                sortedDates.map(dateString => {
                  const date = new Date(dateString);
                  const isToday = date.toDateString() === today.toDateString();
                  const dateFormatted = isToday 
                    ? 'Today' 
                    : format(date, 'EEEE, MMMM d');
                  
                  return (
                    <div key={dateString} className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <h3 className="font-medium">{dateFormatted}</h3>
                      </div>
                      
                      {groupedByDate[dateString].map((scheduledTask, index) => (
                        <div key={`${scheduledTask.task.id}-${index}`} className="bg-[#283445] p-3 pl-4 rounded-lg border border-[#3D4A5C] ml-6">
                          <div className="text-xs font-medium text-primary mb-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> {scheduledTask.timeSlot}
                          </div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{scheduledTask.task.title}</h3>
                              <div className="flex items-center mt-1 space-x-2">
                                <Badge variant="outline" className="text-[#C9E6FA] border-[#C9E6FA] text-xs">
                                  {scheduledTask.task.category}
                                </Badge>
                                <Badge variant="outline" className={`text-xs
                                  ${scheduledTask.task.priority === 'High' ? 'text-[#FB836F] border-[#FB836F]' : 
                                   scheduledTask.task.priority === 'Medium' ? 'text-[#FFC107] border-[#FFC107]' : 
                                  'text-[#41E0B5] border-[#41E0B5]'}`}
                                >
                                  {scheduledTask.task.priority}
                                </Badge>
                              </div>
                            </div>
                            {isToday && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded-full w-6 h-6 p-0"
                                onClick={() => completeTask(scheduledTask.task.id)}
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-400 bg-[#283445] p-4 rounded-lg border border-[#3D4A5C]">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No tasks scheduled for the upcoming week</p>
                  <p className="text-xs mt-1 text-gray-500">Add tasks or adjust your AI preferences</p>
                  <div className="flex justify-center mt-4 space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-primary border-primary hover:bg-primary/10"
                      onClick={() => navigate('/create-task')}
                    >
                      Add Task
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm" 
                      className="text-primary border-primary hover:bg-primary/10"
                      onClick={rescheduleAllTasks}
                    >
                      <BrainCog className="w-3 h-3 mr-1" /> Recalculate
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <NavBar />
    </div>
  );
};

export default Dashboard;
