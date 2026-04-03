import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";

// Fix Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapComponent = ({ hotels = [], onHotelSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    console.log("Map component received hotels:", hotels.length);

    // Initialize map
    if (!mapInstanceRef.current && mapRef.current) {
      console.log("Initializing map...");
      const map = L.map(mapRef.current).setView([48.0, 68.0], 5);

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    // Clear existing markers
    if (mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Add hotel markers
      console.log("Adding markers for hotels:", hotels);
      hotels.forEach((hotel) => {
        if (hotel.latitude && hotel.longitude) {
          console.log(
            `Adding marker for ${hotel.name} at ${hotel.latitude}, ${hotel.longitude}`,
          );
          const marker = L.marker([hotel.latitude, hotel.longitude], {
            title: hotel.name,
          })
            .bindPopup(
              `<div style="width: 200px;">
                <h3>${hotel.name}</h3>
                <p><strong>Город:</strong> ${hotel.city}</p>
                <p><strong>Цена:</strong> $${hotel.price}/ночь</p>
                <p><strong>Рейтинг:</strong> ★ ${hotel.rating}</p>
              </div>`,
              { maxWidth: 250 },
            )
            .addTo(mapInstanceRef.current);

          // Handle marker click
          marker.on("click", () => {
            if (onHotelSelect) {
              onHotelSelect(hotel);
            }
          });
        }
      });

      // Fit map to show all markers
      if (hotels.length > 0) {
        try {
          const hotelMarkers = hotels
            .filter((hotel) => hotel.latitude && hotel.longitude)
            .map((hotel) => L.marker([hotel.latitude, hotel.longitude]));

          if (hotelMarkers.length > 0) {
            const group = new L.featureGroup(hotelMarkers);
            mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
            console.log(`Map fitted to ${hotelMarkers.length} markers`);
          }
        } catch (error) {
          console.error("Error fitting map bounds:", error);
        }
      }
    }
  }, [hotels, onHotelSelect]);

  return (
    <div className="map-container">
      <div ref={mapRef} className="map-instance"></div>
    </div>
  );
};

export default MapComponent;
