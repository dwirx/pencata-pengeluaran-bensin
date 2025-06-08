import { FuelType, VehicleType } from "@/lib/types/fuel";

export const INDONESIAN_FUEL_TYPES: FuelType[] = [
  {
    id: "pertalite",
    name: "Pertalite",
    octaneRating: 90,
    pricePerLiter: 10000, // Rp per liter (update sesuai harga terkini)
    color: "#4ade80", // Green
    description: "Bahan bakar dengan RON 90, ramah lingkungan"
  },
  {
    id: "pertamax",
    name: "Pertamax",
    octaneRating: 92,
    pricePerLiter: 12400,
    color: "#3b82f6", // Blue
    description: "Bahan bakar dengan RON 92, performa mesin lebih baik"
  },
  {
    id: "pertamax-turbo",
    name: "Pertamax Turbo",
    octaneRating: 98,
    pricePerLiter: 13700,
    color: "#8b5cf6", // Purple
    description: "Bahan bakar premium dengan RON 98, performa maksimal"
  },
  {
    id: "pertamax-green-95",
    name: "Pertamax Green 95",
    octaneRating: 95,
    pricePerLiter: 13400,
    color: "#10b981", // Emerald
    description: "Bahan bakar ramah lingkungan dengan RON 95"
  },
  {
    id: "solar",
    name: "Solar",
    octaneRating: 0, // Diesel doesn't use octane rating
    pricePerLiter: 5150,
    color: "#f59e0b", // Amber
    description: "Bahan bakar diesel untuk kendaraan diesel"
  },
  {
    id: "pertamina-dex",
    name: "Pertamina Dex",
    octaneRating: 0,
    pricePerLiter: 13300,
    color: "#ef4444", // Red
    description: "Bahan bakar diesel premium dengan aditif pembersih"
  },
  {
    id: "premium",
    name: "Premium",
    octaneRating: 88,
    pricePerLiter: 6800,
    color: "#6b7280", // Gray
    description: "Bahan bakar dengan RON 88 (sudah tidak dijual umum)"
  }
];

export const VEHICLE_TYPES: VehicleType[] = [
  {
    id: "car",
    name: "Mobil",
    icon: "car",
    co2PerLiter: 2.3 // kg CO2 per liter untuk bensin
  },
  {
    id: "motorcycle",
    name: "Sepeda Motor",
    icon: "bike",
    co2PerLiter: 1.8 // kg CO2 per liter untuk sepeda motor
  },
  {
    id: "truck",
    name: "Truk",
    icon: "truck",
    co2PerLiter: 2.7 // kg CO2 per liter untuk diesel
  },
  {
    id: "suv",
    name: "SUV",
    icon: "car",
    co2PerLiter: 2.5 // kg CO2 per liter untuk SUV
  }
];

export const getFuelTypeById = (id: string): FuelType | undefined => {
  return INDONESIAN_FUEL_TYPES.find(fuel => fuel.id === id);
};

export const getVehicleTypeById = (id: string): VehicleType | undefined => {
  return VEHICLE_TYPES.find(vehicle => vehicle.id === id);
};

export const calculateCO2Emissions = (liters: number, vehicleTypeId: string): number => {
  const vehicleType = getVehicleTypeById(vehicleTypeId);
  return vehicleType ? liters * vehicleType.co2PerLiter : 0;
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}; 