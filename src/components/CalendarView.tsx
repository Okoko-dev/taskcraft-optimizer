
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Task, useTaskManager } from '@/context/TaskContext';
import { formatDistanceToNow, subMonths, isBefore, isAfter } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CheckCircle, CalendarIcon } from 'lucide-react';

const CalendarView: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { getTasksByDate, getCompletedTasks } = useTaskManager();
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  // Get the date range for the last 2 months
  const twoMonthsAgo = subMonths(new Date(), 2);
  
  // Get all completed tasks for highlighting dates in the calendar
  const completedTasks = getCompletedTasks();
  
  useEffect(() => {
    // Create a list of dates that should be disabled (dates before 2 months ago)
    const today = new Date();
    const allDates: Date[] = [];
    
    for (let i = 0; i < 365; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      if (isBefore(date, twoMonthsAgo) || isAfter(date, today)) {
        allDates.push(date);
      }
    }
    
    setDisabledDates(allDates);
  }, [twoMonthsAgo]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      const tasks = getTasksByDate(selectedDate);
      setSelectedDateTasks(tasks);
      setIsDialogOpen(tasks.length > 0);
    }
  };

  // Function to determine if a date has completed tasks
  const hasCompletedTasks = (date: Date) => {
    // Format the date to compare (strip time part)
    const dateString = date.toDateString();
    
    return completedTasks.some(task => {
      if (task.completedAt) {
        return new Date(task.completedAt).toDateString() === dateString;
      }
      return false;
    });
  };

  return (
    <div>
      <div className="bg-taskace-card rounded-lg p-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium">Completed Tasks</h3>
          <span className="text-xs text-primary flex items-center">
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
          }}
          modifiersClassNames={{
            completed: "border border-primary text-primary",
          }}
          className="pointer-events-auto"
        />
        
        <div className="mt-3 text-xs text-gray-400 flex items-center">
          <div className="w-3 h-3 border border-primary rounded-sm mr-1"></div>
          <span>Days with completed tasks</span>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-taskace-dark text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Tasks for {date?.toLocaleDateString()}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedDateTasks.length} completed tasks on this day
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4 max-h-80 overflow-y-auto">
            {selectedDateTasks.map(task => (
              <div key={task.id} className="task-card relative">
                <div className="absolute top-2 right-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h3 className="font-semibold pr-6">{task.title}</h3>
                <p className="text-sm text-gray-300 mt-1">{task.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                    {task.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    Completed {formatDistanceToNow(new Date(task.completedAt!), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
