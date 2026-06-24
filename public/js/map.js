maptilersdk.config.apiKey = mapToken;

// 1. Safety check for missing, empty, or un-geocoded [0, 0] coordinates
if (
  !listing.geometry ||
  !listing.geometry.coordinates ||
  listing.geometry.coordinates.length === 0 ||
  (listing.geometry.coordinates[0] === 0 &&
    listing.geometry.coordinates[1] === 0)
) {
  // Graceful fallback: Structure it as a valid GeoJSON Point
  listing.geometry = {
    type: "Point",
    coordinates: [78.9629, 20.5937], // General center of India
  };
}

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: listing.geometry.coordinates,
  zoom: 9,
});

// 2. Custom Marker Creation & Hover Effects
const el = document.createElement("div");
el.className = "marker-container";

const icon = document.createElement("i");
icon.className = "fa-solid fa-location-dot"; // Default map pin icon
el.appendChild(icon);

el.addEventListener("mouseenter", () => {
  icon.className = "fa-solid fa-compass-drafting"; // Custom "Logo" icon on hover
});

el.addEventListener("mouseleave", () => {
  icon.className = "fa-solid fa-location-dot"; // Back to default pin
});

// 3. Render Marker with Popup
new maptilersdk.Marker({ element: el, anchor: "bottom" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}</h4><p>Exact location provided after booking</p>`,
    ),
  )
  .addTo(map);

// 4. Geocoding Control
const gc = new maptilersdk.GeocodingControl();
map.addControl(gc, "top-left");
