"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkedCalendar } from "@/components/ui/marked-calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, BarChart3, Fuel } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Import our modular components
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { AdvancedAnalytics } from "@/components/dashboard/advanced-analytics";
import { TimePeriodFilterComponent } from "@/components/dashboard/time-period-filter";
import { AddFuelEntry } from "@/components/fuel-tracking/add-fuel-entry";
import { FuelEntriesList } from "@/components/fuel-tracking/fuel-entries-list";
import { useFuelData } from "@/hooks/use-fuel-data";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { MobileSettingsFab } from "@/components/settings/mobile-settings-fab";
import { InstallPrompt, IOSInstallInstructions } from "@/components/pwa/install-prompt";
import { ClientOnly } from "@/components/common/client-only";

export default function EcoFuelAnalytics() {
  const {
    fuelEntries,
    isLoading,
    addFuelEntry,
    updateFuelEntry,
    deleteFuelEntry,
    getEntriesByDate,
    getEntriesByPeriod,
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
  } = useFuelData();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const entriesForSelectedDate = getEntriesByDate(selectedDate);

  return (
    <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
      {/* Header - Mobile Optimized */}
      <div className="text-center space-y-3 sm:space-y-4 py-4 sm:py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 flex-1">
            <Leaf className="h-8 w-8 sm:h-12 sm:w-12 text-green-600" />
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Eco-fuel Analytics
            </h1>
          </div>
          <div className="hidden sm:block">
            <SettingsDialog
              onExportData={exportData}
              onImportData={importData}
              onResetData={resetAllData}
              customVehicleTypes={customVehicleTypes}
              onAddVehicleType={addCustomVehicleType}
              onDeleteVehicleType={deleteCustomVehicleType}
            />
          </div>
        </div>
        <p className="text-sm sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Unlock your driving insights • Track fuel • Monitor emissions • Drive greener
        </p>
      </div>

      {/* Main Content Tabs - Mobile Responsive */}
      <Tabs defaultValue="dashboard" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="dashboard" className="text-xs sm:text-sm py-2">Dashboard</TabsTrigger>
          <TabsTrigger value="tracking" className="text-xs sm:text-sm py-2">Pencatatan BBM</TabsTrigger>
          <TabsTrigger value="emissions" className="text-xs sm:text-sm py-2">Analisis CO2</TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs sm:text-sm py-2">Kalender</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
          <StatsOverview currentMonthStats={currentMonthStats} />

          {/* Time Period Filter */}
          <TimePeriodFilterComponent
            periods={timePeriodFilters}
            onPeriodChange={() => {}}
            getEntriesByPeriod={getEntriesByPeriod}
          />

          {/* Advanced Analytics */}
          <AdvancedAnalytics
            gapAnalysis={gapAnalysis}
            fuelingHabits={fuelingHabits}
            driveSmarter={driveSmarter}
            vehicleAnalysis={vehicleAnalysis}
            driveFurtherRefillLess={driveFurtherRefillLess}
          />

          {/* Monthly Trends - Mobile Optimized */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <span>Tren 6 Bulan Terakhir</span>
              </CardTitle>
              <CardDescription className="text-sm">Perkembangan konsumsi dan emisi CO2</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {last6MonthsStats.map((stat, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="space-y-1 mb-2 sm:mb-0">
                      <h4 className="font-semibold text-sm">{stat.month} {stat.year}</h4>
                      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-muted-foreground">
                        <span>{stat.refillCount} isi</span>
                        <span>{stat.totalLiters.toFixed(1)}L</span>
                        <span>{stat.efficiency > 0 ? `${stat.efficiency.toFixed(1)} km/L` : 'N/A'}</span>
                        <span className="text-red-600">{stat.co2Emissions.toFixed(1)}kg CO2</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-base sm:text-lg font-bold text-green-600">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(stat.totalAmount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fuel Tracking Tab */}
        <TabsContent value="tracking" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <h2 className="text-lg sm:text-2xl font-bold">Pencatatan Bahan Bakar</h2>
            <AddFuelEntry onAddEntry={addFuelEntry} isLoading={isLoading} recentEntries={fuelEntries} />
          </div>

          <FuelEntriesList 
            entries={fuelEntries} 
            onEdit={(entry) => updateFuelEntry(entry.id, entry)}
            onDelete={deleteFuelEntry}
          />
        </TabsContent>

        {/* CO2 Analysis Tab */}
        <TabsContent value="emissions" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Analisis Emisi CO2</CardTitle>
              <CardDescription className="text-sm">Analisis detail jejak karbon Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div className="text-center p-3 border rounded-lg bg-red-50">
                  <p className="text-lg sm:text-2xl font-bold text-red-600">
                    {currentMonthStats.co2Emissions.toFixed(1)}kg
                  </p>
                  <p className="text-xs text-muted-foreground">CO2 Diproduksi</p>
                </div>
                <div className="text-center p-3 border rounded-lg bg-green-50">
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    {Math.max(0, 200 - currentMonthStats.co2Emissions).toFixed(1)}kg
                  </p>
                  <p className="text-xs text-muted-foreground">CO2 Tersisa</p>
                </div>
                <div className="text-center p-3 border rounded-lg bg-orange-50">
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">200kg</p>
                  <p className="text-xs text-muted-foreground">Batas Bulanan</p>
                </div>
                <div className="text-center p-3 border rounded-lg bg-blue-50">
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">150kg</p>
                  <p className="text-xs text-muted-foreground">Target Optimal</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Rincian Bulanan</h4>
                {last6MonthsStats.slice(-4).map((data, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded hover:bg-gray-50">
                    <span className="font-medium text-sm">Bulan {data.month}</span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs">
                      <span className="text-red-600">{data.co2Emissions.toFixed(1)}kg CO2</span>
                      <span className="text-blue-600">{data.efficiency.toFixed(1)} km/L</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Kalender Isi Bensin</CardTitle>
              <CardDescription className="text-sm">Lihat catatan isi bensin berdasarkan tanggal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <div className="lg:w-1/2">
                  <MarkedCalendar
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    entries={fuelEntries}
                    className="w-full"
                    locale={id}
                  />
                </div>
                <div className="lg:w-1/2 space-y-3">
                  <h4 className="font-semibold text-sm">
                    Catatan untuk {format(selectedDate, "dd MMMM yyyy", { locale: id })}
                  </h4>
                  {entriesForSelectedDate.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Fuel className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Tidak ada catatan untuk tanggal ini</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {entriesForSelectedDate.map((entry) => (
                        <Card key={entry.id} className="p-3 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-1 sm:space-y-0">
                            <div className="flex-1">
                              <h5 className="font-semibold text-sm">
                                {new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }).format(entry.totalAmount)}
                              </h5>
                              <p className="text-xs text-muted-foreground">
                                {entry.liters}L • {entry.vehicleType} • {entry.odometer.toLocaleString()}km
                              </p>
                              {entry.location && (
                                <p className="text-xs text-muted-foreground">📍 {entry.location}</p>
                              )}
                            </div>
                            <div className="text-xs text-red-600 sm:text-right">
                              ~{((entry.liters * 2.3)).toFixed(1)}kg CO2
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mobile Settings FAB */}
      <ClientOnly>
        <div className="fixed bottom-4 right-4 z-50">
          <MobileSettingsFab
            onExportData={exportData}
            onImportData={importData}
            onResetData={resetAllData}
            customVehicleTypes={customVehicleTypes}
            onAddVehicleType={addCustomVehicleType}
            onDeleteVehicleType={deleteCustomVehicleType}
          />
        </div>
      </ClientOnly>

      {/* PWA Install Prompts */}
      <ClientOnly>
        <InstallPrompt />
        <IOSInstallInstructions />
      </ClientOnly>
    </div>
  );
}
