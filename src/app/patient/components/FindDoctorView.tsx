'use client';

import { useState } from 'react';
import type { User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DoctorCard } from './DoctorCard';

interface FindDoctorViewProps {
  doctors: User[];
}

export function FindDoctorView({ doctors }: FindDoctorViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = doctors.filter(doctor => {
    const term = searchTerm.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(term) ||
      doctor.doctorInfo?.specialty?.toLowerCase().includes(term) ||
      doctor.doctorInfo?.practiceName?.toLowerCase().includes(term) ||
      doctor.doctorInfo?.practiceAddress?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="h-full flex flex-col bg-secondary">
      <header className="p-4 border-b bg-card space-y-4">
        <h1 className="text-2xl font-bold font-headline">Find a Doctor</h1>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">🔍</span>
          <Input
            placeholder="Search by name, specialty, or location..."
            className="h-11 rounded-full bg-input pl-10 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      <ScrollArea className="flex-1">
        {filteredDoctors.length > 0 ? (
          <div className="p-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
            <p className="text-lg font-medium">No Doctors Found</p>
            <p className="text-sm">Try adjusting your search terms.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
