"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Roaster } from "@/lib/contentful";
import { MapPin, Search, X, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";
import { GoogleMap, LoadScript, Marker, InfoWindow, Autocomplete } from "@react-google-maps/api";
import { useTranslations } from "@/lib/useTranslations";
import { createGeocodingFunction } from "@/lib/geocoding";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { defaultMapOptions, styledMapOptions } from "./googleMapStyles";
import { createRoasterSlug } from "@/lib/utils";

interface RoastersMapProps {
	roasters: Roaster[];
	onLoadingChange?: (isLoading: boolean) => void;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const mapContainerStyle = {
	width: "100%",
	height: "100%",
};

export default function RoastersMap({ roasters, onLoadingChange }: RoastersMapProps) {
	const { translations, lang } = useTranslations();
	const searchParams = useSearchParams();
	const [selectedRoaster, setSelectedRoaster] = useState<string | null>(null);
	const [mapView, setMapView] = useState<"map" | "list">("map");
	const [map, setMap] = useState<google.maps.Map | null>(null);
	const [addresses, setAddresses] = useState<Record<string, string>>({});
	const geocodingRequested = useRef<Set<string>>(new Set());
	const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [distanceFilter, setDistanceFilter] = useState<number>(15); // Default 15 miles
	const [addressInput, setAddressInput] = useState<string>("");
	const [useStyledMap, setUseStyledMap] = useState<boolean>(false); // Default to unstyled map
	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
	const [isMapLoading, setIsMapLoading] = useState<boolean>(true);

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
				setUserLocation({ lat, lng });
				// For postal codes, use the postal code or formatted address
				const postalCode = place.address_components?.find((component) => component.types.includes("postal_code"))?.long_name;
				setAddressInput(postalCode || place.name || place.formatted_address || "");
			}
		}
	};

	// Load autocomplete when Google Maps API is ready
	const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
		autocompleteRef.current = autocomplete;
	};

	// Filter roasters with valid location data and within distance
	const roastersWithLocations = useMemo(() => {
		const roastersWithValidLocations = roasters.filter((roaster) => {
			const locationData = roaster.fields.shopLocation as { lat: number; lon: number } | undefined;
			return locationData && locationData.lat && locationData.lon;
		});

		// If user location is set, filter by distance
		let filteredRoasters = roastersWithValidLocations;
		if (userLocation) {
			filteredRoasters = roastersWithValidLocations.filter((roaster) => {
				const locationData = roaster.fields.shopLocation as { lat: number; lon: number };
				const distance = calculateDistance(userLocation.lat, userLocation.lng, locationData.lat, locationData.lon);
				return distance <= distanceFilter;
			});
		}

		// Sort alphabetically by shop name
		return filteredRoasters.sort((a, b) => {
			const nameA = (a.fields.shopName as string).toLowerCase();
			const nameB = (b.fields.shopName as string).toLowerCase();
			return nameA.localeCompare(nameB);
		});
	}, [roasters, userLocation, distanceFilter]);

	// Calculate center point (use user location if available, otherwise average of all locations)
	const mapCenter = useMemo(() => {
		// If user location is set, center on user location
		if (userLocation) {
			return userLocation;
		}

		if (roastersWithLocations.length === 0) {
			return { lat: 0, lng: 0 };
		}

		if (roastersWithLocations.length === 1) {
			const locationData = roastersWithLocations[0].fields.shopLocation as { lat: number; lon: number };
			return { lat: locationData.lat, lng: locationData.lon };
		}

		// Calculate average center
		const sum = roastersWithLocations.reduce(
			(acc, roaster) => {
				const locationData = roaster.fields.shopLocation as { lat: number; lon: number };
				return {
					lat: acc.lat + locationData.lat,
					lng: acc.lng + locationData.lon,
				};
			},
			{ lat: 0, lng: 0 }
		);

		return {
			lat: sum.lat / roastersWithLocations.length,
			lng: sum.lng / roastersWithLocations.length,
		};
	}, [roastersWithLocations, userLocation]);

	// Track if we should force a fresh geocoding (e.g., when navigating back)
	const [forceRefresh, setForceRefresh] = useState(0);

	// Reset geocoding state when roasters change
	useEffect(() => {
		// Clear the requested IDs and addresses when roasters change
		geocodingRequested.current.clear();
		setAddresses({});
		setForceRefresh((prev) => prev + 1); // Force refresh
	}, [roasters]);

	const performGeocoding = useMemo(() => {
		// Create a fresh Set for this geocoding session
		const freshRequestedIds = new Set<string>();

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
			requestedIds: freshRequestedIds,
			existingAddresses: {}, // Always start fresh - don't use cached addresses
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roastersWithLocations, forceRefresh]); // Include forceRefresh to recreate function

	// Initialize geocoder and reverse geocode addresses
	useEffect(() => {
		// Try to geocode if API is already loaded (fallback if map hasn't loaded yet)
		performGeocoding();
	}, [performGeocoding]);

	const handleRoasterClick = (roasterId: string, lat: number, lng: number) => {
		setSelectedRoaster(roasterId);
		if (map) {
			map.setCenter({ lat, lng });
			map.setZoom(15);
		}
	};

	// Load map when map is loaded
	const onLoad = (mapInstance: google.maps.Map) => {
		setMap(mapInstance);
		setIsMapLoading(false);
		// Trigger geocoding once map is loaded (ensures API is ready)
		performGeocoding();

		// Fit bounds to show all markers if there are multiple locations
		if (roastersWithLocations.length > 1 && !userLocation) {
			const bounds = new window.google.maps.LatLngBounds();
			roastersWithLocations.forEach((roaster) => {
				const locationData = roaster.fields.shopLocation as { lat: number; lon: number };
				bounds.extend(new window.google.maps.LatLng(locationData.lat, locationData.lon));
			});
			mapInstance.fitBounds(bounds);
		}
	};

	const onUnmount = () => {
		setMap(null);
	};

	// Update map bounds when locations change
	useEffect(() => {
		if (map && roastersWithLocations.length > 1 && !userLocation) {
			const bounds = new window.google.maps.LatLngBounds();
			roastersWithLocations.forEach((roaster) => {
				const locationData = roaster.fields.shopLocation as { lat: number; lon: number };
				bounds.extend(new window.google.maps.LatLng(locationData.lat, locationData.lon));
			});
			map.fitBounds(bounds);
		}
	}, [map, roastersWithLocations, userLocation]);

	// Update map styles when useStyledMap changes
	useEffect(() => {
		if (map) {
			if (useStyledMap) {
				map.setOptions(styledMapOptions);
			} else {
				// Explicitly clear styles by setting them to null
				map.setOptions({
					...defaultMapOptions,
					styles: null,
				});
			}
		}
	}, [map, useStyledMap]);

	// Notify parent component of loading state changes
	useEffect(() => {
		if (onLoadingChange) {
			onLoadingChange(isMapLoading);
		}
	}, [isMapLoading, onLoadingChange]);

	return (
		<LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
			<div className="w-full flex flex-col">
				<div className="mb-4 p-4 bg-gray-50 border rounded-lg">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div className="flex items-center gap-3 flex-wrap flex-1">
							<div className="flex-1 min-w-[400px] relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brown" />
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
										placeholder={translations("roasters.search.zipcodeMapPlaceholder")}
										value={addressInput}
										onChange={(e) => setAddressInput(e.target.value)}
										className={`w-full pl-10 ${
											userLocation ? "pr-10" : "pr-4"
										} py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-brown text-sm`}
									/>
								</Autocomplete>
								{userLocation && (
									<button
										onClick={() => {
											setUserLocation(null);
											setAddressInput("");
										}}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
										aria-label={translations("roasters.map.clear")}
									>
										<X className="h-5 w-5 text-brown" />
									</button>
								)}
							</div>
							<div className="flex items-center gap-2">
								<label htmlFor="distance-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
									{translations("roasters.search.distance")}
								</label>
								<select
									id="distance-filter"
									value={distanceFilter}
									onChange={(e) => setDistanceFilter(Number(e.target.value))}
									className="px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-brown"
								>
									<option value={5}>5 {translations("roasters.search.miles")}</option>
									<option value={10}>10 {translations("roasters.search.miles")}</option>
									<option value={15}>15 {translations("roasters.search.miles")}</option>
									<option value={25}>25 {translations("roasters.search.miles")}</option>
									<option value={300}>300 {translations("roasters.search.miles")}</option>
									<option value={5000}>5000 {translations("roasters.search.miles")}</option>
								</select>
							</div>
						</div>
						<button
							onClick={() => setUseStyledMap(!useStyledMap)}
							className="px-3 py-2 bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300 transition-colors text-sm whitespace-nowrap flex items-center gap-2"
							title={
								useStyledMap ? translations("roasters.map.switchToDefault") : translations("roasters.map.switchToThemed")
							}
						>
							<Palette className="h-4 w-4 text-brown" />
							{useStyledMap ? translations("roasters.map.default") : translations("roasters.map.themed")}
						</button>
					</div>
				</div>

				{/* Map Container */}
				<div className="w-full h-[calc(100vh-380px)] max-h-[calc(100vh-380px)] flex flex-col md:flex-row border rounded-lg overflow-hidden">
					<div
						className={`${
							mapView === "list" ? "flex md:hidden" : "hidden md:flex"
						} flex-col w-full md:w-96 border-r bg-white overflow-y-auto`}
					>
						<div className="p-4 border-b bg-gray-50">
							<h2 className="text-lg font-semibold text-gray-900">
								{translations("roasters.map.locationsNearYou").replace("{count}", roastersWithLocations.length.toString())}
							</h2>
						</div>

						<div className="flex-1 overflow-y-auto">
							{roastersWithLocations.length === 0 ? (
								<div className="p-8 text-center text-gray-500">
									<MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
									<p>{translations("roasters.map.noLocationData")}</p>
								</div>
							) : (
								<div>
									{roastersWithLocations.map((roaster) => {
										const locationData = roaster.fields.shopLocation as { lat: number; lon: number };
										const isSelected = selectedRoaster === roaster.sys.id;

										return (
											<Card
												key={roaster.sys.id}
												className={`p-4 rounded-none border-0 border-b cursor-pointer transition-colors ${
													isSelected ? "bg-brown/10 border-l-4 border-l-brown" : "hover:bg-gray-50"
												}`}
												onClick={() => handleRoasterClick(roaster.sys.id, locationData.lat, locationData.lon)}
											>
												<div className="flex items-start justify-between gap-3">
													<div className="flex-1 min-w-0">
														<h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-brown transition-colors">
															{roaster.fields.shopName}
														</h3>
														<div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
															<MapPin
																className={`h-4 w-4 flex-shrink-0 ${
																	isSelected ? "text-black" : "text-brown"
																}`}
															/>
															<span>
																{addresses[roaster.sys.id] ||
																	`${locationData.lat.toFixed(4)}, ${locationData.lon.toFixed(4)}`}
															</span>
														</div>
													</div>
												</div>
											</Card>
										);
									})}
								</div>
							)}
						</div>
					</div>

					<div className={`${mapView === "map" ? "flex" : "hidden md:flex"} flex-1 relative bg-gray-100`}>
						{roastersWithLocations.length > 0 ? (
							<GoogleMap
								mapContainerStyle={mapContainerStyle}
								center={mapCenter}
								zoom={userLocation ? 10 : roastersWithLocations.length === 1 ? 12 : 8}
								options={useStyledMap ? styledMapOptions : defaultMapOptions}
								onLoad={onLoad}
								onUnmount={onUnmount}
							>
								{userLocation && (
									<Marker
										position={userLocation}
										icon={{
											path: google.maps.SymbolPath.CIRCLE,
											scale: 8,
											fillColor: "#4285F4",
											fillOpacity: 1,
											strokeColor: "#ffffff",
											strokeWeight: 3,
										}}
										title="Your Location"
									/>
								)}
								{roastersWithLocations.map((roaster) => {
									const locationData = roaster.fields.shopLocation as { lat: number; lon: number };
									const isSelected = selectedRoaster === roaster.sys.id;

									return (
										<Marker
											key={roaster.sys.id}
											position={{ lat: locationData.lat, lng: locationData.lon }}
											onClick={() => handleRoasterClick(roaster.sys.id, locationData.lat, locationData.lon)}
											icon={
												isSelected
													? {
															path: google.maps.SymbolPath.CIRCLE,
															scale: 10,
															fillColor: "#946234",
															fillOpacity: 1,
															strokeColor: "#ffffff",
															strokeWeight: 2,
													  }
													: undefined
											}
										>
											{isSelected && (
												<InfoWindow
													position={{ lat: locationData.lat, lng: locationData.lon }}
													onCloseClick={() => setSelectedRoaster(null)}
												>
													<div className="p-2">
														<h3 className="font-semibold text-sm mb-1">{roaster.fields.shopName}</h3>
														<Link
															href={(() => {
																const roasterSlug = createRoasterSlug(
																	roaster.fields.shopName as string,
																	roaster.sys.id
																);
																const testParam = searchParams?.get("test") === "true" ? "&test=true" : "";
																const langParam =
																	lang && lang !== "en-US"
																		? `?lang=${encodeURIComponent(lang)}${testParam}`
																		: testParam
																		? `?test=true`
																		: "";
																return `/roasters-and-shops/${encodeURIComponent(roasterSlug)}${langParam}`;
															})()}
															className="text-xs text-blue-600 hover:underline"
														>
															{translations("roasters.map.visitWebsite")}
														</Link>
													</div>
												</InfoWindow>
											)}
										</Marker>
									);
								})}
							</GoogleMap>
						) : (
							<div className="w-full h-full flex items-center justify-center text-gray-500">
								<div className="text-center">
									<MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
									<p>{translations("roasters.map.noLocationData")}</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</LoadScript>
	);
}
