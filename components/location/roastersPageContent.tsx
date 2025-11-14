"use client";

import { useState } from "react";
import { Roaster } from "@/lib/contentful";
import RoastersGrid from "@/components/location/roastersGrid";
import RoastersMap from "@/components/location/roastersMap";

interface RoastersPageContentProps {
	roasters: Roaster[];
}

export default function RoastersPageContent({ roasters }: RoastersPageContentProps) {
	const [isMapLoading, setIsMapLoading] = useState<boolean>(true);
	const [isGridLoading, setIsGridLoading] = useState<boolean>(true);

	return (
		<>
			{isMapLoading && (
				<div className="hidden md:block fixed inset-0 h-screen w-full z-50">
					{/* White background div - full viewport height */}
					<div className="absolute inset-0 h-screen w-full bg-white"></div>
					{/* Spinning wheel with opacity background */}
					<div className="absolute inset-0 flex items-center justify-center bg-white/80">
						<div className="relative w-20 h-20">
							{/* Outer ring - light roast */}
							<div className="absolute inset-0 border-4 border-lightRoast/30 rounded-full"></div>
							{/* Medium roast spinner */}
							<div className="absolute inset-0 border-4 border-transparent border-t-mediumRoast rounded-full animate-spin"></div>
							{/* Brown spinner - reverse direction */}
							<div
								className="absolute inset-1 border-4 border-transparent border-r-brown rounded-full animate-spin"
								style={{ animationDirection: "reverse", animationDuration: "1.2s" }}
							></div>
							{/* Light roast inner spinner */}
							<div
								className="absolute inset-2 border-4 border-transparent border-b-lightRoast rounded-full animate-spin"
								style={{ animationDuration: "1.8s" }}
							></div>
						</div>
					</div>
				</div>
			)}
			{isGridLoading && (
				<div className="flex md:hidden fixed inset-0 h-screen w-full z-50">
					{/* White background div - full viewport height */}
					<div className="absolute inset-0 h-screen w-full bg-white"></div>
					{/* Spinning wheel with opacity background */}
					<div className="absolute inset-0 flex items-center justify-center bg-white/80">
						<div className="relative w-20 h-20">
							{/* Outer ring - light roast */}
							<div className="absolute inset-0 border-4 border-lightRoast/30 rounded-full"></div>
							{/* Medium roast spinner */}
							<div className="absolute inset-0 border-4 border-transparent border-t-mediumRoast rounded-full animate-spin"></div>
							{/* Brown spinner - reverse direction */}
							<div
								className="absolute inset-1 border-4 border-transparent border-r-brown rounded-full animate-spin"
								style={{ animationDirection: "reverse", animationDuration: "1.2s" }}
							></div>
							{/* Light roast inner spinner */}
							<div
								className="absolute inset-2 border-4 border-transparent border-b-lightRoast rounded-full animate-spin"
								style={{ animationDuration: "1.8s" }}
							></div>
						</div>
					</div>
				</div>
			)}
			<div id="roasters-map-view" className="hidden md:block relative">
				<RoastersMap roasters={roasters} onLoadingChange={setIsMapLoading} />
			</div>

			<div id="roasters-grid-view" className="block md:hidden">
				<RoastersGrid roasters={roasters} onLoadingChange={setIsGridLoading} />
			</div>
		</>
	);
}
