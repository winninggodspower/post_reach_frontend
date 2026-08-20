'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowRight, ArrowDown, Loader2 } from 'lucide-react';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const res = await axios.post('/api/waitlist', { email });
      
      if (res.status === 200) {
        setStatus('success');
        toast.success("You're on the waitlist! 🎉");
        setEmail('');
      }
    } catch (err: any) {
      setStatus('error');
      toast.error(err.response?.data?.error || 'Failed to join waitlist. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <p className="mb-1.5 flex items-center gap-2 text-base font-medium text-gray-800">
        Join the waitlist <ArrowDown className="size-4 text-orange-500" />
      </p>
      <form onSubmit={handleSubmit} className="relative flex w-full items-center">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          disabled={status === 'loading' || status === 'success'}
          className="w-full rounded-full border border-gray-300 bg-white/50 px-6 py-4 pr-32 text-base shadow-sm backdrop-blur-sm transition-all focus:border-accent-brand focus:outline-none focus:ring-2 focus:ring-accent-brand/20 disabled:opacity-70"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 font-medium text-white transition-all hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-70"
        >
          {status === 'loading' ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              Join <ArrowRight className="size-4 hidden sm:block" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
