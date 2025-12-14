"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

interface Alarm {
  id: number;
  name: string;
  time: string;
  sound: string;
}

const alarmSounds = [
  { label: "Bell", value: "/sounds/bell.mp3" },
  { label: "Digital", value: "/sounds/digital.mp3" },
  { label: "Rush", value: "/sounds/rush.mp3" },
];

const STORAGE_KEY = "alarm-clock-alarms";

interface AlarmContextType {
  alarms: Alarm[];
  addAlarm: (name: string, time: string, sound: string) => void;
  removeAlarm: (id: number) => void;
  getTimeRemaining: (alarmTime: string) => string;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export function AlarmProvider({ children }: { children: React.ReactNode }) {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isClient, setIsClient] = useState(false);
  const triggeredAlarmsRef = useRef<Set<number>>(new Set());
  const audioMapRef = useRef<Record<string, HTMLAudioElement>>({});
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize client state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load alarms from localStorage on component mount
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const savedAlarms = localStorage.getItem(STORAGE_KEY);
      if (savedAlarms) {
        const parsedAlarms = JSON.parse(savedAlarms);
        setAlarms(parsedAlarms);
      }
    } catch (error) {
      console.error("Failed to load alarms from localStorage:", error);
    }
  }, [isClient]);

  // Save alarms to localStorage whenever they change
  useEffect(() => {
    if (!isClient) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
    } catch (error) {
      console.error("Failed to save alarms to localStorage:", error);
    }
  }, [alarms, isClient]);

  // Initialize audio objects on client side
  useEffect(() => {
    if (!isClient) return;
    
    alarmSounds.forEach((sound) => {
      if (!audioMapRef.current[sound.value]) {
        const audio = new Audio(sound.value);
        audio.loop = true;
        audioMapRef.current[sound.value] = audio;
      }
    });
  }, [isClient]);

  // Alarm checking logic - runs globally regardless of which page is active
  useEffect(() => {
    if (!isClient) return;

    // Clear any existing interval
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }

    // Start checking for alarms every second
    checkIntervalRef.current = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      
      // Check each alarm
      alarms.forEach((alarm) => {
        // Skip if already triggered
        if (triggeredAlarmsRef.current.has(alarm.id)) return;
        
        if (currentTime === alarm.time) {
          // Mark as triggered
          triggeredAlarmsRef.current.add(alarm.id);
          
          const audio = audioMapRef.current[alarm.sound];
          if (!audio) return;
          
          audio.currentTime = 0;
          
          // Get theme from document
          const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
          
          // Show alert even if page is not active
          Swal.fire({
            title: `⏰ ${alarm.name || "Alarm"}!`,
            text: `Alarm for ${formatTo12Hour(alarm.time)}`,
            icon: "info",
            confirmButtonText: "Dismiss",
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#1f2937',
            confirmButtonColor: '#2563eb',
            iconColor: '#3b82f6',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              audio.play().catch(err => {
                console.error("Failed to play alarm sound:", err);
              });
            },
            willClose: () => {
              audio.pause();
              audio.currentTime = 0;
            },
          }).then(() => {
            // Remove triggered alarm after alert is dismissed
            setAlarms(prev => prev.filter(a => a.id !== alarm.id));
            triggeredAlarmsRef.current.delete(alarm.id);
          });
        }
      });
    }, 1000); // Check every second

    // Cleanup interval on unmount
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [alarms, isClient]);

  // Helper function to format time to 12-hour
  const formatTo12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Calculate time remaining for an alarm
  const getTimeRemaining = (alarmTime: string): string => {
    const now = new Date();
    const [hours, minutes] = alarmTime.split(":").map(Number);
    const alarmDate = new Date(now);
    alarmDate.setHours(hours, minutes, 0, 0);
    
    // If the alarm time has passed today, set it for tomorrow
    if (alarmDate.getTime() <= now.getTime()) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }
    
    const diff = alarmDate.getTime() - now.getTime();
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const addAlarm = (name: string, time: string, sound: string) => {
    const id = Date.now();
    setAlarms(prev => [...prev, { id, name, time, sound }]);
  };

  const removeAlarm = (id: number) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
    triggeredAlarmsRef.current.delete(id);
  };

  const value: AlarmContextType = {
    alarms,
    addAlarm,
    removeAlarm,
    getTimeRemaining,
  };

  return (
    <AlarmContext.Provider value={value}>
      {children}
    </AlarmContext.Provider>
  );
}

export function useAlarm() {
  const context = useContext(AlarmContext);
  if (!context) throw new Error("useAlarm must be used within an AlarmProvider");
  return context;
}