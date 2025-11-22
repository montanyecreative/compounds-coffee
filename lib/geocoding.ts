import { Roaster } from "@/lib/contentful";

interface GeocodeOptions {
	roasters: Roaster[];
	onAddressUpdate: (roasterId: string, address: string) => void;
	requestedIds?: Set<string>;
	existingAddresses?: Record<string, string>;
}

/**
 * Geocodes an address to latitude and longitude coordinates using Google Maps Geocoding API
 * @param address - The address string to geocode
 * @returns Promise with lat/lon coordinates or null if geocoding fails
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lon: number } | null> {
	try {
		const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

		if (!apiKey) {
			console.error("Google Maps API key not found");
			return null;
		}

		const encodedAddress = encodeURIComponent(address);
		const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

		const response = await fetch(url);
		const data = await response.json();

		if (data.status === "OK" && data.results && data.results.length > 0) {
			const location = data.results[0].geometry.location;
			return {
				lat: location.lat,
				lon: location.lng,
			};
		} else {
			console.error("Geocoding failed:", data.status, data.error_message);
			return null;
		}
	} catch (error) {
		console.error("Error geocoding address:", error);
		return null;
	}
}

/**
 * Performs reverse geocoding for roaster locations to get formatted addresses.
 *
 * @param options - Configuration options for geocoding
 * @param options.roasters - Array of roasters with valid location data
 * @param options.onAddressUpdate - Callback function to update addresses when geocoding completes
 * @param options.requestedIds - Optional Set to track which roasters have already been requested
 * @param options.existingAddresses - Optional Record of existing addresses to skip geocoding for
 *
 * @returns A function that can be called to perform geocoding
 */
export function createGeocodingFunction({ roasters, onAddressUpdate, requestedIds = new Set(), existingAddresses = {} }: GeocodeOptions) {
	return () => {
		if (
			typeof window === "undefined" ||
			!window.google ||
			!window.google.maps ||
			!window.google.maps.Geocoder ||
			roasters.length === 0
		) {
			return;
		}

		try {
			const geocoderInstance = new window.google.maps.Geocoder();

			// Reverse geocode all roasters that don't have addresses yet
			roasters.forEach((roaster) => {
				const locationData = roaster.fields.shopLocation as { lat: number; lon: number } | undefined;
				if (!locationData || !locationData.lat || !locationData.lon) {
					return;
				}

				const roasterId = roaster.sys.id;

				// Skip if we already have an address or have already requested geocoding
				if (existingAddresses[roasterId] || requestedIds.has(roasterId)) {
					return;
				}

				// Mark as requested
				requestedIds.add(roasterId);

				// Perform reverse geocoding
				geocoderInstance.geocode({ location: { lat: locationData.lat, lng: locationData.lon } }, (results, status) => {
					if (status === "OK" && results && results[0]) {
						onAddressUpdate(roasterId, results[0].formatted_address);
					}
				});
			});
		} catch (error) {
			console.error("Error initializing geocoder:", error);
		}
	};
}
