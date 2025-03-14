
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function serializeMongoose<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}