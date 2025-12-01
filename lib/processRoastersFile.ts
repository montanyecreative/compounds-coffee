import * as XLSX from "xlsx";
import { createRoasterEntry, CreateRoasterData, deleteAllRoastersTest } from "@/lib/contentful";
import { geocodeAddress } from "@/lib/geocoding";

export interface ProcessResult {
	success: string[];
	errors: string[];
	deletedCount?: number;
}

export async function processRoastersFile(buffer: Buffer, filename: string): Promise<ProcessResult> {
	const results: ProcessResult = {
		success: [],
		errors: [],
	};

	// Delete all existing roastersAndShopsTest entries before processing new file
	try {
		console.log("Deleting all existing roastersAndShopsTest entries...");
		const deletedCount = await deleteAllRoastersTest();
		results.deletedCount = deletedCount;
		console.log(`Deleted ${deletedCount} existing entries`);
	} catch (error: any) {
		console.error("Error deleting existing entries:", error);
		results.errors.push(`Warning: Failed to delete existing entries: ${error.message}`);
		// Continue processing even if deletion fails
	}

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
	for (let i = 1; i < data.length; i++) {
		const row = data[i];
		if (!row || row.length === 0) continue;

		const shopName = row[shopNameIndex] ? String(row[shopNameIndex]).trim() : null;

		if (!shopName) {
			results.errors.push(`Row ${i + 1}: Missing shop name`);
			continue;
		}

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

			await createRoasterEntry(roasterData);
			results.success.push(`Row ${i + 1}: ${shopName} created successfully`);
		} catch (error: any) {
			results.errors.push(`Row ${i + 1}: ${shopName} - ${error.message || "Failed to create entry"}`);
		}
	}

	return results;
}
