import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Convert grams of liquid coffee to fluid ounces
 * @param grams - Weight in grams
 * @returns Volume in fluid ounces (rounded to 2 decimal places)
 */
export function gramsToFluidOunces(grams: number): number {
	const ML_PER_FL_OZ = 29.5735;
	return Math.round((grams / ML_PER_FL_OZ) * 100) / 100;
}
