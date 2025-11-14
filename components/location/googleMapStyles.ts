export const defaultMapOptions: google.maps.MapOptions = {
	zoomControl: true,
	streetViewControl: false,
	mapTypeControl: false,
	fullscreenControl: true,
};

export const styledMapOptions: google.maps.MapOptions = {
	zoomControl: true,
	streetViewControl: false,
	mapTypeControl: false,
	fullscreenControl: true,
	styles: [
		{
			elementType: "geometry",
			stylers: [{ color: "#f5f5f5" }],
		},
		{
			elementType: "labels.icon",
			stylers: [{ visibility: "on" }],
		},
		{
			elementType: "labels.text.fill",
			stylers: [{ color: "#616161" }],
		},
		{
			elementType: "labels.text.stroke",
			stylers: [{ color: "#f5f5f5" }],
		},
		{
			featureType: "administrative",
			elementType: "geometry.stroke",
			stylers: [{ color: "#CD9564" }, { weight: 1 }],
		},
		{
			featureType: "administrative.province",
			elementType: "geometry.stroke",
			stylers: [{ color: "#CD9564" }, { weight: 2 }],
		},
		{
			featureType: "administrative.locality",
			elementType: "geometry.stroke",
			stylers: [{ color: "#CD9564" }, { weight: 1 }],
		},
		{
			featureType: "administrative.land_parcel",
			elementType: "labels.text.fill",
			stylers: [{ color: "#bdbdbd" }],
		},
		{
			featureType: "administrative.neighborhood",
			stylers: [{ visibility: "on" }],
		},
		{
			featureType: "poi",
			elementType: "geometry",
			stylers: [{ color: "#eeeeee" }],
		},
		{
			featureType: "poi",
			elementType: "labels.text.fill",
			stylers: [{ color: "#757575" }],
		},
		{
			featureType: "poi.park",
			elementType: "geometry",
			stylers: [{ color: "#e5e5e5" }],
		},
		{
			featureType: "poi.park",
			elementType: "labels.text.fill",
			stylers: [{ color: "#9e9e9e" }],
		},
		{
			featureType: "road",
			elementType: "geometry",
			stylers: [{ color: "#ffffff" }],
		},
		{
			featureType: "road.arterial",
			elementType: "labels.text.fill",
			stylers: [{ color: "#757575" }],
		},
		{
			featureType: "road.highway",
			elementType: "geometry",
			stylers: [{ color: "#CD9564" }],
		},
		{
			featureType: "road.highway.controlled_access",
			elementType: "geometry",
			stylers: [{ color: "#CD9564" }],
		},
		{
			featureType: "road.local",
			elementType: "labels.text.fill",
			stylers: [{ color: "#9e9e9e" }],
		},
		{
			featureType: "transit.line",
			elementType: "geometry",
			stylers: [{ color: "#e5e5e5" }],
		},
		{
			featureType: "transit.station",
			elementType: "geometry",
			stylers: [{ color: "#eeeeee" }],
		},
		{
			featureType: "water",
			elementType: "geometry",
			stylers: [{ color: "#ad9784" }],
		},
		{
			featureType: "water",
			elementType: "labels.text.fill",
			stylers: [{ color: "#9e9e9e" }],
		},
	],
};
