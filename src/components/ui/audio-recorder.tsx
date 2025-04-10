import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { RecordingOptionsModal } from './recording-options-modal';

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
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const previousTranscriptionRef = useRef<string>('');
  const accumulatedTranscriptRef = useRef<string>('');
  const { toast } = useToast();

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

      // Create a new speech recognition instance
      const SpeechRecognitionClass =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
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

          if (finalTranscript) {
            accumulatedTranscriptRef.current = accumulatedTranscriptRef.current
              ? accumulatedTranscriptRef.current + ' ' + finalTranscript
              : finalTranscript;
          }

          const newTranscription =
            accumulatedTranscriptRef.current +
            (interimTranscript ? ' ' + interimTranscript : '');
          setTranscription(newTranscription);
          onTranscriptionComplete(newTranscription);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setError(`Speech recognition error: ${event.error}`);
        };

        recognitionRef.current = recognition;
        recognitionRef.current.start();

        toast({
          title: 'Recording started',
          description:
            'Speak now. Click the microphone icon again to stop recording.',
        });
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
  }, [toast, onTranscriptionComplete]);

  const handleStartRecording = useCallback(async () => {
    if (previousTranscriptionRef.current) {
      setShowOptionsModal(true);
      return;
    }
    await startRecording();
  }, [startRecording]);

  const handleContinueRecording = useCallback(async () => {
    // Preserve the previous transcription
    const previousText = previousTranscriptionRef.current;
    await startRecording();
    // Restore the previous transcription
    setTranscription(previousText);
    onTranscriptionComplete(previousText);
    previousTranscriptionRef.current = previousText;
    accumulatedTranscriptRef.current = previousText;
  }, [startRecording, onTranscriptionComplete]);

  const handleNewRecording = useCallback(async () => {
    previousTranscriptionRef.current = '';
    accumulatedTranscriptRef.current = '';
    setTranscription('');
    onTranscriptionComplete('');
    await startRecording();
  }, [startRecording, onTranscriptionComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      // Stop media recording first
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);

      // Completely destroy the speech recognition instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.abort();
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current = null;
        } catch (err) {
          console.error('Error stopping speech recognition:', err);
        }
      }

      // Save the current transcription
      if (transcription) {
        previousTranscriptionRef.current = transcription;
        onTranscriptionComplete(transcription);
      }

      // Only proceed with OpenAI transcription if we don't have a transcription
      if (!transcription) {
        setIsTranscribing(true);
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        transcribeAudio(audioBlob);
      }
    }
  }, [isRecording, transcription, onTranscriptionComplete, transcribeAudio]);

  // Remove the initialization useEffect since we're now creating the instance in startRecording
  useEffect(() => {
    if (onRecordingStateChange) {
      onRecordingStateChange(isRecording);
    }
  }, [isRecording, onRecordingStateChange]);

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
        onClick={isRecording ? stopRecording : handleStartRecording}
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
      <RecordingOptionsModal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onContinue={handleContinueRecording}
        onNewRecording={handleNewRecording}
      />
    </div>
  );
}
