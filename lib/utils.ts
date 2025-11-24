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

/**
 * Formats a date string to MM/DD/YYYY 12:00am/pm format
 */
export function formatBrewDate(dateString: string | undefined): string {
	if (!dateString) return "";

	try {
		const date = new Date(dateString);

		// Check if date is valid
		if (isNaN(date.getTime())) {
			return dateString; // Return original if invalid
		}

		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const year = date.getFullYear();

		// Format time (12:00am/pm)
		let hours = date.getHours();
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const ampm = hours >= 12 ? "pm" : "am";
		hours = hours % 12;
		hours = hours ? hours : 12; // 0 should be 12
		const time = `${hours}:${minutes}${ampm}`;

		return `${month}/${day}/${year} ${time}`;
	} catch (error) {
		return dateString; // Return original if parsing fails
	}
}
