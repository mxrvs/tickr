"use client";

import { useClock } from "@/hooks/useClock";
import { useState } from "react";
import { useAlarm } from "@/context/AlarmContext";

const alarmSounds = [
  { label: "Bell", value: "/sounds/bell.mp3" },
  { label: "Digital", value: "/sounds/digital.mp3" },
  { label: "Rush", value: "/sounds/rush.mp3" },
];

// Function to convert 24-hour format to 12-hour format
const formatTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export default function AlarmPage() {
  const now = useClock();
  const { alarms, addAlarm: contextAddAlarm, removeAlarm, getTimeRemaining } = useAlarm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlarm, setNewAlarm] = useState("");
  const [alarmName, setAlarmName] = useState("");
  const [selectedSound, setSelectedSound] = useState(alarmSounds[0].value);

  const addAlarm = () => {
    if (!newAlarm) return;
    contextAddAlarm(alarmName, newAlarm, selectedSound);
    setNewAlarm("");
    setAlarmName("");
    setIsModalOpen(false);
  };

  // Display time in 12-hour format
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="p-4 md:p-6 flex flex-col items-center justify-center min-h-screen">
      {/* Big Clock */}
      <div className="w-full max-w-4xl text-center rounded-3xl border-4 border-gray-300 dark:border-gray-700 shadow-2xl p-6 md:p-10 lg:p-12 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white mx-4">
        <div>
          <div className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 dark:text-gray-300 mb-3 md:mb-6">Local Time</div>
          <div className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold tracking-wider [font-family:var(--font-digital)] leading-tight text-gray-900 dark:text-white">
            {timeString}
          </div>
          <div className="mt-4 md:mt-8 text-lg md:text-xl lg:text-2xl font-bold [font-family:var(--font-digital)] text-gray-600 dark:text-gray-400">
            {dateString}
          </div>
        </div>
      </div>

      {/* Set Alarm Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 md:mt-8 px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white text-lg md:text-xl font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Set Alarm
      </button>

      {/* Display Alarms List */}
      {alarms.length > 0 && (
        <div className="w-full max-w-2xl mt-8 px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Active Alarms ({alarms.length})</h2>
          <div className="space-y-3 md:space-y-4">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className="flex flex-col sm:flex-row justify-between items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3 md:p-4 gap-2 bg-white dark:bg-gray-800 shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏰</span>
                    <span className="font-bold text-base md:text-lg dark:text-gray-200">{alarm.name || "Alarm"}</span>
                  </div>
                  <div className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                    {formatTo12Hour(alarm.time)}
                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                      ({alarm.time})
                    </span>
                  </div>
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  <div>Time remaining: <span className="font-mono font-bold">{getTimeRemaining(alarm.time)}</span></div>
                  <div className="text-sm">Sound: {alarmSounds.find((s) => s.value === alarm.sound)?.label}</div>
                </div>
                <button
                  onClick={() => removeAlarm(alarm.id)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-bold text-xl px-3"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Setting Alarm */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border dark:border-gray-700">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Set New Alarm</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alarm Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Morning Wake Up"
                  value={alarmName}
                  onChange={(e) => setAlarmName(e.target.value)}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl p-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alarm Time
                </label>
                <input
                  type="time"
                  value={newAlarm}
                  onChange={(e) => setNewAlarm(e.target.value)}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl p-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alarm Sound
                </label>
                <select
                  value={selectedSound}
                  onChange={(e) => setSelectedSound(e.target.value)}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl p-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
                >
                  {alarmSounds.map((sound) => (
                    <option key={sound.value} value={sound.value}>
                      {sound.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t dark:border-gray-700">
              <div className="flex gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={addAlarm}
                  disabled={!newAlarm}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Set Alarm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}