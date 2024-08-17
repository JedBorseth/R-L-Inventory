import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNum(input: number) {
  const formatted = new Intl.NumberFormat().format(input);
  return formatted;
}
