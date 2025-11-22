"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface UploadResult {
	message: string;
	successCount: number;
	errorCount: number;
	success: string[];
	errors: string[];
}

export function RoasterUpload() {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [result, setResult] = useState<UploadResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			setResult(null);
			setError(null);
		}
	};

	const handleUpload = async () => {
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

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
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
					<input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} disabled={uploading} />
				</label>
			</div>

			{file && (
				<div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
					<span className="text-sm text-gray-700 flex-1">{file.name}</span>
					<Button onClick={handleUpload} disabled={uploading} className="min-w-[120px]">
						{uploading ? "Uploading..." : "Upload"}
					</Button>
				</div>
			)}

			{error && (
				<div className="p-4 bg-red-50 border border-red-200 rounded-md">
					<p className="text-sm text-red-800">{error}</p>
				</div>
			)}

			{result && (
				<div className="space-y-4">
					<div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
						<p className="text-sm font-semibold text-blue-900 mb-2">{result.message}</p>
						<div className="flex gap-4 text-sm">
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
