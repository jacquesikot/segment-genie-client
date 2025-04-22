import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Switch from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Copy, Check, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onOpenChange, reportId }) => {
  const [isPublic, setIsPublic] = useState(false);
  const [shareableUrl, setShareableUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const handleMakePublic = async () => {
    setIsPublic(!isPublic);

    if (!isPublic) {
      // Only generate URL when making public
      setIsGeneratingLink(true);

      // Simulate API call to make report public and get shareable URL
      try {
        // In a real implementation, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        const url = `${window.location.origin}/shared-report/${reportId}`;
        setShareableUrl(url);
      } catch (error) {
        console.error('Failed to generate shareable link', error);
      } finally {
        setIsGeneratingLink(false);
      }
    } else {
      // When making private again, clear the URL
      setShareableUrl('');
    }
  };

  const handleCopyLink = () => {
    if (shareableUrl) {
      navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your report</DialogTitle>
          <DialogDescription>Make your report public to share it with others</DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="public-switch" className="text-sm font-medium">
                Make report public
              </Label>
              <p className="text-xs text-muted-foreground">When enabled, anyone with the link can view this report</p>
            </div>
            <Switch checked={isPublic} onToggle={handleMakePublic} />
          </div>

          {isGeneratingLink && (
            <div className="flex items-center justify-center py-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm">Generating link...</span>
            </div>
          )}

          {shareableUrl && (
            <div className="space-y-2">
              <Label htmlFor="link" className="text-sm">
                Shareable Link
              </Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="link" value={shareableUrl} readOnly className="pl-8 pr-2 h-10 w-full" />
                </div>
                <Button
                  size="sm"
                  onClick={handleCopyLink}
                  variant="outline"
                  className={cn(
                    'flex gap-1 items-center transition-all',
                    copied && 'bg-green-50 text-green-600 border-green-200'
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This link will remain active as long as your report is public
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
