import { createClient, Entry, EntrySkeletonType } from "contentful";
import { createClient as createManagementClient } from "contentful-management";

// Create the Contentful client (for reading)
const client = createClient({
	space: process.env.CONTENTFUL_SPACE_ID!,
	accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

// Create the Contentful Management client (for writing)
// Note: Management API token is different from Content Delivery API token
// We create it lazily to avoid initialization errors at module load
let managementClient: ReturnType<typeof createManagementClient> | null = null;

const getManagementClient = () => {
	if (!managementClient) {
		const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
		if (!token) {
			throw new Error(
				"CONTENTFUL_MANAGEMENT_TOKEN is required for creating entries. Please set it in your environment variables. " +
					"Get it from Contentful Settings > CMA tokens > Create personal access token. " +
					"Note: This is different from Content Delivery API or Content Preview API tokens."
			);
		}
		managementClient = createManagementClient({
			accessToken: token,
		});
	}
	return managementClient;
};

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
		roaster?: Entry<RoasterAndShopSkeleton, undefined, string>;
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

// -------------------- Roaster and Shop Content --------------------
interface RoasterAndShopSkeleton extends EntrySkeletonType {
	contentTypeId: "roastersAndShops" | "roastersAndShopsTest";
	fields: {
		shopName: string;
		shopLocation: {
			lat: number;
			lon: number;
		};
		shopWebsite: string;
		shopPhoneNumber: string;
	};
}

export type CoffeeBrewPost = Entry<CoffeeBrewSkeleton, undefined, string>;
export type BrewMethod = Entry<BrewMethodSkeleton, undefined, string>;
export type Roaster = Entry<RoasterAndShopSkeleton, undefined, string>;

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

// Fetch all roasters or shops
export async function getRoasters(locale?: string): Promise<Roaster[]> {
	try {
		const entries = await client.getEntries<RoasterAndShopSkeleton>({
			content_type: "roastersAndShops",
			...(locale ? { locale } : {}),
		});
		return entries.items as Roaster[];
	} catch (error) {
		console.error("Error fetching roasters or shops:", error);
		return [];
	}
}

// Fetch all roasters or shops from test content model
export async function getRoastersTest(locale?: string): Promise<Roaster[]> {
	try {
		const entries = await client.getEntries<RoasterAndShopSkeleton>({
			content_type: "roastersAndShopsTest",
			...(locale ? { locale } : {}),
		});
		return entries.items as Roaster[];
	} catch (error) {
		console.error("Error fetching roasters or shops from test model:", error);
		return [];
	}
}

// Fetch a single roaster or shop by ID
export async function getRoasterById(id: string, locale?: string): Promise<Roaster | null> {
	try {
		const entry = await client.getEntry<RoasterAndShopSkeleton>(id, locale ? { locale } : undefined);
		if (entry.sys.contentType.sys.id === "roastersAndShops" || entry.sys.contentType.sys.id === "roastersAndShopsTest") {
			return entry as Roaster;
		}
		return null;
	} catch (error) {
		console.error("Error fetching roaster or shop:", error);
		return null;
	}
}

// Fetch a single roaster or shop by name
export async function getRoasterByName(name: string, locale?: string): Promise<Roaster | null> {
	try {
		const entries = await client.getEntries<RoasterAndShopSkeleton>({
			content_type: "roastersAndShops",
			limit: 1,
			...({ "fields.shopName": name } as any),
			...(locale ? { locale } : {}),
		});
		if (entries.items.length > 0) return entries.items[0] as Roaster;
		return null;
	} catch (error) {
		console.error("Error fetching roaster or shop by name:", error);
		return null;
	}
}

// Create a roaster entry in Contentful
export interface CreateRoasterData {
	shopName: string;
	shopLocation?: {
		lat: number;
		lon: number;
	};
	shopWebsite?: string;
	shopPhoneNumber?: string;
}

export async function createRoasterEntry(data: CreateRoasterData): Promise<Roaster | null> {
	try {
		const client = getManagementClient();
		const space = await (client as any).getSpace(process.env.CONTENTFUL_SPACE_ID!);
		const environment = await space.getEnvironment("master");

		const entry = await environment.createEntry("roastersAndShopsTest", {
			fields: {
				shopName: {
					"en-US": data.shopName,
				},
				...(data.shopLocation && {
					shopLocation: {
						"en-US": {
							lat: data.shopLocation.lat,
							lon: data.shopLocation.lon,
						},
					},
				}),
				...(data.shopWebsite && {
					shopWebsite: {
						"en-US": data.shopWebsite,
					},
				}),
				...(data.shopPhoneNumber && {
					shopPhoneNumber: {
						"en-US": data.shopPhoneNumber,
					},
				}),
			},
		});

		// Publish the entry
		await entry.publish();

		// Fetch the created entry using the read client to return it in the expected format
		return await getRoasterById(entry.sys.id);
	} catch (error: any) {
		console.error("Error creating roaster entry:", error);

		// Provide more helpful error messages
		if (error?.name === "AccessTokenInvalid" || error?.status === 403) {
			const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
			if (token) {
				throw new Error(
					"Invalid Contentful Management API token. Please verify that CONTENTFUL_MANAGEMENT_TOKEN is a valid Personal Access Token (PAT). " +
						"Get a new token from Contentful Settings > CMA tokens > Create personal access token. " +
						"Note: Personal Access Tokens are different from Content Delivery API or Content Preview API tokens."
				);
			} else {
				throw new Error(
					"CONTENTFUL_MANAGEMENT_TOKEN is not set. Please add it to your environment variables. " +
						"Get it from Contentful Settings > CMA tokens > Create personal access token."
				);
			}
		}

		throw error;
	}
}

export interface CreateCoffeeBrewData {
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
	link: string;
	price: number;
	roasterId?: string;
}

export async function createCoffeeBrewEntry(data: CreateCoffeeBrewData): Promise<CoffeeBrewPost | null> {
	try {
		const management = getManagementClient();
		const space = await (management as any).getSpace(process.env.CONTENTFUL_SPACE_ID!);
		const environment = await space.getEnvironment("master");

		const entry = await environment.createEntry("coffee", {
			fields: {
				name: {
					"en-US": data.name,
				},
				...(data.slug && {
					slug: {
						"en-US": data.slug,
					},
				}),
				region: {
					"en-US": data.region,
				},
				roastLevel: {
					"en-US": data.roastLevel,
				},
				process: {
					"en-US": data.process,
				},
				brewMethod: {
					"en-US": data.brewMethod,
				},
				brewDate: {
					"en-US": data.brewDate,
				},
				grinder: {
					"en-US": data.grinder,
				},
				grindSetting: {
					"en-US": data.grindSetting,
				},
				waterTemp: {
					"en-US": data.waterTemp,
				},
				coffeeDose: {
					"en-US": data.coffeeDose,
				},
				bloomYield: {
					"en-US": data.bloomYield,
				},
				coffeeYield: {
					"en-US": data.coffeeYield,
				},
				bloomTime: {
					"en-US": data.bloomTime,
				},
				brewTime: {
					"en-US": data.brewTime,
				},
				tastingHighlights: {
					"en-US": data.tastingHighlights,
				},
				tastingNotes: {
					"en-US": data.tastingNotes,
				},
				notes: {
					"en-US": data.notes,
				},
				link: {
					"en-US": data.link,
				},
				price: {
					"en-US": data.price,
				},
				...(data.roasterId && {
					roaster: {
						"en-US": {
							sys: {
								type: "Link",
								linkType: "Entry",
								id: data.roasterId,
							},
						},
					},
				}),
			},
		});

		await entry.publish();

		const created = await client.getEntry<CoffeeBrewSkeleton>(entry.sys.id, {
			include: 2,
		} as any);

		return created as CoffeeBrewPost;
	} catch (error: any) {
		console.error("Error creating coffee brew entry:", error);

		if (error?.name === "AccessTokenInvalid" || error?.status === 403) {
			const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
			if (token) {
				throw new Error(
					"Invalid Contentful Management API token. Please verify that CONTENTFUL_MANAGEMENT_TOKEN is a valid Personal Access Token (PAT). " +
						"Get a new token from Contentful Settings > CMA tokens > Create personal access token. " +
						"Note: Personal Access Tokens are different from Content Delivery API or Content Preview API tokens."
				);
			} else {
				throw new Error(
					"CONTENTFUL_MANAGEMENT_TOKEN is not set. Please add it to your environment variables. " +
						"Get it from Contentful Settings > CMA tokens > Create personal access token."
				);
			}
		}

		throw error;
	}
}
