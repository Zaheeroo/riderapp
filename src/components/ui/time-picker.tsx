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
  const [hours, setHours] = React.useState<string>(value ? value.split(":")[0] : "")
  const [minutes, setMinutes] = React.useState<string>(value ? value.split(":")[1] : "")
  const [period, setPeriod] = React.useState<"AM" | "PM">(
    value 
      ? (parseInt(value.split(":")[0]) >= 12 ? "PM" : "AM") 
      : "AM"
  )

  // Generate hours options (1-12)
  const hoursOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1
    return { value: hour.toString().padStart(2, "0"), label: hour.toString() }
  })

  // Generate minutes options (00-55, increments of 5)
  const minutesOptions = Array.from({ length: 12 }, (_, i) => {
    const minute = i * 5
    return { value: minute.toString().padStart(2, "0"), label: minute.toString().padStart(2, "0") }
  })

  // Update the parent component when time changes
  React.useEffect(() => {
    if (hours && minutes) {
      let hour = parseInt(hours)
      
      // Convert to 24-hour format
      if (period === "PM" && hour < 12) {
        hour += 12
      } else if (period === "AM" && hour === 12) {
        hour = 0
      }
      
      const formattedHour = hour.toString().padStart(2, "0")
      const formattedTime = `${formattedHour}:${minutes}`
      onChange(formattedTime)
    }
  }, [hours, minutes, period, onChange])

  // Initialize from value prop
  React.useEffect(() => {
    if (value) {
      const [hourStr, minuteStr] = value.split(":")
      const hour = parseInt(hourStr)
      
      // Convert 24-hour to 12-hour format
      let hour12 = hour % 12
      if (hour12 === 0) hour12 = 12
      
      setHours(hour12.toString().padStart(2, "0"))
      setMinutes(minuteStr)
      setPeriod(hour >= 12 ? "PM" : "AM")
    }
  }, [value])

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
              {hours}:{minutes} {period}
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
              value={hours}
              onValueChange={(value) => setHours(value)}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {hoursOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Minute</span>
            <Select
              value={minutes}
              onValueChange={(value) => setMinutes(value)}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {minutesOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Period</span>
            <Select
              value={period}
              onValueChange={(value) => setPeriod(value as "AM" | "PM")}
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