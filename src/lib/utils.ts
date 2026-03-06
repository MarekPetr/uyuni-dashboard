import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export const oneMinuteInMs = 60 * 1000
export const fiveMinutesInMs = 5 * oneMinuteInMs
