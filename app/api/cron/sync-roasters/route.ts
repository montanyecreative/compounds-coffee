import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processRoastersFile } from "@/lib/processRoastersFile";
import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const s3Client = new S3Client({
	region: process.env.AWS_REGION || "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const SFTP_FILE_PATH = process.env.SFTP_FILE_PATH || "uploads/roastersAndShopsTest.xlsx";

export async function GET(request: NextRequest) {
	try {
		// Verify cron secret (for security - set in Vercel environment variables)
		const authHeader = request.headers.get("authorization");
		const cronSecret = process.env.CRON_SECRET;

		if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if scheduled sync is enabled
		if (!prisma) {
			console.error("Prisma client is undefined");
			return NextResponse.json({ error: "Database connection not available" }, { status: 500 });
		}

		// Access settings model with type safety
		let settings;
		try {
			// Type assertion to handle Prisma client types
			const settingsModel = (prisma as any).settings;
			if (!settingsModel) {
				console.error("Prisma Settings model is not available. Make sure the migration was run and Prisma client was regenerated.");
				return NextResponse.json(
					{
						error: "Database model not available",
						message: "Settings model not found. Please run migrations and regenerate Prisma client.",
					},
					{ status: 500 }
				);
			}

			settings = await settingsModel.findUnique({
				where: { id: "settings" },
			});

			// If settings don't exist, create default (disabled)
			if (!settings) {
				settings = await (prisma as any).settings.create({
					data: {
						id: "settings",
						scheduledSyncEnabled: false,
						scheduledSyncTime: "13:10",
					},
				});
			}
		} catch (dbError: any) {
			console.error("Database error:", dbError);
			return NextResponse.json(
				{
					error: "Database error",
					message: dbError.message || "Failed to access database",
				},
				{ status: 500 }
			);
		}

		if (!settings || !settings.scheduledSyncEnabled) {
			return NextResponse.json({
				message: "Scheduled sync is disabled",
				enabled: false,
			});
		}

		// Check if it's the right time (within 5 minutes of scheduled time)
		const now = new Date();
		const [scheduledHour, scheduledMinute] = settings.scheduledSyncTime.split(":").map(Number);
		const scheduledTime = new Date();
		scheduledTime.setHours(scheduledHour, scheduledMinute, 0, 0);

		// Allow execution within 5 minutes of scheduled time
		const timeDiff = Math.abs(now.getTime() - scheduledTime.getTime());
		const fiveMinutes = 5 * 60 * 1000;

		if (timeDiff > fiveMinutes) {
			return NextResponse.json({
				message: `Not scheduled time yet. Scheduled for ${settings.scheduledSyncTime}`,
				scheduledTime: settings.scheduledSyncTime,
				currentTime: `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`,
			});
		}

		// Proceed with sync
		console.log("Running scheduled SFTP sync at", now.toISOString());

		// Check if file exists in S3
		try {
			let listCommand = new ListObjectsV2Command({
				Bucket: BUCKET_NAME,
				Prefix: SFTP_FILE_PATH,
			});

			let listResponse = await s3Client.send(listCommand);

			// If no files found with the exact prefix, try to find any Excel files
			if (!listResponse.Contents || listResponse.Contents.length === 0) {
				if (SFTP_FILE_PATH.includes("uploads")) {
					listCommand = new ListObjectsV2Command({
						Bucket: BUCKET_NAME,
						Prefix: "uploads/",
					});
					listResponse = await s3Client.send(listCommand);
				}

				if (!listResponse.Contents || listResponse.Contents.length === 0) {
					listCommand = new ListObjectsV2Command({
						Bucket: BUCKET_NAME,
					});
					listResponse = await s3Client.send(listCommand);
				}

				if (listResponse.Contents && listResponse.Contents.length > 0) {
					const excelFiles = listResponse.Contents.filter(
						(file) => file.Key && (file.Key.endsWith(".xlsx") || file.Key.endsWith(".xls") || file.Key.endsWith(".csv"))
					);

					if (excelFiles.length === 0) {
						return NextResponse.json({
							message: "No Excel/CSV files found in S3 bucket",
							success: false,
						});
					}

					listResponse.Contents = excelFiles;
				} else {
					return NextResponse.json({
						message: "No files found in S3 bucket",
						success: false,
					});
				}
			}

			// Get the most recent file
			const fileKey = listResponse.Contents.sort((a, b) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0))[0]
				.Key!;

			// Download file from S3
			const getCommand = new GetObjectCommand({
				Bucket: BUCKET_NAME,
				Key: fileKey,
			});

			const s3Response = await s3Client.send(getCommand);
			const arrayBuffer = await s3Response.Body!.transformToByteArray();
			const buffer = Buffer.from(arrayBuffer);

			// Process the file
			const results = await processRoastersFile(buffer, fileKey);

			return NextResponse.json({
				message: `Scheduled sync completed: ${fileKey}`,
				success: true,
				successCount: results.success.length,
				errorCount: results.errors.length,
				deletedCount: results.deletedCount,
				timestamp: now.toISOString(),
			});
		} catch (s3Error: any) {
			console.error("Error in scheduled sync:", s3Error);
			return NextResponse.json(
				{
					message: "Error during scheduled sync",
					error: s3Error.message,
					success: false,
				},
				{ status: 500 }
			);
		}
	} catch (error: any) {
		console.error("Error in cron job:", error);
		return NextResponse.json({ error: error.message || "Failed to run scheduled sync" }, { status: 500 });
	}
}
