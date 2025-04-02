
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Save, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  
  // Additional profile fields
  const [age, setAge] = useState('24');
  const [education, setEducation] = useState("Bachelor's in International Studies");
  const [status, setStatus] = useState('Single');
  const [occupation, setOccupation] = useState('Travel Writer');
  const [location, setLocation] = useState('New York City');
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload the file to a server
      // For demo purposes, we'll use FileReader to get a data URL
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ 
      name,
      avatar
    });
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-taskace-dark text-white pb-24">
      <Header />
      
      <main className="max-w-lg mx-auto pb-24 px-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/profile')} className="p-2 mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden group mb-4">
              <Avatar className="w-full h-full">
                <AvatarImage src={avatar} alt="Profile" />
                <AvatarFallback>{name.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleAvatarClick}
              >
                <Camera className="text-white w-6 h-6" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <p className="text-sm text-gray-400 mb-4">Click on the photo to change your profile picture</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                Full Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-taskace-card border-gray-700 focus:border-primary"
              />
            </div>
            
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-400 mb-1">
                Age
              </label>
              <Input
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="bg-taskace-card border-gray-700 focus:border-primary"
              />
            </div>
            
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-400 mb-1">
                Education
              </label>
              <Input
                id="education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="bg-taskace-card border-gray-700 focus:border-primary"
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-1">
                Status
              </label>
              <Input
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-taskace-card border-gray-700 focus:border-primary"
              />
            </div>
            
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-400 mb-1">
                Occupation
              </label>
              <Input
                id="occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="bg-taskace-card border-gray-700 focus:border-primary"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-1">
                Location
              </label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-taskace-card border-gray-700 focus:border-primary"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </form>
      </main>
      
      <NavBar />
    </div>
  );
};

export default EditProfile;
