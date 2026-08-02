"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Leaflet Icons
const createCustomIcon = (color: string, initials: string) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 13px;
        font-family: sans-serif;
      ">
        ${initials}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
};

const userGpsIcon = L.divIcon({
  className: "custom-user-gps-marker",
  html: `
    <div style="
      background-color: #2563eb;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 15px rgba(37,99,235,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      📍
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

// Component to dynamically re-center map when selected location changes
function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

export interface CrewLocation {
  id: string;
  initials: string;
  lat: number;
  lng: number;
  name: string;
  task: string;
  vehicle: string;
  status: string;
  colorHex: string;
}

interface MapProps {
  locations: CrewLocation[];
  selectedId?: string | null;
  onSelectLocation?: (id: string) => void;
  userGps?: { lat: number; lng: number } | null;
  center?: [number, number];
  zoom?: number;
}

export default function Map({
  locations,
  selectedId,
  onSelectLocation,
  userGps,
  center = [41.6521, 1.8322],
  zoom = 12
}: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  // Find selected crew coordinates or fallback
  const selectedCrew = locations.find((l) => l.id === selectedId);
  const activeCenter: [number, number] = selectedCrew ? [selectedCrew.lat, selectedCrew.lng] : center;
  const activeZoom = selectedCrew ? 14 : zoom;

  return (
    <MapContainer center={activeCenter} zoom={activeZoom} className="h-full w-full rounded-2xl z-0" style={{ minHeight: "500px" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapRecenter center={activeCenter} zoom={activeZoom} />

      {/* Render Crew Markers */}
      {locations.map((loc) => {
        const isSelected = loc.id === selectedId;
        const icon = createCustomIcon(loc.colorHex, loc.initials);

        return (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={icon}
            eventHandlers={{
              click: () => onSelectLocation && onSelectLocation(loc.id),
            }}
          >
            <Popup>
              <div className="p-1 font-sans">
                <strong className="text-sm block text-slate-900">{loc.name}</strong>
                <span className="text-xs text-slate-600 block">{loc.task}</span>
                <span className="text-xs text-slate-500 block">{loc.vehicle}</span>
                <span className="text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                  {loc.status}
                </span>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Render User GPS Live Position Marker */}
      {userGps && (
        <Marker position={[userGps.lat, userGps.lng]} icon={userGpsIcon}>
          <Popup>
            <div className="p-1 text-xs">
              <strong className="text-blue-600 block font-bold">📍 El Teu GPS (Mòbil)</strong>
              <span>Posició geolocalitzada en temps real</span>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
