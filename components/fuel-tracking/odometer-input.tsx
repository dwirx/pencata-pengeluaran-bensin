"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, HelpCircle, Calculator } from "lucide-react";
import { FuelEntry } from "@/lib/types/fuel";

interface OdometerInputProps {
  value: number;
  onChange: (value: number) => void;
  vehicleType: string;
  recentEntries: FuelEntry[];
  label?: string;
  placeholder?: string;
}

export function OdometerInput({
  value,
  onChange,
  vehicleType,
  recentEntries,
  label = "Odometer (km)",
  placeholder = "Contoh: 15000"
}: OdometerInputProps) {
  const [showHelper, setShowHelper] = useState(false);
  const [useEstimate, setUseEstimate] = useState(false);

  // Calculate estimated odometer based on previous entries
  const getEstimatedOdometer = () => {
    if (recentEntries.length === 0) return 0;
    
    const lastEntry = recentEntries[recentEntries.length - 1];
    if (!lastEntry) return 0;

    // Estimate based on average driving patterns
    const daysSinceLastFill = Math.floor(
      (new Date().getTime() - lastEntry.date.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Average daily driving: 30km for cars, 20km for motorcycles
    const avgDailyDistance = vehicleType === 'motorcycle' ? 20 : 30;
    const estimatedDistance = daysSinceLastFill * avgDailyDistance;
    
    return lastEntry.odometer + estimatedDistance;
  };

  const estimatedOdometer = getEstimatedOdometer();

  const handleUseEstimate = () => {
    onChange(estimatedOdometer);
    setUseEstimate(true);
    setShowHelper(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    onChange(newValue);
    setUseEstimate(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label htmlFor="odometer" className="text-sm font-medium">
          {label}
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowHelper(!showHelper)}
          className="h-6 w-6 p-0"
        >
          <HelpCircle className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-2">
        <Input
          id="odometer"
          type="number"
          value={value || ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`${useEstimate ? 'border-blue-500 bg-blue-50' : ''}`}
        />
        
        {useEstimate && (
          <div className="flex items-center space-x-1 text-xs text-blue-600">
            <Calculator className="h-3 w-3" />
            <span>Menggunakan estimasi otomatis</span>
          </div>
        )}
      </div>

      {showHelper && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-3 space-y-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="text-blue-800 font-medium">
                  Tidak tahu angka kilometer saat ini?
                </p>
                <p className="text-blue-700 text-xs">
                  Tidak masalah! Anda bisa menggunakan estimasi atau memasukkan angka perkiraan.
                  Aplikasi akan menghitung efisiensi berdasarkan pola pengisian Anda.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {recentEntries.length > 0 && estimatedOdometer > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-blue-700">
                    💡 Berdasarkan isi bensin terakhir pada {recentEntries[recentEntries.length - 1]?.date.toLocaleDateString('id-ID')}:
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUseEstimate}
                    className="w-full text-xs h-8 border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Calculator className="h-3 w-3 mr-1" />
                    Gunakan estimasi: {estimatedOdometer.toLocaleString()} km
                  </Button>
                </div>
              )}

              <div className="border-t pt-2 space-y-1 text-xs text-blue-600">
                <p>📋 <strong>Tips:</strong></p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li>Cek dashboard kendaraan atau aplikasi kendaraan</li>
                  <li>Perkirakan saja jika tidak tahu pasti</li>
                  <li>Konsistensi lebih penting daripada akurasi absolut</li>
                  <li>Data akan lebih akurat seiring waktu</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 