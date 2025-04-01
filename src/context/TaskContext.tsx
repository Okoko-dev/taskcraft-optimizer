
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
  estimatedDuration?: number; // Duration in minutes
  lastWorkedOn?: Date;
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

export type ScheduledTask = { 
  task: Task; 
  timeSlot: string;
  startTime: string;
  endTime: string;
  date: Date;
};

type UserPreferences = {
  preferredStudyTime: 'morning' | 'afternoon' | 'evening' | 'night';
  maxTasksPerDay: number;
  breakDuration: number; // in minutes
  studySessionDuration: number; // in minutes
};

type TaskContextType = {
  tasks: Task[];
  schedules: ScheduleTemplate[];
  currentSchedule: ScheduleTemplate | null;
  scheduledTasks: ScheduledTask[];
  points: number;
  userPreferences: UserPreferences;
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'completedAt'>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  addSchedule: (schedule: Omit<ScheduleTemplate, 'id'>) => void;
  setCurrentSchedule: (id: string) => void;
  getTodaysTasks: () => Task[];
  getTasksByDate: (date: Date) => Task[];
  getCompletedTasks: () => Task[];
  updateUserPreferences: (prefs: Partial<UserPreferences>) => void;
  rescheduleAllTasks: () => void;
};

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  schedules: [],
  currentSchedule: null,
  scheduledTasks: [],
  points: 0,
  userPreferences: {
    preferredStudyTime: 'afternoon',
    maxTasksPerDay: 5,
    breakDuration: 15,
    studySessionDuration: 45,
  },
  addTask: () => {},
  completeTask: () => {},
  deleteTask: () => {},
  updateTask: () => {},
  addSchedule: () => {},
  setCurrentSchedule: () => {},
  getTodaysTasks: () => [],
  getTasksByDate: () => [],
  getCompletedTasks: () => [],
  updateUserPreferences: () => {},
  rescheduleAllTasks: () => {},
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
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [points, setPoints] = useState<number>(155);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    preferredStudyTime: 'afternoon',
    maxTasksPerDay: 5,
    breakDuration: 15,
    studySessionDuration: 45,
  });

  // Load tasks from localStorage on initial load
  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem('taskace_tasks');
      const storedSchedules = localStorage.getItem('taskace_schedules');
      const storedPoints = localStorage.getItem('taskace_points');
      const storedPreferences = localStorage.getItem('taskace_preferences');
      
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        // Convert string dates back to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          deadline: new Date(task.deadline),
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          lastWorkedOn: task.lastWorkedOn ? new Date(task.lastWorkedOn) : undefined,
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

      if (storedPreferences) {
        setUserPreferences(JSON.parse(storedPreferences));
      }
      
      // Schedule tasks based on availability
      scheduleTasksBasedOnAI();
    }
  }, [user]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (user && tasks.length > 0) {
      localStorage.setItem('taskace_tasks', JSON.stringify(tasks));
      scheduleTasksBasedOnAI();
    }
  }, [tasks, user]);
  
  // Save schedules to localStorage whenever they change
  useEffect(() => {
    if (user && schedules.length > 0) {
      localStorage.setItem('taskace_schedules', JSON.stringify(schedules));
      scheduleTasksBasedOnAI();
    }
  }, [schedules, user]);
  
  // Save points to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('taskace_points', JSON.stringify(points));
    }
  }, [points, user]);

  // Save user preferences to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('taskace_preferences', JSON.stringify(userPreferences));
      scheduleTasksBasedOnAI();
    }
  }, [userPreferences, user]);

  // AI algorithm to schedule tasks based on availability
  const scheduleTasksBasedOnAI = () => {
    if (!currentSchedule) return;
    
    // Filter incomplete tasks
    const incompleteTasks = tasks.filter(task => !task.completed);
    
    // Sort tasks by a weighted score based on multiple factors
    const sortedTasks = [...incompleteTasks].sort((a, b) => {
      // Calculate score based on priority
      const priorityScore = (priority: TaskPriority) => {
        const priorityValues = { High: 10, Medium: 5, Low: 1 };
        return priorityValues[priority];
      };
      
      // Calculate score based on deadline proximity
      const deadlineScore = (deadline: Date) => {
        const daysUntilDeadline = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        // Higher score for closer deadlines (max 10 points)
        return Math.min(10, Math.max(0, 10 - daysUntilDeadline));
      };
      
      // Calculate score based on category (education tasks might be prioritized)
      const categoryScore = (category: TaskCategory) => {
        return category === 'Education' ? 3 : (category === 'Personal' ? 2 : 1);
      };
      
      // Optional: Consider estimated duration (if available)
      const durationScore = (task: Task) => {
        // Tasks with known duration get a small bonus
        return task.estimatedDuration ? 1 : 0;
      };
      
      // Calculate total weighted score
      const scoreA = (priorityScore(a.priority) * 3) + 
                    (deadlineScore(a.deadline) * 2) + 
                    categoryScore(a.category) +
                    durationScore(a);
                    
      const scoreB = (priorityScore(b.priority) * 3) + 
                    (deadlineScore(b.deadline) * 2) + 
                    categoryScore(b.category) +
                    durationScore(b);
      
      // Sort by higher score first
      return scoreB - scoreA;
    });
    
    // Find available time slots from the schedule
    const availableSlots = currentSchedule.scheduleItems.filter(
      item => item.activity.includes('Free Time') || item.activity.includes('Work/Study')
    );
    
    // Calculate today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate time in minutes for a given time string (e.g., "14:30" → 870 minutes)
    const timeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    // Convert minutes back to time string (e.g., 870 → "14:30")
    const minutesToTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };
    
    // Determine available slots for each day over the next week
    const scheduled: ScheduledTask[] = [];
    
    // Plan for the next 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);
      
      // Skip if we've already scheduled the maximum tasks for this day
      const tasksForThisDay = scheduled.filter(
        s => s.date.toDateString() === currentDate.toDateString()
      ).length;
      
      if (tasksForThisDay >= userPreferences.maxTasksPerDay) {
        continue;
      }
      
      // Clone the available slots for this day
      const daySlots = JSON.parse(JSON.stringify(availableSlots));
      
      // Sort slots based on preferred study time
      daySlots.sort((a: ScheduleItem, b: ScheduleItem) => {
        const timeA = timeToMinutes(a.startTime);
        const timeB = timeToMinutes(b.startTime);
        
        // Define time ranges
        const isMorning = (t: number) => t >= 5 * 60 && t < 12 * 60;
        const isAfternoon = (t: number) => t >= 12 * 60 && t < 17 * 60;
        const isEvening = (t: number) => t >= 17 * 60 && t < 22 * 60;
        const isNight = (t: number) => t >= 22 * 60 || t < 5 * 60;
        
        // Score based on preferred time
        const getTimePreferenceScore = (time: number) => {
          switch (userPreferences.preferredStudyTime) {
            case 'morning': return isMorning(time) ? 3 : isAfternoon(time) ? 2 : isEvening(time) ? 1 : 0;
            case 'afternoon': return isAfternoon(time) ? 3 : isEvening(time) ? 2 : isMorning(time) ? 1 : 0;
            case 'evening': return isEvening(time) ? 3 : isAfternoon(time) ? 2 : isMorning(time) ? 1 : 0;
            case 'night': return isNight(time) ? 3 : isEvening(time) ? 2 : isAfternoon(time) ? 1 : 0;
            default: return 0;
          }
        };
        
        return getTimePreferenceScore(timeB) - getTimePreferenceScore(timeA);
      });
      
      // For each available slot in the day
      for (const slot of daySlots) {
        // Skip if we've already scheduled the maximum tasks for this day
        if (scheduled.filter(s => s.date.toDateString() === currentDate.toDateString()).length 
            >= userPreferences.maxTasksPerDay) {
          break;
        }
        
        // Calculate slot duration in minutes
        const slotStart = timeToMinutes(slot.startTime);
        const slotEnd = timeToMinutes(slot.endTime);
        const slotDuration = slotEnd - slotStart;
        
        // Get remaining tasks that still need scheduling
        const remainingTasks = sortedTasks.filter(
          task => !scheduled.some(st => st.task.id === task.id)
        );
        
        if (remainingTasks.length === 0) {
          break;
        }
        
        // Try to fit tasks into this time slot with appropriate breaks
        let currentTime = slotStart;
        
        while (currentTime < slotEnd && remainingTasks.length > 0) {
          const nextTask = remainingTasks[0];
          
          // Determine task duration (use estimated or default to study session duration)
          const taskDuration = nextTask.estimatedDuration || userPreferences.studySessionDuration;
          
          // Check if task fits in remaining time
          if (currentTime + taskDuration <= slotEnd) {
            // Schedule this task
            const taskStartTime = minutesToTime(currentTime);
            const taskEndTime = minutesToTime(currentTime + taskDuration);
            
            scheduled.push({
              task: nextTask,
              timeSlot: `${taskStartTime} - ${taskEndTime}`,
              startTime: taskStartTime,
              endTime: taskEndTime,
              date: new Date(currentDate),
            });
            
            // Remove this task from consideration
            sortedTasks.splice(sortedTasks.findIndex(t => t.id === nextTask.id), 1);
            
            // Move time forward and add a break
            currentTime += taskDuration + userPreferences.breakDuration;
          } else {
            // Can't fit any more tasks in this slot
            break;
          }
        }
      }
    }
    
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
    toast.message("AI has rescheduled your tasks based on priorities");
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

  const updateTask = (id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, ...taskData } 
          : task
      )
    );
    toast.success("Task updated successfully!");
    toast.message("AI has rescheduled your tasks based on new information");
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
      scheduleTasksBasedOnAI();
      toast.success(`Switched to "${schedule.name}" schedule`);
      toast.message("AI has rescheduled your tasks according to the new schedule");
    }
  };

  const updateUserPreferences = (prefs: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...prefs }));
    toast.success("Preferences updated!");
    scheduleTasksBasedOnAI();
  };

  const rescheduleAllTasks = () => {
    scheduleTasksBasedOnAI();
    toast.success("AI has rescheduled all tasks");
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
        userPreferences,
        addTask,
        completeTask,
        deleteTask,
        updateTask,
        addSchedule,
        setCurrentSchedule: setActiveSchedule,
        getTodaysTasks,
        getTasksByDate,
        getCompletedTasks,
        updateUserPreferences,
        rescheduleAllTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
