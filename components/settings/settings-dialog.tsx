"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Settings, 
  Plus, 
  Car, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw,
  AlertTriangle
} from "lucide-react";
import { VehicleType } from "@/lib/types/fuel";
import { VEHICLE_TYPES } from "@/lib/data/fuel-types";

interface SettingsDialogProps {
  onExportData: () => void;
  onImportData: (data: any) => void;
  onResetData: () => void;
  customVehicleTypes?: VehicleType[];
  onAddVehicleType?: (vehicleType: VehicleType) => void;
  onDeleteVehicleType?: (vehicleId: string) => void;
  children?: React.ReactNode;
}

export function SettingsDialog({
  onExportData,
  onImportData,
  onResetData,
  customVehicleTypes = [],
  onAddVehicleType,
  onDeleteVehicleType,
  children
}: SettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    icon: "car",
    co2PerLiter: ""
  });

  const allVehicleTypes = [...VEHICLE_TYPES, ...customVehicleTypes];

  const handleAddVehicle = () => {
    if (newVehicle.name && newVehicle.co2PerLiter && onAddVehicleType) {
      const vehicleType: VehicleType = {
        id: `custom-${Date.now()}`,
        name: newVehicle.name,
        icon: newVehicle.icon,
        co2PerLiter: parseFloat(newVehicle.co2PerLiter)
      };
      
      onAddVehicleType(vehicleType);
      setNewVehicle({ name: "", icon: "car", co2PerLiter: "" });
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          onImportData(data);
          setIsOpen(false);
        } catch (error) {
          alert("File tidak valid! Pastikan format JSON benar.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Pengaturan Aplikasi</span>
          </DialogTitle>
          <DialogDescription>
            Kelola jenis kendaraan, export/import data, dan pengaturan lainnya
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="vehicles" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vehicles">Kendaraan</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="about">Info</TabsTrigger>
          </TabsList>

          {/* Vehicle Types Tab */}
          <TabsContent value="vehicles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Car className="h-5 w-5" />
                  <span>Tambah Jenis Kendaraan</span>
                </CardTitle>
                <CardDescription>
                  Buat jenis kendaraan custom dengan emisi CO2 yang sesuai
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-name">Nama Kendaraan</Label>
                    <Input
                      id="vehicle-name"
                      placeholder="Contoh: Motor Matic"
                      value={newVehicle.name}
                      onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-icon">Jenis</Label>
                    <Select 
                      value={newVehicle.icon} 
                      onValueChange={(value) => setNewVehicle({...newVehicle, icon: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">🚗 Mobil</SelectItem>
                        <SelectItem value="motorcycle">🏍️ Motor</SelectItem>
                        <SelectItem value="truck">🚛 Truk</SelectItem>
                        <SelectItem value="suv">🚙 SUV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-co2">CO2 per Liter (kg)</Label>
                    <Input
                      id="vehicle-co2"
                      type="number"
                      step="0.1"
                      placeholder="2.3"
                      value={newVehicle.co2PerLiter}
                      onChange={(e) => setNewVehicle({...newVehicle, co2PerLiter: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddVehicle}
                  disabled={!newVehicle.name || !newVehicle.co2PerLiter}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Kendaraan
                </Button>
              </CardContent>
            </Card>

            {/* Existing Vehicle Types */}
            <Card>
              <CardHeader>
                <CardTitle>Daftar Jenis Kendaraan</CardTitle>
                <CardDescription>
                  Semua jenis kendaraan yang tersedia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {allVehicleTypes.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {vehicle.icon === 'car' && '🚗'}
                          {vehicle.icon === 'motorcycle' && '🏍️'}
                          {vehicle.icon === 'truck' && '🚛'}
                          {vehicle.icon === 'suv' && '🚙'}
                        </div>
                        <div>
                          <div className="font-medium">{vehicle.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {vehicle.co2PerLiter} kg CO2/L
                          </div>
                        </div>
                      </div>
                      
                      {vehicle.id.startsWith('custom-') && onDeleteVehicleType && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Jenis Kendaraan</AlertDialogTitle>
                              <AlertDialogDescription>
                                Yakin ingin menghapus "{vehicle.name}"? Tindakan ini tidak bisa dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDeleteVehicleType(vehicle.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Export Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-600">
                    <Download className="h-5 w-5" />
                    <span>Export Data</span>
                  </CardTitle>
                  <CardDescription>
                    Unduh semua data sebagai file JSON untuk backup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={onExportData} className="w-full bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup JSON
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    File akan berisi semua catatan isi bensin dan pengaturan
                  </p>
                </CardContent>
              </Card>

              {/* Import Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-600">
                    <Upload className="h-5 w-5" />
                    <span>Import Data</span>
                  </CardTitle>
                  <CardDescription>
                    Restore data dari file JSON backup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <label htmlFor="import-file">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Pilih File JSON Backup
                      </span>
                    </Button>
                  </label>
                  <input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    ⚠️ Data lama akan diganti dengan data dari file
                  </p>
                </CardContent>
              </Card>

              {/* Reset Data */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <RotateCcw className="h-5 w-5" />
                    <span>Reset Data</span>
                  </CardTitle>
                  <CardDescription>
                    Hapus semua data aplikasi (tidak bisa dibatalkan)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Semua Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <span>Reset Semua Data</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <p className="font-semibold text-red-600">
                            ⚠️ PERHATIAN: Tindakan ini akan menghapus SEMUA data!
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Semua catatan isi bensin</li>
                            <li>Jenis kendaraan custom</li>
                            <li>Pengaturan aplikasi</li>
                          </ul>
                          <p className="font-semibold">
                            Pastikan sudah export data sebelum melakukan reset.
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => {
                            onResetData();
                            setIsOpen(false);
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Ya, Reset Semua
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Eco-fuel Analytics v2.0</CardTitle>
                <CardDescription>
                  Aplikasi tracking konsumsi BBM dan emisi CO2
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">🎯 Fitur Utama:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Tracking konsumsi BBM</li>
                      <li>• Monitoring emisi CO2</li>
                      <li>• Gap & habits analysis</li>
                      <li>• Drive smarter insights</li>
                      <li>• Vehicle analytics</li>
                      <li>• Calendar dengan marking</li>
                      <li>• Export/Import data</li>
                      <li>• Custom vehicle types</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🚀 Teknologi:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Next.js 15 + React 19</li>
                      <li>• TypeScript</li>
                      <li>• Tailwind CSS v4</li>
                      <li>• ShadCN UI</li>
                      <li>• Local Storage</li>
                      <li>• PWA Ready</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t pt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    💚 Dibuat untuk membantu monitoring konsumsi bahan bakar dan emisi CO2 
                    demi lingkungan yang lebih hijau.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 