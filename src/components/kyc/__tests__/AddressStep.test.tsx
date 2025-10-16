import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { AddressStep } from '../AddressStep';

describe('AddressStep', () => {
  const mockOnNext = vi.fn();
  const mockOnPrevious = vi.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
    mockOnPrevious.mockClear();
  });

  it('should render all form fields', () => {
    render(<AddressStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    expect(screen.getByLabelText(/endereço completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/código postal/i)).toBeInTheDocument();
    expect(screen.getByText(/comprovante de endereço/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
  });

  it('should display validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<AddressStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    const submitButton = screen.getByRole('button', { name: /continuar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/o endereço deve ter pelo menos 5 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/a cidade deve ter pelo menos 2 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/o estado deve ter pelo menos 2 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/código postal inválido/i)).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('should display validation error for short street address', async () => {
    const user = userEvent.setup();
    render(<AddressStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    const streetInput = screen.getByLabelText(/endereço completo/i);
    await user.type(streetInput, 'Rua');
    await user.click(screen.getByRole('button', { name: /continuar/i }));

    await waitFor(() => {
      expect(screen.getByText(/o endereço deve ter pelo menos 5 caracteres/i)).toBeInTheDocument();
    });
  });

  it('should populate form with default values', () => {
    const defaultValues = {
      street: 'Rua Example, 123',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '12345-678',
    };

    render(
      <AddressStep
        defaultValues={defaultValues}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );

    expect(screen.getByDisplayValue('Rua Example, 123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('São Paulo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('SP')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12345-678')).toBeInTheDocument();
  });

  it('should call onPrevious when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddressStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    const backButton = screen.getByRole('button', { name: /voltar/i });
    await user.click(backButton);

    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('should call onNext with form data when valid form is submitted', async () => {
    const user = userEvent.setup();
    render(<AddressStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    // Fill in the form
    await user.type(screen.getByLabelText(/endereço completo/i), 'Rua Example, 123, Apto 45');
    await user.type(screen.getByLabelText(/cidade/i), 'São Paulo');
    await user.type(screen.getByLabelText(/estado/i), 'SP');
    await user.type(screen.getByLabelText(/código postal/i), '12345-678');

    const submitButton = screen.getByRole('button', { name: /continuar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledTimes(1);
      expect(mockOnNext).toHaveBeenCalledWith(
        expect.objectContaining({
          street: 'Rua Example, 123, Apto 45',
          city: 'São Paulo',
          state: 'SP',
          postalCode: '12345-678',
        })
      );
    });
  });

  it('should accept all form inputs correctly', async () => {
    const user = userEvent.setup();
    render(<AddressStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    const streetInput = screen.getByLabelText(/endereço completo/i) as HTMLInputElement;
    const cityInput = screen.getByLabelText(/cidade/i) as HTMLInputElement;
    const stateInput = screen.getByLabelText(/estado/i) as HTMLInputElement;
    const postalCodeInput = screen.getByLabelText(/código postal/i) as HTMLInputElement;

    await user.type(streetInput, 'Avenida Paulista, 1000');
    await user.type(cityInput, 'São Paulo');
    await user.type(stateInput, 'SP');
    await user.type(postalCodeInput, '01310-100');

    expect(streetInput.value).toBe('Avenida Paulista, 1000');
    expect(cityInput.value).toBe('São Paulo');
    expect(stateInput.value).toBe('SP');
    expect(postalCodeInput.value).toBe('01310-100');
  });

  it('should validate minimum length for postal code', async () => {
    const user = userEvent.setup();
    render(<AddressStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    await user.type(screen.getByLabelText(/endereço completo/i), 'Rua Example, 123');
    await user.type(screen.getByLabelText(/cidade/i), 'São Paulo');
    await user.type(screen.getByLabelText(/estado/i), 'SP');
    await user.type(screen.getByLabelText(/código postal/i), '12');

    await user.click(screen.getByRole('button', { name: /continuar/i }));

    await waitFor(() => {
      expect(screen.getByText(/código postal inválido/i)).toBeInTheDocument();
    });
  });
});
