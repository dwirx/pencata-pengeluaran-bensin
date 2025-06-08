export interface FuelType {
  id: string;
  name: string;
  octaneRating: number;
  pricePerLiter: number; // Harga per liter dalam Rupiah
  color: string;
  description: string;
}

export interface VehicleType {
  id: string;
  name: string;
  icon: string;
  co2PerLiter: number; // kg CO2 per liter
}

export interface FuelEntry {
  id: string;
  date: Date;
  vehicleType: string;
  fuelType: string;
  liters: number;
  pricePerLiter: number;
  totalAmount: number;
  odometer: number;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FuelSummary {
  totalAmount: number;
  totalLiters: number;
  totalRefills: number;
  averagePricePerLiter: number;
  totalCO2Emissions: number;
  periodStart: Date;
  periodEnd: Date;
}

export interface MonthlyStats {
  month: string;
  year: number;
  totalAmount: number;
  totalLiters: number;
  refillCount: number;
  co2Emissions: number;
  efficiency: number;
  averageGapDays: number;
  totalDistance: number;
}

export interface EmissionData {
  date: string;
  co2Emitted: number;
  co2Saved: number;
  efficiency: number;
  fuelType: string;
  vehicleType: string;
}

export interface EcoGoals {
  monthlyBudget: number;
  monthlyCO2Limit: number;
  monthlyLiterLimit: number;
  efficiencyTarget: number;
}

// New interfaces for advanced analytics
export interface GapAnalysis {
  currentGap: number; // days since last refill
  longestGap: number; // longest period between refills
  totalGapDays: number; // sum of all gaps
  averageGap: number; // average days between refills
  gapTrend: 'improving' | 'worsening' | 'stable';
}

export interface FuelingHabits {
  preferredDays: string[]; // most common refill days
  preferredTimeRange: string; // morning, afternoon, evening
  averageRefillAmount: number; // average liters per refill
  refillFrequency: 'frequent' | 'moderate' | 'infrequent';
  fuelTypePreference: { [key: string]: number }; // percentage by fuel type
  locationPatterns: { [key: string]: number }; // frequency by location
}

export interface DriveSmarter {
  efficiencyTrend: 'improving' | 'declining' | 'stable';
  fuelSavingsPotential: number; // estimated savings in Rupiah
  co2ReductionPotential: number; // estimated CO2 reduction in kg
  recommendations: string[];
  drivingScore: number; // 0-100 score
}

export interface VehicleAnalysis {
  vehicleId: string;
  vehicleName: string;
  totalEntries: number;
  totalAmount: number;
  totalLiters: number;
  averageEfficiency: number;
  co2Emissions: number;
  lastRefill: Date;
  averageRefillAmount: number;
}

export interface TimePeriodFilter {
  label: string;
  days: number;
  startDate: Date;
  endDate: Date;
}

export interface DriveFurtherRefillLess {
  currentEfficiency: number; // current km/L
  targetEfficiency: number; // target km/L
  potentialSavings: {
    litersPerMonth: number;
    amountPerMonth: number;
    co2ReductionPerMonth: number;
  };
  tips: string[];
  progressToTarget: number; // percentage
} 