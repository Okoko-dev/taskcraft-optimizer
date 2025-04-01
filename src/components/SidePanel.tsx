
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskManager } from '@/context/TaskContext';
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { User, LogOut, Home, CheckSquare, Calendar, Settings, BrainCog } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

interface SidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { userPreferences, updateUserPreferences, rescheduleAllTasks } = useTaskManager();
  const [activeTab, setActiveTab] = useState('navigation');

  const handleNavigation = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
    onOpenChange(false);
  };

  return (
    <SheetContent className="bg-[#1F2A39] border-r border-[#3D4A5C] p-0 w-[300px]">
      <SheetHeader className="p-6 border-b border-[#3D4A5C]">
        <SheetTitle className="text-white">Task Ace</SheetTitle>
      </SheetHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#283445] grid grid-cols-3 w-full rounded-none">
          <TabsTrigger 
            value="navigation" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Navigation
          </TabsTrigger>
          <TabsTrigger 
            value="ai" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            AI Settings
          </TabsTrigger>
          <TabsTrigger 
            value="account" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="navigation" className="p-4 space-y-4">
          <div>
            <div className="text-sm text-gray-400 mb-2">Main Navigation</div>
            <div className="space-y-2">
              <button 
                onClick={() => handleNavigation('/dashboard')}
                className="w-full flex items-center p-3 rounded-md text-white hover:bg-[#283445] transition-colors"
              >
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </button>
              
              <button 
                onClick={() => handleNavigation('/tasks')}
                className="w-full flex items-center p-3 rounded-md text-white hover:bg-[#283445] transition-colors"
              >
                <CheckSquare className="w-5 h-5 mr-3" />
                Tasks
              </button>
              
              <button 
                onClick={() => handleNavigation('/schedules')}
                className="w-full flex items-center p-3 rounded-md text-white hover:bg-[#283445] transition-colors"
              >
                <Settings className="w-5 h-5 mr-3" />
                Schedules
              </button>

              <button 
                onClick={() => handleNavigation('/calendar')}
                className="w-full flex items-center p-3 rounded-md text-white hover:bg-[#283445] transition-colors"
              >
                <Calendar className="w-5 h-5 mr-3" />
                Calendar
              </button>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-400 mb-2">User</div>
            <div className="space-y-2">
              <button 
                onClick={() => handleNavigation('/profile')}
                className="w-full flex items-center p-3 rounded-md text-white hover:bg-[#283445] transition-colors"
              >
                <User className="w-5 h-5 mr-3" />
                Profile
              </button>
              
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center p-3 rounded-md text-[#FB836F] hover:bg-[#FB836F]/10 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BrainCog className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium text-white">AI Preferences</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-300 block mb-2">Preferred Study Time</label>
                <Select
                  value={userPreferences.preferredStudyTime}
                  onValueChange={(value: 'morning' | 'afternoon' | 'evening' | 'night') => 
                    updateUserPreferences({ preferredStudyTime: value })
                  }
                >
                  <SelectTrigger className="bg-[#283445] border-[#3D4A5C] text-white">
                    <SelectValue placeholder="Select preferred time" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#283445] border-[#3D4A5C] text-white">
                    <SelectItem value="morning">Morning (5AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                    <SelectItem value="evening">Evening (5PM - 10PM)</SelectItem>
                    <SelectItem value="night">Night (10PM - 5AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Maximum Tasks Per Day: {userPreferences.maxTasksPerDay}
                </label>
                <Slider
                  value={[userPreferences.maxTasksPerDay]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => updateUserPreferences({ maxTasksPerDay: value[0] })}
                  className="py-4"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Study Session Duration: {userPreferences.studySessionDuration} minutes
                </label>
                <Slider
                  value={[userPreferences.studySessionDuration]}
                  min={15}
                  max={120}
                  step={15}
                  onValueChange={(value) => updateUserPreferences({ studySessionDuration: value[0] })}
                  className="py-4"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Break Duration: {userPreferences.breakDuration} minutes
                </label>
                <Slider
                  value={[userPreferences.breakDuration]}
                  min={5}
                  max={30}
                  step={5}
                  onValueChange={(value) => updateUserPreferences({ breakDuration: value[0] })}
                  className="py-4"
                />
              </div>
              
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
                onClick={rescheduleAllTasks}
              >
                <BrainCog className="w-4 h-4 mr-2" /> 
                Recalculate AI Schedule
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account" className="p-4">
          {user && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-4">
                <img 
                  src={user.avatar || "/lovable-uploads/7156323a-9b42-44ad-89f9-d6477e9a511a.png"} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover mb-3"
                />
                <h3 className="text-lg font-medium text-white">{user.name}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-[#3D4A5C] text-white"
                onClick={() => handleNavigation('/profile')}
              >
                Edit Profile
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-[#FB836F] text-[#FB836F] hover:bg-[#FB836F]/10"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </SheetContent>
  );
};

export default SidePanel;
