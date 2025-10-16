import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { IdentityStep } from '../IdentityStep';

describe('IdentityStep', () => {
  const mockOnNext = vi.fn();
  const mockOnPrevious = vi.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
    mockOnPrevious.mockClear();
  });

  it('should render all form fields', () => {
    render(<IdentityStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    expect(screen.getByText(/tipo de documento \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();
    expect(screen.getByText(/foto do documento \(frente\) \*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
  });

  it('should display validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<IdentityStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    const submitButton = screen.getByRole('button', { name: /continuar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/por favor, selecione um tipo de documento/i)).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('should format CPF as user types', async () => {
    const user = userEvent.setup();
    render(<IdentityStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    const cpfInput = screen.getByLabelText(/cpf/i) as HTMLInputElement;
    await user.type(cpfInput, '11144477735');

    await waitFor(() => {
      expect(cpfInput.value).toBe('111.444.777-35');
    });
  });

  it('should show back side upload only for driver license and RG', async () => {
    const user = userEvent.setup();
    render(<IdentityStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    // Initially, should not show back side
    expect(screen.queryByText(/foto do documento \(verso\)/i)).not.toBeInTheDocument();

    // Select passport - should not show back side
    const selectTrigger = screen.getByRole('combobox');
    await user.click(selectTrigger);

    const passportOption = screen.getByRole('option', { name: /passaporte/i });
    await user.click(passportOption);

    await waitFor(() => {
      expect(screen.queryByText(/foto do documento \(verso\)/i)).not.toBeInTheDocument();
    });
  });

  it('should show back side upload for driver license', async () => {
    const user = userEvent.setup();
    render(<IdentityStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    const selectTrigger = screen.getByRole('combobox');
    await user.click(selectTrigger);

    const driverLicenseOption = screen.getByRole('option', { name: /carteira de motorista/i });
    await user.click(driverLicenseOption);

    await waitFor(() => {
      expect(screen.getByText(/foto do documento \(verso\)/i)).toBeInTheDocument();
    });
  });

  it('should show back side upload for RG', async () => {
    const user = userEvent.setup();
    render(<IdentityStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    const selectTrigger = screen.getByRole('combobox');
    await user.click(selectTrigger);

    const rgOption = screen.getByRole('option', { name: /^rg$/i });
    await user.click(rgOption);

    await waitFor(() => {
      expect(screen.getByText(/foto do documento \(verso\)/i)).toBeInTheDocument();
    });
  });

  it('should populate form with default values', () => {
    const defaultValues = {
      idType: 'passport' as const,
      idNumber: '111.444.777-35',
    };

    render(
      <IdentityStep
        defaultValues={defaultValues}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );

    expect(screen.getByDisplayValue('111.444.777-35')).toBeInTheDocument();
  });

  it('should call onPrevious when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<IdentityStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    const backButton = screen.getByRole('button', { name: /voltar/i });
    await user.click(backButton);

    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('should call onNext with form data when valid form is submitted', async () => {
    const user = userEvent.setup();
    render(<IdentityStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    // Select document type
    const selectTrigger = screen.getByRole('combobox');
    await user.click(selectTrigger);
    const passportOption = screen.getByRole('option', { name: /passaporte/i });
    await user.click(passportOption);

    // Fill CPF with a valid CPF
    const cpfInput = screen.getByLabelText(/cpf/i);
    await user.type(cpfInput, '11144477735');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /continuar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledTimes(1);
      expect(mockOnNext).toHaveBeenCalledWith(
        expect.objectContaining({
          idType: 'passport',
          idNumber: '111.444.777-35',
        })
      );
    });
  });

  it('should validate CPF format', async () => {
    const user = userEvent.setup();
    render(<IdentityStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    // Select document type
    const selectTrigger = screen.getByRole('combobox');
    await user.click(selectTrigger);
    const passportOption = screen.getByRole('option', { name: /passaporte/i });
    await user.click(passportOption);

    // Enter invalid CPF
    const cpfInput = screen.getByLabelText(/cpf/i);
    await user.type(cpfInput, '123');

    // Submit form
    await user.click(screen.getByRole('button', { name: /continuar/i }));

    await waitFor(() => {
      expect(screen.getByText(/cpf inválido/i)).toBeInTheDocument();
    });
  });
});
