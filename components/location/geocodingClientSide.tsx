"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { LoadScript } from "@react-google-maps/api";
import { Roaster } from "@/lib/contentful";

interface RoasterLocationProps {
	locationData: { lat: number; lon: number } | undefined;
	roasterId: string;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

function RoasterLocationContent({ locationData, roasterId }: RoasterLocationProps) {
	// Create a unique location key based on coordinates
	const locationKey = useMemo(() => {
		if (locationData && locationData.lat && locationData.lon) {
			return `${locationData.lat.toFixed(6)}-${locationData.lon.toFixed(6)}`;
		}
		return null;
	}, [locationData]);

	// Initialize state - reset on every mount/remount
	const [address, setAddress] = useState<string | null>(null);
	const geocodingRequestedRef = useRef<boolean>(false);
	const currentLocationRef = useRef<string | null>(null);
	const mountedRef = useRef<boolean>(true);
	const instanceIdRef = useRef<string>(`${roasterId}-${locationKey || "no-loc"}-${Date.now()}`);

	// Reset state when location or roaster changes - this runs on mount and when dependencies change
	useEffect(() => {
		// Create a new instance ID to ensure this is a fresh instance
		instanceIdRef.current = `${roasterId}-${locationKey || "no-loc"}-${Date.now()}`;
		mountedRef.current = true;
		setAddress(null);
		geocodingRequestedRef.current = false;
		currentLocationRef.current = locationKey;

		return () => {
			mountedRef.current = false;
			setAddress(null);
			geocodingRequestedRef.current = false;
		};
	}, [locationKey, roasterId]);

	// Perform geocoding directly without using the shared geocoding function
	useEffect(() => {
		if (!locationData || !locationData.lat || !locationData.lon || !locationKey) {
			setAddress(null);
			return;
		}

		// Don't geocode if we've already requested for this location or component is unmounted
		if (geocodingRequestedRef.current || currentLocationRef.current !== locationKey || !mountedRef.current) {
			return;
		}

		// Check if Google Maps API is available
		const checkAndGeocode = () => {
			// Capture the current locationKey in the closure to prevent stale closures
			const capturedLocationKey = locationKey;
			const capturedLat = locationData.lat;
			const capturedLon = locationData.lon;

			if (
				typeof window === "undefined" ||
				!window.google ||
				!window.google.maps ||
				!window.google.maps.Geocoder ||
				!mountedRef.current ||
				currentLocationRef.current !== capturedLocationKey
			) {
				return false;
			}

			try {
				const geocoder = new window.google.maps.Geocoder();
				geocodingRequestedRef.current = true;

				geocoder.geocode({ location: { lat: capturedLat, lng: capturedLon } }, (results, status) => {
					// Only update if this is still the current location and component is mounted
					// Use the captured locationKey from the closure - this ensures we only update for the correct location
					if (
						status === "OK" &&
						results &&
						results[0] &&
						mountedRef.current &&
						currentLocationRef.current === capturedLocationKey
					) {
						setAddress(results[0].formatted_address);
					} else if (status !== "OK") {
						// Reset requested flag on error so we can retry
						if (currentLocationRef.current === capturedLocationKey) {
							geocodingRequestedRef.current = false;
						}
					}
				});
				return true;
			} catch (error) {
				console.error("Error geocoding:", error);
				if (currentLocationRef.current === capturedLocationKey) {
					geocodingRequestedRef.current = false;
				}
				return false;
			}
		};

		// Try to geocode immediately if API is available
		if (!checkAndGeocode()) {
			// Set up interval to check when API becomes available
			const interval = setInterval(() => {
				if (checkAndGeocode()) {
					clearInterval(interval);
				}
			}, 500);

			return () => {
				clearInterval(interval);
			};
		}
	}, [locationData, locationKey, roasterId]);

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
	// Use a combination of roasterId and location as key to force React to create a new component instance
	// This ensures each unique location gets its own component instance
	const locationKey = props.locationData
		? `${props.roasterId}-${props.locationData.lat.toFixed(6)}-${props.locationData.lon.toFixed(6)}`
		: props.roasterId;

	// Check if Google Maps API is already loaded
	const [apiLoaded, setApiLoaded] = useState(false);

	useEffect(() => {
		// Check if API is already available
		if (typeof window !== "undefined" && window.google && window.google.maps && window.google.maps.Geocoder) {
			setApiLoaded(true);
			return;
		}

		// Poll for API availability
		const checkInterval = setInterval(() => {
			if (typeof window !== "undefined" && window.google && window.google.maps && window.google.maps.Geocoder) {
				setApiLoaded(true);
				clearInterval(checkInterval);
			}
		}, 100);

		return () => clearInterval(checkInterval);
	}, []);

	// If API is already loaded, render content directly without LoadScript
	if (apiLoaded) {
		return <RoasterLocationContent key={locationKey} {...props} />;
	}

	// Otherwise, use LoadScript to load the API
	return (
		<LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]} key={locationKey}>
			<RoasterLocationContent key={locationKey} {...props} />
		</LoadScript>
	);
}
