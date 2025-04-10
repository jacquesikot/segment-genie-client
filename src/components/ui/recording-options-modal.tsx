import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';

interface RecordingOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onNewRecording: () => void;
}

export function RecordingOptionsModal({
  isOpen,
  onClose,
  onContinue,
  onNewRecording,
}: RecordingOptionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Recording Options</DialogTitle>
          <DialogDescription>
            You have existing transcribed text. Would you like to continue
            recording or start a new recording?
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4 py-4'>
          <Button
            variant='outline'
            className='w-full justify-start gap-2'
            onClick={() => {
              onContinue();
              onClose();
            }}
          >
            <Mic className='h-4 w-4' />
            Continue Recording
          </Button>
          <Button
            variant='outline'
            className='w-full justify-start gap-2'
            onClick={() => {
              onNewRecording();
              onClose();
            }}
          >
            <Square className='h-4 w-4' />
            Start New Recording
          </Button>
        </div>
        <DialogFooter>
          <Button variant='ghost' onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
