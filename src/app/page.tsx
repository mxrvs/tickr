"use client";
import { useClock } from "@/hooks/useClock";
import { TIMEZONES } from "../lib/timezone";

interface Timezone {
  zone: string;
  label: string;
  country: string;
  continent: string;
}

// Sort timezones by continent
const timezonesByContinent = TIMEZONES.reduce((acc, tz) => {
  // Extract continent from zone (e.g., "Asia/Tokyo" -> "Asia")
  const continent = tz.zone.split('/')[0];
  if (!acc[continent]) {
    acc[continent] = [];
  }
  acc[continent].push({
    ...tz,
    continent
  });
  return acc;
}, {} as Record<string, Timezone[]>);

// Sort continents alphabetically
const sortedContinents = Object.keys(timezonesByContinent).sort();

// Sort timezones within each continent
sortedContinents.forEach(continent => {
  timezonesByContinent[continent].sort((a, b) => 
    a.label.localeCompare(b.label)
  );
});

export default function HomePage() {
  const now = useClock();

  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="p-4 md:p-6 space-y-8 min-h-screen">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">World Clock</h1>
        <p className="text-gray-600 dark:text-gray-300">Current times around the world</p>
      </div>

      {/* Current Local Time Display */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center rounded-3xl border-4 border-gray-300 dark:border-gray-700 shadow-2xl p-6 md:p-8 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white mx-4">
          <div className="text-xl md:text-2xl font-semibold text-gray-300 mb-4">Local Time</div>
          <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-wider [font-family:var(--font-digital)] leading-tight">
            {timeString}
          </div>
          <div className="mt-4 text-lg md:text-xl font-bold [font-family:var(--font-digital)] text-gray-400">
            {dateString}
          </div>
        </div>
      </div>

      {/* World Clocks by Continent */}
      <div className="space-y-8">
        {sortedContinents.map((continent) => (
          <div key={continent} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-b pb-2 border-gray-300 dark:border-gray-700">
              {continent}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {timezonesByContinent[continent].map((tz) => {
                const timeInZone = now.toLocaleTimeString("en-US", {
                  timeZone: tz.zone,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });
                
                const dateInZone = now.toLocaleDateString("en-US", {
                  timeZone: tz.zone,
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div 
                    key={tz.zone} 
                    className="p-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="mb-3">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">{tz.label}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-sm font-medium px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {tz.country}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{tz.zone}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-2xl md:text-3xl font-bold tracking-wider [font-family:var(--font-digital)] text-gray-900 dark:text-white">
                        {timeInZone}
                      </div>
                      <div className="text-sm font-medium [font-family:var(--font-digital)] text-gray-600 dark:text-gray-400">
                        {dateInZone}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}