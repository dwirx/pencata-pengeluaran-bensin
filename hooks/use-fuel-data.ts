"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  FuelEntry, 
  FuelSummary, 
  MonthlyStats, 
  GapAnalysis, 
  FuelingHabits, 
  DriveSmarter,
  VehicleAnalysis,
  VehicleType,
  TimePeriodFilter,
  DriveFurtherRefillLess
} from "@/lib/types/fuel";
import { calculateCO2Emissions, getFuelTypeById, getVehicleTypeById } from "@/lib/data/fuel-types";
import { startOfMonth, endOfMonth, format, isWithinInterval, differenceInDays, subDays, getDay } from "date-fns";

export const useFuelData = () => {
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);
  const [customVehicleTypes, setCustomVehicleTypes] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("fuel-entries");
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries).map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt),
        }));
        setFuelEntries(parsedEntries);
      } catch (error) {
        console.error("Error loading fuel entries:", error);
      }
    }

    // Load custom vehicle types
    const savedVehicleTypes = localStorage.getItem("custom-vehicle-types");
    if (savedVehicleTypes) {
      try {
        const parsedVehicleTypes = JSON.parse(savedVehicleTypes);
        setCustomVehicleTypes(parsedVehicleTypes);
      } catch (error) {
        console.error("Error loading custom vehicle types:", error);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (fuelEntries.length > 0) {
      localStorage.setItem("fuel-entries", JSON.stringify(fuelEntries));
    }
  }, [fuelEntries]);

  useEffect(() => {
    if (customVehicleTypes.length > 0) {
      localStorage.setItem("custom-vehicle-types", JSON.stringify(customVehicleTypes));
    }
  }, [customVehicleTypes]);

  const addFuelEntry = (entry: Omit<FuelEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    const newEntry: FuelEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setFuelEntries(prev => [...prev, newEntry]);
    setIsLoading(false);
  };

  const updateFuelEntry = (id: string, updates: Partial<FuelEntry>) => {
    setIsLoading(true);
    setFuelEntries(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { ...entry, ...updates, updatedAt: new Date() }
          : entry
      )
    );
    setIsLoading(false);
  };

  const deleteFuelEntry = (id: string) => {
    setFuelEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Custom vehicle type management
  const addCustomVehicleType = (vehicleType: VehicleType) => {
    setCustomVehicleTypes(prev => [...prev, vehicleType]);
  };

  const deleteCustomVehicleType = (vehicleId: string) => {
    setCustomVehicleTypes(prev => prev.filter(vt => vt.id !== vehicleId));
  };

  // Data management functions
  const exportData = () => {
    const dataToExport = {
      fuelEntries,
      customVehicleTypes,
      exportDate: new Date().toISOString(),
      version: "2.0"
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `eco-fuel-backup-${format(new Date(), 'yyyy-MM-dd-HHmm')}.json`;
    link.click();
  };

  const importData = (data: any) => {
    try {
      if (data.fuelEntries && Array.isArray(data.fuelEntries)) {
        const parsedEntries = data.fuelEntries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt),
        }));
        setFuelEntries(parsedEntries);
      }
      
      if (data.customVehicleTypes && Array.isArray(data.customVehicleTypes)) {
        setCustomVehicleTypes(data.customVehicleTypes);
      }
      
      alert("Data berhasil diimport!");
    } catch (error) {
      console.error("Error importing data:", error);
      alert("Error saat import data!");
    }
  };

  const resetAllData = () => {
    setFuelEntries([]);
    setCustomVehicleTypes([]);
    localStorage.removeItem("fuel-entries");
    localStorage.removeItem("custom-vehicle-types");
    alert("Semua data telah dihapus!");
  };

  // Enhanced odometer handling - calculate relative distance
  // Handle cases where user doesn't know initial odometer reading
  const calculateDistance = (entries: FuelEntry[]): number => {
    if (entries.length < 2) return 0;
    const sortedEntries = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // If odometer readings are present and reasonable, use them
    const maxOdometer = Math.max(...sortedEntries.map(e => e.odometer));
    const minOdometer = Math.min(...sortedEntries.map(e => e.odometer));
    const odometerDistance = maxOdometer - minOdometer;
    
    // If odometer distance seems reasonable (not 0 and not too large)
    if (odometerDistance > 0 && odometerDistance < 50000) {
      return odometerDistance;
    }
    
    // Fallback: estimate based on fuel consumption patterns
    // Assume average efficiency of 12 km/L for cars, 25 km/L for motorcycles
    const totalLiters = sortedEntries.reduce((sum, entry) => sum + entry.liters, 0);
    const avgEfficiency = sortedEntries.some(e => e.vehicleType === 'motorcycle') ? 25 : 12;
    return totalLiters * avgEfficiency;
  };

  // Calculate gap analysis
  const getGapAnalysis = (entries: FuelEntry[]): GapAnalysis => {
    if (entries.length < 2) {
      return {
        currentGap: 0,
        longestGap: 0,
        totalGapDays: 0,
        averageGap: 0,
        gapTrend: 'stable'
      };
    }

    const sortedEntries = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());
    const gaps: number[] = [];
    
    for (let i = 1; i < sortedEntries.length; i++) {
      const gap = differenceInDays(sortedEntries[i].date, sortedEntries[i - 1].date);
      gaps.push(gap);
    }

    const currentGap = differenceInDays(new Date(), sortedEntries[sortedEntries.length - 1].date);
    const longestGap = Math.max(...gaps);
    const totalGapDays = gaps.reduce((sum, gap) => sum + gap, 0);
    const averageGap = totalGapDays / gaps.length;

    // Determine trend
    const recentGaps = gaps.slice(-3);
    const olderGaps = gaps.slice(0, -3);
    const recentAvg = recentGaps.reduce((sum, gap) => sum + gap, 0) / recentGaps.length;
    const olderAvg = olderGaps.reduce((sum, gap) => sum + gap, 0) / olderGaps.length;
    
    let gapTrend: 'improving' | 'worsening' | 'stable' = 'stable';
    if (recentAvg > olderAvg * 1.1) gapTrend = 'worsening';
    else if (recentAvg < olderAvg * 0.9) gapTrend = 'improving';

    return {
      currentGap,
      longestGap,
      totalGapDays,
      averageGap,
      gapTrend
    };
  };

  // Calculate fueling habits
  const getFuelingHabits = (entries: FuelEntry[]): FuelingHabits => {
    if (entries.length === 0) {
      return {
        preferredDays: [],
        preferredTimeRange: 'morning',
        averageRefillAmount: 0,
        refillFrequency: 'moderate',
        fuelTypePreference: {},
        locationPatterns: {}
      };
    }

    // Preferred days (0 = Sunday, 1 = Monday, etc.)
    const dayCount: { [key: number]: number } = {};
    entries.forEach(entry => {
      const day = getDay(entry.date);
      dayCount[day] = (dayCount[day] || 0) + 1;
    });

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const preferredDays = Object.entries(dayCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([day]) => dayNames[parseInt(day)]);

    // Time range based on creation time
    const timeRanges = { morning: 0, afternoon: 0, evening: 0 };
    entries.forEach(entry => {
      const hour = entry.createdAt.getHours();
      if (hour < 12) timeRanges.morning++;
      else if (hour < 18) timeRanges.afternoon++;
      else timeRanges.evening++;
    });

    const preferredTimeRange = Object.entries(timeRanges)
      .sort(([,a], [,b]) => b - a)[0][0];

    // Average refill amount
    const averageRefillAmount = entries.reduce((sum, entry) => sum + entry.liters, 0) / entries.length;

    // Refill frequency
    const gaps = getGapAnalysis(entries);
    let refillFrequency: 'frequent' | 'moderate' | 'infrequent' = 'moderate';
    if (gaps.averageGap < 7) refillFrequency = 'frequent';
    else if (gaps.averageGap > 14) refillFrequency = 'infrequent';

    // Fuel type preference
    const fuelTypeCount: { [key: string]: number } = {};
    entries.forEach(entry => {
      fuelTypeCount[entry.fuelType] = (fuelTypeCount[entry.fuelType] || 0) + 1;
    });
    const fuelTypePreference: { [key: string]: number } = {};
    Object.entries(fuelTypeCount).forEach(([type, count]) => {
      fuelTypePreference[type] = (count / entries.length) * 100;
    });

    // Location patterns
    const locationCount: { [key: string]: number } = {};
    entries.forEach(entry => {
      if (entry.location) {
        locationCount[entry.location] = (locationCount[entry.location] || 0) + 1;
      }
    });
    const locationPatterns: { [key: string]: number } = {};
    Object.entries(locationCount).forEach(([location, count]) => {
      locationPatterns[location] = (count / entries.filter(e => e.location).length) * 100;
    });

    return {
      preferredDays,
      preferredTimeRange,
      averageRefillAmount,
      refillFrequency,
      fuelTypePreference,
      locationPatterns
    };
  };

  // Calculate drive smarter insights
  const getDriveSmarter = (entries: FuelEntry[]): DriveSmarter => {
    if (entries.length < 3) {
      return {
        efficiencyTrend: 'stable',
        fuelSavingsPotential: 0,
        co2ReductionPotential: 0,
        recommendations: ['Tambah lebih banyak data untuk analisis yang lebih akurat'],
        drivingScore: 75
      };
    }

    const sortedEntries = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Calculate efficiency trend
    const recentEntries = sortedEntries.slice(-5);
    const olderEntries = sortedEntries.slice(0, -5);
    
    const calculateEfficiency = (entryList: FuelEntry[]) => {
      if (entryList.length < 2) return 0;
      const distance = calculateDistance(entryList);
      const totalLiters = entryList.reduce((sum, entry) => sum + entry.liters, 0);
      return distance / totalLiters;
    };

    const recentEfficiency = calculateEfficiency(recentEntries);
    const olderEfficiency = calculateEfficiency(olderEntries);
    
    let efficiencyTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentEfficiency > olderEfficiency * 1.05) efficiencyTrend = 'improving';
    else if (recentEfficiency < olderEfficiency * 0.95) efficiencyTrend = 'declining';

    // Calculate potential savings (if efficiency improved by 10%)
    const currentMonthlyLiters = entries.reduce((sum, entry) => sum + entry.liters, 0);
    const currentMonthlyAmount = entries.reduce((sum, entry) => sum + entry.totalAmount, 0);
    const currentMonthlyCO2 = entries.reduce((sum, entry) => 
      sum + calculateCO2Emissions(entry.liters, entry.vehicleType), 0);

    const fuelSavingsPotential = currentMonthlyAmount * 0.1; // 10% savings potential
    const co2ReductionPotential = currentMonthlyCO2 * 0.1;

    // Generate recommendations
    const recommendations: string[] = [];
    if (efficiencyTrend === 'declining') {
      recommendations.push('Periksa tekanan ban secara rutin');
      recommendations.push('Hindari akselerasi mendadak');
    }
    recommendations.push('Gunakan cruise control di jalan tol');
    recommendations.push('Matikan AC saat kecepatan rendah');
    recommendations.push('Rencanakan rute untuk menghindari macet');

    // Calculate driving score (0-100)
    let drivingScore = 75; // base score
    if (efficiencyTrend === 'improving') drivingScore += 15;
    else if (efficiencyTrend === 'declining') drivingScore -= 15;
    
    const habits = getFuelingHabits(entries);
    if (habits.refillFrequency === 'moderate') drivingScore += 10;

    return {
      efficiencyTrend,
      fuelSavingsPotential,
      co2ReductionPotential,
      recommendations,
      drivingScore: Math.max(0, Math.min(100, drivingScore))
    };
  };

  // Get vehicle analysis
  const getVehicleAnalysis = (entries: FuelEntry[]): VehicleAnalysis[] => {
    const vehicleGroups: { [key: string]: FuelEntry[] } = {};
    entries.forEach(entry => {
      if (!vehicleGroups[entry.vehicleType]) {
        vehicleGroups[entry.vehicleType] = [];
      }
      vehicleGroups[entry.vehicleType].push(entry);
    });

    return Object.entries(vehicleGroups).map(([vehicleId, vehicleEntries]) => {
      const vehicleType = getVehicleTypeById(vehicleId);
      const totalAmount = vehicleEntries.reduce((sum, entry) => sum + entry.totalAmount, 0);
      const totalLiters = vehicleEntries.reduce((sum, entry) => sum + entry.liters, 0);
      const distance = calculateDistance(vehicleEntries);
      const lastRefill = vehicleEntries.sort((a, b) => b.date.getTime() - a.date.getTime())[0].date;
      
      return {
        vehicleId,
        vehicleName: vehicleType?.name || vehicleId,
        totalEntries: vehicleEntries.length,
        totalAmount,
        totalLiters,
        averageEfficiency: totalLiters > 0 ? distance / totalLiters : 0,
        co2Emissions: vehicleEntries.reduce((sum, entry) => 
          sum + calculateCO2Emissions(entry.liters, entry.vehicleType), 0),
        lastRefill,
        averageRefillAmount: totalLiters / vehicleEntries.length
      };
    });
  };

  // Drive further, refill less analysis
  const getDriveFurtherRefillLess = (entries: FuelEntry[]): DriveFurtherRefillLess => {
    const distance = calculateDistance(entries);
    const totalLiters = entries.reduce((sum, entry) => sum + entry.liters, 0);
    const currentEfficiency = totalLiters > 0 ? distance / totalLiters : 0;
    const targetEfficiency = currentEfficiency * 1.15; // 15% improvement target

    const monthlyLiters = totalLiters;
    const monthlyAmount = entries.reduce((sum, entry) => sum + entry.totalAmount, 0);
    const monthlyCO2 = entries.reduce((sum, entry) => 
      sum + calculateCO2Emissions(entry.liters, entry.vehicleType), 0);

    const improvementFactor = (targetEfficiency - currentEfficiency) / currentEfficiency;
    
    return {
      currentEfficiency,
      targetEfficiency,
      potentialSavings: {
        litersPerMonth: monthlyLiters * improvementFactor,
        amountPerMonth: monthlyAmount * improvementFactor,
        co2ReductionPerMonth: monthlyCO2 * improvementFactor
      },
      tips: [
        'Jaga kecepatan konstan 60-80 km/h',
        'Gunakan transmisi manual dengan efisien',
        'Rencanakan perjalanan untuk menghindari kemacetan',
        'Periksa filter udara secara berkala',
        'Hindari membawa beban berlebih'
      ],
      progressToTarget: currentEfficiency > 0 ? (currentEfficiency / targetEfficiency) * 100 : 0
    };
  };

  // Time period filters
  const getTimePeriodFilters = (): TimePeriodFilter[] => {
    const now = new Date();
    return [
      {
        label: '7 Hari Terakhir',
        days: 7,
        startDate: subDays(now, 7),
        endDate: now
      },
      {
        label: '30 Hari Terakhir',
        days: 30,
        startDate: subDays(now, 30),
        endDate: now
      },
      {
        label: 'Bulan Ini',
        days: 0,
        startDate: startOfMonth(now),
        endDate: endOfMonth(now)
      },
      {
        label: 'Bulan Lalu',
        days: 0,
        startDate: startOfMonth(subDays(now, 30)),
        endDate: endOfMonth(subDays(now, 30))
      }
    ];
  };

  // Filter entries by time period
  const getEntriesByPeriod = (period: TimePeriodFilter): FuelEntry[] => {
    return fuelEntries.filter(entry => 
      isWithinInterval(entry.date, { start: period.startDate, end: period.endDate })
    );
  };

  // Enhanced monthly stats calculation
  const getMonthlyStats = (date: Date): MonthlyStats => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthEntries = fuelEntries.filter(entry => 
      isWithinInterval(entry.date, { start: monthStart, end: monthEnd })
    );

    const totalAmount = monthEntries.reduce((sum, entry) => sum + entry.totalAmount, 0);
    const totalLiters = monthEntries.reduce((sum, entry) => sum + entry.liters, 0);
    const refillCount = monthEntries.length;
    const co2Emissions = monthEntries.reduce((sum, entry) => 
      sum + calculateCO2Emissions(entry.liters, entry.vehicleType), 0
    );

    const totalDistance = calculateDistance(monthEntries);
    const efficiency = totalLiters > 0 ? totalDistance / totalLiters : 0;
    
    const gaps = getGapAnalysis(monthEntries);
    const averageGapDays = gaps.averageGap;

    return {
      month: format(date, 'MMMM'),
      year: date.getFullYear(),
      totalAmount,
      totalLiters,
      refillCount,
      co2Emissions,
      efficiency,
      averageGapDays,
      totalDistance,
    };
  };

  // Get summary for a date range
  const getSummary = (startDate: Date, endDate: Date): FuelSummary => {
    const periodEntries = fuelEntries.filter(entry => 
      isWithinInterval(entry.date, { start: startDate, end: endDate })
    );

    const totalAmount = periodEntries.reduce((sum, entry) => sum + entry.totalAmount, 0);
    const totalLiters = periodEntries.reduce((sum, entry) => sum + entry.liters, 0);
    const totalRefills = periodEntries.length;
    const averagePricePerLiter = totalLiters > 0 ? totalAmount / totalLiters : 0;
    const totalCO2Emissions = periodEntries.reduce((sum, entry) => 
      sum + calculateCO2Emissions(entry.liters, entry.vehicleType), 0
    );

    return {
      totalAmount,
      totalLiters,
      totalRefills,
      averagePricePerLiter,
      totalCO2Emissions,
      periodStart: startDate,
      periodEnd: endDate,
    };
  };

  // Get entries by date
  const getEntriesByDate = (date: Date): FuelEntry[] => {
    return fuelEntries.filter(entry => 
      format(entry.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // Get fuel type distribution
  const fuelTypeDistribution = useMemo(() => {
    const distribution: { [key: string]: number } = {};
    fuelEntries.forEach(entry => {
      distribution[entry.fuelType] = (distribution[entry.fuelType] || 0) + 1;
    });
    return distribution;
  }, [fuelEntries]);

  // Get vehicle type distribution
  const vehicleTypeDistribution = useMemo(() => {
    const distribution: { [key: string]: number } = {};
    fuelEntries.forEach(entry => {
      distribution[entry.vehicleType] = (distribution[entry.vehicleType] || 0) + 1;
    });
    return distribution;
  }, [fuelEntries]);

  // Current month stats
  const currentMonthStats = useMemo(() => 
    getMonthlyStats(new Date()), [fuelEntries]
  );

  // Last 6 months stats
  const last6MonthsStats = useMemo(() => {
    const stats: MonthlyStats[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      stats.push(getMonthlyStats(date));
    }
    return stats;
  }, [fuelEntries]);

  // Advanced analytics
  const gapAnalysis = useMemo(() => getGapAnalysis(fuelEntries), [fuelEntries]);
  const fuelingHabits = useMemo(() => getFuelingHabits(fuelEntries), [fuelEntries]);
  const driveSmarter = useMemo(() => getDriveSmarter(fuelEntries), [fuelEntries]);
  const vehicleAnalysis = useMemo(() => getVehicleAnalysis(fuelEntries), [fuelEntries]);
  const driveFurtherRefillLess = useMemo(() => getDriveFurtherRefillLess(fuelEntries), [fuelEntries]);
  const timePeriodFilters = useMemo(() => getTimePeriodFilters(), []);

  return {
    fuelEntries,
    isLoading,
    addFuelEntry,
    updateFuelEntry,
    deleteFuelEntry,
    getMonthlyStats,
    getSummary,
    getEntriesByDate,
    getEntriesByPeriod,
    fuelTypeDistribution,
    vehicleTypeDistribution,
    currentMonthStats,
    last6MonthsStats,
    // Advanced analytics
    gapAnalysis,
    fuelingHabits,
    driveSmarter,
    vehicleAnalysis,
    driveFurtherRefillLess,
    timePeriodFilters,
    // Custom vehicle types
    customVehicleTypes,
    addCustomVehicleType,
    deleteCustomVehicleType,
    // Data management
    exportData,
    importData,
    resetAllData,
  };
}; 