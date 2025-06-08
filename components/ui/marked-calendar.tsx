"use client";

import { Calendar } from "@/components/ui/calendar";
import { FuelEntry } from "@/lib/types/fuel";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface MarkedCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  entries: FuelEntry[];
  className?: string;
  locale?: any;
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

  // Custom day content to show marks
  const DayContent = ({ date }: { date: Date }) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const entryCount = datesWithEntries.get(dateKey) || 0;
    const hasEntries = entryCount > 0;
    const isSelected = selected && isSameDay(date, selected);

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={cn(
          "text-sm",
          isSelected && "font-bold text-white"
        )}>
          {date.getDate()}
        </span>
        {hasEntries && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <div className={cn(
              "flex space-x-0.5",
              entryCount === 1 && "justify-center",
              entryCount >= 2 && "justify-center"
            )}>
              {/* Show dots based on number of entries */}
              {Array.from({ length: Math.min(entryCount, 3) }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    entryCount === 1 && "bg-green-500",
                    entryCount === 2 && "bg-blue-500", 
                    entryCount >= 3 && "bg-purple-500",
                    isSelected && "bg-white"
                  )}
                />
              ))}
              {entryCount > 3 && (
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  "bg-red-500",
                  isSelected && "bg-white"
                )}>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        className={cn("rounded-md border", className)}
        locale={locale}
        components={{
          DayContent: DayContent as any
        }}
      />
      
      {/* Legend */}
      <div className="text-xs space-y-1 p-2 bg-gray-50 rounded">
        <div className="font-semibold mb-1">📌 Keterangan:</div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span>1 kali isi</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          <span>2 kali isi</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
          <span>3 kali isi</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          <span>4+ kali isi</span>
        </div>
      </div>
    </div>
  );
} 