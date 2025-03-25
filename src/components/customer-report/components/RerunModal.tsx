import { Segment } from '@/api/segment';
import { NewSegmentForm } from '@/components/NewSegmentForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { researchInputForm } from '@/pages/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, RefreshCw } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface RerunModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (values: z.infer<typeof researchInputForm>) => void;
  segment?: Segment;
  isLoading: boolean;
}

const RerunModal: React.FC<RerunModalProps> = ({ isOpen, onClose, onConfirm, segment, isLoading }) => {
  const form = useForm<z.infer<typeof researchInputForm>>({
    resolver: zodResolver(researchInputForm),
    defaultValues: {
      title: segment?.title || '',
      segment: segment?.input?.customerProfile?.segment || '',
      demographics: segment?.input?.customerProfile?.demographics || '',
      painPoints: segment?.input?.customerProfile?.painPoints || '',
      problem: segment?.input?.solutionOverview?.problemToSolve || '',
      solution: segment?.input?.solutionOverview?.solutionOffered || '',
      features: segment?.input?.solutionOverview?.uniqueFeatures || '',
      industry: segment?.input?.marketContext?.industry || '',
      competitors: segment?.input?.marketContext?.competitors || '',
      channels: segment?.input?.marketContext?.channels || '',
    },
  });

  useEffect(() => {
    if (segment) {
      form.reset({
        title: segment.title || '',
        segment: segment.input?.customerProfile?.segment || '',
        demographics: segment.input?.customerProfile?.demographics || '',
        painPoints: segment.input?.customerProfile?.painPoints || '',
        problem: segment.input?.solutionOverview?.problemToSolve || '',
        solution: segment.input?.solutionOverview?.solutionOffered || '',
        features: segment.input?.solutionOverview?.uniqueFeatures || '',
        industry: segment.input?.marketContext?.industry || '',
        competitors: segment.input?.marketContext?.competitors || '',
        channels: segment.input?.marketContext?.channels || '',
      });
    }
  }, [segment, form]);

  const handleFormSubmit = (values: z.infer<typeof researchInputForm>) => {
    onConfirm(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Re-run Report</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update the segment information below to re-run your report with new inputs.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)}>
              <NewSegmentForm form={form} isRerunModal={true} />
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:gap-0 mt-6 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Re-running...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Re-run Report</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RerunModal; 