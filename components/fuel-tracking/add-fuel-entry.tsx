"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Plus, Calculator } from "lucide-react";
import { format } from "date-fns";
import { INDONESIAN_FUEL_TYPES, VEHICLE_TYPES, getFuelTypeById, formatRupiah } from "@/lib/data/fuel-types";
import { FuelEntry } from "@/lib/types/fuel";
import { OdometerInput } from "./odometer-input";

interface AddFuelEntryProps {
  onAddEntry: (entry: Omit<FuelEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
  recentEntries?: FuelEntry[];
}

export function AddFuelEntry({ onAddEntry, isLoading = false, recentEntries = [] }: AddFuelEntryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date(),
    vehicleType: "",
    fuelType: "",
    liters: "",
    pricePerLiter: "",
    totalAmount: "",
    odometer: "",
    location: "",
    notes: ""
  });

  const selectedFuelType = getFuelTypeById(newEntry.fuelType);

  // Auto-calculate total amount when liters or price changes
  const handleLitersChange = (value: string) => {
    setNewEntry(prev => {
      const liters = parseFloat(value) || 0;
      const pricePerLiter = parseFloat(prev.pricePerLiter) || selectedFuelType?.pricePerLiter || 0;
      const totalAmount = liters * pricePerLiter;
      
      return {
        ...prev,
        liters: value,
        totalAmount: totalAmount.toString()
      };
    });
  };

  const handlePricePerLiterChange = (value: string) => {
    setNewEntry(prev => {
      const pricePerLiter = parseFloat(value) || 0;
      const liters = parseFloat(prev.liters) || 0;
      const totalAmount = liters * pricePerLiter;
      
      return {
        ...prev,
        pricePerLiter: value,
        totalAmount: totalAmount.toString()
      };
    });
  };

  const handleFuelTypeChange = (fuelTypeId: string) => {
    const fuelType = getFuelTypeById(fuelTypeId);
    setNewEntry(prev => {
      const liters = parseFloat(prev.liters) || 0;
      const pricePerLiter = fuelType?.pricePerLiter || 0;
      const totalAmount = liters * pricePerLiter;
      
      return {
        ...prev,
        fuelType: fuelTypeId,
        pricePerLiter: pricePerLiter.toString(),
        totalAmount: totalAmount.toString()
      };
    });
  };

  const handleSubmit = () => {
    if (newEntry.vehicleType && newEntry.fuelType && newEntry.liters && newEntry.totalAmount && newEntry.odometer) {
      onAddEntry({
        date: newEntry.date,
        vehicleType: newEntry.vehicleType,
        fuelType: newEntry.fuelType,
        liters: parseFloat(newEntry.liters),
        pricePerLiter: parseFloat(newEntry.pricePerLiter),
        totalAmount: parseFloat(newEntry.totalAmount),
        odometer: parseFloat(newEntry.odometer),
        location: newEntry.location || undefined,
        notes: newEntry.notes || undefined,
      });
      
      setNewEntry({
        date: new Date(),
        vehicleType: "",
        fuelType: "",
        liters: "",
        pricePerLiter: "",
        totalAmount: "",
        odometer: "",
        location: "",
        notes: ""
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Isi Bensin
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Catatan Isi Bensin</DialogTitle>
          <DialogDescription>
            Catat konsumsi bahan bakar dan hitung emisi CO2 secara otomatis
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Tanggal Isi Bensin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(newEntry.date, "dd MMMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newEntry.date}
                  onSelect={(date) => date && setNewEntry({...newEntry, date})}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicle Type */}
            <div className="space-y-2">
              <Label htmlFor="vehicle">Jenis Kendaraan</Label>
              <Select 
                value={newEntry.vehicleType} 
                onValueChange={(value) => setNewEntry({...newEntry, vehicleType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kendaraan" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <Label htmlFor="fuel">Jenis Bahan Bakar</Label>
              <Select 
                value={newEntry.fuelType} 
                onValueChange={handleFuelTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bahan bakar" />
                </SelectTrigger>
                <SelectContent>
                  {INDONESIAN_FUEL_TYPES.map((fuel) => (
                    <SelectItem key={fuel.id} value={fuel.id}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: fuel.color }}
                        />
                        <span>{fuel.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({formatRupiah(fuel.pricePerLiter)}/L)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFuelType && (
                <p className="text-xs text-muted-foreground">
                  {selectedFuelType.description}
                </p>
              )}
            </div>
          </div>

          {/* Fuel Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liters">Jumlah Liter</Label>
              <Input
                id="liters"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newEntry.liters}
                onChange={(e) => handleLitersChange(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Harga per Liter</Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={newEntry.pricePerLiter}
                onChange={(e) => handlePricePerLiterChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total">Total Bayar</Label>
              <div className="relative">
                <Input
                  id="total"
                  type="number"
                  placeholder="0"
                  value={newEntry.totalAmount}
                  onChange={(e) => setNewEntry({...newEntry, totalAmount: e.target.value})}
                />
                <Calculator className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
              {parseFloat(newEntry.totalAmount) > 0 && (
                <p className="text-xs text-green-600">
                  {formatRupiah(parseFloat(newEntry.totalAmount))}
                </p>
              )}
            </div>
          </div>

          {/* Smart Odometer Input */}
          <OdometerInput
            value={parseInt(newEntry.odometer) || 0}
            onChange={(value) => setNewEntry({...newEntry, odometer: value.toString()})}
            vehicleType={newEntry.vehicleType}
            recentEntries={recentEntries}
          />

          {/* Location (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi SPBU (Opsional)</Label>
            <Input
              id="location"
              placeholder="Contoh: SPBU Shell Sudirman"
              value={newEntry.location}
              onChange={(e) => setNewEntry({...newEntry, location: e.target.value})}
            />
          </div>

          {/* Notes (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              placeholder="Tambahkan catatan khusus..."
              value={newEntry.notes}
              onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
              rows={3}
            />
          </div>

          {/* Summary Preview */}
          {newEntry.liters && newEntry.vehicleType && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-sm text-green-800">Perkiraan Emisi CO2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700">
                  Sekitar {((parseFloat(newEntry.liters) || 0) * 
                    (VEHICLE_TYPES.find(v => v.id === newEntry.vehicleType)?.co2PerLiter || 0)).toFixed(1)} kg CO2
                </p>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={isLoading || !newEntry.vehicleType || !newEntry.fuelType || !newEntry.liters || !newEntry.odometer}
          >
            {isLoading ? "Menyimpan..." : "Simpan Catatan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 