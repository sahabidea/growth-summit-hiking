import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Convert any number/string digits to Persian numerals */
export function toPersianNum(value: string | number): string {
    return String(value).replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

/** Format a number as Persian price with comma separators */
export function toPersianPrice(value: number): string {
    return toPersianNum(value.toLocaleString("en-US"));
}
