"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Fuel, 
  TrendingUp, 
  Target,
  AlertCircle,
  CheckCircle,
  Zap
} from "lucide-react";
import { MonthlyStats } from "@/lib/types/fuel";
import { formatRupiah } from "@/lib/data/fuel-types";

interface StatsOverviewProps {
  currentMonthStats: MonthlyStats;
  co2Threshold?: number;
  co2Target?: number;
  budgetLimit?: number;
}

export function StatsOverview({ 
  currentMonthStats, 
  co2Threshold = 200, 
  budgetLimit = 2000000 // 2 juta rupiah
}: StatsOverviewProps) {
  
  const co2Status = currentMonthStats.co2Emissions > co2Threshold ? 'danger' : 'safe';
  const budgetStatus = currentMonthStats.totalAmount > budgetLimit ? 'over' : 'under';
  const co2Progress = (currentMonthStats.co2Emissions / co2Threshold) * 100;
  const budgetProgress = (currentMonthStats.totalAmount / budgetLimit) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Total Amount This Month */}
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
          <Fuel className={`h-4 w-4 ${budgetStatus === 'over' ? 'text-red-500' : 'text-green-500'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatRupiah(currentMonthStats.totalAmount)}</div>
          <p className="text-xs text-muted-foreground">
            {budgetStatus === 'over' ? 'Melebihi budget' : 'Dalam budget'}
          </p>
          <Progress value={Math.min(budgetProgress, 100)} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Budget: {formatRupiah(budgetLimit)}
          </p>
        </CardContent>
      </Card>

      {/* Total Liters */}
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Liter</CardTitle>
          <Fuel className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentMonthStats.totalLiters.toFixed(1)}L</div>
          <p className="text-xs text-muted-foreground">
            {currentMonthStats.refillCount} kali isi bensin
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-3 w-3 text-blue-500 mr-1" />
            <span className="text-sm text-blue-600">
              Rata-rata {(currentMonthStats.totalLiters / Math.max(currentMonthStats.refillCount, 1)).toFixed(1)}L/isi
            </span>
          </div>
        </CardContent>
      </Card>

      {/* CO2 Emissions */}
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CO2 Bulan Ini</CardTitle>
          <AlertCircle className={`h-4 w-4 ${co2Status === 'danger' ? 'text-red-500' : 'text-green-500'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentMonthStats.co2Emissions.toFixed(1)}kg</div>
          <p className="text-xs text-muted-foreground">
            {co2Status === 'danger' ? 'Melebihi batas' : 'Dalam batas aman'}
          </p>
          <Progress 
            value={Math.min(co2Progress, 100)} 
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Batas: {co2Threshold}kg CO2
          </p>
        </CardContent>
      </Card>

      {/* Fuel Efficiency */}
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Efisiensi BBM</CardTitle>
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currentMonthStats.efficiency > 0 ? `${currentMonthStats.efficiency.toFixed(1)} km/L` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">
            Konsumsi bahan bakar
          </p>
          {currentMonthStats.efficiency > 0 && (
            <div className="flex items-center mt-2">
              {currentMonthStats.efficiency >= 10 ? (
                <>
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Efisien</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-600">Bisa ditingkatkan</span>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Summary Card */}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-600" />
            <span>Ringkasan Bulan {currentMonthStats.month} {currentMonthStats.year}</span>
          </CardTitle>
          <CardDescription>Statistik penggunaan bahan bakar dan emisi CO2</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {currentMonthStats.refillCount}
              </div>
              <div className="text-sm text-muted-foreground">Kali Isi Bensin</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {formatRupiah(currentMonthStats.totalAmount / Math.max(currentMonthStats.refillCount, 1))}
              </div>
              <div className="text-sm text-muted-foreground">Rata-rata per Isi</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {(currentMonthStats.totalAmount / Math.max(currentMonthStats.totalLiters, 1)).toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Rp per Liter</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {(currentMonthStats.co2Emissions / Math.max(currentMonthStats.totalLiters, 1)).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">kg CO2 per Liter</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2 text-green-800">💡 Tips Penghematan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">🚗 Berkendara Efisien:</span>
                <p className="text-muted-foreground">Jaga kecepatan konstan, hindari akselerasi mendadak</p>
              </div>
              <div>
                <span className="font-medium">🌱 Ramah Lingkungan:</span>
                <p className="text-muted-foreground">Gunakan transportasi umum atau kendaraan listrik</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 