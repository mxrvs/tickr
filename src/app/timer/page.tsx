"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

interface Timer {
  id: number;
  title: string;
  hours: number;
  minutes: number;
  seconds: number;
  sound: string;
  repeatSound: boolean;
  currentTime: number; // in seconds
  isRunning: boolean;
  targetTime: number; // total seconds
}

interface TimerSettings {
  hours: number;
  minutes: number;
  seconds: number;
  sound: string;
  repeatSound: boolean;
}

// Fixed: Each sound has a unique value
const timerSounds = [
  { label: "Bell", value: "/sounds/bell.mp3" },
  { label: "Digital", value: "/sounds/digital.mp3" },
  { label: "Rush", value: "/sounds/rush.mp3" },
];

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Key for localStorage
const TIMERS_STORAGE_KEY = "timer-page-timers";

// Function to get current theme
const getCurrentTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

export default function TimerPage() {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [activeTimerId, setActiveTimerId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTimerId, setEditingTimerId] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const [settings, setSettings] = useState<TimerSettings>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    sound: timerSounds[0].value,
    repeatSound: false,
  });

  // Refs for audio objects
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get active timer
  const activeTimer = activeTimerId ? timers.find(t => t.id === activeTimerId) : null;

  // Load timers from localStorage on component mount
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const savedTimers = localStorage.getItem(TIMERS_STORAGE_KEY);
      if (savedTimers) {
        const parsedTimers = JSON.parse(savedTimers);
        setTimers(parsedTimers);
        
        // Set active timer if there are timers
        if (parsedTimers.length > 0) {
          // Find the first running timer, or the first timer if none are running
          const runningTimer = parsedTimers.find((t: Timer) => t.isRunning);
          setActiveTimerId(runningTimer ? runningTimer.id : parsedTimers[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load timers from localStorage:", error);
    }
  }, [isClient]);

  // Save timers to localStorage whenever they change
  useEffect(() => {
    if (!isClient) return;
    
    try {
      localStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(timers));
    } catch (error) {
      console.error("Failed to save timers to localStorage:", error);
    }
  }, [timers, isClient]);

  // Initialize audio objects
  useEffect(() => {
    if (!isClient) return;
    
    timerSounds.forEach((sound) => {
      if (!audioRefs.current[sound.value]) {
        const audio = new Audio(sound.value);
        audio.loop = true;
        audioRefs.current[sound.value] = audio;
      }
    });
  }, [isClient]);

  // Timer countdown effect
  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(() => {
      setTimers(prevTimers => 
        prevTimers.map(timer => {
          if (!timer.isRunning) return timer;
          
          const newTime = timer.currentTime - 1;
          
          // Check if timer reached zero
          if (newTime <= 0) {
            const audio = audioRefs.current[timer.sound];
            if (audio) {
              audio.currentTime = 0;
              
              // Get current theme for alert styling
              const theme = getCurrentTheme();
              
              if (timer.repeatSound) {
                audio.loop = true;
                audio.play().catch(() => {});
                
                // Show alert with stop button for repeating sounds
                Swal.fire({
                  title: `⏱ Timer Finished!`,
                  text: `Timer "${timer.title}" has reached zero`,
                  icon: "info",
                  confirmButtonText: "Stop Sound",
                  showCancelButton: true,
                  cancelButtonText: "Continue",
                  background: theme === 'dark' ? '#1f2937' : '#ffffff',
                  color: theme === 'dark' ? '#ffffff' : '#1f2937',
                  confirmButtonColor: '#2563eb',
                  cancelButtonColor: theme === 'dark' ? '#374151' : '#9ca3af',
                  iconColor: '#3b82f6',
                  willClose: () => {
                    audio.pause();
                    audio.currentTime = 0;
                  },
                }).then((result) => {
                  if (result.isConfirmed) {
                    audio.pause();
                    audio.currentTime = 0;
                  }
                });
              } else {
                audio.loop = false;
                audio.play().catch(() => {});
                
                Swal.fire({
                  title: `⏱ Timer Finished!`,
                  text: `Timer "${timer.title}" has reached zero`,
                  icon: "info",
                  confirmButtonText: "OK",
                  background: theme === 'dark' ? '#1f2937' : '#ffffff',
                  color: theme === 'dark' ? '#ffffff' : '#1f2937',
                  confirmButtonColor: '#2563eb',
                  iconColor: '#3b82f6',
                  willClose: () => {
                    audio.pause();
                    audio.currentTime = 0;
                  },
                });
              }
            }
            
            // Reset timer and stop it
            return { ...timer, currentTime: timer.targetTime, isRunning: false };
          }
          
          return { ...timer, currentTime: newTime };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [timers, isClient]);

  const handleAddTimer = () => {
    if (!isClient) return;
    
    setIsModalOpen(true);
    setEditingTimerId(null);
    setSettings({
      hours: 0,
      minutes: 0,
      seconds: 0,
      sound: timerSounds[0].value,
      repeatSound: false,
    });
  };

  const handleEditTimer = (timerId: number) => {
    if (!isClient) return;
    
    const timerToEdit = timers.find(t => t.id === timerId);
    if (timerToEdit && !timerToEdit.isRunning) {
      setIsModalOpen(true);
      setEditingTimerId(timerId);
      setSettings({
        hours: Math.floor(timerToEdit.targetTime / 3600),
        minutes: Math.floor((timerToEdit.targetTime % 3600) / 60),
        seconds: timerToEdit.targetTime % 60,
        sound: timerToEdit.sound,
        repeatSound: timerToEdit.repeatSound,
      });
    }
  };

  const handleSaveTimer = () => {
    if (!isClient) return;
    
    const targetTime = (settings.hours * 3600) + (settings.minutes * 60) + settings.seconds;
    
    if (targetTime === 0) {
      // Get current theme for alert styling
      const theme = getCurrentTheme();
      
      Swal.fire({
        title: "Invalid Timer",
        text: "Please set a timer duration greater than 0",
        icon: "warning",
        confirmButtonText: "OK",
        background: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#1f2937',
        confirmButtonColor: '#2563eb',
        iconColor: '#f59e0b',
      });
      return;
    }
    
    if (editingTimerId) {
      // Update existing timer
      setTimers(prev => prev.map(timer => 
        timer.id === editingTimerId 
          ? {
              ...timer,
              hours: settings.hours,
              minutes: settings.minutes,
              seconds: settings.seconds,
              sound: settings.sound,
              repeatSound: settings.repeatSound,
              currentTime: targetTime,
              targetTime: targetTime,
            }
          : timer
      ));
      setActiveTimerId(editingTimerId);
    } else {
      // Add new timer
      const newTimer: Timer = {
        id: Date.now(),
        title: `Timer ${timers.length + 1}`,
        hours: settings.hours,
        minutes: settings.minutes,
        seconds: settings.seconds,
        sound: settings.sound,
        repeatSound: settings.repeatSound,
        currentTime: targetTime,
        targetTime: targetTime,
        isRunning: false,
      };
      setTimers(prev => [...prev, newTimer]);
      setActiveTimerId(newTimer.id);
    }
    
    setIsModalOpen(false);
    setSettings({
      hours: 0,
      minutes: 0,
      seconds: 0,
      sound: timerSounds[0].value,
      repeatSound: false,
    });
  };

  const handleStartTimer = (timerId: number) => {
    if (!isClient) return;
    
    setTimers(prev => prev.map(timer => {
      if (timer.id === timerId) {
        // Start this timer
        setActiveTimerId(timerId);
        return { ...timer, isRunning: true };
      } else {
        // Stop all other timers
        return { ...timer, isRunning: false };
      }
    }));
  };

  const handlePauseTimer = (timerId: number) => {
    if (!isClient) return;
    
    setTimers(prev => prev.map(timer => 
      timer.id === timerId 
        ? { ...timer, isRunning: false }
        : timer
    ));
  };

  const handleResetTimer = (timerId: number) => {
    if (!isClient) return;
    
    const timer = timers.find(t => t.id === timerId);
    if (timer && !timer.isRunning) {
      setTimers(prev => prev.map(t => 
        t.id === timerId 
          ? { ...t, currentTime: t.targetTime, isRunning: false }
          : t
      ));
    }
  };

  const handleDeleteTimer = (timerId: number) => {
    if (!isClient) return;
    
    const timer = timers.find(t => t.id === timerId);
    if (timer && !timer.isRunning) {
      setTimers(prev => prev.filter(t => t.id !== timerId));
      if (activeTimerId === timerId) {
        const remainingTimers = timers.filter(t => t.id !== timerId);
        setActiveTimerId(remainingTimers.length > 0 ? remainingTimers[0]?.id || null : null);
      }
    }
  };

  const updateSetting = (key: keyof TimerSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Don't render until client-side to avoid hydration issues
  if (!isClient) {
    return (
      <main className="p-4 md:p-6 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl text-center rounded-3xl border-4 border-gray-300 dark:border-gray-700 shadow-2xl p-6 md:p-10 lg:p-12 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white mx-4">
          <div className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 dark:text-gray-300 mb-3 md:mb-6">
            Loading...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 flex flex-col items-center justify-center min-h-screen">
      {/* Timer Display - Only shows when a timer is active and running */}
      {activeTimer ? (
        <div className="w-full max-w-2xl text-center rounded-3xl border-4 border-gray-300 dark:border-gray-700 shadow-2xl p-6 md:p-10 lg:p-12 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white mx-4 mb-8">
          <div className="mb-8">
            <div className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 dark:text-gray-300 mb-3 md:mb-6">
              {activeTimer.title}
            </div>
            <div className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold tracking-wider [font-family:var(--font-digital)] leading-tight text-gray-900 dark:text-white">
              {formatTime(activeTimer.currentTime)}
            </div>
            <div className="mt-4 text-lg md:text-xl font-semibold [font-family:var(--font-digital)] text-gray-600 dark:text-gray-400">
              {activeTimer.isRunning ? "Running..." : "Paused"}
            </div>
          </div>
        </div>
      ) : (
        // Empty state display
        <div className="w-full max-w-2xl text-center rounded-3xl border-4 border-gray-300 dark:border-gray-700 shadow-2xl p-6 md:p-10 lg:p-12 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white mx-4 mb-8">
          <div className="mb-8">
            <div className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 dark:text-gray-300 mb-3 md:mb-6">
              Set a Timer
            </div>
            <div className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold tracking-wider [font-family:var(--font-digital)] leading-tight text-gray-900 dark:text-white">
              00:00:00
            </div>
            <div className="mt-4 text-lg md:text-xl font-semibold [font-family:var(--font-digital)] text-gray-600 dark:text-gray-400">
              No timer set
            </div>
          </div>
        </div>
      )}

      {/* Timer List - Always show when there are timers */}
      {timers.length > 0 ? (
        <div className="w-full max-w-2xl mt-8 px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Your Timers ({timers.length})
          </h2>
          <div className="space-y-3 md:space-y-4">
            {timers.map((timer) => (
              <div
                key={timer.id}
                className={`flex flex-col sm:flex-row justify-between items-center border-2 rounded-xl p-3 md:p-4 gap-2 shadow-sm transition-all duration-300 ${
                  activeTimer?.id === timer.id
                    ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">⏱</span>
                    <span className="font-bold text-base md:text-lg dark:text-gray-200">
                      {timer.title}
                    </span>
                    {activeTimer?.id === timer.id && (
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                        Active
                      </span>
                    )}
                    {timer.repeatSound && (
                      <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded">
                        Repeat
                      </span>
                    )}
                  </div>
                  <div className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                    {formatTime(timer.currentTime)} / {formatTime(timer.targetTime)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Sound: {timerSounds.find((s) => s.value === timer.sound)?.label}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {timer.isRunning ? (
                    <button
                      onClick={() => handlePauseTimer(timer.id)}
                      className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm"
                    >
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartTimer(timer.id)}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                    >
                      Start
                    </button>
                  )}
                  <button
                    onClick={() => handleResetTimer(timer.id)}
                    disabled={timer.isRunning}
                    className={`px-3 py-2 border rounded-lg text-sm ${
                      timer.isRunning
                        ? "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => handleEditTimer(timer.id)}
                    disabled={timer.isRunning}
                    className={`px-3 py-2 border rounded-lg text-sm ${
                      timer.isRunning
                        ? "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTimer(timer.id)}
                    disabled={timer.isRunning}
                    className={`px-3 py-2 font-bold text-sm rounded-lg ${
                      timer.isRunning
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    }`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // No timers message
        <div className="w-full max-w-2xl mt-8 px-4 text-center">
          <div className="text-gray-600 dark:text-gray-400 mb-4">
            No timers created yet
          </div>
        </div>
      )}

      {/* Add Timer Button */}
      <button
        onClick={handleAddTimer}
        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
      >
        + Add New Timer
      </button>

      {/* Timer Settings Modal - Simplified */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto border dark:border-gray-700">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {editingTimerId ? "Edit Timer" : "Set New Timer"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - Simplified */}
            <div className="p-6 space-y-6">
              {/* Timer Duration Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Timer Duration</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hours</label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={settings.hours}
                      onChange={(e) => updateSetting('hours', parseInt(e.target.value) || 0)}
                      className="w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl p-3 text-lg text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minutes</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={settings.minutes}
                      onChange={(e) => updateSetting('minutes', parseInt(e.target.value) || 0)}
                      className="w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl p-3 text-lg text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Seconds</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={settings.seconds}
                      onChange={(e) => updateSetting('seconds', parseInt(e.target.value) || 0)}
                      className="w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl p-3 text-lg text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Sound Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Sound</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="repeatSound"
                      checked={settings.repeatSound}
                      onChange={(e) => updateSetting('repeatSound', e.target.checked)}
                      className="w-5 h-5 mr-3"
                    />
                    <label htmlFor="repeatSound" className="text-gray-700 dark:text-gray-300">Repeat sound</label>
                  </div>
                </div>
                <select
                  value={settings.sound}
                  onChange={(e) => updateSetting('sound', e.target.value)}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl p-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
                >
                  {timerSounds.map((sound) => (
                    <option key={sound.value} value={sound.value}>
                      {sound.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t dark:border-gray-700">
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTimer}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors duration-300"
                >
                  {editingTimerId ? "Update Timer" : "Start Timer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}