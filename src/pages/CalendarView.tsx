
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Task, useTaskManager } from '@/context/TaskContext';
import { formatDistanceToNow, subMonths, isBefore, isAfter, format } from 'date-fns';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CheckCircle, CalendarIcon, Clock, AlertCircle, Undo } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

const CalendarViewPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { tasks, getTodaysTasks, getTasksByDate, uncompleteTask } = useTaskManager();
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);
  const [unfinishedTasks, setUnfinishedTasks] = useState<Task[]>([]);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [secondsLeftMap, setSecondsLeftMap] = useState<Record<string, number>>({});

  // Get the date range for the last 2 months
  const twoMonthsAgo = subMonths(new Date(), 2);
  const today = new Date();
  
  useEffect(() => {
    // Create a list of dates that should be disabled (dates before 2 months ago)
    const allDates: Date[] = [];
    
    for (let i = 0; i < 365; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      if (isBefore(date, twoMonthsAgo) || isAfter(date, today)) {
        allDates.push(date);
      }
    }
    
    setDisabledDates(allDates);
  }, [twoMonthsAgo, today]);

  useEffect(() => {
    // Manage countdown timers for recently completed tasks
    const timers: Record<string, NodeJS.Timeout> = {};
    const initialSecondsLeft: Record<string, number> = {};
    
    selectedDateTasks.forEach(task => {
      if (task.completed && task.completedAt) {
        const now = new Date();
        const completedTime = new Date(task.completedAt);
        const diffInSeconds = Math.floor((now.getTime() - completedTime.getTime()) / 1000);
        const timeLeft = Math.max(0, 30 - diffInSeconds);
        
        initialSecondsLeft[task.id] = timeLeft;
        
        if (timeLeft > 0) {
          timers[task.id] = setInterval(() => {
            setSecondsLeftMap(prev => {
              const newTime = prev[task.id] - 1;
              if (newTime <= 0) {
                clearInterval(timers[task.id]);
                return { ...prev, [task.id]: 0 };
              }
              return { ...prev, [task.id]: newTime };
            });
          }, 1000);
        }
      }
    });
    
    setSecondsLeftMap(initialSecondsLeft);
    
    // Cleanup timers
    return () => {
      Object.values(timers).forEach(timer => clearInterval(timer));
    };
  }, [selectedDateTasks]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      
      // Get completed tasks for the selected date
      const completedTasks = tasks.filter(task => {
        if (task.completed && task.completedAt) {
          const completedDate = new Date(task.completedAt);
          return completedDate.toDateString() === selectedDate.toDateString();
        }
        return false;
      });
      
      // Get unfinished tasks for the selected date
      const unfinished = tasks.filter(task => {
        const taskDeadline = new Date(task.deadline);
        return taskDeadline.toDateString() === selectedDate.toDateString() && !task.completed;
      });
      
      setSelectedDateTasks(completedTasks);
      setUnfinishedTasks(unfinished);
      setIsDialogOpen(completedTasks.length > 0 || unfinished.length > 0);
    }
  };

  // Function to determine if a date has completed tasks
  const hasCompletedTasks = (date: Date) => {
    // Format the date to compare (strip time part)
    const dateString = date.toDateString();
    
    return tasks.some(task => {
      if (task.completedAt) {
        return new Date(task.completedAt).toDateString() === dateString;
      }
      return false;
    });
  };

  // Function to determine if a date has unfinished tasks
  const hasUnfinishedTasks = (date: Date) => {
    // Format the date to compare (strip time part)
    const dateString = date.toDateString();
    
    return tasks.some(task => {
      const taskDeadline = new Date(task.deadline);
      return taskDeadline.toDateString() === dateString && !task.completed;
    });
  };

  // Function to get today's tasks
  const todaysTasks = getTodaysTasks();
  
  const handleUndo = (taskId: string) => {
    uncompleteTask(taskId);
    toast.info("Task marked as incomplete");
    
    // Update the selected date tasks
    setSelectedDateTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const canUndo = (task: Task) => {
    if (task.completed && task.completedAt) {
      return secondsLeftMap[task.id] > 0;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-[#1F2A39] text-white pb-24">
      <Header />
      
      <main className="p-4 max-w-lg mx-auto">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-[#41E0B5] mb-6">C<span className="text-white">alendar</span></h1>
        </div>
        
        <div className="bg-[#283445] rounded-lg p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium">Tasks Calendar</h3>
            <span className="text-xs text-[#41E0B5] flex items-center">
              <CalendarIcon className="h-3 w-3 mr-1" /> Past 2 months
            </span>
          </div>
          
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={disabledDates}
            modifiers={{
              completed: (date) => hasCompletedTasks(date),
              unfinished: (date) => hasUnfinishedTasks(date),
            }}
            modifiersClassNames={{
              completed: "border border-[#41E0B5] text-[#41E0B5]",
              unfinished: "border border-[#FB836F] text-[#FB836F]",
            }}
            className="rounded-md bg-[#283445] text-white border-[#3D4A5C] pointer-events-auto"
          />
          
          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 border border-[#41E0B5] rounded-sm mr-1"></div>
              <span className="text-gray-300">Completed tasks</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 border border-[#FB836F] rounded-sm mr-1"></div>
              <span className="text-gray-300">Unfinished tasks</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[#283445] rounded-lg p-5 mb-6">
          <h3 className="text-base font-medium mb-4">Today's Tasks</h3>
          
          {todaysTasks.length > 0 ? (
            <div className="space-y-4">
              {todaysTasks.map(task => (
                <div key={task.id} className="bg-[#1F2A39] p-4 rounded-lg border border-[#3D4A5C]">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{task.title}</h3>
                    <Badge className={task.completed ? "bg-[#41E0B5]" : "bg-[#FB836F]"}>
                      {task.completed ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{task.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="outline" className="text-[#C9E6FA] border-[#C9E6FA]">
                      {task.category}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Due {format(new Date(task.deadline), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                  {task.completed && task.completedAt && (
                    <div className="mt-3 text-xs text-gray-400">
                      Completed {formatDistanceToNow(new Date(task.completedAt), { addSuffix: true })}
                      {canUndo(task) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-6 px-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500"
                          onClick={() => handleUndo(task.id)}
                        >
                          <Undo className="h-3 w-3 mr-1" /> Undo ({secondsLeftMap[task.id]}s)
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No tasks scheduled for today</p>
            </div>
          )}
        </div>
      </main>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1F2A39] text-white border-[#3D4A5C]">
          <DialogHeader>
            <DialogTitle>Tasks for {date?.toLocaleDateString()}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedDateTasks.length} completed tasks, {unfinishedTasks.length} unfinished tasks
            </DialogDescription>
          </DialogHeader>
          
          {selectedDateTasks.length > 0 && (
            <>
              <h3 className="font-medium text-[#41E0B5] flex items-center mt-2">
                <CheckCircle className="h-4 w-4 mr-2" /> Completed Tasks
              </h3>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {selectedDateTasks.map(task => (
                  <div key={task.id} className="bg-[#283445] p-3 rounded-lg border border-[#3D4A5C]">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{task.title}</h4>
                      {canUndo(task) && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500"
                            onClick={() => handleUndo(task.id)}
                          >
                            <Undo className="h-3 w-3 mr-1" /> Undo ({secondsLeftMap[task.id]}s)
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{task.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#41E0B5]/20 text-[#41E0B5]">
                        {task.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        Completed {formatDistanceToNow(new Date(task.completedAt!), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {unfinishedTasks.length > 0 && (
            <>
              <h3 className="font-medium text-[#FB836F] flex items-center mt-4">
                <AlertCircle className="h-4 w-4 mr-2" /> Unfinished Tasks
              </h3>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {unfinishedTasks.map(task => (
                  <div key={task.id} className="bg-[#283445] p-3 rounded-lg border border-[#3D4A5C]">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-300 mt-1">{task.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#FB836F]/20 text-[#FB836F]">
                        {task.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        Priority: {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <NavBar />
    </div>
  );
};

export default CalendarViewPage;
