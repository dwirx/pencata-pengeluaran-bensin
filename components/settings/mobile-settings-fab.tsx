"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { SettingsDialog } from "./settings-dialog";
import { VehicleType } from "@/lib/types/fuel";

interface MobileSettingsFabProps {
  onExportData: () => void;
  onImportData: (data: any) => void;
  onResetData: () => void;
  customVehicleTypes?: VehicleType[];
  onAddVehicleType?: (vehicleType: VehicleType) => void;
  onDeleteVehicleType?: (vehicleId: string) => void;
}

export function MobileSettingsFab(props: MobileSettingsFabProps) {
  return (
    <SettingsDialog {...props}>
      <Button 
        size="lg"
        className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg sm:hidden"
      >
        <Settings className="h-6 w-6" />
      </Button>
    </SettingsDialog>
  );
} 