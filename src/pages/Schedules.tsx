
import React from 'react';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import { useTaskManager } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Plus, Clock, MoreHorizontal } from 'lucide-react';
import CalendarView from '@/components/CalendarView';

const Schedules = () => {
  const { schedules, currentSchedule, setCurrentSchedule } = useTaskManager();

  return (
    <div className="min-h-screen bg-taskace-dark text-white pb-24">
      <Header />
      
      <main className="p-4 max-w-lg mx-auto">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-primary mb-6">S<span className="text-white">chedule</span></h1>
        </div>
        
        <div className="flex space-x-2 mb-6">
          <Button 
            className="flex-1 bg-primary hover:bg-primary-dark text-white"
            onClick={() => {}}
          >
            Today Schedule
          </Button>
          <Button 
            className="flex-1 bg-transparent border border-green-700 text-primary hover:bg-primary/10"
            onClick={() => {}}
          >
            All Schedules
          </Button>
        </div>
        
        <div className="space-y-4 mb-6">
          {schedules.map(schedule => (
            <div 
              key={schedule.id} 
              className={`p-4 rounded-lg ${currentSchedule?.id === schedule.id ? 'bg-primary/20' : 'bg-taskace-card'} flex justify-between items-center cursor-pointer`}
              onClick={() => setCurrentSchedule(schedule.id)}
            >
              <h3 className="text-lg">{schedule.name}</h3>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
        
        {currentSchedule && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Current Schedule: {currentSchedule.name}</h2>
            <div className="space-y-4">
              {currentSchedule.scheduleItems.map(item => (
                <div key={item.id} className="task-card flex items-center">
                  <div className="mr-4 text-sm text-gray-300">
                    {item.startTime} - {item.endTime}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.activity}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Completed Tasks Calendar</h2>
          <CalendarView />
        </div>
      </main>
      
      <div className="fixed right-6 bottom-24">
        <Button className="w-14 h-14 rounded-full bg-primary hover:bg-primary-dark">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      
      <NavBar />
    </div>
  );
};

export default Schedules;
