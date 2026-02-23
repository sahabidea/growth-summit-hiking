import { XMLParser } from "fast-xml-parser";

export interface GPXStats {
    distance_km: number;
    elevation_gain: number;
    duration_minutes: number;
    calories_burned: number;
}

function haversineDist(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Earth Radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function parseGPX(gpxString: string): GPXStats {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_"
    });

    let jsonObj;
    try {
        jsonObj = parser.parse(gpxString);
    } catch (e) {
        throw new Error("Invalid GPX/XML format");
    }

    if (!jsonObj.gpx) {
        throw new Error("No GPX data found inside the file");
    }

    let points: any[] = [];

    const trk = jsonObj.gpx.trk;
    if (!trk) return { distance_km: 0, elevation_gain: 0, duration_minutes: 0, calories_burned: 0 };

    const tracks = Array.isArray(trk) ? trk : [trk];

    tracks.forEach((track: any) => {
        const segs = Array.isArray(track.trkseg) ? track.trkseg : [track.trkseg];
        segs.forEach((seg: any) => {
            if (!seg || !seg.trkpt) return;
            const pts = Array.isArray(seg.trkpt) ? seg.trkpt : [seg.trkpt];
            points = points.concat(pts);
        });
    });

    if (points.length < 2) {
        return { distance_km: 0, elevation_gain: 0, duration_minutes: 0, calories_burned: 0 };
    }

    let distance = 0;
    let elevationGain = 0;

    let startTime = new Date(points[0].time).getTime();
    let endTime = new Date(points[points.length - 1].time).getTime();

    for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];

        const lat1 = parseFloat(p1['@_lat']);
        const lon1 = parseFloat(p1['@_lon']);
        const ele1 = parseFloat(p1.ele || 0);

        const lat2 = parseFloat(p2['@_lat']);
        const lon2 = parseFloat(p2['@_lon']);
        const ele2 = parseFloat(p2.ele || 0);

        distance += haversineDist(lat1, lon1, lat2, lon2);

        if (ele2 > ele1) {
            elevationGain += (ele2 - ele1);
        }
    }

    const durationMs = endTime - startTime;
    const durationMinutes = Math.max(0, Math.round(durationMs / 60000));

    // Rough calories burning estimate for hiking
    // Based on distance, duration, and elevation
    // Approx 60 kcal per km flat + 10 kcal per 10m elevation gain + generic basal metabolism
    let calories = 0;
    if (durationMinutes > 0) {
        calories = Math.round((distance * 60) + (elevationGain)); // a basic heuristic: 60kcal/km + 10kcal/10m = 1kcal/m
    }

    return {
        distance_km: Math.round(distance * 100) / 100, // Round to 2 decimals
        elevation_gain: Math.round(elevationGain),
        duration_minutes: durationMinutes,
        calories_burned: calories
    };
}
