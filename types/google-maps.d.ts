/// <reference types="@types/google.maps" />

declare namespace google.maps {
	interface Map {
		setCenter(latlng: LatLng | LatLngLiteral): void;
		setZoom(zoom: number): void;
	}
}
