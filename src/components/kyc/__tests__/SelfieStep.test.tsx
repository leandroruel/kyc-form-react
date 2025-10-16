import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { SelfieStep } from '../SelfieStep';

// Mock the react-webcam component
vi.mock('react-webcam', () => ({
  default: vi.fn(({ ref }) => {
    // Mock the ref object with a getScreenshot method
    if (ref && typeof ref === 'object' && 'current' in ref) {
      ref.current = {
        getScreenshot: () => 'data:image/jpeg;base64,mockbase64data',
        video: document.createElement('video'),
      };
    }
    return <div data-testid="webcam">Webcam Mock</div>;
  }),
}));

// Mock the useFaceDetection hook
vi.mock('@/hooks/useFaceDetection', () => ({
  useFaceDetection: vi.fn(() => ({
    result: {
      faceDetected: true,
      confidence: 0.95,
    },
    isInitialized: true,
    error: null,
    reset: vi.fn(),
  })),
}));

describe('SelfieStep', () => {
  const mockOnNext = vi.fn();
  const mockOnPrevious = vi.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
    mockOnPrevious.mockClear();

    // Mock fetch for converting base64 to blob
    global.fetch = vi.fn((input) => {
      if (typeof input === 'string' && input.startsWith('data:image')) {
        return Promise.resolve({
          blob: () => Promise.resolve(new Blob(['fake-image-data'], { type: 'image/jpeg' })),
        } as Response);
      }
      return Promise.reject(new Error('Unexpected fetch call'));
    });
  });

  it('should render selfie instructions', () => {
    render(<SelfieStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    expect(screen.getByText(/instruções para uma boa selfie:/i)).toBeInTheDocument();
    expect(screen.getByText(/certifique-se de que seu rosto está claramente visível/i)).toBeInTheDocument();
  });

  it('should render activate camera button initially', () => {
    render(<SelfieStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    expect(screen.getByRole('button', { name: /ativar câmera/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
  });

  it('should show webcam when activate camera is clicked', async () => {
    const user = userEvent.setup();
    render(<SelfieStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    const activateCameraButton = screen.getByRole('button', { name: /ativar câmera/i });
    await user.click(activateCameraButton);

    await waitFor(() => {
      expect(screen.getByTestId('webcam')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /capturar foto/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    });
  });

  it('should display face detection status', async () => {
    const user = userEvent.setup();
    render(<SelfieStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    await user.click(screen.getByRole('button', { name: /ativar câmera/i }));

    await waitFor(() => {
      expect(screen.getByText(/rosto detectado/i)).toBeInTheDocument();
    });
  });

  it('should capture photo when capture button is clicked', async () => {
    const user = userEvent.setup();
    render(<SelfieStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    // Activate camera
    await user.click(screen.getByRole('button', { name: /ativar câmera/i }));

    // Capture photo
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /capturar foto/i })).toBeInTheDocument();
    });

    const captureButton = screen.getByRole('button', { name: /capturar foto/i });
    await user.click(captureButton);

    // Should show preview
    await waitFor(() => {
      expect(screen.getByText(/selfie capturada/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /tirar nova foto/i })).toBeInTheDocument();
    });
  });

  it('should allow retaking photo', async () => {
    const user = userEvent.setup();
    render(<SelfieStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    // Activate camera and capture
    await user.click(screen.getByRole('button', { name: /ativar câmera/i }));
    await user.click(await screen.findByRole('button', { name: /capturar foto/i }));

    // Wait for capture to complete
    await waitFor(() => {
      expect(screen.getByText(/selfie capturada/i)).toBeInTheDocument();
    });

    // Retake photo
    const retakeButton = screen.getByRole('button', { name: /tirar nova foto/i });
    await user.click(retakeButton);

    // Should show camera again
    await waitFor(() => {
      expect(screen.getByTestId('webcam')).toBeInTheDocument();
    });
  });

  it('should call onPrevious when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<SelfieStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    const backButton = screen.getByRole('button', { name: /voltar/i });
    await user.click(backButton);

    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('should call onNext with selfie data when form is submitted with captured photo', async () => {
    const user = userEvent.setup();
    render(<SelfieStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    // Activate camera and capture
    await user.click(screen.getByRole('button', { name: /ativar câmera/i }));
    await user.click(await screen.findByRole('button', { name: /capturar foto/i }));

    // Wait for capture to complete
    await waitFor(() => {
      expect(screen.getByText(/selfie capturada/i)).toBeInTheDocument();
    });

    // Submit form
    const continueButton = screen.getByRole('button', { name: /continuar/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledTimes(1);
      expect(mockOnNext).toHaveBeenCalledWith(
        expect.objectContaining({
          selfie: expect.any(File),
        })
      );
    });
  });

  it('should cancel camera when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<SelfieStep onNext={mockOnNext} onPrevious={mockOnPrevious} />);

    // Activate camera
    await user.click(screen.getByRole('button', { name: /ativar câmera/i }));

    // Cancel
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    // Should show activate camera button again
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ativar câmera/i })).toBeInTheDocument();
    });
  });
});
