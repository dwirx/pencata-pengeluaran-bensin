"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, TrendingUp } from "lucide-react";
import { TimePeriodFilter, FuelEntry } from "@/lib/types/fuel";
import { formatRupiah } from "@/lib/data/fuel-types";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface TimePeriodFilterProps {
  periods: TimePeriodFilter[];
  onPeriodChange: (period: TimePeriodFilter) => void;
  getEntriesByPeriod: (period: TimePeriodFilter) => FuelEntry[];
}

export function TimePeriodFilterComponent({
  periods,
  onPeriodChange,
  getEntriesByPeriod
}: TimePeriodFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);

  const handlePeriodChange = (period: TimePeriodFilter) => {
    setSelectedPeriod(period);
    onPeriodChange(period);
  };

  const calculatePeriodStats = (period: TimePeriodFilter) => {
    const periodEntries = getEntriesByPeriod(period);
    const totalAmount = periodEntries.reduce((sum, entry) => sum + entry.totalAmount, 0);
    const totalLiters = periodEntries.reduce((sum, entry) => sum + entry.liters, 0);
    const refillCount = periodEntries.length;
    const averagePerRefill = refillCount > 0 ? totalAmount / refillCount : 0;

    return {
      totalAmount,
      totalLiters,
      refillCount,
      averagePerRefill,
      entries: periodEntries
    };
  };

  const selectedStats = calculatePeriodStats(selectedPeriod);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <CalendarDays className="h-5 w-5 text-blue-500" />
          <span>Filter Periode Waktu</span>
        </CardTitle>
        <CardDescription className="text-sm">
          Analisis data berdasarkan periode waktu tertentu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Period Buttons - Mobile Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {periods.map((period, index) => (
            <Button
              key={index}
              variant={selectedPeriod.label === period.label ? "default" : "outline"}
              size="sm"
              onClick={() => handlePeriodChange(period)}
              className="text-xs h-9 px-2"
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Selected Period Info */}
        <div className="border rounded-lg p-3 bg-blue-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-800 text-sm">
                {selectedPeriod.label}
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {selectedStats.refillCount} isi bensin
            </Badge>
          </div>
          
          <div className="text-xs text-blue-700 space-y-1">
            <div>
              📅 {format(selectedPeriod.startDate, "dd MMM yyyy", { locale: id })} - {format(selectedPeriod.endDate, "dd MMM yyyy", { locale: id })}
            </div>
            {selectedStats.entries.length > 0 && (
              <div>
                🏁 Isi terakhir: {format(selectedStats.entries[selectedStats.entries.length - 1]?.date || new Date(), "dd MMM yyyy", { locale: id })}
              </div>
            )}
          </div>
        </div>

        {/* Period Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 border rounded-lg bg-green-50">
            <div className="text-lg font-bold text-green-600">
              {formatRupiah(selectedStats.totalAmount)}
            </div>
            <div className="text-xs text-muted-foreground">Total Biaya</div>
          </div>
          
          <div className="text-center p-3 border rounded-lg bg-blue-50">
            <div className="text-lg font-bold text-blue-600">
              {selectedStats.totalLiters.toFixed(1)}L
            </div>
            <div className="text-xs text-muted-foreground">Total Liter</div>
          </div>
          
          <div className="text-center p-3 border rounded-lg bg-purple-50">
            <div className="text-lg font-bold text-purple-600">
              {selectedStats.refillCount}
            </div>
            <div className="text-xs text-muted-foreground">Kali Isi</div>
          </div>
          
          <div className="text-center p-3 border rounded-lg bg-orange-50">
            <div className="text-lg font-bold text-orange-600">
              {formatRupiah(selectedStats.averagePerRefill)}
            </div>
            <div className="text-xs text-muted-foreground">Rata-rata/Isi</div>
          </div>
        </div>

        {/* Period Comparison - Show comparison with previous period if available */}
        {periods.length > 1 && (
          <div className="border-t pt-3">
            <h5 className="font-semibold text-sm mb-2 flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Perbandingan Periode</span>
            </h5>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {periods.slice(0, 4).map((period, index) => {
                const stats = calculatePeriodStats(period);
                return (
                  <div 
                    key={index} 
                    className={`p-2 border rounded text-xs ${
                      selectedPeriod.label === period.label 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium mb-1">{period.label}</div>
                    <div className="space-y-0.5 text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Biaya:</span>
                        <span className="font-medium">{formatRupiah(stats.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Liter:</span>
                        <span className="font-medium">{stats.totalLiters.toFixed(1)}L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Isi:</span>
                        <span className="font-medium">{stats.refillCount}x</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Data Message */}
        {selectedStats.refillCount === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Tidak ada data untuk periode ini</p>
            <p className="text-xs">Pilih periode waktu yang berbeda atau tambah data isi bensin</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 