"use client";

import { useState, useMemo } from "react";
import { Roaster } from "@/lib/contentful";
import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

interface RoastersMapProps {
	roasters: Roaster[];
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const mapContainerStyle = {
	width: "100%",
	height: "100%",
};

const defaultMapOptions = {
	zoomControl: true,
	streetViewControl: false,
	mapTypeControl: false,
	fullscreenControl: true,
};

export default function RoastersMap({ roasters }: RoastersMapProps) {
	const [selectedRoaster, setSelectedRoaster] = useState<string | null>(null);
	const [mapView, setMapView] = useState<"map" | "list">("map");
	const [map, setMap] = useState<google.maps.Map | null>(null);

	// Filter roasters with valid location data
	const roastersWithLocations = useMemo(() => {
		return roasters.filter((roaster) => {
			const locationData = roaster.fields.shopLocation as { lat: number; lon: number } | undefined;
			return locationData && locationData.lat && locationData.lon;
		});
	}, [roasters]);

	// Calculate center point (average of all locations or first location)
	const mapCenter = useMemo(() => {
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
	}, [roastersWithLocations]);

	const handleRoasterClick = (roasterId: string, lat: number, lng: number) => {
		setSelectedRoaster(roasterId);
		if (map) {
			map.setCenter({ lat, lng });
			map.setZoom(15);
		}
	};

	const onLoad = (mapInstance: google.maps.Map) => {
		setMap(mapInstance);
	};

	const onUnmount = () => {
		setMap(null);
	};

	const getRoasterWebsite = (roaster: Roaster) => {
		const website = roaster.fields.shopWebsite as string;
		return website.startsWith("http") ? website : `https://${website}`;
	};

	return (
		<div className="w-full h-[calc(100vh-300px)] min-h-[600px] flex flex-col md:flex-row border rounded-lg overflow-hidden">
			<div
				className={`${
					mapView === "list" ? "flex md:hidden" : "hidden md:flex"
				} flex-col w-full md:w-96 border-r bg-white overflow-y-auto`}
			>
				<div className="p-4 border-b bg-gray-50">
					<h2 className="text-lg font-semibold text-gray-900">
						{roastersWithLocations.length} Roaster{roastersWithLocations.length !== 1 ? "s" : ""} / Shop
						{roastersWithLocations.length !== 1 ? "s" : ""}
					</h2>
					<p className="text-sm text-gray-600 mt-1">Click on a roaster to view details</p>
				</div>

				<div className="flex-1 overflow-y-auto">
					{roastersWithLocations.length === 0 ? (
						<div className="p-8 text-center text-gray-500">
							<MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
							<p>No roasters with location data available</p>
						</div>
					) : (
						<div className="divide-y">
							{roastersWithLocations.map((roaster) => {
								const locationData = roaster.fields.shopLocation as { lat: number; lon: number };
								const website = roaster.fields.shopWebsite as string;
								const websiteUrl = getRoasterWebsite(roaster);
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
													<MapPin className="h-4 w-4 flex-shrink-0" />
													<span>
														{locationData.lat.toFixed(4)}, {locationData.lon.toFixed(4)}
													</span>
												</div>
												{website && (
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
												)}
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
					<LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
						<GoogleMap
							mapContainerStyle={mapContainerStyle}
							center={mapCenter}
							zoom={roastersWithLocations.length === 1 ? 12 : 10}
							options={defaultMapOptions}
							onLoad={onLoad}
							onUnmount={onUnmount}
						>
							{roastersWithLocations.map((roaster) => {
								const locationData = roaster.fields.shopLocation as { lat: number; lon: number };
								const isSelected = selectedRoaster === roaster.sys.id;
								const website = roaster.fields.shopWebsite as string;
								const websiteUrl = getRoasterWebsite(roaster);

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
													{website && (
														<a
															href={websiteUrl}
															target="_blank"
															rel="noopener noreferrer"
															className="text-xs text-blue-600 hover:underline"
														>
															Visit Website
														</a>
													)}
												</div>
											</InfoWindow>
										)}
									</Marker>
								);
							})}
						</GoogleMap>
					</LoadScript>
				) : (
					<div className="w-full h-full flex items-center justify-center text-gray-500">
						<div className="text-center">
							<MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
							<p>No roasters with location data available</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
