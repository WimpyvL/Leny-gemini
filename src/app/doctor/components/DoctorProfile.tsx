'use client';

import type { User } from '@/lib/types';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface DoctorProfileProps {
  user: User;
}

export function DoctorProfile({ user: initialUser }: DoctorProfileProps) {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);

  const handleDoctorInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({
        ...prev,
        doctorInfo: { ...prev.doctorInfo, [name]: value }
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
    // In a real app, an API call would save the user data.
  };

  return (
    <div className="bg-secondary h-full">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className={cn("text-3xl text-white", user.avatarColor)}>{user.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl font-bold font-headline">{user.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base">
                    <span className="text-lg">👩‍⚕️</span> {user.doctorInfo?.specialty}
                  </CardDescription>
                </div>
              </div>
              <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                <span className="mr-2">✏️</span>
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </CardHeader>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><span className="text-xl">💼</span> Professional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                      <Label htmlFor="practiceName" className="flex items-center gap-1.5"><span className="text-lg">🏢</span> Practice Name</Label>
                      <Input id="practiceName" name="practiceName" value={user.doctorInfo?.practiceName || ''} onChange={handleDoctorInfoChange} disabled={!isEditing} />
                  </div>
                  <div className="space-y-1">
                      <Label htmlFor="licenseNumber" className="flex items-center gap-1.5"><span className="text-lg">🏅</span> Medical License</Label>
                      <Input id="licenseNumber" name="licenseNumber" value={user.doctorInfo?.licenseNumber || ''} onChange={handleDoctorInfoChange} disabled={!isEditing} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                      <Label htmlFor="practiceAddress" className="flex items-center gap-1.5"><span className="text-lg">🏢</span> Practice Address</Label>
                      <Input id="practiceAddress" name="practiceAddress" value={user.doctorInfo?.practiceAddress || ''} onChange={handleDoctorInfoChange} disabled={!isEditing} />
                  </div>
                  <div className="space-y-1">
                      <Label htmlFor="officeHours" className="flex items-center gap-1.5"><span className="text-lg">🕒</span> Office Hours</Label>
                      <Input id="officeHours" name="officeHours" value={user.doctorInfo?.officeHours || ''} onChange={handleDoctorInfoChange} disabled={!isEditing} />
                  </div>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="bio" className="flex items-center gap-1.5"><span className="text-lg">👤</span> Bio</Label>
                    <Textarea id="bio" name="bio" value={user.doctorInfo?.bio || ''} onChange={handleDoctorInfoChange} disabled={!isEditing} rows={4} />
                  </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><span className="text-xl">⚙️</span> Preferences & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2"><span className="text-lg">🔔</span> Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                          <p className="text-xs text-muted-foreground">Receive updates and alerts for your patients.</p>
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
                  <div>
                      <h3 className="font-medium mb-2 flex items-center gap-2"><span className="text-lg">🛡️</span> Account Actions</h3>
                      <div className="flex gap-2">
                          <Button variant="outline">Request Data Export</Button>
                          <Button variant="destructive">Deactivate Account</Button>
                      </div>
                  </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
