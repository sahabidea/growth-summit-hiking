export interface Application {
    name: string;
    email: string;
    goal: string;
    politicsAgreement: boolean;
}

export interface VettingResult {
    approved: boolean;
    score: number;
    reason: string;
}

const GROWTH_KEYWORDS = [
    "رشد", "یادگیری", "توسعه", "استارتاپ", "کسب و کار",
    "آرامش", "ذهن", "ورزش", "سلامتی", "ارتقا", "پیشرفت"
];

const RED_FLAGS = [
    "سیاست", "بحث", "دعوا", "حزب", "اعتراض", "نقد سیاسی"
];

export class GatekeeperAgent {
    static vetApplication(app: Application): VettingResult {
        let score = 0;

        // 1. Check Agreement (Binary Gate)
        if (!app.politicsAgreement) {
            return { approved: false, score: 0, reason: "عدم پذیرش پیمان‌نامه جامعه." };
        }

        // 2. Analyze Goal for Keywords
        const goalLower = app.goal.toLowerCase();

        // Bonus for growth keywords
        GROWTH_KEYWORDS.forEach(keyword => {
            if (goalLower.includes(keyword)) score += 10;
        });

        // Penalty for red flags (Politics)
        RED_FLAGS.forEach(flag => {
            if (goalLower.includes(flag)) score -= 50;
        });

        // Length check (Commitment)
        if (app.goal.length > 50) score += 10;
        if (app.goal.length < 10) score -= 20;

        // Decision Logic
        const approved = score >= 20;

        return {
            approved,
            score,
            reason: approved
                ? "تبریک! ذهنیت شما با ارزش‌های جامعه هم‌خوانی دارد."
                : "متاسفانه پروفایل شما در حال حاضر با معیارهای جامعه هم‌خوانی ندارد."
        };
    }
}
