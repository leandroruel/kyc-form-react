import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'The controlled checked state of the checkbox',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </Label>
    </div>
  ),
};

export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="flex items-start space-x-2">
      <Checkbox id="marketing" className="mt-0.5" />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor="marketing"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Marketing emails
        </Label>
        <p className="text-sm text-muted-foreground">
          Receive emails about new products, features, and more.
        </p>
      </div>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms-error" aria-invalid="true" />
        <Label htmlFor="terms-error">Accept terms and conditions</Label>
      </div>
      <p className="text-sm text-destructive ml-6">
        You must accept the terms and conditions
      </p>
    </div>
  ),
};

export const MultipleCheckboxes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" defaultChecked />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" />
        <Label htmlFor="option3">Option 3</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option4" disabled />
        <Label htmlFor="option4">Option 4 (Disabled)</Label>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="space-y-4">
      <div className="space-y-3">
        <Label className="text-base">Notification Preferences</Label>
        <div className="flex items-center space-x-2">
          <Checkbox id="email-notif" defaultChecked />
          <Label htmlFor="email-notif">Email notifications</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="sms-notif" />
          <Label htmlFor="sms-notif">SMS notifications</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="push-notif" defaultChecked />
          <Label htmlFor="push-notif">Push notifications</Label>
        </div>
      </div>
    </form>
  ),
};
