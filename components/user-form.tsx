'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserPlus, Loader2, Mail, User } from 'lucide-react';

export function UserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    };

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to create user');
      }

      // Reset form
      (e.target as HTMLFormElement).reset();
      
      // Refresh the page to show new user in server component list
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full border-muted/40 shadow-xl transition-all hover:shadow-2xl dark:bg-zinc-950/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <UserPlus className="h-5 w-5 text-indigo-500" />
          Add New User
        </CardTitle>
        <CardDescription>
          Join our platform by entering your details below.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                className="pl-9 transition-all focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                className="pl-9 transition-all focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            disabled={loading} 
            className="w-full bg-indigo-600 font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create User'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
