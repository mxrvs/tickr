"use client";

import { HOLIDAYS } from "@/lib/holidays";
import { useState, useEffect } from "react";

// Holiday interface
interface Holiday {
  name: string;
  country: string;
  date: string;
}

// Countdown interface
interface HolidayCountdown extends Holiday {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
  hasPassed: boolean;
  continent?: string;
}

// Continent constants
const CONTINENTS = {
  WORLD: "World",
  ASIA: "Asia",
  EUROPE: "Europe",
  AMERICAS: "Americas",
  OCEANIA: "Oceania",
  AFRICA: "Africa"
} as const;

// Assign continent based on country
const getContinent = (country: string) => {
  if (country === "World") return CONTINENTS.WORLD;
  if (["Philippines", "Japan", "China", "South Korea", "India", "UAE", "Sri Lanka"].includes(country)) return CONTINENTS.ASIA;
  if (["United Kingdom", "Germany", "France", "Russia"].includes(country)) return CONTINENTS.EUROPE;
  if (["USA", "Canada", "Brazil", "Mexico"].includes(country)) return CONTINENTS.AMERICAS;
  if (["Australia", "New Zealand"].includes(country)) return CONTINENTS.OCEANIA;
  if (["Egypt", "South Africa", "Nigeria", "Kenya"].includes(country)) return CONTINENTS.AFRICA;
  return CONTINENTS.WORLD;
};

// Generate holidays for current year with continent
const getCurrentYearHolidays = (): Holiday[] => {
  return HOLIDAYS.map(h => ({
    ...h,
    continent: getContinent(h.country)
  }));
};

// Group holidays by continent → country → sorted by date
const groupHolidaysByContinent = (holidays: Holiday[]) => {
  const continentGroups: Record<string, Record<string, Holiday[]>> = {};

  holidays.forEach(holiday => {
    const continent = getContinent(holiday.country);
    if (!continentGroups[continent]) continentGroups[continent] = {};
    if (!continentGroups[continent][holiday.country]) continentGroups[continent][holiday.country] = [];

    continentGroups[continent][holiday.country].push(holiday);
  });

  // Sort holidays by date within each country
  Object.keys(continentGroups).forEach(continent => {
    Object.keys(continentGroups[continent]).forEach(country => {
      continentGroups[continent][country].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  });

  return continentGroups;
};

// Calculate countdown for a holiday
function calculateTimeUntil(holiday: Holiday): HolidayCountdown {
  const now = new Date();
  const target = new Date(holiday.date);
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    const isToday = target.toDateString() === now.toDateString();
    return { ...holiday, days: 0, hours: 0, minutes: 0, seconds: 0, isToday, hasPassed: !isToday && diff < 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { ...holiday, days, hours, minutes, seconds, isToday: false, hasPassed: false };
}

// Format time units
function formatTimeUnit(value: number, unit: string): string {
  return `${value.toString().padStart(2, "0")}${unit}`;
}

// Days difference helper
function daysUntil(date: string): number {
  const now = new Date();
  const target = new Date(date);
  return Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [countdowns, setCountdowns] = useState<HolidayCountdown[]>([]);
  const [groupedHolidays, setGroupedHolidays] = useState<ReturnType<typeof groupHolidaysByContinent>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const currentHolidays = getCurrentYearHolidays();
    setHolidays(currentHolidays);
    setGroupedHolidays(groupHolidaysByContinent(currentHolidays));
  }, []);

  useEffect(() => {
    if (!isClient || holidays.length === 0) return;

    const updateCountdowns = () => {
      setCountdowns(holidays.map(h => calculateTimeUntil(h)));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [isClient, holidays]);

  const getHolidayCountdown = (holiday: Holiday) => {
    return countdowns.find(c => c.name === holiday.name && c.date === holiday.date) || calculateTimeUntil(holiday);
  };

  const continentOrder = [
    CONTINENTS.WORLD,
    CONTINENTS.ASIA,
    CONTINENTS.EUROPE,
    CONTINENTS.AMERICAS,
    CONTINENTS.OCEANIA,
    CONTINENTS.AFRICA
  ];

  if (!isClient) return <p>Loading...</p>;

  return (
    <main className="p-6 space-y-8 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
        🌍 Global Holiday Countdown {new Date().getFullYear()}
      </h1>

      {continentOrder.map(continent => {
        const countries = groupedHolidays[continent];
        if (!countries) return null;

        return (
          <div key={continent} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{continent}</h2>
            {Object.keys(countries).sort().map(country => {
              const countryHolidays = countries[country];
              return (
                <div key={country} className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{country}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {countryHolidays.map(holiday => {
                      const countdown = getHolidayCountdown(holiday);
                      return (
                        <div
                          key={`${holiday.name}-${holiday.date}`}
                          className={`bg-white dark:bg-gray-800 rounded-2xl border-2 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                            countdown.hasPassed
                              ? "border-gray-300 dark:border-gray-700 opacity-70"
                              : countdown.isToday
                              ? "border-green-500 dark:border-green-600"
                              : "border-blue-200 dark:border-blue-800"
                          }`}
                        >
                          <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{holiday.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {new Date(holiday.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                          </p>

                          {countdown.isToday ? (
                            <p className="text-green-600 font-bold text-center">Today&apos;s the day! 🎉</p>
                          ) : countdown.hasPassed ? (
                            <p className="text-gray-500 font-semibold text-center">Already Celebrated ({Math.abs(daysUntil(holiday.date))} days ago)</p>
                          ) : (
                            <div className="text-center font-mono text-xl md:text-2xl">
                              {formatTimeUnit(countdown.days, "d")} : {formatTimeUnit(countdown.hours, "h")} : {formatTimeUnit(countdown.minutes, "m")} : {formatTimeUnit(countdown.seconds, "s")}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </main>
  );
}
