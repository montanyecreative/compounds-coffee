import { NextRequest, NextResponse } from "next/server";
import { auth, isAdmin } from "@/lib/auth";
import { processRoastersFile } from "@/lib/processRoastersFile";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const session = await auth();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if user is admin
		if (!isAdmin(session)) {
			return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
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

		// Process the file using shared function
		const results = await processRoastersFile(buffer, file.name);

		return NextResponse.json({
			message: `Processed ${file.name}${
				results.deletedCount !== undefined ? ` (deleted ${results.deletedCount} existing entries)` : ""
			}`,
			successCount: results.success.length,
			errorCount: results.errors.length,
			deletedCount: results.deletedCount,
			success: results.success,
			errors: results.errors,
		});
	} catch (error: any) {
		console.error("Error processing file:", error);
		return NextResponse.json({ error: error.message || "Failed to process file" }, { status: 500 });
	}
}
