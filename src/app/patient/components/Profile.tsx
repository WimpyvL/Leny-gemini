'use client';

import type { User } from '@/lib/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


interface ProfileProps {
  user: User;
}

export function Profile({ user: initialUser }: ProfileProps) {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleHealthInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({
        ...prev,
        healthInfo: { ...prev.healthInfo, [name]: value }
    }));
  };
  
  const handleNotificationChange = (checked: boolean, type: 'email' | 'push') => {
    setUser(prev => ({
        ...prev,
        settings: { 
            ...prev.settings, 
            notifications: { ...prev.settings?.notifications, [type]: checked }
        }
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would call an API to save the user data.
    // For this prototype, we just exit edit mode.
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    toast({
      title: 'Feature Disabled',
      description: 'Account upgrades are not available as authentication is disabled.',
      variant: 'destructive',
    });
    setTimeout(() => setIsUpgrading(false), 1000);
  };

  return (
    <div className="bg-secondary h-full">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person" />}
                  <AvatarFallback className={cn("text-2xl text-white", user.avatarColor)}>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl font-bold font-headline">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
              <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                <span className="mr-2">✏️</span>
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><span>👤</span> Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={user.name} onChange={handleInfoChange} disabled={!isEditing} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={user.email || ''} onChange={handleInfoChange} disabled={!isEditing} />
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" name="dob" type="date" value={user.dob || ''} onChange={handleInfoChange} disabled={!isEditing} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><span>🫀</span> Health Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-3 gap-4">
                     <div className="space-y-1">
                      <Label htmlFor="height">Height</Label>
                      <Input id="height" name="height" value={user.healthInfo?.height || ''} onChange={handleHealthInfoChange} disabled={!isEditing} />
                    </div>
                     <div className="space-y-1">
                      <Label htmlFor="weight">Weight</Label>
                      <Input id="weight" name="weight" value={user.healthInfo?.weight || ''} onChange={handleHealthInfoChange} disabled={!isEditing} />
                    </div>
                     <div className="space-y-1">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Input id="bloodType" name="bloodType" value={user.healthInfo?.bloodType || ''} onChange={handleHealthInfoChange} disabled={!isEditing} />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <Label>Allergies</Label>
                    <Input placeholder="e.g., Peanuts, Pollen" value={user.healthInfo?.allergies?.join(', ') || ''} disabled />
                    <p className="text-xs text-muted-foreground">This field is managed by your provider.</p>
                 </div>
              </CardContent>
            </Card>
          </div>

          <Card>
             <CardHeader>
                <CardTitle className="flex items-center gap-2"><span>⚙️</span> Preferences & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2"><span>🔔</span> Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive updates and reminders via email.</p>
                      </div>
                      <Switch id="email-notifications" checked={user.settings?.notifications?.email} onCheckedChange={(c) => handleNotificationChange(c, 'email')} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                       <div>
                        <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">Get real-time alerts on your devices.</p>
                      </div>
                      <Switch id="push-notifications" checked={user.settings?.notifications?.push} onCheckedChange={(c) => handleNotificationChange(c, 'push')} />
                    </div>
                  </div>
                </div>
                 <Separator />
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2"><span>🛡️</span> Account Actions</h3>
                  <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div>
                              <Label className="font-medium">Register as a Doctor/Provider</Label>
                              <p className="text-xs text-muted-foreground">Access provider dashboard and tools.</p>
                          </div>
                          <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button variant="secondary"><span className="mr-2">💼</span> Register</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>Confirm Account Upgrade</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          Are you sure you want to register as a Doctor/Provider? This will grant you access to provider-level features. This action cannot be easily undone.
                                      </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                      <AlertDialogCancel disabled={isUpgrading}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={handleUpgrade} disabled={isUpgrading}>
                                          {isUpgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                          Confirm & Upgrade
                                      </AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                      </div>
                      <div className="flex gap-2 pt-2">
                          <Button variant="outline">Export My Data</Button>
                          <Button variant="destructive">Delete Account</Button>
                      </div>
                  </div>
                </div>
              </CardContent>
          </Card>

        </div>
      </ScrollArea>
    </div>
  );
}
