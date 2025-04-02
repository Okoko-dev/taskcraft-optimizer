
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTaskManager } from '@/context/TaskContext';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, LogOut, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { tasks, points } = useTaskManager();
  const [activeTab, setActiveTab] = useState('account');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Calculate task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload the file to a server
      // For now, we'll use FileReader to get a data URL
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          updateProfile({ avatar: reader.result });
          toast.success('Profile photo updated!');
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Mock user data
  const userData = {
    name: user?.name || 'Emma Walls',
    age: 24,
    education: "Bachelor's in International Studies",
    status: 'Single',
    occupation: 'Travel Writer',
    location: 'New York City',
  };

  return (
    <div className="min-h-screen bg-taskace-dark text-white pb-24">
      <Header />
      
      <main className="max-w-lg mx-auto pb-24">
        <div className="w-full h-40 bg-gradient-to-b from-gray-800 to-transparent relative">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="relative w-24 h-24 rounded-full border-4 border-taskace-dark overflow-hidden group">
              <Avatar className="w-full h-full">
                <AvatarImage 
                  src={user?.avatar || "/lovable-uploads/7156323a-9b42-44ad-89f9-d6477e9a511a.png"} 
                  alt="Profile" 
                />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleAvatarClick}
              >
                <Camera className="text-white w-6 h-6" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-16 px-4">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="bg-white rounded-full">
              <TabsTrigger 
                value="account" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full flex-1"
                onClick={() => setActiveTab('account')}
              >
                Account
              </TabsTrigger>
              <TabsTrigger 
                value="today" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full flex-1"
                onClick={() => setActiveTab('today')}
              >
                Today
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="mt-6">
              <div className="task-card">
                <h2 className="text-primary text-xl font-bold mb-6">{userData.name}</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white">Age</span>
                    <span className="text-primary">{userData.age}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white">Education</span>
                    <span className="text-primary">{userData.education}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white">Status</span>
                    <span className="text-primary">{userData.status}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white">Occupation</span>
                    <span className="text-primary">{userData.occupation}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white">Location</span>
                    <span className="text-primary">{userData.location}</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="mb-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold">Task</h3>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Finished</span>
                      <span>Not Completed</span>
                    </div>
                  </div>
                  
                  <div className="w-full h-2 bg-gray-700 rounded-full mb-2 overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>{completedTasks}/100</span>
                    <span>{totalTasks - completedTasks}/100</span>
                  </div>
                </div>
                
                <div className="mt-8 space-y-2">
                  <Button
                    className="w-full bg-primary hover:bg-primary-dark text-white"
                    onClick={() => navigate('/edit-profile')}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  
                  <Button
                    className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="today" className="mt-6">
              <div className="task-card">
                <h2 className="text-primary text-xl font-bold">Task Progress</h2>
                <p className="text-gray-400 text-sm mb-4">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
                
                <div className="mb-4">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full border-8 border-primary/30 mx-auto flex items-center justify-center">
                      <span className="text-2xl font-bold">{completionRate}%</span>
                    </div>
                    <div className="absolute top-0 left-0 w-28 h-28 rounded-full border-8 border-transparent border-t-primary border-r-primary mx-auto"
                         style={{ transform: `rotate(${completionRate * 3.6}deg)` }}></div>
                  </div>
                  <p className="text-center mt-2 text-gray-400">Tasks Completed</p>
                </div>
                
                <div className="space-y-4">
                  {tasks.filter(task => !task.completed).slice(0, 3).map(task => (
                    <div key={task.id} className="p-2 bg-taskace-card/50 rounded-lg">
                      <h3 className="font-medium">{task.title}</h3>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{task.category}</span>
                        <span>{format(new Date(task.deadline), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Points Progress</h3>
                  <ProgressBar progress={Math.min((points / 500) * 100, 100)} />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>{points} points</span>
                    <span>500 points</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <NavBar />
    </div>
  );
};

export default Profile;
