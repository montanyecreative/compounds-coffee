"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoastersViewToggle() {
	const [view, setView] = useState<"grid" | "map">("map");

	useEffect(() => {
		const gridView = document.getElementById("roasters-grid-view");
		const mapView = document.getElementById("roasters-map-view");

		if (gridView && mapView) {
			const isDesktop = window.innerWidth >= 768;

			if (isDesktop) {
				gridView.classList.remove("md:hidden", "md:block");
				mapView.classList.remove("md:hidden", "md:block");

				if (view === "grid") {
					gridView.classList.add("md:block");
					mapView.classList.add("md:hidden");
				} else {
					mapView.classList.add("md:block");
					gridView.classList.add("md:hidden");
				}
			}
		}
	}, [view]);

	return (
		<div className="hidden md:flex gap-2 border rounded-lg p-1 bg-white">
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
