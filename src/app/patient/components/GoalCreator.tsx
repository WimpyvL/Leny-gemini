'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { ForYouCardData } from '@/lib/types';

interface GoalCreatorProps {
  onSave: (goal: Omit<ForYouCardData, 'id' | 'type'>) => void;
  onCancel: () => void;
}

const goalCategories = [
  { value: 'fitness', label: 'Fitness', icon: '🏋️', color: 'text-blue-500', units: ['reps', 'minutes', 'km', 'workouts'] },
  { value: 'mindfulness', label: 'Mindfulness', icon: '🧠', color: 'text-purple-500', units: ['minutes', 'sessions'] },
  { value: 'nutrition', label: 'Nutrition', icon: '🥗', color: 'text-green-500', units: ['servings', 'calories', 'days'] },
  { value: 'sleep', label: 'Sleep', icon: '🛌', color: 'text-indigo-500', units: ['hours', 'nights'] },
];

export function GoalCreator({ onSave, onCancel }: GoalCreatorProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('fitness');
  const [goalValue, setGoalValue] = useState('');
  const [goalUnit, setGoalUnit] = useState<string>('reps');
  const [endDate, setEndDate] = useState<Date | undefined>();

  const selectedCategory = goalCategories.find(c => c.value === category);

  const handleSubmit = () => {
    if (!title || !goalValue || !selectedCategory) return;
    
    const newGoal: Omit<ForYouCardData, 'id' | 'type'> = {
      icon: selectedCategory.icon,
      iconColor: selectedCategory.color,
      title: title,
      description: `Goal: ${goalValue} ${goalUnit}`,
      cta: "Track Progress",
      currentStreak: 0,
      goal: parseInt(goalValue, 10),
      timestamp: endDate,
      progressData: [],
    };
    onSave(newGoal);
  };

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle>Create a New Goal</CardTitle>
        <CardDescription>Define a new health goal to track your progress.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="goal-title">Goal Title</Label>
          <Input id="goal-title" placeholder="e.g., Run a 5k" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal-category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="goal-category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {goalCategories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="goal-value">Target</Label>
                <Input id="goal-value" type="number" placeholder="e.g., 5" value={goalValue} onChange={(e) => setGoalValue(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="goal-unit">Unit</Label>
                 <Select value={goalUnit} onValueChange={setGoalUnit}>
                    <SelectTrigger id="goal-unit">
                        <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {selectedCategory?.units.map(unit => (
                            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className="space-y-2">
            <Label>Target End Date (Optional)</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Save Goal</Button>
      </CardFooter>
    </Card>
  );
}
