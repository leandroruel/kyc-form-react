import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { ReviewStep, type ReviewData } from '../ReviewStep';

describe('ReviewStep', () => {
  const mockOnEdit = vi.fn();
  const mockOnPrevious = vi.fn();
  const mockOnSubmit = vi.fn();

  const mockData: ReviewData = {
    personalInfo: {
      fullName: 'João Silva',
      email: 'joao@example.com',
      phone: '(11) 99999-9999',
      dateOfBirth: new Date('1990-01-01'),
      country: 'Brazil',
    },
    address: {
      street: 'Rua Example, 123',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '12345-678',
      addressProof: new File([''], 'address-proof.pdf', { type: 'application/pdf' }),
    },
    identity: {
      idType: 'passport',
      idNumber: '123.456.789-00',
      idFront: new File([''], 'id-front.jpg', { type: 'image/jpeg' }),
      idBack: new File([''], 'id-back.jpg', { type: 'image/jpeg' }),
    },
    selfie: {
      selfie: new File([''], 'selfie.jpg', { type: 'image/jpeg' }),
    },
  };

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnPrevious.mockClear();
    mockOnSubmit.mockClear();
  });

  it('should render all review sections', () => {
    render(
      <ReviewStep
        data={mockData}
        onEdit={mockOnEdit}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByRole('heading', { name: /informações pessoais/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /endereço/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /identidade/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /selfie de verificação/i })).toBeInTheDocument();
  });

  it('should display all personal info data', () => {
    render(
      <ReviewStep
        data={mockData}
        onEdit={mockOnEdit}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
    expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument();
    // Date formatting may vary based on timezone, so we check for a date pattern
    expect(screen.getByText(/\d{2}\/\d{2}\/\d{4}/)).toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
  });

  it('should display all address data', () => {
    render(
      <ReviewStep
        data={mockData}
        onEdit={mockOnEdit}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Rua Example, 123')).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    expect(screen.getByText('SP')).toBeInTheDocument();
    expect(screen.getByText('12345-678')).toBeInTheDocument();
    expect(screen.getByText('address-proof.pdf')).toBeInTheDocument();
  });

  it('should display all identity data', () => {
    render(
      <ReviewStep
        data={mockData}
        onEdit={mockOnEdit}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Passaporte')).toBeInTheDocument();
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
    expect(screen.getByText('id-front.jpg')).toBeInTheDocument();
    expect(screen.getByText('id-back.jpg')).toBeInTheDocument();
  });

  it('should display selfie data', () => {
    render(
      <ReviewStep
        data={mockData}
        onEdit={mockOnEdit}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('selfie.jpg')).toBeInTheDocument();
  });

  it('should render terms checkbox and submit button', () => {
    render(
      <ReviewStep
        data={mockData}
        onEdit={mockOnEdit}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByRole('checkbox', { name: /eu concordo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar verificação/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
  });

  it('should disable submit button when terms are not accepted', () => {
    render(
      <ReviewStep
        data={mockData}
        onEdit={mockOnEdit}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /enviar verificação/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when terms are accepted', async () => {
    const user = userEvent.setup();
    render(
      <ReviewStep
        data={mockData}
        onEdit={mockOnEdit}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />
    );

    const termsCheckbox = screen.getByRole('checkbox', { name: /eu concordo/i });
    await user.click(termsCheckbox);

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /enviar verificação/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should call onEdit with correct step index when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ReviewStep
        data={mockData}
        onEdit={mockOnEdit}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /editar/i });

    // Edit personal info (step 0)
    await user.click(editButtons[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(0);

    // Edit address (step 1)
    await user.click(editButtons[1]);
    expect(mockOnEdit).toHaveBeenCalledWith(1);

    // Edit identity (step 2)
    await user.click(editButtons[2]);
    expect(mockOnEdit).toHaveBeenCalledWith(2);

    // Edit selfie (step 3)
    await user.click(editButtons[3]);
    expect(mockOnEdit).toHaveBeenCalledWith(3);
  });

  it('should call onPrevious when back button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ReviewStep
        data={mockData}
        onEdit={mockOnEdit}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />
    );

    const backButton = screen.getByRole('button', { name: /voltar/i });
    await user.click(backButton);

    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('should call onSubmit when form is submitted with accepted terms', async () => {
    const user = userEvent.setup();
    render(
      <ReviewStep
        data={mockData}
        onEdit={mockOnEdit}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />
    );

    // Accept terms
    const termsCheckbox = screen.getByRole('checkbox', { name: /eu concordo/i });
    await user.click(termsCheckbox);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /enviar verificação/i });
    await user.click(submitButton);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/enviando.../i)).toBeInTheDocument();
    });

    // Should call onSubmit after loading
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });
  });

  it('should display "Não enviado" for missing files', () => {
    const dataWithoutFiles: ReviewData = {
      ...mockData,
      address: {
        ...mockData.address,
        addressProof: undefined,
      },
      identity: {
        ...mockData.identity,
        idFront: undefined,
        idBack: undefined,
      },
      selfie: {
        selfie: undefined,
      },
    };

    render(
      <ReviewStep
        data={dataWithoutFiles}
        onEdit={mockOnEdit}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />
    );

    const notSentTexts = screen.getAllByText(/não enviado/i);
    expect(notSentTexts).toHaveLength(4); // address proof, id front, id back, selfie
  });

  it('should display correct document type labels', () => {
    const dataWithDriverLicense = {
      ...mockData,
      identity: {
        ...mockData.identity,
        idType: 'driver_license' as const,
      },
    };

    const { rerender } = render(
      <ReviewStep
        data={dataWithDriverLicense}
        onEdit={mockOnEdit}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('CNH')).toBeInTheDocument();

    const dataWithRG = {
      ...mockData,
      identity: {
        ...mockData.identity,
        idType: 'rg' as const,
      },
    };

    rerender(
      <ReviewStep
        data={dataWithRG}
        onEdit={mockOnEdit}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('RG')).toBeInTheDocument();
  });
});
