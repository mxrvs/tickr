"use client";

import { useState, useEffect, useRef } from "react";

export default function StopwatchPage() {
  const [isClient, setIsClient] = useState(false);
  const [time, setTime] = useState(0); // time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle stopwatch interval (updates only milliseconds)
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime((prev) => prev + 10); // update every 10ms
      }, 10);
    } else if (!isRunning && intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const startStopwatch = () => setIsRunning(true);
  const stopStopwatch = () => setIsRunning(false);
  const resetStopwatch = () => {
    setIsRunning(false);
    setTime(0);
  };

  // Split time into main (hh:mm:ss) and milliseconds for separate rendering
  const getMainTime = (ms: number) => {
    const h = Math.floor(ms / 3600000).toString().padStart(2, "0");
    const m = Math.floor((ms % 3600000) / 60000).toString().padStart(2, "0");
    const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const getMilliseconds = (ms: number) => {
    return Math.floor((ms % 1000) / 10).toString().padStart(2, "0");
  };

  if (!isClient) {
    return (
      <main className="p-4 md:p-6 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl text-center rounded-3xl border-4 border-gray-300 dark:border-gray-700 shadow-2xl p-6 md:p-10 lg:p-12 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white mx-4">
          <div className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 dark:text-gray-300 mb-3 md:mb-6">
            Loading...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 flex flex-col items-center justify-center min-h-screen">
      {/* Stopwatch Display */}
      <div className="w-full max-w-4xl text-center rounded-3xl border-4 border-gray-300 dark:border-gray-700 shadow-2xl p-6 md:p-10 lg:p-12 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white mx-4">
        <div className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 dark:text-gray-300 mb-3 md:mb-6">
          Stopwatch
        </div>
        <div className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold tracking-wider [font-family:var(--font-digital)] leading-tight text-gray-900 dark:text-white flex justify-center items-baseline gap-2">
          {/* Main time does not move */}
          <span>{getMainTime(time)}</span>
          {/* Milliseconds update independently */}
          <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-mono text-gray-500 dark:text-gray-400">
            .{getMilliseconds(time)}
          </span>
        </div>
      </div>

      {/* Stopwatch Controls */}
      <div className="mt-6 md:mt-8 flex gap-4">
        <button
          onClick={startStopwatch}
          disabled={isRunning}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start
        </button>
        <button
          onClick={stopStopwatch}
          disabled={!isRunning}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Stop
        </button>
        <button
          onClick={resetStopwatch}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
        >
          Reset
        </button>
      </div>
    </main>
  );
}
