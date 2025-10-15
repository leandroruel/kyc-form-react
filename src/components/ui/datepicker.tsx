import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format, type Locale } from "date-fns"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  dateFormat?: string
  locale?: Locale
  minDate?: Date
  maxDate?: Date
  startYear?: number
  endYear?: number
  disabled?: boolean
  className?: string
  align?: "start" | "center" | "end"
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Selecione uma data",
  dateFormat = "dd/MM/yyyy",
  locale = ptBR,
  minDate,
  maxDate,
  startYear = 1900,
  endYear = new Date().getFullYear(),
  disabled = false,
  className,
  align = "start",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          {date ? format(date, dateFormat, { locale }) : placeholder}
          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align={align}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onDateChange?.(selectedDate)
            setOpen(false)
          }}
          captionLayout="dropdown"
          startMonth={new Date(startYear, 0)}
          endMonth={new Date(endYear, 11)}
          disabled={(day) => {
            if (minDate && day < minDate) return true
            if (maxDate && day > maxDate) return true
            return false
          }}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  )
}
