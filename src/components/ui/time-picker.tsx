"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  // Parse the initial value or use defaults
  const parseTime = () => {
    try {
      if (value && value.includes(":")) {
        const [hourStr, minuteStr] = value.split(":");
        const hour = parseInt(hourStr);
        
        // Convert 24-hour to 12-hour format
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour >= 12 ? "PM" : "AM";
        
        return {
          hour: hour12.toString(),
          minute: minuteStr,
          period
        };
      }
    } catch (e) {
      console.log("Error parsing time:", e);
    }
    
    // Default values
    return { hour: "12", minute: "00", period: "AM" };
  };
  
  const initialTime = parseTime();
  
  const [hour, setHour] = React.useState(initialTime.hour);
  const [minute, setMinute] = React.useState(initialTime.minute);
  const [period, setPeriod] = React.useState<"AM" | "PM">(initialTime.period as "AM" | "PM");

  // Generate hours options (1-12)
  const hours = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
  ];

  // Generate minutes options (00-55, increments of 5)
  const minutes = [
    "00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"
  ];

  // Update the parent component when time changes
  const updateTime = () => {
    let hourInt = parseInt(hour);
    
    // Convert to 24-hour format
    if (period === "PM" && hourInt < 12) {
      hourInt += 12;
    } else if (period === "AM" && hourInt === 12) {
      hourInt = 0;
    }
    
    const formattedHour = hourInt.toString().padStart(2, "0");
    const formattedTime = `${formattedHour}:${minute}`;
    onChange(formattedTime);
  };

  // Handle hour change
  const handleHourChange = (newHour: string) => {
    setHour(newHour);
    setTimeout(updateTime, 0);
  };

  // Handle minute change
  const handleMinuteChange = (newMinute: string) => {
    setMinute(newMinute);
    setTimeout(updateTime, 0);
  };

  // Handle period change
  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod as "AM" | "PM");
    setTimeout(updateTime, 0);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? (
            <span>
              {hour}:{minute} {period}
            </span>
          ) : (
            <span>Pick a time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Hour</span>
            <Select
              value={hour}
              onValueChange={handleHourChange}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Minute</span>
            <Select
              value={minute}
              onValueChange={handleMinuteChange}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Period</span>
            <Select
              value={period}
              onValueChange={handlePeriodChange}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 