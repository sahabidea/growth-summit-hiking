"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with React/Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function LocationPicker({
    initialLat,
    initialLng,
    onLocationSelect,
}: {
    initialLat?: number;
    initialLng?: number;
    onLocationSelect: (mapLink: string) => void;
}) {
    // Default to Tehran if no initial position
    const defaultPosition: [number, number] = [35.6892, 51.3890];
    const startingPosition: [number, number] = initialLat && initialLng ? [initialLat, initialLng] : defaultPosition;

    const [position, setPosition] = useState<[number, number]>(startingPosition);

    const handleSelect = (lat: number, lng: number) => {
        setPosition([lat, lng]);
        onLocationSelect(`https://www.google.com/maps?q=${lat},${lng}`);
    };

    return (
        <div className="h-[300px] w-full rounded-xl overflow-hidden border border-white/10 relative z-10">
            <MapContainer center={startingPosition} zoom={11} scrollWheelZoom={true} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} />
                <MapClickHandler onLocationSelect={handleSelect} />
            </MapContainer>
        </div>
    );
}
