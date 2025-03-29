
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';

export type TaskCategory = 'Education' | 'Personal' | 'Household';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export type Task = {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  deadline: Date;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
};

export type ScheduleTemplate = {
  id: string;
  name: string;
  scheduleItems: ScheduleItem[];
};

export type ScheduleItem = {
  id: string;
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  activity: string;
};

type TaskContextType = {
  tasks: Task[];
  schedules: ScheduleTemplate[];
  currentSchedule: ScheduleTemplate | null;
  scheduledTasks: { task: Task; timeSlot: string }[];
  points: number;
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'completedAt'>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addSchedule: (schedule: Omit<ScheduleTemplate, 'id'>) => void;
  setCurrentSchedule: (id: string) => void;
  getTodaysTasks: () => Task[];
  getTasksByDate: (date: Date) => Task[];
  getCompletedTasks: () => Task[];
};

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  schedules: [],
  currentSchedule: null,
  scheduledTasks: [],
  points: 0,
  addTask: () => {},
  completeTask: () => {},
  deleteTask: () => {},
  addSchedule: () => {},
  setCurrentSchedule: () => {},
  getTodaysTasks: () => [],
  getTasksByDate: () => [],
  getCompletedTasks: () => [],
});

export const useTaskManager = () => useContext(TaskContext);

// Sample initial data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design Homepage',
    description: 'Create wireframe for new website homepage',
    category: 'Education',
    priority: 'High',
    deadline: new Date(2025, 10, 23),
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Sketsa Ilustrasi',
    description: 'Create sketches for the new project',
    category: 'Education',
    priority: 'Medium',
    deadline: new Date(2025, 10, 15),
    completed: true,
    createdAt: new Date(),
    completedAt: new Date(),
  },
  {
    id: '3',
    title: 'Onboarding Design',
    description: 'Design onboarding screens for the app',
    category: 'Education',
    priority: 'High',
    deadline: new Date(2025, 10, 15),
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '4',
    title: 'Create Wireframe',
    description: 'Design wireframes for the dashboard',
    category: 'Education',
    priority: 'Medium',
    deadline: new Date(),
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '5',
    title: 'Slack Logo Design',
    description: 'Redesign the Slack logo',
    category: 'Personal',
    priority: 'Low',
    deadline: new Date(),
    completed: false,
    createdAt: new Date(),
  },
];

const initialSchedules: ScheduleTemplate[] = [
  {
    id: '1',
    name: 'Working Day',
    scheduleItems: [
      { id: '1', startTime: '08:00', endTime: '09:30', activity: 'Morning Routine' },
      { id: '2', startTime: '09:30', endTime: '12:00', activity: 'Work/Study' },
      { id: '3', startTime: '12:00', endTime: '13:00', activity: 'Lunch Break' },
      { id: '4', startTime: '13:00', endTime: '17:00', activity: 'Work/Study' },
      { id: '5', startTime: '17:00', endTime: '18:00', activity: 'Exercise' },
      { id: '6', startTime: '18:00', endTime: '19:00', activity: 'Dinner' },
      { id: '7', startTime: '19:00', endTime: '22:00', activity: 'Free Time' },
    ],
  },
  {
    id: '2',
    name: 'Holiday',
    scheduleItems: [
      { id: '1', startTime: '09:00', endTime: '10:00', activity: 'Morning Routine' },
      { id: '2', startTime: '10:00', endTime: '12:00', activity: 'Free Time' },
      { id: '3', startTime: '12:00', endTime: '13:00', activity: 'Lunch' },
      { id: '4', startTime: '13:00', endTime: '18:00', activity: 'Free Time' },
      { id: '5', startTime: '18:00', endTime: '19:00', activity: 'Dinner' },
      { id: '6', startTime: '19:00', endTime: '23:00', activity: 'Free Time' },
    ],
  },
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedules, setSchedules] = useState<ScheduleTemplate[]>(initialSchedules);
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleTemplate | null>(initialSchedules[0]);
  const [scheduledTasks, setScheduledTasks] = useState<{ task: Task; timeSlot: string }[]>([]);
  const [points, setPoints] = useState<number>(155);

  // Load tasks from localStorage on initial load
  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem('taskace_tasks');
      const storedSchedules = localStorage.getItem('taskace_schedules');
      const storedPoints = localStorage.getItem('taskace_points');
      
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        // Convert string dates back to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          deadline: new Date(task.deadline),
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        }));
        setTasks(tasksWithDates);
      } else {
        // Use initial data if no stored tasks
        setTasks(initialTasks);
      }
      
      if (storedSchedules) {
        setSchedules(JSON.parse(storedSchedules));
        setCurrentSchedule(JSON.parse(storedSchedules)[0]);
      }
      
      if (storedPoints) {
        setPoints(JSON.parse(storedPoints));
      }
      
      // Schedule tasks based on availability
      scheduleTasksBasedOnAvailability();
    }
  }, [user]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (user && tasks.length > 0) {
      localStorage.setItem('taskace_tasks', JSON.stringify(tasks));
      scheduleTasksBasedOnAvailability();
    }
  }, [tasks, user]);
  
  // Save schedules to localStorage whenever they change
  useEffect(() => {
    if (user && schedules.length > 0) {
      localStorage.setItem('taskace_schedules', JSON.stringify(schedules));
    }
  }, [schedules, user]);
  
  // Save points to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('taskace_points', JSON.stringify(points));
    }
  }, [points, user]);

  // AI algorithm to schedule tasks based on availability
  const scheduleTasksBasedOnAvailability = () => {
    if (!currentSchedule) return;
    
    // Filter incomplete tasks
    const incompleteTasks = tasks.filter(task => !task.completed);
    
    // Sort tasks by priority and deadline
    const sortedTasks = [...incompleteTasks].sort((a, b) => {
      // First sort by priority
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      const priorityA = priorityOrder[a.priority];
      const priorityB = priorityOrder[b.priority];
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      
      // Then sort by deadline
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
    
    // Find available time slots from the schedule
    const availableSlots = currentSchedule.scheduleItems.filter(
      item => item.activity.includes('Free Time') || item.activity.includes('Work/Study')
    );
    
    // Assign tasks to available slots
    const scheduled: { task: Task; timeSlot: string }[] = [];
    
    // Simple algorithm: assign tasks to slots (in real app would be more sophisticated)
    sortedTasks.forEach((task, index) => {
      if (index < availableSlots.length) {
        const slot = availableSlots[index];
        scheduled.push({
          task,
          timeSlot: `${slot.startTime} - ${slot.endTime}`,
        });
      }
    });
    
    setScheduledTasks(scheduled);
  };

  const addTask = (task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'completedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date(),
    };
    
    setTasks(prev => [...prev, newTask]);
    toast.success("Task added successfully!");
  };

  const completeTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, completed: true, completedAt: new Date() } 
          : task
      )
    );
    
    // Add points for completing a task
    setPoints(prev => prev + 10);
    toast.success("Task completed! +10 points");
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task deleted successfully!");
  };

  const addSchedule = (schedule: Omit<ScheduleTemplate, 'id'>) => {
    const newSchedule: ScheduleTemplate = {
      ...schedule,
      id: Date.now().toString(),
    };
    
    setSchedules(prev => [...prev, newSchedule]);
    toast.success("Schedule template added!");
  };

  const setActiveSchedule = (id: string) => {
    const schedule = schedules.find(s => s.id === id);
    if (schedule) {
      setCurrentSchedule(schedule);
      scheduleTasksBasedOnAvailability();
    }
  };

  const getTodaysTasks = (): Task[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });
  };

  const getTasksByDate = (date: Date): Task[] => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (task.completedAt) {
        const completedDate = new Date(task.completedAt);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === targetDate.getTime();
      }
      return false;
    });
  };

  const getCompletedTasks = (): Task[] => {
    return tasks.filter(task => task.completed);
  };

  return (
    <TaskContext.Provider 
      value={{
        tasks,
        schedules,
        currentSchedule,
        scheduledTasks,
        points,
        addTask,
        completeTask,
        deleteTask,
        addSchedule,
        setCurrentSchedule: setActiveSchedule,
        getTodaysTasks,
        getTasksByDate,
        getCompletedTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
