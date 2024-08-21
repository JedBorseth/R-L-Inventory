import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNum(input: number) {
  const formatted = new Intl.NumberFormat().format(input);
  return formatted;
}

export function customCSVOrder({
  type,
  color,
  ect,
  flute,
  width,
  length,
  date,
}: {
  type: string;
  color: string;
  ect: string;
  flute: string;
  width: number;
  length: number;
  date: string;
}) {
  return {
    A: "",
    type: type,
    item: color,
    ect: ect,
    flute: flute,
    width: width,
    x: "",
    length: length,
    I: "",
    J: "",
    K: "",
    L: "",
    M: "",
    N: "",
    O: "",
    P: "",
    Q: "",
    R: "",
    S: "",
    T: "",
    U: "",
    V: "",
    InStock: "X",
    X: "",
    Y: date,
  };
}
