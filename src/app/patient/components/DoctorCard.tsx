'use client';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Stethoscope, Building, MapPin, MessageSquare } from 'lucide-react';

export function DoctorCard({ doctor }: { doctor: User }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-xl bg-sky-100 text-sky-700">{doctor.avatar}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{doctor.name}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            <Stethoscope className="h-4 w-4" /> {doctor.doctorInfo?.specialty}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <Building className="h-4 w-4 flex-shrink-0" />
          <span>{doctor.doctorInfo?.practiceName}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span>{doctor.doctorInfo?.practiceAddress}</span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="w-full">
          <MessageSquare className="mr-2 h-4 w-4" /> Start a Chat
        </Button>
        <Button variant="outline" className="w-full">Request Appointment</Button>
      </CardFooter>
    </Card>
  );
}
