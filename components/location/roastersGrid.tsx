"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Roaster } from "@/lib/contentful";
import Link from "next/link";
import { Search, MapPin, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { useTranslations } from "@/lib/useTranslations";
import { createGeocodingFunction } from "@/lib/geocoding";

interface RoastersGridProps {
	roasters: Roaster[];
	onLoadingChange?: (isLoading: boolean) => void;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export default function RoastersGrid({ roasters, onLoadingChange }: RoastersGridProps) {
	const searchParams = useSearchParams();
	const currentLang = searchParams.get("lang");
	const { translations, lang } = useTranslations();
	const [addresses, setAddresses] = useState<Record<string, string>>({});
	const geocodingRequested = useRef<Set<string>>(new Set());
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [searchMode, setSearchMode] = useState<"name" | "location">("name");
	const [locationSearch, setLocationSearch] = useState<{ lat: number; lng: number } | null>(null);
	const [locationInput, setLocationInput] = useState<string>("");
	const [locationDistance, setLocationDistance] = useState<number>(15);
	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
	const [isGridLoading, setIsGridLoading] = useState<boolean>(true);

	// Calculate distance between two coordinates in miles (Haversine formula)
	const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
		const R = 3959; // Earth's radius in miles
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	};

	// Handle place selection from autocomplete
	const onPlaceChanged = () => {
		if (autocompleteRef.current) {
			const place = autocompleteRef.current.getPlace();
			if (place.geometry && place.geometry.location) {
				const lat = place.geometry.location.lat();
				const lng = place.geometry.location.lng();
				setLocationSearch({ lat, lng });
				// For postal codes, use the postal code or formatted address
				const postalCode = place.address_components?.find((component) => component.types.includes("postal_code"))?.long_name;
				setLocationInput(postalCode || place.name || place.formatted_address || "");
			}
		}
	};

	// Load autocomplete when Google Maps API is ready
	const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
		autocompleteRef.current = autocomplete;
	};

	// Filter roasters with valid location data
	const roastersWithLocations = useMemo(() => {
		return roasters.filter((roaster) => {
			const locationData = roaster.fields.shopLocation as { lat: number; lon: number } | undefined;
			return locationData && locationData.lat && locationData.lon;
		});
	}, [roasters]);

	const performGeocoding = useMemo(() => {
		return createGeocodingFunction({
			roasters: roastersWithLocations,
			onAddressUpdate: (roasterId: string, address: string) => {
				setAddresses((current) => {
					// Only update if we don't already have an address (avoid race conditions)
					if (!current[roasterId]) {
						return {
							...current,
							[roasterId]: address,
						};
					}
					return current;
				});
			},
			requestedIds: geocodingRequested.current,
			existingAddresses: addresses,
		});
	}, [roastersWithLocations, addresses]);

	// Initialize geocoder and reverse geocode addresses
	useEffect(() => {
		// Try to geocode if API is already loaded
		performGeocoding();

		// Also set up an interval to check if API becomes available (for cases where LoadScript hasn't loaded yet)
		const interval = setInterval(() => {
			if (typeof window !== "undefined" && window.google && window.google.maps && window.google.maps.Geocoder) {
				performGeocoding();
				setIsGridLoading(false);
				clearInterval(interval);
			}
		}, 500);

		return () => clearInterval(interval);
	}, [performGeocoding]);

	// Check if API is already loaded on mount
	useEffect(() => {
		if (typeof window !== "undefined" && window.google && window.google.maps && window.google.maps.Geocoder) {
			setIsGridLoading(false);
		}
	}, []);

	// Notify parent component of loading state changes
	useEffect(() => {
		if (onLoadingChange) {
			onLoadingChange(isGridLoading);
		}
	}, [isGridLoading, onLoadingChange]);

	// Filter roasters based on search mode and query
	const filteredRoasters = useMemo(() => {
		if (searchMode === "name") {
			// Filter by store name
			if (!searchQuery.trim()) {
				return roasters;
			}
			const query = searchQuery.toLowerCase().trim();
			return roasters.filter((roaster) => {
				const shopName = (roaster.fields.shopName as string).toLowerCase();
				return shopName.includes(query);
			});
		} else {
			// Filter by location distance
			if (!locationSearch) {
				return roasters;
			}
			return roasters.filter((roaster) => {
				const locationData = roaster.fields.shopLocation as { lat: number; lon: number } | undefined;
				if (!locationData || !locationData.lat || !locationData.lon) {
					return false;
				}
				const distance = calculateDistance(locationSearch.lat, locationSearch.lng, locationData.lat, locationData.lon);
				return distance <= locationDistance;
			});
		}
	}, [roasters, searchQuery, searchMode, locationSearch, locationDistance]);

	return (
		<LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
			<div className="w-full">
				{/* Search Bar */}
				<div className="mb-6">
					<div className="flex flex-col md:flex-row md:items-center gap-3">
						<div className="w-full md:flex-1 relative">
							{searchMode === "name" ? (
								<>
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brown" />
									<input
										type="text"
										placeholder={translations("roasters.search.storeNamePlaceholder")}
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className={`w-full pl-10 ${
											searchQuery.trim() ? "pr-10" : "pr-4"
										} py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-brown text-sm`}
									/>
									{searchQuery.trim() && (
										<button
											onClick={() => {
												setSearchQuery("");
												setLocationSearch(null);
												setLocationInput("");
											}}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
											aria-label={translations("roasters.search.clear")}
										>
											<X className="h-5 w-5 text-brown" />
										</button>
									)}
								</>
							) : (
								<>
									<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brown" />
									<Autocomplete
										onLoad={onAutocompleteLoad}
										onPlaceChanged={onPlaceChanged}
										options={{
											types: ["(regions)"],
											componentRestrictions: { country: ["us", "ca"] },
										}}
									>
										<input
											type="text"
											placeholder={translations("roasters.search.zipcodePlaceholder")}
											value={locationInput}
											onChange={(e) => setLocationInput(e.target.value)}
											className={`w-full pl-10 ${
												locationSearch ? "pr-10" : "pr-4"
											} py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-brown text-sm`}
										/>
									</Autocomplete>
									{locationSearch && (
										<button
											onClick={() => {
												setSearchQuery("");
												setLocationSearch(null);
												setLocationInput("");
											}}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
											aria-label={translations("roasters.search.clear")}
										>
											<X className="h-5 w-5 text-brown" />
										</button>
									)}
								</>
							)}
						</div>
						<button
							onClick={() => {
								setSearchMode(searchMode === "name" ? "location" : "name");
								// Clear search when switching modes
								setSearchQuery("");
								setLocationSearch(null);
								setLocationInput("");
							}}
							className="w-full md:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300 transition-colors text-sm whitespace-nowrap flex items-center justify-center md:justify-start gap-2"
						>
							{searchMode === "name" ? (
								<>
									<MapPin className="h-4 w-4 text-brown" />
									{translations("roasters.search.toggleToLocation")}
								</>
							) : (
								<>
									<Search className="h-4 w-4 text-brown" />
									{translations("roasters.search.toggleToStore")}
								</>
							)}
						</button>
					</div>
					{searchMode === "location" && locationSearch && (
						<div className="mt-3 flex items-center gap-3">
							<label className="text-sm text-gray-600">{translations("roasters.search.distance")}</label>
							<select
								value={locationDistance}
								onChange={(e) => setLocationDistance(Number(e.target.value))}
								className="px-3 py-1 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-brown"
							>
								<option value={5}>5 {translations("roasters.search.miles")}</option>
								<option value={10}>10 {translations("roasters.search.miles")}</option>
								<option value={15}>15 {translations("roasters.search.miles")}</option>
								<option value={25}>25 {translations("roasters.search.miles")}</option>
								<option value={50}>50 {translations("roasters.search.miles")}</option>
								<option value={300}>300 {translations("roasters.search.miles")}</option>
								<option value={5000}>5000 {translations("roasters.search.miles")}</option>
							</select>
						</div>
					)}
				</div>

				{((searchMode === "name" && searchQuery.trim()) || (searchMode === "location" && locationSearch)) && (
					<div className="mb-4 text-sm text-gray-600">
						{filteredRoasters.length === 0 ? (
							<span>
								{searchMode === "name"
									? translations("roasters.search.noStoresFound").replace("{query}", searchQuery)
									: translations("roasters.search.noStoresInRange")
											.replace("{distance}", locationDistance.toString())
											.replace("{miles}", translations("roasters.search.miles"))}
							</span>
						) : (
							<span>
								{searchMode === "name"
									? translations("roasters.search.foundStores")
											.replace("{count}", filteredRoasters.length.toString())
											.replace(
												/\{plural\}/g,
												filteredRoasters.length !== 1 ? (currentLang === "fr-CA" ? "s" : "s") : ""
											)
											.replace(
												/\{plural2\}/g,
												filteredRoasters.length !== 1
													? currentLang === "fr-CA"
														? "s"
														: ""
													: currentLang === "fr-CA"
													? ""
													: ""
											)
											.replace("{query}", searchQuery)
									: translations("roasters.search.foundStoresInRange")
											.replace("{count}", filteredRoasters.length.toString())
											.replace(
												/\{plural\}/g,
												filteredRoasters.length !== 1 ? (currentLang === "fr-CA" ? "s" : "s") : ""
											)
											.replace(
												/\{plural2\}/g,
												filteredRoasters.length !== 1
													? currentLang === "fr-CA"
														? "s"
														: ""
													: currentLang === "fr-CA"
													? ""
													: ""
											)
											.replace("{distance}", locationDistance.toString())
											.replace("{miles}", translations("roasters.search.miles"))}
							</span>
						)}
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
					{filteredRoasters.map((roaster) => {
						// Format location - use address if available, otherwise show coordinates
						const locationData = roaster.fields.shopLocation as { lat: number; lon: number } | undefined;
						const location = addresses[roaster.sys.id]
							? addresses[roaster.sys.id]
							: locationData
							? `${locationData.lat.toFixed(4)}, ${locationData.lon.toFixed(4)}`
							: "N/A";

						const roasterDetailUrl =
							lang && lang !== "en-US"
								? `/roasters-and-shops/${encodeURIComponent(roaster.fields.shopName)}?lang=${encodeURIComponent(lang)}`
								: `/roasters-and-shops/${encodeURIComponent(roaster.fields.shopName)}`;

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
										<span className="font-bold text-sm text-gray-700 min-w-[80px]">
											{translations("roasters.grid.location")}
										</span>
										<span className="text-sm text-gray-600">
											{location === "N/A" ? translations("roasters.grid.notAvailable") : location}
										</span>
									</div>
									<div className="flex items-start gap-2">
										<span className="font-bold text-sm text-gray-700 min-w-[80px]">
											{translations("roasters.grid.website")}
										</span>
										<Link
											href={roasterDetailUrl}
											className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
											onClick={(e) => e.stopPropagation()}
										>
											{translations("roasters.map.visitWebsite")}
										</Link>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</LoadScript>
	);
}
