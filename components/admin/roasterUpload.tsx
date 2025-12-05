"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface UploadResult {
	message: string;
	successCount: number;
	errorCount: number;
	deletedCount?: number;
	success: string[];
	errors: string[];
}

interface ScheduledSyncSettings {
	scheduledSyncEnabled: boolean;
	scheduledSyncTime: string;
}

interface RoasterUploadProps {
	isAdmin?: boolean;
}

export function RoasterUpload({ isAdmin = true }: RoasterUploadProps) {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [result, setResult] = useState<UploadResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [scheduledSyncEnabled, setScheduledSyncEnabled] = useState(false);
	const [scheduledSyncTime, setScheduledSyncTime] = useState("13:10");
	const [loadingSettings, setLoadingSettings] = useState(true);
	const [updatingSettings, setUpdatingSettings] = useState(false);

	// Load scheduled sync settings on mount
	useEffect(() => {
		const loadSettings = async () => {
			try {
				const response = await fetch("/api/admin/scheduled-sync-settings");
				if (response.ok) {
					const settings: ScheduledSyncSettings = await response.json();
					setScheduledSyncEnabled(settings.scheduledSyncEnabled);
					setScheduledSyncTime(settings.scheduledSyncTime || "13:10");
				}
			} catch (err) {
				console.error("Error loading settings:", err);
			} finally {
				setLoadingSettings(false);
			}
		};
		loadSettings();
	}, []);

	const handleToggleScheduledSync = async (enabled: boolean) => {
		if (!isAdmin) return;
		setUpdatingSettings(true);
		try {
			const response = await fetch("/api/admin/scheduled-sync-settings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					scheduledSyncEnabled: enabled,
					scheduledSyncTime: scheduledSyncTime,
				}),
			});

			if (response.ok) {
				const settings: ScheduledSyncSettings = await response.json();
				setScheduledSyncEnabled(settings.scheduledSyncEnabled);
				setScheduledSyncTime(settings.scheduledSyncTime);
			} else {
				const error = await response.json();
				setError(error.error || "Failed to update settings");
			}
		} catch (err: any) {
			setError(err.message || "An error occurred while updating settings");
		} finally {
			setUpdatingSettings(false);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isAdmin) return;
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			setResult(null);
			setError(null);
		}
	};

	const handleUpload = async () => {
		if (!isAdmin) return;
		if (!file) {
			setError("Please select a file first");
			return;
		}

		setUploading(true);
		setError(null);
		setResult(null);

		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("/api/admin/upload-roasters", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to upload file");
			}

			setResult(data);
		} catch (err: any) {
			setError(err.message || "An error occurred while uploading the file");
		} finally {
			setUploading(false);
		}
	};

	const handleSyncFromSFTP = async () => {
		if (!isAdmin) return;
		setUploading(true);
		setError(null);
		setResult(null);

		try {
			const response = await fetch("/api/admin/sync-roasters-sftp", {
				method: "POST",
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to sync from SFTP");
			}

			setResult(data);
		} catch (err: any) {
			setError(err.message || "An error occurred while syncing from SFTP");
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="space-y-4">
			{!isAdmin && (
				<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
					<p className="text-sm text-yellow-800">
						⚠️ You don&apos;t have permission to upload roasters. Only administrators can perform this action.
					</p>
				</div>
			)}
			<div className="flex items-center gap-4">
				<label
					className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg ${
						isAdmin ? "cursor-pointer bg-gray-50 hover:bg-gray-100" : "cursor-not-allowed bg-gray-100 opacity-60"
					}`}
				>
					<div className="flex flex-col items-center justify-center pt-5 pb-6">
						<svg
							className="w-10 h-10 mb-3 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							/>
						</svg>
						<p className="mb-2 text-sm text-gray-500">
							<span className="font-semibold">Click to upload</span> or drag and drop
						</p>
						<p className="text-xs text-gray-500">Excel (.xlsx, .xls) or CSV</p>
					</div>
					<input
						type="file"
						className="hidden"
						accept=".xlsx,.xls,.csv"
						onChange={handleFileChange}
						disabled={uploading || !isAdmin}
					/>
				</label>
			</div>

			{file && (
				<div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
					<span className="text-sm text-gray-700 flex-1">{file.name}</span>
					<Button
						onClick={handleUpload}
						disabled={uploading || !isAdmin}
						className="min-w-[120px] rounded-full px-10 mb-10 md:mb-unset text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]"
					>
						{uploading ? "Uploading..." : "Upload"}
					</Button>
				</div>
			)}

			<div className="mt-4 space-y-4">
				<Button
					onClick={handleSyncFromSFTP}
					disabled={uploading || !isAdmin}
					className="min-w-[120px] rounded-full px-10 mb-10 md:mb-unset text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]"
				>
					{uploading ? "Syncing..." : "Sync from SFTP"}
				</Button>

				<div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
					<div className="flex items-center justify-between">
						<div className="flex-1">
							<h3 className="text-sm font-semibold text-gray-900 mb-1">Scheduled Daily Sync</h3>
							<p className="text-xs text-gray-600">Automatically sync from SFTP at {scheduledSyncTime} (1:10 PM) every day</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={scheduledSyncEnabled}
								onChange={(e) => handleToggleScheduledSync(e.target.checked)}
								disabled={loadingSettings || updatingSettings || !isAdmin}
								className="sr-only peer"
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brown/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brown"></div>
						</label>
					</div>
					{scheduledSyncEnabled && (
						<div className="mt-2 text-xs text-green-700">
							✓ Scheduled sync is enabled. Next sync will run at {scheduledSyncTime} today.
						</div>
					)}
				</div>
			</div>

			{error && (
				<div className="p-4 bg-red-50 border border-red-200 rounded-md">
					<p className="text-sm text-red-800">{error}</p>
				</div>
			)}

			{result && (
				<div className="space-y-4">
					<div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
						<p className="text-sm font-semibold text-blue-900 mb-2">{result.message}</p>
						<div className="flex gap-4 text-sm flex-wrap">
							{result.deletedCount !== undefined && (
								<span className="text-gray-700 font-medium">🗑️ {result.deletedCount} deleted</span>
							)}
							<span className="text-green-700 font-medium">✓ {result.successCount} successful</span>
							{result.errorCount > 0 && <span className="text-red-700 font-medium">✗ {result.errorCount} errors</span>}
						</div>
					</div>

					{result.success.length > 0 && (
						<div className="p-4 bg-green-50 border border-green-200 rounded-md">
							<h4 className="text-sm font-semibold text-green-900 mb-2">Successful Entries:</h4>
							<ul className="text-sm text-green-800 space-y-1 max-h-40 overflow-y-auto">
								{result.success.map((msg, idx) => (
									<li key={idx}>• {msg}</li>
								))}
							</ul>
						</div>
					)}

					{result.errors.length > 0 && (
						<div className="p-4 bg-red-50 border border-red-200 rounded-md">
							<h4 className="text-sm font-semibold text-red-900 mb-2">Errors:</h4>
							<ul className="text-sm text-red-800 space-y-1 max-h-40 overflow-y-auto">
								{result.errors.map((msg, idx) => (
									<li key={idx}>• {msg}</li>
								))}
							</ul>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
