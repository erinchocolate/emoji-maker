import { EmojiCard } from './emoji-card';
import { generateId } from '@/lib/utils';

interface EmojiGridProps {
  emojis: string[];
}

export function EmojiGrid({ emojis }: EmojiGridProps) {
  if (!Array.isArray(emojis) || emojis.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {emojis.map((emoji, index) => {
        // Skip empty URLs
        if (!emoji) return null;
        
        // Generate a stable ID for the emoji based on its URL and index
        const id = generateId(`${emoji}-${index}`);
        
        return (
          <EmojiCard
            key={id}
            id={id}
            imageUrl={emoji}
            initialLikes={0}
          />
        );
      })}
    </div>
  );
} 