
import React from 'react';
import { Task, useTaskManager } from '@/context/TaskContext';
import { Check, Calendar, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { completeTask, deleteTask } = useTaskManager();
  
  const priorityColors = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-blue-500'
  };
  
  const categoryColors = {
    Education: 'bg-purple-500',
    Personal: 'bg-green-500',
    Household: 'bg-orange-500'
  };
  
  const isTaskDueSoon = () => {
    const today = new Date();
    const deadline = new Date(task.deadline);
    const differenceInDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return differenceInDays <= 2 && !task.completed;
  };

  return (
    <div className={`task-card ${task.completed ? 'opacity-60' : ''} relative overflow-hidden`}>
      {isTaskDueSoon() && (
        <div className="absolute top-0 right-0 bg-red-500 text-xs px-2 py-1 text-white rounded-bl-md">
          Due Soon!
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-semibold ${task.completed ? 'line-through' : ''}`}>
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
          <span className={`text-xs px-2 py-1 rounded-full text-white ${categoryColors[task.category]}`}>
            {task.category}
          </span>
          
          <div className="flex items-center text-xs text-gray-300">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
          </div>
        </div>
        
        {!task.completed ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded-full w-8 h-8 p-0"
            onClick={() => completeTask(task.id)}
          >
            <Check className="w-4 h-4" />
          </Button>
        ) : (
          <span className="text-xs text-primary">Completed</span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
