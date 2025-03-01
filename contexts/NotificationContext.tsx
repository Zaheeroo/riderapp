"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationContextType {
  pendingRequests: number;
  soundEnabled: boolean;
  toggleSound: () => void;
  testSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [pendingRequests, setPendingRequests] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const previousRequestCountRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialize audio element
  useEffect(() => {
    // Create audio element with error handling
    try {
      const audio = new Audio('/notification.mp3');
      
      // Add event listeners for debugging
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        toast({
          title: "Sound Error",
          description: `Could not load sound: ${e.message || 'Unknown error'}`,
          variant: "destructive",
        });
      });
      
      audio.addEventListener('canplaythrough', () => {
        console.log('Audio loaded and can play');
      });
      
      audioRef.current = audio;
      
      // Preload the audio
      audio.load();
      
      console.log('Audio element created with source:', audio.src);
    } catch (error) {
      console.error('Error creating audio element:', error);
    }
    
    // Check if sound notifications were previously disabled
    const savedSoundPreference = localStorage.getItem('contactRequestsSoundEnabled');
    if (savedSoundPreference !== null) {
      setSoundEnabled(savedSoundPreference === 'true');
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Fetch pending contact requests count
  useEffect(() => {
    const fetchPendingRequestsCount = async () => {
      try {
        const response = await fetch('/api/admin/contact-requests/count');
        if (response.ok) {
          const data = await response.json();
          const newCount = data.count || 0;
          
          // If there are more pending requests than before, play sound
          if (newCount > previousRequestCountRef.current && previousRequestCountRef.current > 0 && soundEnabled) {
            console.log('New request detected, attempting to play sound...');
            
            // Create a new audio instance each time to avoid issues with reuse
            const notificationAudio = new Audio('/notification.mp3');
            
            notificationAudio.play()
              .then(() => {
                console.log('Notification sound played successfully');
              })
              .catch((err) => {
                console.error('Error playing notification sound:', err);
                toast({
                  title: "Sound Playback Error",
                  description: `Could not play notification: ${err.message}. Check browser autoplay settings.`,
                  variant: "destructive",
                });
              });
            
            // Show toast notification
            toast({
              title: "New Contact Request",
              description: "You have received a new contact request",
              variant: "default",
            });
          }
          
          // Update the reference count
          previousRequestCountRef.current = newCount;
          setPendingRequests(newCount);
        }
      } catch (error) {
        console.error('Error fetching pending requests count:', error);
      }
    };

    // Fetch immediately
    fetchPendingRequestsCount();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchPendingRequestsCount, 30000);
    
    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Test sound playback
  const testSound = () => {
    if (audioRef.current) {
      console.log('Testing sound playback...');
      
      // Create a new audio instance for testing to avoid issues with the main one
      const testAudio = new Audio('/notification.mp3');
      
      testAudio.play()
        .then(() => {
          console.log('Sound played successfully');
          toast({
            title: "Sound Test",
            description: "Notification sound played successfully",
            variant: "default",
          });
        })
        .catch((err) => {
          console.error('Error playing test sound:', err);
          toast({
            title: "Sound Test Failed",
            description: `Could not play sound: ${err.message}. Check browser autoplay settings.`,
            variant: "destructive",
          });
        });
    } else {
      console.error('Audio element not initialized');
      toast({
        title: "Sound Test Failed",
        description: "Audio element not initialized",
        variant: "destructive",
      });
    }
  };

  // Toggle sound notifications
  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    localStorage.setItem('contactRequestsSoundEnabled', newSoundEnabled.toString());
    
    toast({
      title: newSoundEnabled ? "Sound notifications enabled" : "Sound notifications disabled",
      description: newSoundEnabled 
        ? "You will now hear a sound when new requests arrive" 
        : "You will no longer hear sounds for new requests",
      variant: "default",
    });
    
    // Test sound if enabled
    if (newSoundEnabled) {
      testSound();
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      pendingRequests, 
      soundEnabled, 
      toggleSound,
      testSound
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 