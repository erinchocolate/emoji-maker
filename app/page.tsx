'use client';

import { useState, useEffect } from 'react';
import { EmojiForm } from '@/components/emoji-form';
import { EmojiGrid } from '@/components/emoji-grid';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { createOrGetUserProfile } from '@/lib/user-profile';

export default function Home() {
  const { user, isLoaded } = useUser();
  const [emojis, setEmojis] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      // Initialize user profile when user signs in
      createOrGetUserProfile(user.id).catch(console.error);
    }
  }, [isLoaded, user]);

  const handleGenerate = async (prompt: string) => {
    if (!user) {
      toast.error('Please sign in to generate emojis');
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate emoji');
      }
      
      if (data.output && Array.isArray(data.output)) {
        // Add new emojis to the beginning of the array
        setEmojis(prevEmojis => [...data.output, ...prevEmojis]);
        toast.success('Emoji generated successfully!');
      } else {
        console.error('Invalid API response format:', data);
        toast.error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error generating emoji:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate emoji');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        🤖 Emoji maker
      </h1>
      
      <div className="w-full max-w-3xl space-y-8">
        <EmojiForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        <div className="min-h-[200px]">
          {emojis.length > 0 ? (
            <EmojiGrid emojis={emojis} />
          ) : (
            isGenerating && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Generating your emoji...</p>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}
