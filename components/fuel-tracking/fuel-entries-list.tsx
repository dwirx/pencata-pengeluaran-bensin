"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Bike, 
  Truck, 
  Fuel, 
  MapPin, 
  Clock, 
  Edit, 
  Trash2,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FuelEntry } from "@/lib/types/fuel";
import { getFuelTypeById, getVehicleTypeById, formatRupiah, calculateCO2Emissions } from "@/lib/data/fuel-types";

interface FuelEntriesListProps {
  entries: FuelEntry[];
  onEdit?: (entry: FuelEntry) => void;
  onDelete?: (entryId: string) => void;
}

const getVehicleIcon = (vehicleType: string) => {
  switch (vehicleType) {
    case 'car':
    case 'suv':
      return Car;
    case 'motorcycle':
      return Bike;
    case 'truck':
      return Truck;
    default:
      return Car;
  }
};

export function FuelEntriesList({ entries, onEdit, onDelete }: FuelEntriesListProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Fuel className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Belum ada catatan isi bensin</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Mulai catat konsumsi bahan bakar Anda untuk melacak pengeluaran dan emisi CO2.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Catatan Isi Bensin ({entries.length})
        </h3>
        <Badge variant="secondary">
          Total: {formatRupiah(entries.reduce((sum, entry) => sum + entry.totalAmount, 0))}
        </Badge>
      </div>

      <div className="space-y-3">
        {sortedEntries.map((entry) => {
          const fuelType = getFuelTypeById(entry.fuelType);
          const vehicleType = getVehicleTypeById(entry.vehicleType);
          const VehicleIcon = getVehicleIcon(entry.vehicleType);
          const co2Emission = calculateCO2Emissions(entry.liters, entry.vehicleType);

          return (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Vehicle Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <VehicleIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-lg">
                          {formatRupiah(entry.totalAmount)}
                        </h4>
                        {fuelType && (
                          <Badge 
                            style={{ backgroundColor: fuelType.color + '20', color: fuelType.color }}
                            className="border-0"
                          >
                            {fuelType.name}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(entry.date, "dd MMMM yyyy", { locale: id })}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(entry.createdAt, "HH:mm")}</span>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Liter:</span>
                          <div className="font-medium">{entry.liters}L</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Harga/L:</span>
                          <div className="font-medium">{formatRupiah(entry.pricePerLiter)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Kendaraan:</span>
                          <div className="font-medium">{vehicleType?.name}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Odometer:</span>
                          <div className="font-medium">{entry.odometer.toLocaleString()} km</div>
                        </div>
                      </div>

                      {/* Location & Notes */}
                      {(entry.location || entry.notes) && (
                        <div className="mt-3 space-y-1">
                          {entry.location && (
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{entry.location}</span>
                            </div>
                          )}
                          {entry.notes && (
                            <div className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                              📝 {entry.notes}
                            </div>
                          )}
                        </div>
                      )}

                      {/* CO2 Emission */}
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm">
                        <div className="flex items-center space-x-1 text-red-700">
                          <span>🌍 Emisi CO2:</span>
                          <span className="font-semibold">{co2Emission.toFixed(1)} kg</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-4">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(entry)}
                        className="w-8 h-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(entry.id)}
                        className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Footer */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {entries.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Isi Bensin</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {entries.reduce((sum, entry) => sum + entry.liters, 0).toFixed(1)}L
              </div>
              <div className="text-sm text-muted-foreground">Total Liter</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {formatRupiah(entries.reduce((sum, entry) => sum + entry.totalAmount, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Biaya</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {entries.reduce((sum, entry) => 
                  sum + calculateCO2Emissions(entry.liters, entry.vehicleType), 0
                ).toFixed(1)}kg
              </div>
              <div className="text-sm text-muted-foreground">Total CO2</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 