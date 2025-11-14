"use client";

import { useMemo, useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface SingleRoasterMapProps {
	locationData: { lat: number; lon: number } | undefined;
	shopName: string;
	onLoadingChange?: (isLoading: boolean) => void;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const mapContainerStyle = {
	width: "100%",
	height: "100%",
	minHeight: "400px",
};

const defaultMapOptions = {
	zoomControl: true,
	streetViewControl: false,
	mapTypeControl: false,
	fullscreenControl: true,
};

export default function SingleRoasterMap({ locationData, shopName, onLoadingChange }: SingleRoasterMapProps) {
	const [isMapLoading, setIsMapLoading] = useState<boolean>(true);

	const mapCenter = useMemo(() => {
		if (!locationData || !locationData.lat || !locationData.lon) {
			return { lat: 0, lng: 0 };
		}
		return { lat: locationData.lat, lng: locationData.lon };
	}, [locationData]);

	// Check if API is already loaded on mount
	useEffect(() => {
		if (typeof window !== "undefined" && window.google && window.google.maps && window.google.maps.Map) {
			setIsMapLoading(false);
		}
	}, []);

	// Notify parent component of loading state changes
	useEffect(() => {
		if (onLoadingChange) {
			onLoadingChange(isMapLoading);
		}
	}, [isMapLoading, onLoadingChange]);

	// Load map when map is loaded
	const onLoad = () => {
		setIsMapLoading(false);
	};

	if (!locationData || !locationData.lat || !locationData.lon) {
		return (
			<div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
				<p className="text-gray-500">Location data not available</p>
			</div>
		);
	}

	return (
		<LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
			<div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden">
				<GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={15} options={defaultMapOptions} onLoad={onLoad}>
					<Marker position={{ lat: locationData.lat, lng: locationData.lon }} title={shopName} />
				</GoogleMap>
			</div>
		</LoadScript>
	);
}
