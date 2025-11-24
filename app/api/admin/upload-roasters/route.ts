import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRoasterEntry, CreateRoasterData } from "@/lib/contentful";
import { geocodeAddress } from "@/lib/geocoding";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const session = await auth();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get the form data
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Check if file is Excel format
		const validExtensions = [".xlsx", ".xls", ".csv"];
		const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
		if (!validExtensions.some((ext) => fileExtension === ext)) {
			return NextResponse.json({ error: "Invalid file type. Please upload an Excel file (.xlsx, .xls) or CSV." }, { status: 400 });
		}

		// Read the file as buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Parse Excel file
		const workbook = XLSX.read(buffer, { type: "buffer" });
		const sheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[sheetName];

		// Convert to JSON
		const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

		if (data.length < 2) {
			return NextResponse.json({ error: "Excel file must have at least a header row and one data row" }, { status: 400 });
		}

		// Get headers (first row)
		const headers = data[0].map((h: any) => String(h).toLowerCase().trim());

		// Find column indices
		const shopNameIndex = headers.findIndex((h) => h.includes("name") || h.includes("shop"));
		const addressIndex = headers.findIndex((h) => h.includes("address") || h.includes("location"));
		const latIndex = headers.findIndex((h) => h.includes("lat") || h.includes("latitude"));
		const lonIndex = headers.findIndex((h) => h.includes("lon") || h.includes("lng") || h.includes("longitude"));
		const websiteIndex = headers.findIndex((h) => h.includes("website") || h.includes("url") || h.includes("web"));
		const phoneIndex = headers.findIndex((h) => h.includes("phone") || h.includes("tel"));

		if (shopNameIndex === -1) {
			return NextResponse.json({ error: "Excel file must have a 'shop name' or 'name' column" }, { status: 400 });
		}

		// Process rows (skip header row)
		const results = {
			success: [] as string[],
			errors: [] as string[],
		};

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

		return NextResponse.json({
			message: `Processed ${data.length - 1} rows`,
			successCount: results.success.length,
			errorCount: results.errors.length,
			success: results.success,
			errors: results.errors,
		});
	} catch (error: any) {
		console.error("Error processing file:", error);
		return NextResponse.json({ error: error.message || "Failed to process file" }, { status: 500 });
	}
}
