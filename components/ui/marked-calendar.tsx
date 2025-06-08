"use client";

import { Calendar } from "@/components/ui/calendar";
import { FuelEntry } from "@/lib/types/fuel";
import { format, Locale } from "date-fns";
import { cn } from "@/lib/utils";

interface MarkedCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  entries: FuelEntry[];
  className?: string;
  locale?: Locale;
}

export function MarkedCalendar({ 
  selected, 
  onSelect, 
  entries, 
  className,
  locale 
}: MarkedCalendarProps) {
  
  // Get dates that have fuel entries
  const getDatesWithEntries = () => {
    const datesMap = new Map<string, number>();
    entries.forEach(entry => {
      const dateKey = format(entry.date, 'yyyy-MM-dd');
      datesMap.set(dateKey, (datesMap.get(dateKey) || 0) + 1);
    });
    return datesMap;
  };

  const datesWithEntries = getDatesWithEntries();

  return (
    <div className="space-y-4">
      <div className="relative">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          className={cn("rounded-md border", className)}
          locale={locale}
          modifiers={{
            hasEntries: (date) => {
              const dateKey = format(date, 'yyyy-MM-dd');
              return datesWithEntries.has(dateKey);
            }
          }}
          modifiersClassNames={{
            hasEntries: "bg-green-100 text-green-800 font-semibold relative"
          }}
        />
        
        {/* Future: Overlay dots for entry counts */}
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="font-semibold text-green-800">Total Hari Isi</div>
          <div className="text-2xl font-bold text-green-600">{datesWithEntries.size}</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="font-semibold text-blue-800">Total Isi Bensin</div>
          <div className="text-2xl font-bold text-blue-600">
            {Array.from(datesWithEntries.values()).reduce((sum, count) => sum + count, 0)}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="text-xs space-y-2 p-3 bg-gray-50 rounded-lg">
        <div className="font-semibold mb-2">📅 Keterangan Calendar:</div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
          <span>Tanggal ada isi bensin</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
          <span>Tanggal biasa</span>
        </div>
        <div className="text-xs text-gray-600 mt-2">
          💡 <strong>Tip:</strong> Klik tanggal untuk lihat detail isi bensin
        </div>
      </div>
    </div>
  );
} 