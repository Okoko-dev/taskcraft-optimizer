import React, { useState } from 'react';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import { useTaskManager } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Clock, MoreHorizontal, Edit, Trash, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from "sonner";

const Schedules = () => {
  const { schedules, currentSchedule, setCurrentSchedule, addSchedule, scheduledTasks } = useTaskManager();
  
  const [activeTab, setActiveTab] = useState("today");
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditScheduleOpen, setIsEditScheduleOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  // New schedule state
  const [newScheduleName, setNewScheduleName] = useState("");
  const [scheduleItems, setScheduleItems] = useState<{ id: string; startTime: string; endTime: string; activity: string }[]>([
    { id: '1', startTime: '08:00', endTime: '09:00', activity: '' }
  ]);

  // New task state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStartTime, setNewTaskStartTime] = useState("08:00");
  const [newTaskEndTime, setNewTaskEndTime] = useState("09:00");

  const handleAddScheduleItem = () => {
    const newId = String(scheduleItems.length + 1);
    const lastItem = scheduleItems[scheduleItems.length - 1];
    
    setScheduleItems([
      ...scheduleItems,
      { 
        id: newId, 
        startTime: lastItem.endTime, 
        endTime: incrementTime(lastItem.endTime), 
        activity: '' 
      }
    ]);
  };

  const incrementTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    let newHours = hours;
    let newMinutes = minutes + 60;
    
    if (newMinutes >= 60) {
      newHours += Math.floor(newMinutes / 60);
      newMinutes %= 60;
    }
    
    if (newHours >= 24) {
      newHours %= 24;
    }
    
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };

  const handleScheduleItemChange = (id: string, field: 'startTime' | 'endTime' | 'activity', value: string) => {
    setScheduleItems(
      scheduleItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCreateSchedule = () => {
    if (!newScheduleName.trim()) {
      toast.error("Please enter a schedule name");
      return;
    }
    
    if (scheduleItems.some(item => !item.activity.trim())) {
      toast.error("Please fill in all activities");
      return;
    }
    
    const newSchedule = {
      name: newScheduleName,
      scheduleItems: scheduleItems,
    };
    
    addSchedule(newSchedule);
    setNewScheduleName("");
    setScheduleItems([{ id: '1', startTime: '08:00', endTime: '09:00', activity: '' }]);
    setIsAddScheduleOpen(false);
    toast.success("Schedule created successfully!");
  };

  const handleEditSchedule = () => {
    // Implementation for editing schedule would go here
    setIsEditScheduleOpen(false);
    toast.success("Schedule updated successfully!");
  };

  const handleDeleteScheduleItem = (id: string) => {
    if (scheduleItems.length <= 1) {
      toast.error("Schedule must have at least one item");
      return;
    }
    
    setScheduleItems(scheduleItems.filter(item => item.id !== id));
  };

  const handleScheduleSelect = (scheduleId: string) => {
    setCurrentSchedule(scheduleId);
  };

  const handleScheduleOptionsClick = (schedule: any) => {
    setSelectedSchedule(schedule);
    setIsEditScheduleOpen(true);
    
    // Pre-fill the edit form with selected schedule data
    setNewScheduleName(schedule.name);
    setScheduleItems(schedule.scheduleItems);
  };

  return (
    <div className="min-h-screen bg-[#1F2A39] text-white pb-24">
      <Header />
      
      <main className="p-4 max-w-lg mx-auto">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-[#41E0B5] mb-6">S<span className="text-white">chedule</span></h1>
        </div>
        
        <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full grid grid-cols-2 bg-[#283445]">
            <TabsTrigger value="today" className="text-white data-[state=active]:bg-[#41E0B5] data-[state=active]:text-[#1F2A39]">
              Today Schedule
            </TabsTrigger>
            <TabsTrigger value="all" className="text-white data-[state=active]:bg-[#41E0B5] data-[state=active]:text-[#1F2A39]">
              All Schedules
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="mt-4 space-y-4">
            {currentSchedule ? (
              <>
                <h2 className="text-lg font-semibold mb-3">Current Schedule: {currentSchedule.name}</h2>
                <div className="space-y-4">
                  {currentSchedule.scheduleItems.map(item => (
                    <div key={item.id} className="bg-[#283445] p-4 rounded-lg border border-[#3D4A5C]">
                      <div className="flex items-center">
                        <div className="mr-4 text-sm text-gray-300">
                          {item.startTime} - {item.endTime}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.activity}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-lg font-semibold mt-6 mb-3">Scheduled Tasks</h3>
                <div className="space-y-4">
                  {scheduledTasks.map((scheduledTask, index) => (
                    <div key={index} className="bg-[#283445] p-4 rounded-lg border border-[#3D4A5C]">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{scheduledTask.task.title}</h3>
                        <span className="text-xs bg-[#41E0B5] text-[#1F2A39] px-2 py-1 rounded-full">
                          {scheduledTask.timeSlot}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{scheduledTask.task.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-opacity-20 bg-[#C9E6FA] text-[#C9E6FA] px-2 py-1 rounded-full">
                          {scheduledTask.task.category}
                        </span>
                        <span className="text-xs text-gray-400">{scheduledTask.task.priority} Priority</span>
                      </div>
                    </div>
                  ))}
                  
                  {scheduledTasks.length === 0 && (
                    <div className="text-center text-gray-400 py-4">
                      No tasks scheduled. Add some tasks to get started.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 py-8">
                No schedule selected. Please select or create a schedule.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-4">
            <div className="space-y-4">
              {schedules.map(schedule => (
                <div 
                  key={schedule.id} 
                  className={`p-4 rounded-lg ${currentSchedule?.id === schedule.id ? 'bg-[#41E0B5]/20' : 'bg-[#283445]'} flex justify-between items-center border border-[#3D4A5C]`}
                >
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleScheduleSelect(schedule.id)}
                  >
                    <h3 className="text-lg">{schedule.name}</h3>
                    <p className="text-xs text-gray-400">{schedule.scheduleItems.length} time slots</p>
                  </div>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 bg-[#1F2A39] border-[#3D4A5C] text-white">
                      <div className="space-y-1">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left"
                          onClick={() => handleScheduleOptionsClick(schedule)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Schedule
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left text-[#FB836F] hover:text-[#FB836F] hover:bg-[#FB836F]/10"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Schedule
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
              
              {schedules.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  No schedules created yet. Create your first schedule!
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <div className="fixed right-6 bottom-24">
        <Button 
          className="w-14 h-14 rounded-full bg-[#41E0B5] hover:bg-[#41E0B5]/80 text-[#1F2A39]"
          onClick={() => setIsAddScheduleOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Add Schedule Dialog */}
      <Dialog open={isAddScheduleOpen} onOpenChange={setIsAddScheduleOpen}>
        <DialogContent className="bg-[#1F2A39] text-white border-[#3D4A5C]">
          <DialogHeader>
            <DialogTitle>Create New Schedule</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new daily schedule template.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Schedule Name</label>
              <Input
                placeholder="e.g., Workday, Weekend, Holiday"
                value={newScheduleName}
                onChange={(e) => setNewScheduleName(e.target.value)}
                className="bg-[#283445] border-[#3D4A5C] text-white"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-300">Time Slots</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs border-[#3D4A5C] text-[#41E0B5]"
                  onClick={handleAddScheduleItem}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Time Slot
                </Button>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {scheduleItems.map((item, index) => (
                  <div key={item.id} className="bg-[#283445] p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Slot {index + 1}</span>
                      {scheduleItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-[#FB836F] hover:text-[#FB836F] hover:bg-[#FB836F]/10"
                          onClick={() => handleDeleteScheduleItem(item.id)}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className="w-1/3">
                        <label className="text-xs text-gray-400 mb-1 block">Start</label>
                        <Input
                          type="time"
                          value={item.startTime}
                          onChange={(e) => handleScheduleItemChange(item.id, 'startTime', e.target.value)}
                          className="bg-[#1F2A39] border-[#3D4A5C] text-white h-8 text-sm"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="text-xs text-gray-400 mb-1 block">End</label>
                        <Input
                          type="time"
                          value={item.endTime}
                          onChange={(e) => handleScheduleItemChange(item.id, 'endTime', e.target.value)}
                          className="bg-[#1F2A39] border-[#3D4A5C] text-white h-8 text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">Activity</label>
                        <Input
                          placeholder="Activity"
                          value={item.activity}
                          onChange={(e) => handleScheduleItemChange(item.id, 'activity', e.target.value)}
                          className="bg-[#1F2A39] border-[#3D4A5C] text-white h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddScheduleOpen(false)}
              className="border-[#3D4A5C] text-gray-300 hover:bg-[#283445]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#41E0B5] hover:bg-[#41E0B5]/80 text-[#1F2A39]"
              onClick={handleCreateSchedule}
            >
              Create Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Schedule Dialog */}
      <Dialog open={isEditScheduleOpen} onOpenChange={setIsEditScheduleOpen}>
        <DialogContent className="bg-[#1F2A39] text-white border-[#3D4A5C]">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update your schedule template.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Same form as Add Schedule Dialog but pre-filled with selected schedule data */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Schedule Name</label>
              <Input
                placeholder="e.g., Workday, Weekend, Holiday"
                value={newScheduleName}
                onChange={(e) => setNewScheduleName(e.target.value)}
                className="bg-[#283445] border-[#3D4A5C] text-white"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-300">Time Slots</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs border-[#3D4A5C] text-[#41E0B5]"
                  onClick={handleAddScheduleItem}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Time Slot
                </Button>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {scheduleItems.map((item, index) => (
                  <div key={item.id} className="bg-[#283445] p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Slot {index + 1}</span>
                      {scheduleItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-[#FB836F] hover:text-[#FB836F] hover:bg-[#FB836F]/10"
                          onClick={() => handleDeleteScheduleItem(item.id)}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className="w-1/3">
                        <label className="text-xs text-gray-400 mb-1 block">Start</label>
                        <Input
                          type="time"
                          value={item.startTime}
                          onChange={(e) => handleScheduleItemChange(item.id, 'startTime', e.target.value)}
                          className="bg-[#1F2A39] border-[#3D4A5C] text-white h-8 text-sm"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="text-xs text-gray-400 mb-1 block">End</label>
                        <Input
                          type="time"
                          value={item.endTime}
                          onChange={(e) => handleScheduleItemChange(item.id, 'endTime', e.target.value)}
                          className="bg-[#1F2A39] border-[#3D4A5C] text-white h-8 text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">Activity</label>
                        <Input
                          placeholder="Activity"
                          value={item.activity}
                          onChange={(e) => handleScheduleItemChange(item.id, 'activity', e.target.value)}
                          className="bg-[#1F2A39] border-[#3D4A5C] text-white h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditScheduleOpen(false)}
              className="border-[#3D4A5C] text-gray-300 hover:bg-[#283445]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#41E0B5] hover:bg-[#41E0B5]/80 text-[#1F2A39]"
              onClick={handleEditSchedule}
            >
              Update Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="bg-[#1F2A39] text-white border-[#3D4A5C]">
          <DialogHeader>
            <DialogTitle>Add Task to Schedule</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new task for your schedule.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Task Title</label>
              <Input
                placeholder="e.g., Meeting with Team"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="bg-[#283445] border-[#3D4A5C] text-white"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Description</label>
              <Textarea
                placeholder="Task description..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="bg-[#283445] border-[#3D4A5C] text-white h-20 resize-none"
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="text-sm text-gray-300 mb-1 block">Start Time</label>
                <Input
                  type="time"
                  value={newTaskStartTime}
                  onChange={(e) => setNewTaskStartTime(e.target.value)}
                  className="bg-[#283445] border-[#3D4A5C] text-white"
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm text-gray-300 mb-1 block">End Time</label>
                <Input
                  type="time"
                  value={newTaskEndTime}
                  onChange={(e) => setNewTaskEndTime(e.target.value)}
                  className="bg-[#283445] border-[#3D4A5C] text-white"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddTaskOpen(false)}
              className="border-[#3D4A5C] text-gray-300 hover:bg-[#283445]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#41E0B5] hover:bg-[#41E0B5]/80 text-[#1F2A39]"
              onClick={() => {
                // Implementation for adding task would go here
                setIsAddTaskOpen(false);
                toast.success("Task added successfully!");
              }}
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <NavBar />
    </div>
  );
};

export default Schedules;
