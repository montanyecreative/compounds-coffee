"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { LoadScript } from "@react-google-maps/api";
import { createGeocodingFunction } from "@/lib/geocoding";
import { Roaster } from "@/lib/contentful";

interface RoasterLocationProps {
	locationData: { lat: number; lon: number } | undefined;
	roasterId: string;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

function RoasterLocationContent({ locationData, roasterId }: RoasterLocationProps) {
	const [address, setAddress] = useState<string | null>(null);
	const geocodingRequested = useRef<Set<string>>(new Set());

	// Create a mock roaster object for the geocoding function
	const roaster: Roaster = useMemo(
		() =>
			({
				sys: { id: roasterId },
				fields: { shopLocation: locationData },
			} as Roaster),
		[roasterId, locationData]
	);

	const performGeocoding = useMemo(() => {
		if (!locationData || !locationData.lat || !locationData.lon) {
			return () => {};
		}

		return createGeocodingFunction({
			roasters: [roaster],
			onAddressUpdate: (id: string, addr: string) => {
				if (id === roasterId) {
					setAddress(addr);
				}
			},
			requestedIds: geocodingRequested.current,
			existingAddresses: {},
		});
	}, [roaster, roasterId, locationData]);

	// Initialize geocoder and reverse geocode address
	useEffect(() => {
		if (!locationData || !locationData.lat || !locationData.lon) {
			return;
		}

		// Try to geocode if API is already loaded
		performGeocoding();

		// Also set up an interval to check if API becomes available (for cases where LoadScript hasn't loaded yet)
		const interval = setInterval(() => {
			if (typeof window !== "undefined" && window.google && window.google.maps && window.google.maps.Geocoder) {
				performGeocoding();
			}
		}, 500);

		return () => clearInterval(interval);
	}, [performGeocoding, locationData]);

	// Create Google Maps URL
	const getGoogleMapsUrl = () => {
		if (address) {
			return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
		}
		if (locationData && locationData.lat && locationData.lon) {
			return `https://www.google.com/maps?q=${locationData.lat},${locationData.lon}`;
		}
		return null;
	};

	const mapsUrl = getGoogleMapsUrl();

	// Display address if available, otherwise show coordinates
	if (address && mapsUrl) {
		return (
			<a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-brown hover:underline cursor-pointer">
				{address}
			</a>
		);
	}

	if (locationData && locationData.lat && locationData.lon && mapsUrl) {
		return (
			<a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-brown hover:underline cursor-pointer">
				{`${locationData.lat.toFixed(4)}, ${locationData.lon.toFixed(4)}`}
			</a>
		);
	}

	return <span>N/A</span>;
}

export default function RoasterLocation(props: RoasterLocationProps) {
	return (
		<LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
			<RoasterLocationContent {...props} />
		</LoadScript>
	);
}
