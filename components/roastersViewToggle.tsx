"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoastersViewToggle() {
	const [view, setView] = useState<"grid" | "map">("map");

	useEffect(() => {
		// Toggle visibility of grid and map views
		const gridView = document.getElementById("roasters-grid-view");
		const mapView = document.getElementById("roasters-map-view");

		if (gridView && mapView) {
			if (view === "grid") {
				gridView.classList.remove("hidden");
				mapView.classList.add("hidden");
			} else {
				gridView.classList.add("hidden");
				mapView.classList.remove("hidden");
			}
		}
	}, [view]);

	return (
		<div className="flex gap-2 border rounded-lg p-1 bg-white">
			<Button
				variant="ghost"
				size="sm"
				onClick={() => setView("map")}
				className={`flex items-center gap-2 ${view === "map" ? "bg-brown text-white hover:bg-brown/90" : "hover:bg-gray-100"}`}
			>
				<Map className="h-4 w-4" />
				<span className="hidden sm:inline">Map</span>
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => setView("grid")}
				className={`flex items-center gap-2 ${view === "grid" ? "bg-brown text-white hover:bg-brown/90" : "hover:bg-gray-100"}`}
			>
				<LayoutGrid className="h-4 w-4" />
				<span className="hidden sm:inline">Grid</span>
			</Button>
		</div>
	);
}
