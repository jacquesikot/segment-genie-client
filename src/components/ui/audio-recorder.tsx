import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Add complete type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
}

declare global {
  interface Window {
    SpeechRecognition?: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition?: {
      new (): SpeechRecognition;
    };
  }
}

interface AudioRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  className?: string;
  'data-recorder-id'?: string;
}

export function AudioRecorder({
  onTranscriptionComplete,
  onRecordingStateChange,
  className,
  'data-recorder-id': dataRecorderId,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const previousTranscriptionRef = useRef<string>('');
  const isFirstRecordingRef = useRef<boolean>(true);
  const accumulatedTranscriptRef = useRef<string>('');
  const { toast } = useToast();

  // Notify parent component when recording state changes
  useEffect(() => {
    if (onRecordingStateChange) {
      onRecordingStateChange(isRecording);
    }
  }, [isRecording, onRecordingStateChange]);

  // Initialize speech recognition
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          // If this is the first result in a new session, reset the accumulated transcript
          if (event.resultIndex === 0 && isFirstRecordingRef.current) {
            accumulatedTranscriptRef.current = '';
            isFirstRecordingRef.current = false;
          }

          // Update the accumulated transcript with the new final transcript
          if (finalTranscript) {
            accumulatedTranscriptRef.current += finalTranscript;
          }

          // Combine the accumulated transcript with the current interim transcript
          const newTranscription =
            accumulatedTranscriptRef.current + interimTranscript;

          setTranscription(newTranscription);
          onTranscriptionComplete(newTranscription);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setError(`Speech recognition error: ${event.error}`);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscriptionComplete]);

  const transcribeAudio = useCallback(
    async (audioBlob: Blob) => {
      try {
        setIsTranscribing(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.wav');
        formData.append('model', 'whisper-1');

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Transcription failed');
        }

        const data = await response.json();

        // If we have previous transcription, append the new transcription
        const newTranscription = previousTranscriptionRef.current
          ? previousTranscriptionRef.current + ' ' + data.text
          : data.text;

        setTranscription(newTranscription);
        onTranscriptionComplete(newTranscription);
        previousTranscriptionRef.current = newTranscription;

        toast({
          title: 'Transcription complete',
          description: 'Your audio has been transcribed successfully',
        });
      } catch (error) {
        console.error('Error transcribing audio:', error);
        setError('Failed to transcribe audio. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to transcribe audio. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsTranscribing(false);
      }
    },
    [toast, onTranscriptionComplete]
  );

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start speech recognition
      if (recognitionRef.current) {
        try {
          // Reset the accumulated transcript when starting a new recording session
          if (isFirstRecordingRef.current) {
            accumulatedTranscriptRef.current = '';
          }

          recognitionRef.current.start();

          toast({
            title: 'Recording started',
            description:
              'Speak now. Click the microphone icon again to stop recording.',
          });
        } catch (err) {
          console.error('Error starting speech recognition:', err);
          // Continue with recording even if speech recognition fails
        }
      }
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError(
        'Error accessing microphone. Please ensure you have granted microphone permissions.'
      );
      toast({
        title: 'Error',
        description:
          'Failed to access microphone. Please check your permissions.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);

      // Stop speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error('Error stopping speech recognition:', err);
        }
      }

      // Save the current transcription before stopping
      if (transcription) {
        previousTranscriptionRef.current = transcription;
      }

      // If we have a transcription, use it
      if (transcription) {
        onTranscriptionComplete(transcription);
        return;
      }

      // Otherwise, fall back to OpenAI transcription
      setIsTranscribing(true);
      const audioBlob = new Blob(audioChunksRef.current, {
        type: 'audio/webm',
      });
      transcribeAudio(audioBlob);
    }
  }, [isRecording, transcription, onTranscriptionComplete, transcribeAudio]);

  return (
    <div
      className={cn('relative', className)}
      data-recorder-id={dataRecorderId}
    >
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn(
          'absolute right-2 top-2',
          isRecording && 'text-red-500 hover:text-red-600 animate-pulse'
        )}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isTranscribing}
      >
        {isTranscribing ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : isRecording ? (
          <Square className='h-4 w-4' />
        ) : (
          <Mic className='h-4 w-4' />
        )}
      </Button>
      {error && <div className='text-sm text-red-500 mt-2'>{error}</div>}
    </div>
  );
}
