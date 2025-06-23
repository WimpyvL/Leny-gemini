'use client';

import {
  Bot, Stethoscope, Users, Calendar, Bell, FlaskConical, Lightbulb, Flame,
  Dumbbell, Pill, Siren, NotepadText, CalendarPlus, PhoneCall,
  MapPin, BookOpenCheck, Newspaper, ClipboardPenLine, BrainCircuit, Salad, BedDouble, type LucideProps
} from 'lucide-react';

const iconMap = {
  Bot, Stethoscope, Users, Calendar, Bell, FlaskConical, Lightbulb, Flame,
  Dumbbell, Pill, Siren, NotepadText, CalendarPlus, PhoneCall,
  MapPin, BookOpenCheck, Newspaper, ClipboardPenLine, BrainCircuit, Salad, BedDouble
};

export type IconName = keyof typeof iconMap;

interface IconProps extends LucideProps {
  name?: IconName | string;
}

export function Icon({ name, ...props }: IconProps) {
  if (!name) return null;
  const IconComponent = iconMap[name as IconName];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent {...props} />;
}
