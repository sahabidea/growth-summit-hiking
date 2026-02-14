export interface Route {
    id: string;
    name: string;
    difficulty: "Easy" | "Moderate" | "Hard";
    duration: string;
    vibe: "Social" | "Focus" | "Challenge";
}

export const ROUTES: Route[] = [
    { id: "1", name: "درکه - پلنگ‌چال", difficulty: "Moderate", duration: "4h", vibe: "Social" },
    { id: "2", name: "توچال (ایستگاه 5)", difficulty: "Hard", duration: "6h", vibe: "Challenge" },
    { id: "3", name: "دارآباد", difficulty: "Moderate", duration: "3h", vibe: "Focus" },
    { id: "4", name: "کلک‌چال", difficulty: "Easy", duration: "2h", vibe: "Social" },
];

export class PathfinderAgent {
    static suggestRoute(weather: string, groupSize: number): Route {
        // Determine Vibe based on Group Size
        // Small groups -> Focus/Deep Talk
        // Large groups -> Social/Networking

        if (groupSize > 10) {
            // Prefer wider paths, social vibe
            return ROUTES.find(r => r.vibe === "Social") || ROUTES[0];
        } else if (weather === "Rainy" || weather === "Snowy") {
            // Safety first
            return ROUTES.find(r => r.difficulty === "Easy") || ROUTES[3];
        } else {
            // Default to growth/challenge
            return ROUTES.find(r => r.vibe === "Challenge") || ROUTES[1];
        }
    }
}
