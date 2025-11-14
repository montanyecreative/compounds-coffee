"use client";

import { useState } from "react";
import SingleRoasterMap from "./singleRoasterMap";

interface SingleRoasterMapWrapperProps {
	locationData: { lat: number; lon: number } | undefined;
	shopName: string;
}

export default function SingleRoasterMapWrapper({ locationData, shopName }: SingleRoasterMapWrapperProps) {
	const [isMapLoading, setIsMapLoading] = useState<boolean>(true);

	return (
		<>
			{isMapLoading && (
				<div className="fixed inset-0 h-screen w-full z-50">
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
			<div className="w-full h-full relative">
				<SingleRoasterMap locationData={locationData} shopName={shopName} onLoadingChange={setIsMapLoading} />
			</div>
		</>
	);
}
