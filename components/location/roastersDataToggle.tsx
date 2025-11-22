"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RoastersDataToggle() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isTestMode, setIsTestMode] = useState(false);

	// Check URL parameter for test mode
	useEffect(() => {
		const testMode = searchParams?.get("test") === "true";
		setIsTestMode(testMode);
	}, [searchParams]);

	// Only show for authenticated users
	if (status !== "authenticated" || !session) {
		return null;
	}

	const toggleDataSource = () => {
		const newTestMode = !isTestMode;
		setIsTestMode(newTestMode);

		// Update URL parameter
		const params = new URLSearchParams(searchParams?.toString() || "");
		if (newTestMode) {
			params.set("test", "true");
		} else {
			params.delete("test");
		}

		const query = params.toString();
		const newUrl = query ? `/roasters-and-shops?${query}` : "/roasters-and-shops";
		router.push(newUrl);
		router.refresh();
	};

	return (
		<Button onClick={toggleDataSource} variant={isTestMode ? "default" : "outline"} className="text-sm" size="sm">
			{isTestMode ? "Using Test Data" : "Using Production Data"}
		</Button>
	);
}
