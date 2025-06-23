'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface InviteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onInvite: (email: string) => void;
}

export function InviteDialog({ isOpen, onOpenChange, onInvite }: InviteDialogProps) {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleInviteClick = () => {
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address to send an invite.',
        variant: 'destructive',
      });
      return;
    }
    onInvite(email.trim());
    setEmail('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite a Contact</DialogTitle>
          <DialogDescription>
            Enter the email of the person you'd like to chat with on Leny.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') handleInviteClick(); }}
              className="col-span-3"
              placeholder="name@example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleInviteClick}>Send Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
