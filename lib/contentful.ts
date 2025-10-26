import { createClient, Entry, EntrySkeletonType } from "contentful";

// Create the Contentful client
const client = createClient({
	space: process.env.CONTENTFUL_SPACE_ID!,
	accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

// Define types for your content
interface CoffeeBrewSkeleton extends EntrySkeletonType {
	contentTypeId: "coffee";
	fields: {
		name: string;
		region: string;
		roastLevel: string;
		process: string;
		brewMethod: string;
		brewDate: string;
		grindSetting: number;
		waterTemp: number;
		coffeeDose: number;
		bloomYield: number;
		coffeeYield: number;
		bloomTime: string;
		brewTime: string;
		tastingHighlights: string;
		tastingNotes: string;
		notes: string;
		link: string;
		price: number;
	};
}

export type CoffeeBrewPost = Entry<CoffeeBrewSkeleton, undefined, string>;

// Fetch all coffee brew posts
export async function getCoffeeBrews(): Promise<CoffeeBrewPost[]> {
	try {
		const entries = await client.getEntries<CoffeeBrewSkeleton>({
			content_type: "coffee",
			order: ["-sys.createdAt"], // Sort by newest first
		});

		return entries.items;
	} catch (error) {
		console.error("Error fetching coffee brews:", error);
		return [];
	}
}

// Fetch a single coffee brew by slug
export async function getCoffeeBrewBySlug(slug: string): Promise<CoffeeBrewPost | null> {
	try {
		const entries = await client.getEntries<CoffeeBrewSkeleton>({
			content_type: "coffee",
			limit: 1,
			...({ "fields.slug": slug } as any), // Type assertion needed for dynamic field queries
		});

		if (entries.items.length > 0) {
			return entries.items[0];
		}

		return null;
	} catch (error) {
		console.error("Error fetching coffee brew:", error);
		return null;
	}
}
