'use client';

import { useState } from 'react';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AddParticipantDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddParticipants: (userIds: string[]) => void;
  allUsers: User[];
  currentParticipants: User[];
  currentUser: User;
}

export function AddParticipantDialog({
  isOpen,
  onOpenChange,
  onAddParticipants,
  allUsers,
  currentParticipants,
  currentUser,
}: AddParticipantDialogProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const availableUsers = allUsers.filter(
    (user) =>
      !currentParticipants.some((p) => p.id === user.id) &&
      user.id !== 'assistant'
  );

  const handleCheckboxChange = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds((prev) => [...prev, userId]);
    } else {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleAddClick = () => {
    if (selectedUserIds.length > 0) {
      onAddParticipants(selectedUserIds);
      setSelectedUserIds([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Chat</DialogTitle>
          <DialogDescription>
            Select people from your contacts to add to this conversation.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-64">
            <div className="space-y-4 pr-4">
                {availableUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                        <Label htmlFor={`user-${user.id}`} className="flex items-center gap-3 cursor-pointer">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person" />
                                <AvatarFallback className={cn(user.avatarColor, 'text-white text-xs')}>
                                    {user.icon ? <user.icon className="h-4 w-4" /> : user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-normal">{user.name}</span>
                        </Label>
                        <Checkbox
                            id={`user-${user.id}`}
                            checked={selectedUserIds.includes(user.id)}
                            onCheckedChange={(checked) => handleCheckboxChange(user.id, !!checked)}
                        />
                    </div>
                ))}
            </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddClick} disabled={selectedUserIds.length === 0}>
            Add to Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
