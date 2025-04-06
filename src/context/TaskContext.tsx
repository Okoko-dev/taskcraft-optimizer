import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';

export type TaskCategory = 'Education' | 'Personal' | 'Household' | 'Academic Tasks' | 'Personal Development' | 'Daily Responsibilities' | 'Life Management' | 'Rewards' | 'Breaks';
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
  deleted?: boolean;
  deletedAt?: Date;
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
  uncompleteTask: (id: string) => void;
  deleteTask: (id: string) => void;
  restoreTask: (id: string) => void;
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
  uncompleteTask: () => {},
  deleteTask: () => {},
  restoreTask: () => {},
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

  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem('taskace_tasks');
      const storedSchedules = localStorage.getItem('taskace_schedules');
      const storedPoints = localStorage.getItem('taskace_points');
      const storedPreferences = localStorage.getItem('taskace_preferences');
      
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          deadline: new Date(task.deadline),
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          lastWorkedOn: task.lastWorkedOn ? new Date(task.lastWorkedOn) : undefined,
          deleted: task.deleted,
          deletedAt: task.deletedAt ? new Date(task.deletedAt) : undefined,
        }));
        setTasks(tasksWithDates);
      } else {
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
      
      scheduleTasksBasedOnAI();
    }
  }, [user]);

  useEffect(() => {
    if (user && tasks.length > 0) {
      localStorage.setItem('taskace_tasks', JSON.stringify(tasks));
      scheduleTasksBasedOnAI();
    }
  }, [tasks, user]);
  
  useEffect(() => {
    if (user && schedules.length > 0) {
      localStorage.setItem('taskace_schedules', JSON.stringify(schedules));
      scheduleTasksBasedOnAI();
    }
  }, [schedules, user]);
  
  useEffect(() => {
    if (user) {
      localStorage.setItem('taskace_points', JSON.stringify(points));
    }
  }, [points, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('taskace_preferences', JSON.stringify(userPreferences));
      scheduleTasksBasedOnAI();
    }
  }, [userPreferences, user]);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      if (user) {
        setTasks(prevTasks => 
          prevTasks.filter(task => {
            if (!task.completed) return true;
            
            if (task.completedAt) {
              const completedTime = new Date(task.completedAt);
              const now = new Date();
              const diffInHours = (now.getTime() - completedTime.getTime()) / (1000 * 3600);
              return diffInHours <= 24;
            }
            
            return true;
          })
        );
      }
    }, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(cleanupInterval);
  }, [user]);

  const scheduleTasksBasedOnAI = () => {
    if (!currentSchedule) return;
    
    const incompleteTasks = tasks.filter(task => !task.completed);
    
    const sortedTasks = [...incompleteTasks].sort((a, b) => {
      const priorityScore = (priority: TaskPriority) => {
        const priorityValues = { High: 10, Medium: 5, Low: 1 };
        return priorityValues[priority];
      };
      
      const deadlineScore = (deadline: Date) => {
        const daysUntilDeadline = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        return Math.min(10, Math.max(0, 10 - daysUntilDeadline));
      };
      
      const categoryScore = (category: TaskCategory) => {
        const categoryValues: Record<TaskCategory, number> = {
          'Education': 5,
          'Personal': 3,
          'Household': 2,
          'Academic Tasks': 5,
          'Personal Development': 4,
          'Daily Responsibilities': 4, 
          'Life Management': 3,
          'Rewards': 1,
          'Breaks': 1
        };
        return categoryValues[category] || 1;
      };
      
      const durationScore = (task: Task) => {
        return task.estimatedDuration ? 1 : 0;
      };
      
      const scoreA = (priorityScore(a.priority) * 3) + 
                    (deadlineScore(a.deadline) * 2) + 
                    categoryScore(a.category) +
                    durationScore(a);
                    
      const scoreB = (priorityScore(b.priority) * 3) + 
                    (deadlineScore(b.deadline) * 2) + 
                    categoryScore(b.category) +
                    durationScore(b);
      
      return scoreB - scoreA;
    });
    
    const availableSlots = currentSchedule.scheduleItems.filter(
      item => item.activity.includes('Free Time') || item.activity.includes('Work/Study')
    );
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const timeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const minutesToTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };
    
    const formatTimeWithAmPm = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };
    
    const scheduled: ScheduledTask[] = [];
    
    const scheduledTaskIds = new Set<string>();
    
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);
      
      const daySlots = JSON.parse(JSON.stringify(availableSlots));
      
      daySlots.sort((a: ScheduleItem, b: ScheduleItem) => {
        const timeA = timeToMinutes(a.startTime);
        const timeB = timeToMinutes(b.startTime);
        
        const isMorning = (t: number) => t >= 5 * 60 && t < 12 * 60;
        const isAfternoon = (t: number) => t >= 12 * 60 && t < 17 * 60;
        const isEvening = (t: number) => t >= 17 * 60 && t < 22 * 60;
        const isNight = (t: number) => t >= 22 * 60 || t < 5 * 60;
        
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
      
      for (const slot of daySlots) {
        const slotStart = timeToMinutes(slot.startTime);
        const slotEnd = timeToMinutes(slot.endTime);
        const slotDuration = slotEnd - slotStart;
        
        const suitableTasks = sortedTasks.filter(task => {
          if (scheduledTaskIds.has(task.id)) return false;
          
          const isLateNight = slotStart >= 22 * 60 || slotStart < 6 * 60;
          const isWorkRelated = ['Education', 'Academic Tasks'].includes(task.category);
          
          if (isLateNight && isWorkRelated) return false;
          
          const isShortSlot = slotDuration <= 60;
          const isBreakOrReward = ['Breaks', 'Rewards'].includes(task.category);
          
          if (isShortSlot && isBreakOrReward) return true;
          if (isBreakOrReward && !isShortSlot) return false;
          
          const isMorning = slotStart >= 6 * 60 && slotStart < 12 * 60;
          const isDailyResponsibility = task.category === 'Daily Responsibilities';
          
          if (isDailyResponsibility && isMorning) return true;
          
          return true;
        });
        
        if (suitableTasks.length === 0) continue;
        
        let currentTime = slotStart;
        
        while (currentTime < slotEnd && suitableTasks.length > 0) {
          const nextTask = suitableTasks[0];
          
          let estimatedDuration = nextTask.estimatedDuration || userPreferences.studySessionDuration;
          
          if (nextTask.category === 'Breaks') {
            estimatedDuration = Math.min(30, estimatedDuration);
          } else if (nextTask.category === 'Academic Tasks' || nextTask.category === 'Education') {
            estimatedDuration = Math.max(estimatedDuration, 45);
          }
          
          if (nextTask.priority === 'High') {
            estimatedDuration = Math.max(estimatedDuration, 50);
          } else if (nextTask.priority === 'Low') {
            estimatedDuration = Math.min(estimatedDuration, 40);
          }
          
          if (currentTime + estimatedDuration <= slotEnd) {
            const taskStartTime = minutesToTime(currentTime);
            const taskEndTime = minutesToTime(currentTime + estimatedDuration);
            
            scheduled.push({
              task: nextTask,
              timeSlot: `${formatTimeWithAmPm(taskStartTime)} - ${formatTimeWithAmPm(taskEndTime)}`,
              startTime: taskStartTime,
              endTime: taskEndTime,
              date: new Date(currentDate),
            });
            
            scheduledTaskIds.add(nextTask.id);
            
            suitableTasks.shift();
            
            currentTime += estimatedDuration + userPreferences.breakDuration;
          } else {
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
    
    setPoints(prev => prev + 10);
    toast.success("Task completed! +10 points");
  };

  const uncompleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    
    if (task && task.completed && task.completedAt) {
      const now = new Date();
      const completedTime = new Date(task.completedAt);
      const diffInSeconds = Math.floor((now.getTime() - completedTime.getTime()) / 1000);
      
      if (diffInSeconds <= 30) {
        setTasks(prev => 
          prev.map(t => 
            t.id === id 
              ? { ...t, completed: false, completedAt: undefined } 
              : t
          )
        );
        
        setPoints(prev => prev - 10);
        toast.info("Task marked as incomplete");
      } else {
        toast.error("Can only undo within 30 seconds of completion");
      }
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, deleted: true, deletedAt: new Date() } 
          : task
      )
    );
    
    setTimeout(() => {
      setTasks(prev => {
        const task = prev.find(t => t.id === id);
        
        if (task && task.deleted === false) return prev;
        
        return prev.filter(task => task.id !== id);
      });
    }, 30000);
  };

  const restoreTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, deleted: false, deletedAt: undefined } 
          : task
      )
    );
    toast.success("Task restored successfully!");
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
      if (task.deleted) return false;
      
      const taskDate = new Date(task.deadline);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });
  };

  const getTasksByDate = (date: Date): Task[] => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (task.deleted) return false;
      
      if (task.completedAt) {
        const completedDate = new Date(task.completedAt);
        completedDate.setHours(0, 0, 0, 0);
        
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        
        if (completedDate < twoMonthsAgo) {
          return false;
        }
        
        return completedDate.getTime() === targetDate.getTime();
      }
      return false;
    });
  };

  const getCompletedTasks = (): Task[] => {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    return tasks.filter(task => 
      task.completed && 
      !task.deleted && 
      task.completedAt && 
      new Date(task.completedAt) >= twoMonthsAgo
    );
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
        uncompleteTask,
        deleteTask,
        restoreTask,
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
