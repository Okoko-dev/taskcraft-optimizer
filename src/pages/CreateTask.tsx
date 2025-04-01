
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskManager, TaskCategory, TaskPriority } from '@/context/TaskContext';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const CreateTask = () => {
  const navigate = useNavigate();
  const { addTask } = useTaskManager();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Education');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const categories: TaskCategory[] = [
    'Education', 
    'Personal', 
    'Household', 
    'Academic Tasks', 
    'Personal Development', 
    'Daily Responsibilities', 
    'Life Management', 
    'Rewards', 
    'Breaks'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error("Please enter a task title");
      return;
    }
    
    addTask({
      title,
      description,
      category,
      priority,
      deadline,
    });
    
    navigate('/tasks');
  };

  return (
    <div className="min-h-screen bg-taskace-dark text-white pb-24">
      <Header />
      
      <main className="p-4 max-w-lg mx-auto">
        <div className="flex items-start mb-6">
          <h1 className="text-3xl font-bold">
            <span className="text-primary">CRE</span>
            <span className="text-white">ATE TASK</span>
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-primary text-xl mb-2">Title</label>
            <Input
              className="bg-white/10 border-gray-700 text-white"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-primary text-xl mb-2">Category</label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as TaskCategory)}
            >
              <SelectTrigger className="bg-white/10 border-gray-700 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-taskace-dark border-gray-700 max-h-[240px]">
                <ScrollArea className="max-h-[200px]">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-white hover:bg-gray-800">
                      {cat}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-primary text-xl mb-2">Priority</label>
            <Select 
              value={priority} 
              onValueChange={(value) => setPriority(value as TaskPriority)}
            >
              <SelectTrigger className="bg-white/10 border-gray-700 text-white">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-taskace-dark border-gray-700">
                <SelectItem value="High" className="text-white hover:bg-gray-800">High</SelectItem>
                <SelectItem value="Medium" className="text-white hover:bg-gray-800">Medium</SelectItem>
                <SelectItem value="Low" className="text-white hover:bg-gray-800">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-primary text-xl mb-2">Deadline</label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-gray-700 text-white justify-start"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, 'PP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-taskace-dark border-gray-700">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={(date) => {
                    setDeadline(date || new Date());
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                  className="bg-taskace-dark text-white"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="block text-primary text-xl mb-2">Description</label>
            <Textarea
              className="bg-white/10 border-gray-700 text-white min-h-[100px]"
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-dark text-white"
          >
            Add task
          </Button>
        </form>
      </main>
      
      <NavBar />
    </div>
  );
};

export default CreateTask;
