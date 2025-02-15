'use client';

import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';

interface EmojiFormProps {
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}

export function EmojiForm({ onGenerate, isGenerating }: EmojiFormProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    
    await onGenerate(prompt);
    setPrompt('');
  }, [prompt, isGenerating, onGenerate]);

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Enter a prompt to generate an emoji"
        value={prompt}
        onChange={handlePromptChange}
        className="flex-1"
        disabled={isGenerating}
      />
      <Button 
        type="submit" 
        disabled={isGenerating || !prompt.trim()}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating
          </>
        ) : (
          'Generate'
        )}
      </Button>
    </form>
  );
} 