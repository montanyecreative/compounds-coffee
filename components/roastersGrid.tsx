"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Roaster } from "@/lib/contentful";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface RoastersGridProps {
	roasters: Roaster[];
}

export default function RoastersGrid({ roasters }: RoastersGridProps) {
	const searchParams = useSearchParams();
	const currentLang = searchParams.get("lang");
	const [addresses, setAddresses] = useState<Record<string, string>>({});
	const geocodingRequested = useRef<Set<string>>(new Set());
	const [searchQuery, setSearchQuery] = useState<string>("");

	// Filter roasters with valid location data
	const roastersWithLocations = useMemo(() => {
		return roasters.filter((roaster) => {
			const locationData = roaster.fields.shopLocation as { lat: number; lon: number } | undefined;
			return locationData && locationData.lat && locationData.lon;
		});
	}, [roasters]);

	const performGeocoding = useMemo(() => {
		return () => {
			if (
				typeof window !== "undefined" &&
				window.google &&
				window.google.maps &&
				window.google.maps.Geocoder &&
				roastersWithLocations.length > 0
			) {
				try {
					const geocoderInstance = new window.google.maps.Geocoder();

					// Reverse geocode all roasters that don't have addresses yet
					roastersWithLocations.forEach((roaster) => {
						const locationData = roaster.fields.shopLocation as { lat: number; lon: number };
						const roasterId = roaster.sys.id;

						// Skip if we already have an address or have already requested geocoding
						setAddresses((prev) => {
							if (prev[roasterId] || geocodingRequested.current.has(roasterId)) {
								return prev;
							}

							// Mark as requested
							geocodingRequested.current.add(roasterId);
							geocoderInstance.geocode({ location: { lat: locationData.lat, lng: locationData.lon } }, (results, status) => {
								if (status === "OK" && results && results[0]) {
									setAddresses((current) => {
										// Only update if we don't already have an address (avoid race conditions)
										if (!current[roasterId]) {
											return {
												...current,
												[roasterId]: results[0].formatted_address,
											};
										}
										return current;
									});
								}
							});

							return prev;
						});
					});
				} catch (error) {
					console.error("Error initializing geocoder:", error);
				}
			}
		};
	}, [roastersWithLocations]);

	// Initialize geocoder and reverse geocode addresses
	useEffect(() => {
		// Try to geocode if API is already loaded
		performGeocoding();

		// Also set up an interval to check if API becomes available (for cases where LoadScript hasn't loaded yet)
		const interval = setInterval(() => {
			if (typeof window !== "undefined" && window.google && window.google.maps && window.google.maps.Geocoder) {
				performGeocoding();
				clearInterval(interval);
			}
		}, 500);

		return () => clearInterval(interval);
	}, [performGeocoding]);

	// Filter roasters based on search query
	const filteredRoasters = useMemo(() => {
		if (!searchQuery.trim()) {
			return roasters;
		}
		const query = searchQuery.toLowerCase().trim();
		return roasters.filter((roaster) => {
			const shopName = (roaster.fields.shopName as string).toLowerCase();
			return shopName.includes(query);
		});
	}, [roasters, searchQuery]);

	return (
		<div className="w-full">
			{/* Search Bar */}
			<div className="mb-6">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
					<input
						type="text"
						placeholder="Search by store name..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-brown text-sm"
					/>
				</div>
			</div>

			{/* Results Count */}
			{searchQuery.trim() && (
				<div className="mb-4 text-sm text-gray-600">
					{filteredRoasters.length === 0 ? (
						<span>No stores found matching &quot;{searchQuery}&quot;</span>
					) : (
						<span>
							Found {filteredRoasters.length} store{filteredRoasters.length !== 1 ? "s" : ""} matching &quot;{searchQuery}
							&quot;
						</span>
					)}
				</div>
			)}

			{/* Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
				{filteredRoasters.map((roaster) => {
					// Extract values with type assertions to help TypeScript inference
					const website = roaster.fields.shopWebsite as string;
					const websiteUrl = website.startsWith("http") ? website : `https://${website}`;

					// Format location - use address if available, otherwise show coordinates
					const locationData = roaster.fields.shopLocation as { lat: number; lon: number } | undefined;
					const location = addresses[roaster.sys.id]
						? addresses[roaster.sys.id]
						: locationData
						? `${locationData.lat.toFixed(4)}, ${locationData.lon.toFixed(4)}`
						: "N/A";

					const roasterDetailUrl = currentLang
						? `/roasters/${encodeURIComponent(roaster.fields.shopName)}?lang=${encodeURIComponent(currentLang)}`
						: `/roasters/${encodeURIComponent(roaster.fields.shopName)}`;

					return (
						<Card key={roaster.sys.id} className="p-5 border rounded hover:shadow-lg transition-shadow">
							<CardHeader className="p-0 pb-4">
								<Link href={roasterDetailUrl} className="hover:underline">
									<CardTitle className="text-xl font-semibold text-brown hover:text-brown/80">
										{roaster.fields.shopName}
									</CardTitle>
								</Link>
							</CardHeader>
							<CardContent className="p-0 space-y-3">
								<div className="flex items-start gap-2">
									<span className="font-bold text-sm text-gray-700 min-w-[80px]">Location:</span>
									<span className="text-sm text-gray-600">{location}</span>
								</div>
								<div className="flex items-start gap-2">
									<span className="font-bold text-sm text-gray-700 min-w-[80px]">Website:</span>
									<Link
										href={websiteUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
										onClick={(e) => e.stopPropagation()}
									>
										{website}
										<ExternalLink className="h-3 w-3" />
									</Link>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
