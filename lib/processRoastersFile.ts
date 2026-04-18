import * as XLSX from "xlsx";
import { createRoasterEntry, updateRoasterEntry, deleteRoasterEntry, CreateRoasterData, getRoastersTest, Roaster } from "@/lib/contentful";
import { geocodeAddress } from "@/lib/geocoding";

export interface ProcessResult {
	success: string[];
	errors: string[];
	createdCount?: number;
	updatedCount?: number;
	deletedCount?: number;
	skippedCount?: number;
}

// Rate limiting utility to prevent hitting Contentful API limits
async function rateLimit<T>(fn: () => Promise<T>, delayMs: number = 100): Promise<T> {
	await new Promise((resolve) => setTimeout(resolve, delayMs));
	return fn();
}

// Retry utility for handling rate limit errors
async function withRetry<T>(fn: () => Promise<T>, maxRetries: number = 3, backoffMs: number = 1000): Promise<T> {
	for (let i = 0; i < maxRetries; i++) {
		try {
			return await fn();
		} catch (error: any) {
			// Check if it's a rate limit error (429) or server error (5xx)
			if ((error.status === 429 || (error.status >= 500 && error.status < 600)) && i < maxRetries - 1) {
				const delay = backoffMs * Math.pow(2, i); // Exponential backoff
				console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms delay...`);
				await new Promise((resolve) => setTimeout(resolve, delay));
				continue;
			}
			throw error;
		}
	}
	throw new Error("Max retries exceeded");
}

// Compare two roaster data objects to see if they differ
function hasRoasterChanged(existing: Roaster, newData: CreateRoasterData): boolean {
	// Compare shop name
	if (existing.fields.shopName !== newData.shopName) {
		return true;
	}

	// Compare website (handle undefined/null)
	const existingWebsite = existing.fields.shopWebsite || "";
	const newWebsite = newData.shopWebsite || "";
	if (existingWebsite !== newWebsite) {
		return true;
	}

	// Compare phone number (handle undefined/null)
	const existingPhone = existing.fields.shopPhoneNumber || "";
	const newPhone = newData.shopPhoneNumber || "";
	if (existingPhone !== newPhone) {
		return true;
	}

	// Compare location (handle undefined/null and coordinate precision)
	const existingLoc = existing.fields.shopLocation;
	const newLoc = newData.shopLocation;

	if (!existingLoc && !newLoc) {
		return false; // Both missing, no change
	}
	if (!existingLoc || !newLoc) {
		return true; // One missing, one present = change
	}

	// At this point, both locations exist - use type assertion to help TypeScript
	// TypeScript needs help understanding that both are defined after the checks above
	const existingLocTyped = existingLoc as { lat: number; lon: number };
	const newLocTyped = newLoc as { lat: number; lon: number };

	// Compare coordinates with small tolerance for floating point differences
	const latDiff = Math.abs(existingLocTyped.lat - newLocTyped.lat);
	const lonDiff = Math.abs(existingLocTyped.lon - newLocTyped.lon);
	const tolerance = 0.0001; // ~11 meters

	if (latDiff > tolerance || lonDiff > tolerance) {
		return true;
	}

	return false;
}

export async function processRoastersFile(buffer: Buffer, filename: string): Promise<ProcessResult> {
	const results: ProcessResult = {
		success: [],
		errors: [],
		createdCount: 0,
		updatedCount: 0,
		deletedCount: 0,
		skippedCount: 0,
	};

	try {
		// Fetch existing roasters ONCE at the start
		console.log("Fetching existing roasters from Contentful...");
		const existingRoasters = await getRoastersTest();
		const roasterMap = new Map<string, { roaster: Roaster; entryId: string }>();

		existingRoasters.forEach((r) => {
			const name = r.fields.shopName;
			if (name) {
				// Normalize name for comparison (lowercase, trim)
				// Type assertion: shopName is defined as string in the interface
				const nameStr = String(name);
				const normalizedName = nameStr.toLowerCase().trim();
				roasterMap.set(normalizedName, {
					roaster: r,
					entryId: r.sys.id,
				});
			}
		});

		console.log(`Found ${roasterMap.size} existing roasters in Contentful`);

		// Track which roasters from the file we've processed
		const processedRoasterNames = new Set<string>();

		// Parse Excel file
		const workbook = XLSX.read(buffer, { type: "buffer" });
		const sheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[sheetName];

		const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

		if (data.length < 2) {
			throw new Error("Excel file must have at least a header row and one data row");
		}

		const headers = data[0].map((h: any) => String(h).toLowerCase().trim());

		// Find column indices
		const shopNameIndex = headers.findIndex((h) => h.includes("name") || h.includes("shop"));
		const addressIndex = headers.findIndex((h) => h.includes("address") || h.includes("location"));
		const latIndex = headers.findIndex((h) => h.includes("lat") || h.includes("latitude"));
		const lonIndex = headers.findIndex((h) => h.includes("lon") || h.includes("lng") || h.includes("longitude"));
		const websiteIndex = headers.findIndex((h) => h.includes("website") || h.includes("url") || h.includes("web"));
		const phoneIndex = headers.findIndex((h) => h.includes("phone") || h.includes("tel"));

		if (shopNameIndex === -1) {
			throw new Error("Excel file must have a 'shop name' or 'name' column");
		}

		// Process rows (skip header row)
		console.log(`Processing ${data.length - 1} rows from file...`);

		for (let i = 1; i < data.length; i++) {
			const row = data[i];
			if (!row || row.length === 0) continue;

			const shopName = row[shopNameIndex] ? String(row[shopNameIndex]).trim() : null;

			if (!shopName) {
				results.errors.push(`Row ${i + 1}: Missing shop name`);
				continue;
			}

			const normalizedName = shopName.toLowerCase().trim();
			processedRoasterNames.add(normalizedName);

			try {
				let shopLocation: { lat: number; lon: number } | undefined;

				// First, try to use lat/lon if provided
				if (latIndex !== -1 && lonIndex !== -1 && row[latIndex] && row[lonIndex]) {
					const lat = parseFloat(String(row[latIndex]));
					const lon = parseFloat(String(row[lonIndex]));
					if (!isNaN(lat) && !isNaN(lon)) {
						shopLocation = { lat, lon };
					}
				}

				// If no lat/lon, try to geocode address
				if (!shopLocation && addressIndex !== -1 && row[addressIndex]) {
					const address = String(row[addressIndex]).trim();
					if (address) {
						const geocoded = await geocodeAddress(address);
						if (geocoded) {
							shopLocation = geocoded;
						} else {
							results.errors.push(`Row ${i + 1}: ${shopName} - Failed to geocode address: ${address}`);
						}
					}
				}

				const roasterData: CreateRoasterData = {
					shopName,
					...(shopLocation && { shopLocation }),
					...(websiteIndex !== -1 && row[websiteIndex] && { shopWebsite: String(row[websiteIndex]).trim() }),
					...(phoneIndex !== -1 && row[phoneIndex] && { shopPhoneNumber: String(row[phoneIndex]).trim() }),
				};

				// Check if roaster already exists
				const existing = roasterMap.get(normalizedName);

				if (existing) {
					// Check if data has changed
					if (hasRoasterChanged(existing.roaster, roasterData)) {
						// Update existing roaster with rate limiting and retry
						await rateLimit(() => withRetry(() => updateRoasterEntry(existing.entryId, roasterData)), 100);
						results.updatedCount = (results.updatedCount || 0) + 1;
						results.success.push(`Row ${i + 1}: ${shopName} updated successfully`);
					} else {
						// No changes, skip
						results.skippedCount = (results.skippedCount || 0) + 1;
						results.success.push(`Row ${i + 1}: ${shopName} unchanged (skipped)`);
					}
				} else {
					// New roaster - create with rate limiting and retry
					await rateLimit(() => withRetry(() => createRoasterEntry(roasterData)), 100);
					results.createdCount = (results.createdCount || 0) + 1;
					results.success.push(`Row ${i + 1}: ${shopName} created successfully`);
				}
			} catch (error: any) {
				results.errors.push(`Row ${i + 1}: ${shopName} - ${error.message || "Failed to process entry"}`);
			}
		}

		// Delete roasters that are no longer in the file
		console.log("Checking for roasters to delete (not in file)...");
		for (const [normalizedName, { roaster, entryId }] of roasterMap.entries()) {
			if (!processedRoasterNames.has(normalizedName)) {
				try {
					await rateLimit(() => withRetry(() => deleteRoasterEntry(entryId)), 100);
					results.deletedCount = (results.deletedCount || 0) + 1;
					results.success.push(`${roaster.fields.shopName} deleted (not in file)`);
				} catch (error: any) {
					results.errors.push(`Failed to delete ${roaster.fields.shopName}: ${error.message}`);
				}
			}
		}

		console.log("Sync completed:", {
			created: results.createdCount,
			updated: results.updatedCount,
			deleted: results.deletedCount,
			skipped: results.skippedCount,
			errors: results.errors.length,
		});

		return results;
	} catch (error: any) {
		console.error("Error processing roasters file:", error);
		results.errors.push(`Fatal error: ${error.message || "Unknown error"}`);
		return results;
	}
}
