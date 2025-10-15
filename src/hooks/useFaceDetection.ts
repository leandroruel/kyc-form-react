import { useState, useEffect, useRef, useCallback } from 'react';
import * as H from '@vladmandic/human';

export interface FaceDetectionResult {
  faceDetected: boolean;
  faceCount: number;
  confidence: number;
  age?: number;
  gender?: string;
  emotion?: string;
}

export interface UseFaceDetectionOptions {
  enabled?: boolean;
  detectEmotion?: boolean;
  detectAge?: boolean;
  detectGender?: boolean;
  minConfidence?: number;
}

export function useFaceDetection(
  videoRef: React.RefObject<HTMLVideoElement>,
  options: UseFaceDetectionOptions = {}
) {
  const {
    enabled = true,
    detectEmotion = false,
    detectAge = false,
    detectGender = false,
    minConfidence = 0.5,
  } = options;

  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<FaceDetectionResult>({
    faceDetected: false,
    faceCount: 0,
    confidence: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const humanRef = useRef<H.Human | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Human library
  useEffect(() => {
    if (!enabled) return;

    const initHuman = async () => {
      try {
        const humanConfig: Partial<H.Config> = {
          backend: 'webgl',
          modelBasePath: 'https://vladmandic.github.io/human-models/models/',
          face: {
            enabled: true,
            detector: {
              rotation: false,
              return: true,
              minConfidence,
            },
            mesh: { enabled: false },
            iris: { enabled: false },
            description: { enabled: false },
            emotion: { enabled: detectEmotion },
            antispoof: { enabled: false },
            liveness: { enabled: false },
          },
          body: { enabled: false },
          hand: { enabled: false },
          object: { enabled: false },
          gesture: { enabled: false },
        };

        // Add age/gender if requested
        if (detectAge || detectGender) {
          humanConfig.face = {
            ...humanConfig.face,
            description: { enabled: true },
          };
        }

        const human = new H.Human(humanConfig);

        // Load models
        await human.load();

        // Warmup (run a dummy prediction to initialize)
        await human.warmup();

        humanRef.current = human;
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize Human:', err);
        setError('Failed to initialize face detection');
        setIsInitialized(false);
      }
    };

    initHuman();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, detectEmotion, detectAge, detectGender, minConfidence]);

  // Detection loop
  const detect = useCallback(async () => {
    if (!humanRef.current || !videoRef.current || !enabled || !isInitialized) {
      return;
    }

    try {
      const video = videoRef.current;

      // Check if video is ready
      if (video.readyState < 2) {
        animationFrameRef.current = requestAnimationFrame(detect);
        return;
      }

      setIsProcessing(true);

      // Run detection
      const detectionResult = await humanRef.current.detect(video);

      if (detectionResult.face && detectionResult.face.length > 0) {
        const face = detectionResult.face[0];
        const faceResult: FaceDetectionResult = {
          faceDetected: true,
          faceCount: detectionResult.face.length,
          confidence: face.boxScore || face.score || 0,
        };

        // Add emotion if enabled
        if (detectEmotion && face.emotion && face.emotion.length > 0) {
          faceResult.emotion = face.emotion[0].emotion;
        }

        // Add age/gender if enabled
        if (detectAge && face.age) {
          faceResult.age = face.age;
        }
        if (detectGender && face.gender) {
          faceResult.gender = face.gender;
        }

        setResult(faceResult);
      } else {
        setResult({
          faceDetected: false,
          faceCount: 0,
          confidence: 0,
        });
      }

      setIsProcessing(false);
    } catch (err) {
      console.error('Face detection error:', err);
      setIsProcessing(false);
    }

    // Continue detection loop
    animationFrameRef.current = requestAnimationFrame(detect);
  }, [videoRef, enabled, isInitialized, detectEmotion, detectAge, detectGender]);

  // Start detection when initialized
  useEffect(() => {
    if (isInitialized && enabled) {
      detect();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInitialized, enabled, detect]);

  const reset = useCallback(() => {
    setResult({
      faceDetected: false,
      faceCount: 0,
      confidence: 0,
    });
  }, []);

  return {
    isInitialized,
    isProcessing,
    result,
    error,
    reset,
  };
}
