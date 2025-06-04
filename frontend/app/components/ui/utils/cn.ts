// Class name utility for conditional styling
// This utility helps combine and conditionally apply CSS classes

import { type ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names and merges Tailwind classes intelligently
 * 
 * @param inputs - Class names, objects, or arrays of class names
 * @returns Merged class name string
 * 
 * @example
 * cn('px-4 py-2', 'bg-primary-500', { 'text-white': isActive })
 * cn('px-4', 'px-6') // Returns 'px-6' (later class wins)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 