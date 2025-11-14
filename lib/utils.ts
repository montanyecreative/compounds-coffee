import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Converts a string to a URL-friendly slug
 */
export function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/[^\w\-]+/g, "") // Remove all non-word chars except hyphens
		.replace(/\-\-+/g, "-") // Replace multiple hyphens with single hyphen
		.replace(/^-+/, "") // Trim hyphens from start
		.replace(/-+$/, ""); // Trim hyphens from end
}

/**
 * Creates a unique slug for a roaster by combining shop name and ID
 * Format: shop-name--id
 */
export function createRoasterSlug(shopName: string, id: string): string {
	const nameSlug = slugify(shopName);
	return `${nameSlug}--${id}`;
}

/**
 * Parses a roaster slug to extract the ID
 * Returns the ID if found, or the original slug if no ID separator exists
 */
export function parseRoasterSlug(slug: string): string {
	const parts = slug.split("--");
	// If we have a separator, return the last part (the ID)
	// Otherwise, return the original slug (for backward compatibility)
	return parts.length > 1 ? parts[parts.length - 1] : slug;
}

/**
 * Converts grams to fluid ounces
 */
export function gramsToFluidOunces(grams: number): number {
	return Math.round((grams / 29.5735) * 10) / 10;
}
