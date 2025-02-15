import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(str: string): string {
  // Simple hash function for client-side ID generation
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

// Local storage utilities
const STORAGE_KEY = 'emoji-likes';
const LIKED_KEY = 'emoji-liked';

export const storage = {
  getLikes(id: string): number {
    if (typeof window === 'undefined') return 0;
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return 0;
      
      const emojis: Record<string, number> = JSON.parse(data);
      return emojis[id] || 0;
    } catch {
      return 0;
    }
  },

  setLikes(id: string, likes: number) {
    if (typeof window === 'undefined') return;
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const emojis: Record<string, number> = data ? JSON.parse(data) : {};
      emojis[id] = likes;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emojis));
    } catch (error) {
      console.error('Error saving likes:', error);
    }
  },

  getIsLiked(id: string): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const data = localStorage.getItem(LIKED_KEY);
      if (!data) return false;
      
      const liked: Record<string, boolean> = JSON.parse(data);
      return liked[id] || false;
    } catch {
      return false;
    }
  },

  setIsLiked(id: string, isLiked: boolean) {
    if (typeof window === 'undefined') return;
    
    try {
      const data = localStorage.getItem(LIKED_KEY);
      const liked: Record<string, boolean> = data ? JSON.parse(data) : {};
      liked[id] = isLiked;
      localStorage.setItem(LIKED_KEY, JSON.stringify(liked));
    } catch (error) {
      console.error('Error saving liked status:', error);
    }
  }
}; 