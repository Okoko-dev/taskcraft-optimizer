
import React, { useState, useEffect } from 'react';
import { Task, useTaskManager } from '@/context/TaskContext';
import { Check, Calendar, Trash2, Undo, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { completeTask, deleteTask, uncompleteTask, restoreTask } = useTaskManager();
  const [showDeleteUndo, setShowDeleteUndo] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
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
  
  const isTaskDueSoon = () => {
    const today = new Date();
    const deadline = new Date(task.deadline);
    const differenceInDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return differenceInDays <= 2 && !task.completed;
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  const handleComplete = () => {
    completeTask(task.id);
    toast.success("Task completed! You can undo this action within 30 seconds in the Calendar view.");
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteUndo(true);
    toast.success("Task deleted! You can restore it within 30 seconds.");
    
    if (timer) {
      clearInterval(timer);
    }
    
    let countdown = 30;
    setSecondsLeft(countdown);
    
    const newTimer = setInterval(() => {
      countdown -= 1;
      setSecondsLeft(countdown);
      
      if (countdown <= 0) {
        clearInterval(newTimer);
        setShowDeleteUndo(false);
      }
    }, 1000);
    
    setTimer(newTimer);
    
    setTimeout(() => {
      clearInterval(newTimer);
      setShowDeleteUndo(false);
    }, 30000);
  };
  
  const handleRestore = () => {
    restoreTask(task.id);
    setShowDeleteUndo(false);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    toast.success("Task restored successfully!");
  };
  
  const isRecentlyCompleted = () => {
    if (task.completed && task.completedAt) {
      const now = new Date();
      const completedTime = new Date(task.completedAt);
      const diffInHours = (now.getTime() - completedTime.getTime()) / (1000 * 3600);
      return diffInHours <= 24;
    }
    return false;
  };

  const isVisible = !task.completed || isRecentlyCompleted();
  
  if (!isVisible && !showDeleteUndo) return null;
  
  if (showDeleteUndo) {
    return (
      <div className="task-card relative overflow-hidden bg-[#283445]/50 p-4 rounded-lg border border-[#3D4A5C] animate-pulse">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-amber-500" />
            <p className="text-gray-400">Task deleted. You can restore it for {secondsLeft} seconds.</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 h-8"
            onClick={handleRestore}
          >
            <Undo className="w-4 h-4 mr-1" /> Restore
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-card relative overflow-hidden ${task.completed ? 'bg-[#283445]/70' : 'bg-[#283445]'} p-4 rounded-lg border ${task.completed ? 'border-[#3D4A5C]/50' : 'border-[#3D4A5C]'}`}>
      {isTaskDueSoon() && (
        <div className="absolute top-0 right-0 bg-red-500 text-xs px-2 py-1 text-white rounded-bl-md">
          Due Soon!
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-semibold ${task.completed ? 'text-gray-400 line-through' : ''}`}>
          {task.title}
        </h3>
        
        <div className="flex items-center space-x-1">
          <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}></span>
          <span className="text-xs text-gray-300">{task.priority}</span>
        </div>
      </div>
      
      <p className={`text-sm ${task.completed ? 'text-gray-500' : 'text-gray-300'} mb-3 line-clamp-2`}>{task.description}</p>
      
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
          {!task.completed ? (
            <>
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
            </>
          ) : (
            <div className="flex items-center">
              <div className="text-xs text-gray-400 flex items-center mr-2">
                <Check className="w-3 h-3 mr-1 text-green-500" />
                Completed {task.completedAt && formatDistanceToNow(new Date(task.completedAt), { addSuffix: true })}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 rounded-full w-6 h-6 p-0 ml-2"
                onClick={() => uncompleteTask(task.id)}
                title="Undo completion"
              >
                <Undo className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
