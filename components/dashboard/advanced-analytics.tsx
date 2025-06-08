"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Zap,
  CheckCircle,
  BarChart3,
  Car
} from "lucide-react";
import { 
  GapAnalysis, 
  FuelingHabits, 
  DriveSmarter, 
  VehicleAnalysis, 
  DriveFurtherRefillLess 
} from "@/lib/types/fuel";
import { formatRupiah, getFuelTypeById } from "@/lib/data/fuel-types";

interface AdvancedAnalyticsProps {
  gapAnalysis: GapAnalysis;
  fuelingHabits: FuelingHabits;
  driveSmarter: DriveSmarter;
  vehicleAnalysis: VehicleAnalysis[];
  driveFurtherRefillLess: DriveFurtherRefillLess;
}

export function AdvancedAnalytics({
  gapAnalysis,
  fuelingHabits,
  driveSmarter,
  vehicleAnalysis,
  driveFurtherRefillLess
}: AdvancedAnalyticsProps) {

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'worsening': case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Drive Further, Refill Less - Mobile Optimized */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-green-800 text-lg">
            <Target className="h-5 w-5" />
            <span>Drive Further, Refill Less</span>
          </CardTitle>
          <CardDescription className="text-sm">Tingkatkan efisiensi untuk mengemudi lebih jauh</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-white/80 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Efisiensi Saat Ini</span>
                  <span className="font-bold">{driveFurtherRefillLess.currentEfficiency.toFixed(1)} km/L</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Target Efisiensi</span>
                  <span className="font-bold text-green-600">{driveFurtherRefillLess.targetEfficiency.toFixed(1)} km/L</span>
                </div>
                <Progress value={Math.min(driveFurtherRefillLess.progressToTarget, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Progress: {Math.min(driveFurtherRefillLess.progressToTarget, 100).toFixed(0)}%
                </p>
              </div>
              
              <div className="bg-white/80 p-3 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 text-sm">💰 Potensi Penghematan/Bulan</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>BBM:</span>
                    <span className="font-medium">{Math.abs(driveFurtherRefillLess.potentialSavings.litersPerMonth).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uang:</span>
                    <span className="font-medium text-green-600">
                      {formatRupiah(Math.abs(driveFurtherRefillLess.potentialSavings.amountPerMonth))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>CO2:</span>
                    <span className="font-medium text-blue-600">
                      {Math.abs(driveFurtherRefillLess.potentialSavings.co2ReductionPerMonth).toFixed(1)}kg
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-green-800 text-sm">💡 Tips Efisiensi</h4>
              <div className="space-y-2">
                {driveFurtherRefillLess.tips.slice(0, 4).map((tip, index) => (
                  <div key={index} className="flex items-start space-x-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gap Analysis & Habits - Mobile Stacked */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span>Gap Analysis</span>
            </CardTitle>
            <CardDescription className="text-sm">Jarak waktu antar pengisian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 border rounded-lg">
                <div className="text-xl font-bold text-blue-600">{gapAnalysis.currentGap}</div>
                <div className="text-xs text-muted-foreground">Current Gap</div>
              </div>
              <div className="text-center p-2 border rounded-lg">
                <div className="text-xl font-bold text-orange-600">{gapAnalysis.longestGap}</div>
                <div className="text-xs text-muted-foreground">Longest Gap</div>
              </div>
              <div className="text-center p-2 border rounded-lg">
                <div className="text-xl font-bold text-green-600">{gapAnalysis.averageGap.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Average Gap</div>
              </div>
              <div className="text-center p-2 border rounded-lg">
                <div className="text-xl font-bold text-purple-600">{gapAnalysis.totalGapDays}</div>
                <div className="text-xs text-muted-foreground">Total Gap</div>
              </div>
            </div>

            <div className="mt-3 p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                {getTrendIcon(gapAnalysis.gapTrend)}
                <span className="font-semibold text-blue-800 text-sm">
                  Tren: {gapAnalysis.gapTrend === 'improving' ? 'Membaik' : 
                         gapAnalysis.gapTrend === 'worsening' ? 'Memburuk' : 'Stabil'}
                </span>
              </div>
              <p className="text-xs text-blue-700">
                {gapAnalysis.averageGap < 7 
                  ? "Sering isi bensin (< 7 hari)" 
                  : gapAnalysis.averageGap > 14 
                  ? "Jarang isi bensin (> 14 hari)"
                  : "Pola normal (7-14 hari)"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <span>Fueling Habits</span>
            </CardTitle>
            <CardDescription className="text-sm">Kebiasaan pengisian bahan bakar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Hari Favorit:</span>
                <div className="flex flex-wrap gap-1">
                  {fuelingHabits.preferredDays.slice(0, 2).map((day, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground block mb-1">Waktu:</span>
                <Badge variant="outline" className="text-xs">
                  {fuelingHabits.preferredTimeRange === 'morning' ? 'Pagi' :
                   fuelingHabits.preferredTimeRange === 'afternoon' ? 'Siang' : 'Malam'}
                </Badge>
              </div>

              <div>
                <span className="text-muted-foreground block mb-1">Rata-rata:</span>
                <span className="font-medium">{fuelingHabits.averageRefillAmount.toFixed(1)}L</span>
              </div>

              <div>
                <span className="text-muted-foreground block mb-1">Frekuensi:</span>
                <Badge 
                  variant={fuelingHabits.refillFrequency === 'frequent' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {fuelingHabits.refillFrequency === 'frequent' ? 'Sering' :
                   fuelingHabits.refillFrequency === 'moderate' ? 'Sedang' : 'Jarang'}
                </Badge>
              </div>
            </div>

            {Object.keys(fuelingHabits.fuelTypePreference).length > 0 && (
              <div className="border-t pt-3">
                <h5 className="font-semibold text-sm mb-2">Preferensi BBM</h5>
                <div className="space-y-1">
                  {Object.entries(fuelingHabits.fuelTypePreference)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([fuelType, percentage], index) => {
                      const fuel = getFuelTypeById(fuelType);
                      return (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: fuel?.color || '#gray' }}
                            />
                            <span className="text-xs">{fuel?.name || fuelType}</span>
                          </div>
                          <span className="text-xs font-medium">{percentage.toFixed(0)}%</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Drive Smarter - Mobile Optimized */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Drive Smarter</span>
          </CardTitle>
          <CardDescription className="text-sm">Analisis cerdas berkendara efisien</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <div className="text-center border rounded-lg p-4">
                <div className={`text-3xl font-bold ${getScoreColor(driveSmarter.drivingScore)} mb-1`}>
                  {driveSmarter.drivingScore}
                </div>
                <div className="text-sm text-muted-foreground mb-3">Skor Berkendara</div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Tren:</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(driveSmarter.efficiencyTrend)}
                      <span className="text-xs">
                        {driveSmarter.efficiencyTrend === 'improving' ? 'Membaik' :
                         driveSmarter.efficiencyTrend === 'declining' ? 'Menurun' : 'Stabil'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-yellow-50 rounded">
                    <div className="text-xs font-semibold text-yellow-800 mb-1">
                      💰 Potensi Hemat/Bulan
                    </div>
                    <div className="text-sm font-bold text-yellow-700">
                      {formatRupiah(driveSmarter.fuelSavingsPotential)}
                    </div>
                    <div className="text-xs text-yellow-600">
                      ~{driveSmarter.co2ReductionPotential.toFixed(1)}kg CO2↓
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-semibold mb-2 text-sm">🎯 Rekomendasi Cerdas</h4>
              <div className="grid grid-cols-1 gap-2">
                {driveSmarter.recommendations.slice(0, 4).map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 border rounded text-sm hover:bg-gray-50">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Analysis - Mobile Grid */}
      {vehicleAnalysis.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Car className="h-5 w-5 text-blue-500" />
              <span>Analisis per Kendaraan</span>
            </CardTitle>
            <CardDescription className="text-sm">Performa masing-masing kendaraan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {vehicleAnalysis.map((vehicle, index) => (
                <div key={index} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-2 mb-2">
                    <Car className="h-4 w-4 text-blue-500" />
                    <h5 className="font-semibold text-sm">{vehicle.vehicleName}</h5>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Isi:</span>
                      <span className="font-medium">{vehicle.totalEntries}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Biaya:</span>
                      <span className="font-medium">{formatRupiah(vehicle.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Efisiensi:</span>
                      <span className="font-medium">
                        {vehicle.averageEfficiency > 0 ? `${vehicle.averageEfficiency.toFixed(1)}km/L` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CO2:</span>
                      <span className="font-medium text-red-600">{vehicle.co2Emissions.toFixed(1)}kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 