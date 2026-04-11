maptilersdk.config.apiKey = mapToken;
    
const map = new maptilersdk.Map({
    container: 'map', 
    style: maptilersdk.MapStyle.STREETS,
    center: [78.9629,20.5937],
    zoom: 9
});

const gc = new maptilersdk.GeocodingControl();
map.addControl(gc, 'top-left');