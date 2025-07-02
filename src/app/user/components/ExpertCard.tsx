'use client';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function ExpertCard({ expert }: { expert: User }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className={cn("text-xl text-white", expert.avatarColor)}>{expert.avatar}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{expert.name}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            <span>💼</span> {expert.expertInfo?.specialty}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0">🏢</span>
          <span>{expert.expertInfo?.practiceName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0">📍</span>
          <span>{expert.expertInfo?.practiceAddress}</span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="w-full">
          <span className="mr-2">💬</span> Start a Chat
        </Button>
        <Button variant="outline" className="w-full">Request Consultation</Button>
      </CardFooter>
    </Card>
  );
}
