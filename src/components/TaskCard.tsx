
import React, { useState, useEffect } from 'react';
import { Task, useTaskManager } from '@/context/TaskContext';
import { Check, Calendar, Undo, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { completeTask, uncompleteTask, deleteTask } = useTaskManager();
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  
  const priorityColors = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-blue-500'
  };
  
  const categoryColors = {
    Education: 'bg-purple-500',
    Personal: 'bg-green-500',
    Household: 'bg-orange-500',
    'Academic Tasks': 'bg-blue-500',
    'Personal Development': 'bg-indigo-500',
    'Daily Responsibilities': 'bg-amber-500',
    'Life Management': 'bg-teal-500',
    'Rewards': 'bg-pink-500',
    'Breaks': 'bg-cyan-500'
  };
  
  useEffect(() => {
    if (task.completed && task.completedAt) {
      const now = new Date();
      const completedTime = new Date(task.completedAt);
      const diffInSeconds = Math.floor((now.getTime() - completedTime.getTime()) / 1000);
      const timeLeft = Math.max(0, 30 - diffInSeconds);
      
      setSecondsLeft(timeLeft);
      
      if (timeLeft > 0) {
        const intervalId = setInterval(() => {
          setSecondsLeft(prev => {
            const newTime = prev - 1;
            if (newTime <= 0) {
              clearInterval(intervalId);
              return 0;
            }
            return newTime;
          });
        }, 1000);
        
        setTimer(intervalId);
        
        return () => {
          clearInterval(intervalId);
        };
      }
    } else {
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
      setSecondsLeft(0);
    }
  }, [task.completed, task.completedAt, timer]);
  
  const isTaskDueSoon = () => {
    const today = new Date();
    const deadline = new Date(task.deadline);
    const differenceInDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return differenceInDays <= 2 && !task.completed;
  };

  const handleComplete = () => {
    completeTask(task.id);
    toast.success("Task completed! You can undo this action within 30 seconds.");
  };

  const handleUndo = () => {
    uncompleteTask(task.id);
    toast.info("Task marked as incomplete");
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    toast.success("Task deleted successfully!");
  };

  return (
    <div className={`task-card relative overflow-hidden bg-[#283445] p-4 rounded-lg border border-[#3D4A5C]`}>
      {isTaskDueSoon() && (
        <div className="absolute top-0 right-0 bg-red-500 text-xs px-2 py-1 text-white rounded-bl-md">
          Due Soon!
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-semibold`}>
          {task.title}
        </h3>
        
        <div className="flex items-center space-x-1">
          <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}></span>
          <span className="text-xs text-gray-300">{task.priority}</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-300 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full text-white ${categoryColors[task.category as keyof typeof categoryColors] || 'bg-gray-500'}`}>
            {task.category}
          </span>
          
          <div className="flex items-center text-xs text-gray-300">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded-full w-8 h-8 p-0"
            onClick={handleComplete}
          >
            <Check className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-full w-8 h-8 p-0"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
