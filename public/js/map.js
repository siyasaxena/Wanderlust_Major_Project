maptilersdk.config.apiKey = mapToken;
    
// 1. Check if coordinates exist to prevent crashing on old listings
if (!listing.geometry || !listing.geometry.coordinates || listing.geometry.coordinates.length === 0) {
    // Default to a general view of India if no coordinates found
    listing.geometry = { coordinates: [78.9629, 20.5937] }; 
}
const map = new maptilersdk.Map({
    container: 'map', 
    style: maptilersdk.MapStyle.STREETS,
    center: listing.geometry.coordinates,
    zoom: 9
});

const el = document.createElement('div');
el.className = 'marker-container';

const icon = document.createElement('i');
icon.className = 'fa-solid fa-location-dot'; // Default map pin icon
el.appendChild(icon);

el.addEventListener('mouseenter', () => {
    icon.className = 'fa-solid fa-compass-drafting'; // Replace with your "Logo" icon
});

el.addEventListener('mouseleave', () => {
    icon.className = 'fa-solid fa-location-dot'; // Back to default pin
});

new maptilersdk.Marker({element : el}) 
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
        .setHTML( `<h4>${listing.title}</h4><p>Exact location provided after booking</p>`)
    )
    .addTo(map);

// 3. Keep your Geocoding Control
const gc = new maptilersdk.GeocodingControl();
map.addControl(gc, 'top-left');