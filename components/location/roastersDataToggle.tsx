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
		<Button
			onClick={toggleDataSource}
			variant="outline"
			className="text-xs sm:text-sm px-5 sm:px-4 py-3 sm:py-2 whitespace-normal break-words w-full sm:w-auto min-h-[48px] sm:min-h-0 leading-normal"
		>
			{isTestMode ? "Test Data" : "Production Data"}
		</Button>
	);
}
