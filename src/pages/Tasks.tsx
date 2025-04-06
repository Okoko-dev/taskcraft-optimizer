
import React, { useState } from 'react';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import TaskCard from '@/components/TaskCard';
import { useTaskManager, TaskCategory } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";

const Tasks = () => {
  const navigate = useNavigate();
  const { tasks } = useTaskManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | TaskCategory>('All');
  
  const categories: ('All' | TaskCategory)[] = [
    'All', 
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
  
  // Filter tasks based on search term, active category, display completed tasks for 24 hours
  const filteredTasks = tasks
    .filter(task => {
      // Show deleted tasks that still have the 30-second undo window
      if (task.deleted) {
        if (task.deletedAt) {
          const now = new Date();
          const deletedTime = new Date(task.deletedAt);
          const diffInSeconds = (now.getTime() - deletedTime.getTime()) / 1000;
          return diffInSeconds <= 30; // Show deleted tasks during the 30-second undo period
        }
        return false;
      }
      return true;
    })
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || task.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort completed tasks to the bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      
      // Sort by priority for non-completed tasks
      if (!a.completed && !b.completed) {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      // Sort completed tasks by completedAt (most recent first)
      if (a.completed && b.completed && a.completedAt && b.completedAt) {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      }
      
      return 0;
    });

  return (
    <div className="min-h-screen bg-taskace-dark text-white pb-24">
      <Header />
      
      <main className="p-4 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Find your tasks</h1>
          <div className="relative">
            <Button 
              size="icon"
              variant="outline"
              className="rounded-full bg-primary text-white hover:bg-primary-dark"
              onClick={() => navigate('/create-task')}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 bg-white/10 border-gray-700 text-white placeholder:text-gray-400"
            placeholder="Search your tasks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <ScrollArea className="mb-6 pb-2 h-16">
          <div className="flex space-x-2 w-max">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                className={
                  activeCategory === cat 
                    ? 'bg-primary text-white hover:bg-primary-dark' 
                    : 'bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800'
                }
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </ScrollArea>
        
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p className="mb-2">No tasks found</p>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10"
                onClick={() => navigate('/create-task')}
              >
                <Plus className="mr-2 h-4 w-4" /> Add a new task
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <NavBar />
    </div>
  );
};

export default Tasks;
