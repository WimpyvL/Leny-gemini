'use client';
import { useState, useEffect } from 'react';
import type { ForYouCardData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Icon } from '@/components/Icon';

interface ForYouDashboardProps {
  selectedItem: ForYouCardData | null;
  onBack?: () => void;
}

const chartConfig = {
  value: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
};

function StreakDashboard({ item, onBack }: { item: ForYouCardData, onBack?: () => void }) {
    if (!item.progressData) return null;

    return (
        <Card className="w-full h-full border-0 shadow-none rounded-none">
            <CardHeader>
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onBack}>
                            <ArrowLeft className="h-5 w-5" />
                            <span className="sr-only">Back</span>
                        </Button>
                    )}
                    <div className={cn("flex items-center justify-center h-12 w-12 rounded-lg", item.iconColor?.replace('text-', 'bg-') + '/20')}>
                        <Icon name={item.icon} className={cn("h-6 w-6", item.iconColor)} />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold font-headline">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center font-medium">
                        <span>Progress</span>
                        <span>{item.currentStreak} / {item.goal}</span>
                    </div>
                    <Progress value={(item.currentStreak! / item.goal!) * 100} className="h-3" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2">Activity Chart</h3>
                     <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <BarChart accessibilityLayer data={item.progressData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>
            <CardFooter>
                 <Button>{item.cta}</Button>
            </CardFooter>
        </Card>
    )
}

function DefaultDashboard({ item, onBack }: { item: ForYouCardData, onBack?: () => void }) {
    const [formattedTimestamp, setFormattedTimestamp] = useState('');

    useEffect(() => {
        if (item?.timestamp) {
            setFormattedTimestamp(format(item.timestamp, 'EEEE, MMMM d, yyyy @ p'));
        }
    }, [item?.timestamp]);
    
    if (!item) return null;

     return (
        <Card className="w-full h-full border-0 shadow-none rounded-none">
            <CardHeader>
                <div className="flex items-center gap-3">
                     {onBack && (
                        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onBack}>
                            <ArrowLeft className="h-5 w-5" />
                            <span className="sr-only">Back</span>
                        </Button>
                     )}
                     <div className={cn("flex items-center justify-center h-12 w-12 rounded-lg", item.iconColor?.replace('text-', 'bg-') + '/20')}>
                        <Icon name={item.icon} className={cn("h-6 w-6", item.iconColor)} />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold font-headline">{item.title}</CardTitle>
                        {formattedTimestamp && <p className="text-sm text-muted-foreground">{formattedTimestamp}</p>}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-lg">{item.description}</p>
            </CardContent>
            <CardFooter>
                <Button>{item.cta}</Button>
            </CardFooter>
        </Card>
    );
}

export function ForYouDashboard({ selectedItem, onBack }: ForYouDashboardProps) {
  if (!selectedItem) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-secondary text-center p-8">
        <Sparkles className="h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold">Welcome to Your Space</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          This is your personal health dashboard. Select an item from the "For You" list to see more details here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-secondary h-full p-6">
        {selectedItem.type === 'health_streak' 
            ? <StreakDashboard item={selectedItem} onBack={onBack} /> 
            : <DefaultDashboard item={selectedItem} onBack={onBack} />
        }
    </div>
  );
}
