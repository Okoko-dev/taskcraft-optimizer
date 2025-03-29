
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Task, useTaskManager } from '@/context/TaskContext';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const CalendarView: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { getTasksByDate } = useTaskManager();
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      const tasks = getTasksByDate(selectedDate);
      setSelectedDateTasks(tasks);
      setIsDialogOpen(tasks.length > 0);
    }
  };

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="bg-taskace-card rounded-lg p-3"
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-taskace-dark text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Tasks for {date?.toLocaleDateString()}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedDateTasks.length} completed tasks on this day
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedDateTasks.map(task => (
              <div key={task.id} className="task-card">
                <h3 className="font-semibold">{task.title}</h3>
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
