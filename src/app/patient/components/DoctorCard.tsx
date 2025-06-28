'use client';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

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
            <span>👩‍⚕️</span> {doctor.doctorInfo?.specialty}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0">🏢</span>
          <span>{doctor.doctorInfo?.practiceName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0">📍</span>
          <span>{doctor.doctorInfo?.practiceAddress}</span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="w-full">
          <span className="mr-2">💬</span> Start a Chat
        </Button>
        <Button variant="outline" className="w-full">Request Appointment</Button>
      </CardFooter>
    </Card>
  );
}
