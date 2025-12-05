import { NextRequest, NextResponse } from "next/server";
import { auth, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Get scheduled sync settings
export async function GET() {
	try {
		const session = await auth();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get or create settings (using type assertion for Prisma client)
		const settingsModel = (prisma as any).settings;
		if (!settingsModel) {
			return NextResponse.json({ error: "Settings model not available. Please run migrations." }, { status: 500 });
		}

		let settings = await settingsModel.findUnique({
			where: { id: "settings" },
		});

		if (!settings) {
			// Create default settings if they don't exist
			settings = await settingsModel.create({
				data: {
					id: "settings",
					scheduledSyncEnabled: false,
					scheduledSyncTime: "13:10",
				},
			});
		}

		return NextResponse.json(settings);
	} catch (error: any) {
		console.error("Error fetching scheduled sync settings:", error);
		return NextResponse.json({ error: error.message || "Failed to fetch settings" }, { status: 500 });
	}
}

// Update scheduled sync settings
export async function POST(request: NextRequest) {
	try {
		const session = await auth();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if user is admin
		if (!isAdmin(session)) {
			return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
		}

		const body = await request.json();
		const { scheduledSyncEnabled, scheduledSyncTime } = body;

		// Validate input
		if (typeof scheduledSyncEnabled !== "boolean") {
			return NextResponse.json({ error: "scheduledSyncEnabled must be a boolean" }, { status: 400 });
		}

		if (scheduledSyncTime && typeof scheduledSyncTime !== "string") {
			return NextResponse.json({ error: "scheduledSyncTime must be a string" }, { status: 400 });
		}

		// Update or create settings (using type assertion for Prisma client)
		const settingsModel = (prisma as any).settings;
		if (!settingsModel) {
			return NextResponse.json({ error: "Settings model not available. Please run migrations." }, { status: 500 });
		}

		const settings = await settingsModel.upsert({
			where: { id: "settings" },
			update: {
				scheduledSyncEnabled,
				...(scheduledSyncTime && { scheduledSyncTime }),
			},
			create: {
				id: "settings",
				scheduledSyncEnabled,
				scheduledSyncTime: scheduledSyncTime || "13:10",
			},
		});

		return NextResponse.json(settings);
	} catch (error: any) {
		console.error("Error updating scheduled sync settings:", error);
		return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
	}
}
