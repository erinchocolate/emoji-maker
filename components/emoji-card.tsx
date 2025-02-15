'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Download, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { storage } from '@/lib/utils';

interface EmojiCardProps {
  id: string;
  imageUrl: string;
  initialLikes?: number;
}

export function EmojiCard({ id, imageUrl, initialLikes = 0 }: EmojiCardProps) {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return null;
  }

  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Load likes and liked status from localStorage
    const savedLikes = storage.getLikes(id);
    const savedIsLiked = storage.getIsLiked(id);
    setLikes(savedLikes || initialLikes);
    setIsLiked(savedIsLiked);
  }, [id, initialLikes]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleLike = useCallback(() => {
    if (!isLiked) {
      const newLikes = likes + 1;
      setLikes(newLikes);
      setIsLiked(true);
      storage.setLikes(id, newLikes);
      storage.setIsLiked(id, true);
      toast.success('Liked!');
    } else {
      const newLikes = Math.max(0, likes - 1);
      setLikes(newLikes);
      setIsLiked(false);
      storage.setLikes(id, newLikes);
      storage.setIsLiked(id, false);
      toast.success('Unliked!');
    }
  }, [id, likes, isLiked]);

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emoji-${id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download started!');
    } catch (error) {
      console.error('Error downloading emoji:', error);
      toast.error('Failed to download emoji');
    }
  }, [id, imageUrl]);

  const handleImageError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  if (hasError) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Card
        className="relative aspect-square overflow-hidden group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full h-full bg-gray-100 dark:bg-gray-800">
          <Image
            src={imageUrl}
            alt="Generated emoji"
            fill
            className={`object-contain rounded-lg transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 768px) 50vw, 33vw"
            priority
            onLoadingComplete={() => setIsLoading(false)}
            onError={handleImageError}
          />
        </div>
        
        {isHovered && !isLoading && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center gap-2 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className={`h-8 w-8 text-white hover:text-white hover:bg-white/20 ${
                isLiked ? 'text-red-500 hover:text-red-500' : ''
              }`}
              onClick={handleLike}
              type="button"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
              onClick={handleDownload}
              type="button"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
      <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        <span>{likes} likes</span>
      </div>
    </div>
  );
} 