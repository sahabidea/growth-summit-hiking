"use client";

import dynamic from "next/dynamic";

const DynamicLocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false });

interface MapPickerProps {
    initialLat?: number;
    initialLng?: number;
    onLocationSelect: (mapLink: string) => void;
}

export default function MapPicker(props: MapPickerProps) {
    return <DynamicLocationPicker {...props} />;
}
