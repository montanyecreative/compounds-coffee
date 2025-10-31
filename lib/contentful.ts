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
		slug?: string;
		region: string;
		roastLevel: string;
		process: string;
		brewMethod: string;
		brewDate: string;
		grinder: string;
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
		roaster: string;
		link: string;
		price: number;
	};
}

// -------------------- Brew Method Content --------------------
interface BrewMethodSkeleton extends EntrySkeletonType {
	contentTypeId: "brewMethod";
	fields: {
		brewMethod: string;
		slug?: string;
		brewTempRange?: string; // e.g., "195-205°F"
		optimalCoffeeDose?: number;
		targetBloomYield?: number;
		targetBrewYield?: number;
		targetBloomTime?: string;
		targetBrewTime?: string;
		textField1?: string;
		textField2?: string;
		linkToProduct?: string;
		brewMethodIcon?: object;
		nt_experiences?: string;
	};
}

export type CoffeeBrewPost = Entry<CoffeeBrewSkeleton, undefined, string>;
export type BrewMethod = Entry<BrewMethodSkeleton, undefined, string>;

// Fetch all coffee brew posts
export async function getCoffeeBrews(locale?: string): Promise<CoffeeBrewPost[]> {
	try {
		const entries = await client.getEntries<CoffeeBrewSkeleton>({
			content_type: "coffee",
			order: ["-sys.createdAt"], // Sort by newest first
			...(locale ? { locale } : {}),
		});

		return entries.items;
	} catch (error) {
		console.error("Error fetching coffee brews:", error);
		return [];
	}
}

// Fetch a single coffee brew by slug or ID
export async function getCoffeeBrewBySlug(slug: string, locale?: string): Promise<CoffeeBrewPost | null> {
	try {
		console.log("Searching for brew with slug:", slug);

		// Try to fetch by slug field if it exists
		try {
			const entries = await client.getEntries<CoffeeBrewSkeleton>({
				content_type: "coffee",
				limit: 1,
				...({ "fields.slug": slug } as any),
				...(locale ? { locale } : {}),
			});

			console.log("Entries found by slug:", entries.items.length);

			if (entries.items.length > 0) {
				return entries.items[0];
			}
		} catch (slugError: any) {
			// Slug field doesn't exist, continue to ID lookup
			console.log("Slug field not found in content type, trying by ID");
		}

		// Try to fetch by entry ID
		console.log("Trying to fetch by entry ID:", slug);
		const entry = await client.getEntry<CoffeeBrewSkeleton>(slug, locale ? { locale } : undefined);
		console.log("Entry found by ID:", entry.sys.id);

		if (entry.sys.contentType.sys.id === "coffee") {
			return entry as CoffeeBrewPost;
		}

		return null;
	} catch (error) {
		console.error("Error fetching coffee brew:", error);
		return null;
	}
}

export async function getBrewMethods(locale?: string): Promise<BrewMethod[]> {
	try {
		const entries = await client.getEntries<BrewMethodSkeleton>({
			content_type: "brewMethod",
			// Contentful types for order are strict; omit if not supported by typings
			...(locale ? { locale } : {}),
		});
		return entries.items as BrewMethod[];
	} catch (error) {
		console.error("Error fetching brew methods:", error);
		return [];
	}
}

export async function getBrewMethodBySlug(slug: string, locale?: string): Promise<BrewMethod | null> {
	try {
		// Try slug if present in the model
		try {
			const entries = await client.getEntries<BrewMethodSkeleton>({
				content_type: "brewMethod",
				limit: 1,
				...({ "fields.slug": slug } as any),
				...(locale ? { locale } : {}),
			});
			if (entries.items.length > 0) return entries.items[0] as BrewMethod;
		} catch {}

		// Fallback to entry ID
		const entry = await client.getEntry<BrewMethodSkeleton>(slug, locale ? { locale } : undefined);
		if (entry.sys.contentType.sys.id === "brewMethod") return entry as BrewMethod;
		return null;
	} catch (error) {
		console.error("Error fetching brew method:", error);
		return null;
	}
}

// Fetch a single coffee brew by its name
export async function getCoffeeBrewByName(name: string, locale?: string): Promise<CoffeeBrewPost | null> {
	try {
		const entries = await client.getEntries<CoffeeBrewSkeleton>({
			content_type: "coffee",
			limit: 1,
			...({ "fields.name": name } as any),
			...(locale ? { locale } : {}),
		});
		if (entries.items.length > 0) return entries.items[0] as CoffeeBrewPost;
		return null;
	} catch (error) {
		console.error("Error fetching coffee brew by name:", error);
		return null;
	}
}

// Fetch a single brew method by its name (brewMethod field)
export async function getBrewMethodByName(name: string, locale?: string): Promise<BrewMethod | null> {
	try {
		const entries = await client.getEntries<BrewMethodSkeleton>({
			content_type: "brewMethod",
			limit: 1,
			...({ "fields.brewMethod": name } as any),
			...(locale ? { locale } : {}),
		});

		if (entries.items.length > 0) return entries.items[0] as BrewMethod;

		// Fallback: if localized lookup failed (e.g., path has EN name but locale is FR),
		// try default locale to find the entry ID, then refetch by ID with requested locale
		const defaultLocale = "en-US";
		if (locale && locale !== defaultLocale) {
			const fallback = await client.getEntries<BrewMethodSkeleton>({
				content_type: "brewMethod",
				limit: 1,
				...({ "fields.brewMethod": name } as any),
				locale: defaultLocale,
			});
			if (fallback.items.length > 0) {
				const id = fallback.items[0].sys.id;
				const byId = await client.getEntry<BrewMethodSkeleton>(id, { locale });
				if (byId.sys.contentType.sys.id === "brewMethod") return byId as BrewMethod;
			}
		}

		return null;
	} catch (error) {
		console.error("Error fetching brew method by name:", error);
		return null;
	}
}
