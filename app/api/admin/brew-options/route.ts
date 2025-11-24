import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCoffeeBrews, getBrewMethods, getRoasters } from "@/lib/contentful";

export async function GET() {
	try {
		const session = await auth();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const [brews, brewMethods, roasters] = await Promise.all([getCoffeeBrews(), getBrewMethods(), getRoasters()]);

		// Extract unique roast levels
		const roastLevels = Array.from(new Set(brews.map((brew) => brew.fields.roastLevel).filter(Boolean))).sort();

		// Extract unique processes
		const processes = Array.from(new Set(brews.map((brew) => brew.fields.process).filter(Boolean))).sort();

		// Extract brew method names from brew method entries
		const brewMethodNames = Array.from(new Set(brewMethods.map((method) => method.fields.brewMethod).filter(Boolean))).sort();

		// Format roasters with id and name
		const roastersList = roasters.map((roaster) => ({
			id: roaster.sys.id,
			name: roaster.fields.shopName,
		}));

		return NextResponse.json({
			roastLevels,
			processes,
			brewMethods: brewMethodNames,
			roasters: roastersList,
		});
	} catch (error: any) {
		console.error("Error fetching brew options:", error);
		return NextResponse.json({ error: error.message || "Failed to fetch brew options" }, { status: 500 });
	}
}
