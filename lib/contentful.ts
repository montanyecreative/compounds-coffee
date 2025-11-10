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
		roaster?: Entry<RoasterSkeleton, undefined, string>;
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

// -------------------- Roaster Content --------------------
interface RoasterSkeleton extends EntrySkeletonType {
	contentTypeId: "roaster";
	fields: {
		roasterName: string;
		roasterLocation: {
			lat: number;
			lon: number;
		};
		roasterWebsite: string;
	};
}

export type CoffeeBrewPost = Entry<CoffeeBrewSkeleton, undefined, string>;
export type BrewMethod = Entry<BrewMethodSkeleton, undefined, string>;
export type Roaster = Entry<RoasterSkeleton, undefined, string>;

// Fetch all coffee brew posts
export async function getCoffeeBrews(locale?: string): Promise<CoffeeBrewPost[]> {
	try {
		const entries = await client.getEntries<CoffeeBrewSkeleton>({
			content_type: "coffee",
			order: ["-sys.createdAt"], // Sort by newest first
			include: 2, // Include referenced entries (roaster) up to 2 levels deep
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
				include: 2, // Include referenced entries (roaster)
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
		const entry = await client.getEntry<CoffeeBrewSkeleton>(slug, {
			...(locale ? { locale } : {}),
			include: 2, // Include referenced entries (roaster)
		} as any);
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
			include: 2, // Include referenced entries (roaster)
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

		// Fallback: if localized lookup failed, try other locales to find the entry
		// This handles cases where the URL has a name from a different locale
		const defaultLocale = "en-US";
		const alternateLocale = locale === "fr-CA" ? defaultLocale : "fr-CA";

		// Try alternate locale to find the entry
		const fallback = await client.getEntries<BrewMethodSkeleton>({
			content_type: "brewMethod",
			limit: 1,
			...({ "fields.brewMethod": name } as any),
			locale: alternateLocale,
		});

		if (fallback.items.length > 0) {
			const id = fallback.items[0].sys.id;
			// Fetch the entry with the requested locale
			const byId = await client.getEntry<BrewMethodSkeleton>(id, locale ? { locale } : undefined);
			if (byId.sys.contentType.sys.id === "brewMethod") return byId as BrewMethod;
		}

		// Also try default locale if we haven't already
		if (locale && locale !== defaultLocale && alternateLocale !== defaultLocale) {
			const defaultFallback = await client.getEntries<BrewMethodSkeleton>({
				content_type: "brewMethod",
				limit: 1,
				...({ "fields.brewMethod": name } as any),
				locale: defaultLocale,
			});
			if (defaultFallback.items.length > 0) {
				const id = defaultFallback.items[0].sys.id;
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

// Fetch all roasters
export async function getRoasters(locale?: string): Promise<Roaster[]> {
	try {
		const entries = await client.getEntries<RoasterSkeleton>({
			content_type: "roaster",
			...(locale ? { locale } : {}),
		});
		return entries.items as Roaster[];
	} catch (error) {
		console.error("Error fetching roasters:", error);
		return [];
	}
}

// Fetch a single roaster by ID
export async function getRoasterById(id: string, locale?: string): Promise<Roaster | null> {
	try {
		const entry = await client.getEntry<RoasterSkeleton>(id, locale ? { locale } : undefined);
		if (entry.sys.contentType.sys.id === "roaster") return entry as Roaster;
		return null;
	} catch (error) {
		console.error("Error fetching roaster:", error);
		return null;
	}
}

// Fetch a single roaster by name
export async function getRoasterByName(name: string, locale?: string): Promise<Roaster | null> {
	try {
		const entries = await client.getEntries<RoasterSkeleton>({
			content_type: "roaster",
			limit: 1,
			...({ "fields.roasterName": name } as any),
			...(locale ? { locale } : {}),
		});
		if (entries.items.length > 0) return entries.items[0] as Roaster;
		return null;
	} catch (error) {
		console.error("Error fetching roaster by name:", error);
		return null;
	}
}
