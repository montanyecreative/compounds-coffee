import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { createCoffeeBrewEntry, CreateCoffeeBrewData } from "@/lib/contentful";

const numericField = z.preprocess((val) => {
	if (typeof val === "string") {
		const trimmed = val.trim();
		return trimmed === "" ? undefined : Number(trimmed);
	}
	return typeof val === "number" ? val : undefined;
}, z.number().nonnegative("Value must be a positive number"));

const createBrewSchema = z.object({
	name: z.string().min(1, "Name is required"),
	slug: z.string().trim().optional(),
	region: z.string().min(1, "Region is required"),
	roastLevel: z.string().min(1, "Roast level is required"),
	process: z.string().min(1, "Process is required"),
	brewMethod: z.string().min(1, "Brew method is required"),
	brewDate: z.string().min(1, "Brew date is required"),
	grinder: z.string().min(1, "Grinder is required"),
	grindSetting: numericField,
	waterTemp: numericField,
	coffeeDose: numericField,
	bloomYield: numericField,
	coffeeYield: numericField,
	bloomTime: z.string().min(1, "Bloom time is required"),
	brewTime: z.string().min(1, "Brew time is required"),
	tastingHighlights: z.string().min(1, "Tasting highlights are required"),
	tastingNotes: z.string().min(1, "Tasting notes are required"),
	notes: z.string().min(1, "Notes are required"),
	link: z.string().url("Link must be a valid URL"),
	price: numericField,
	roasterId: z.string().trim().optional(),
});

export async function POST(request: NextRequest) {
	const session = await auth();
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const parsed = createBrewSchema.safeParse(payload);
	if (!parsed.success) {
		return NextResponse.json(
			{
				error: "Validation failed",
				details: parsed.error.flatten(),
			},
			{ status: 400 }
		);
	}

	const { roasterId, slug, ...rest } = parsed.data;

	const brewData: CreateCoffeeBrewData = {
		...rest,
		...(slug?.length ? { slug } : {}),
		...(roasterId?.length ? { roasterId } : {}),
	};

	try {
		const entry = await createCoffeeBrewEntry(brewData);
		return NextResponse.json(
			{
				message: "Coffee brew created successfully",
				entry,
			},
			{ status: 201 }
		);
	} catch (error: any) {
		return NextResponse.json({ error: error.message || "Failed to create coffee brew" }, { status: 500 });
	}
}
