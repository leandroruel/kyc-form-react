import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '@/components/ui/datepicker';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { enUS } from 'date-fns/locale';

const meta: Meta<typeof DatePicker> = {
  title: 'UI/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no date is selected',
    },
    dateFormat: {
      control: 'text',
      description: 'Date format string (date-fns format)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the datepicker is disabled',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Alignment of the popover',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return <DatePicker date={date} onDateChange={setDate} />;
  },
};

export const WithLabel: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="grid w-full gap-1.5">
        <Label>Data de Nascimento</Label>
        <DatePicker date={date} onDateChange={setDate} />
      </div>
    );
  },
};

export const WithDefaultDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <DatePicker date={date} onDateChange={setDate} />;
  },
};

export const Disabled: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return <DatePicker date={date} onDateChange={setDate} disabled />;
  },
};

export const WithMinDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    const today = new Date();
    return (
      <div className="grid w-full gap-1.5">
        <Label>Select a future date</Label>
        <DatePicker
          date={date}
          onDateChange={setDate}
          minDate={today}
          placeholder="Select a date (today or later)"
        />
      </div>
    );
  },
};

export const WithMaxDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    const today = new Date();
    return (
      <div className="grid w-full gap-1.5">
        <Label>Select a past date</Label>
        <DatePicker
          date={date}
          onDateChange={setDate}
          maxDate={today}
          placeholder="Select a date (today or earlier)"
        />
      </div>
    );
  },
};

export const WithDateRange: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    const minDate = new Date(2024, 0, 1); // Jan 1, 2024
    const maxDate = new Date(2024, 11, 31); // Dec 31, 2024
    return (
      <div className="grid w-full gap-1.5">
        <Label>Select a date in 2024</Label>
        <DatePicker
          date={date}
          onDateChange={setDate}
          minDate={minDate}
          maxDate={maxDate}
          placeholder="Select a date in 2024"
        />
      </div>
    );
  },
};

export const EnglishLocale: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <DatePicker
        date={date}
        onDateChange={setDate}
        locale={enUS}
        dateFormat="MM/dd/yyyy"
        placeholder="Select a date"
      />
    );
  },
};

export const CustomFormat: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <DatePicker
        date={date}
        onDateChange={setDate}
        dateFormat="dd 'de' MMMM 'de' yyyy"
        placeholder="Selecione uma data"
      />
    );
  },
};

export const CustomYearRange: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="grid w-full gap-1.5">
        <Label>Birth Date (1950-2010)</Label>
        <DatePicker
          date={date}
          onDateChange={setDate}
          startYear={1950}
          endYear={2010}
          placeholder="Select your birth date"
        />
      </div>
    );
  },
};

export const AlignCenter: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <DatePicker
        date={date}
        onDateChange={setDate}
        align="center"
        placeholder="Center aligned"
      />
    );
  },
};

export const AlignEnd: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <DatePicker
        date={date}
        onDateChange={setDate}
        align="end"
        placeholder="End aligned"
      />
    );
  },
};

export const FormExample: Story = {
  render: () => {
    const [birthDate, setBirthDate] = useState<Date>();
    const [appointmentDate, setAppointmentDate] = useState<Date>();

    return (
      <form className="space-y-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="birth-date">Data de Nascimento</Label>
          <DatePicker
            date={birthDate}
            onDateChange={setBirthDate}
            maxDate={new Date()}
            placeholder="dd/mm/aaaa"
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="appointment">Appointment Date</Label>
          <DatePicker
            date={appointmentDate}
            onDateChange={setAppointmentDate}
            minDate={new Date()}
            placeholder="Select an appointment date"
          />
        </div>
      </form>
    );
  },
};
