import { NextRequest, NextResponse } from "next/server";
import { auth, isAdmin } from "@/lib/auth";
import { processRoastersFile } from "@/lib/processRoastersFile";
import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

export const dynamic = "force-dynamic";

const s3Client = new S3Client({
	region: process.env.AWS_REGION || "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const SFTP_FILE_PATH = process.env.SFTP_FILE_PATH || "uploads/roastersAndShopsTest.xlsx";

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

		// Log configuration for debugging
		console.log("SFTP Sync - Configuration:", {
			bucket: BUCKET_NAME,
			path: SFTP_FILE_PATH,
			region: process.env.AWS_REGION || "us-east-1",
		});

		// Check if file exists in S3
		try {
			// First, try to find files with the specified prefix
			let listCommand = new ListObjectsV2Command({
				Bucket: BUCKET_NAME,
				Prefix: SFTP_FILE_PATH,
			});

			let listResponse = await s3Client.send(listCommand);

			// If no files found with the exact prefix, try to find any Excel files in the bucket
			if (!listResponse.Contents || listResponse.Contents.length === 0) {
				// Try listing all files in the uploads folder (if prefix includes uploads)
				if (SFTP_FILE_PATH.includes("uploads")) {
					listCommand = new ListObjectsV2Command({
						Bucket: BUCKET_NAME,
						Prefix: "uploads/",
					});
					listResponse = await s3Client.send(listCommand);
				}

				// If still no files, try listing all files in the bucket root
				if (!listResponse.Contents || listResponse.Contents.length === 0) {
					listCommand = new ListObjectsV2Command({
						Bucket: BUCKET_NAME,
					});
					listResponse = await s3Client.send(listCommand);
				}

				// Filter for Excel/CSV files if we found any files
				if (listResponse.Contents && listResponse.Contents.length > 0) {
					const excelFiles = listResponse.Contents.filter(
						(file) => file.Key && (file.Key.endsWith(".xlsx") || file.Key.endsWith(".xls") || file.Key.endsWith(".csv"))
					);

					if (excelFiles.length === 0) {
						const allFileKeys = listResponse.Contents.map((f) => f.Key)
							.filter(Boolean)
							.join(", ");
						return NextResponse.json({
							message: `No Excel/CSV files found. Looking for path: ${SFTP_FILE_PATH}. Found files: ${allFileKeys || "none"}`,
							successCount: 0,
							errorCount: 0,
							success: [],
							errors: [],
						});
					}

					// Use the Excel files found
					listResponse.Contents = excelFiles;
				} else {
					return NextResponse.json({
						message: `No file found at path: ${SFTP_FILE_PATH}. Please verify: 1) File was uploaded via SFTP, 2) File is in S3 bucket: ${BUCKET_NAME}, 3) SFTP_FILE_PATH environment variable is correct.`,
						successCount: 0,
						errorCount: 0,
						success: [],
						errors: [],
					});
				}
			}

			// Get the most recent file if multiple exist
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
				message: `Processed file: ${fileKey}${
					results.deletedCount !== undefined ? ` (deleted ${results.deletedCount} existing entries)` : ""
				}`,
				successCount: results.success.length,
				errorCount: results.errors.length,
				deletedCount: results.deletedCount,
				success: results.success,
				errors: results.errors,
			});
		} catch (s3Error: any) {
			if (s3Error.name === "NoSuchKey" || s3Error.name === "NotFound") {
				return NextResponse.json({
					message: "File not found in S3 bucket",
					successCount: 0,
					errorCount: 0,
					success: [],
					errors: [],
				});
			}
			throw s3Error;
		}
	} catch (error: any) {
		console.error("Error syncing from SFTP/S3:", error);
		return NextResponse.json({ error: error.message || "Failed to sync from SFTP" }, { status: 500 });
	}
}
