"use client";

import dynamic from "next/dynamic";

const DynamicLocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false });

export default function MapPicker(props: Record<string, unknown>) {
    return <DynamicLocationPicker {...props} />;
}
