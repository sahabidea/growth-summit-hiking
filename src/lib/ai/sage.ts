export interface Topic {
    title: string;
    description: string;
    category: "Mindset" | "Business" | "Philosophy";
}

const TOPICS: Record<string, Topic[]> = {
    Social: [
        { title: "قدرت شبکه سازی", description: "چگونه روابط حرفه ای می توانند مسیر شغلی ما را تغییر دهند؟", category: "Business" },
        { title: "داستان شکست های موفق", description: "هر کدام از ما یک شکست که منجر به یادگیری بزرگ شد را تعریف کنیم.", category: "Mindset" }
    ],
    Focus: [
        { title: "طراحی زندگی", description: "اگر شکست ناپذیر بودید، زندگی شما 5 سال دیگر چطور بود؟", category: "Philosophy" },
        { title: "مدیریت انرژی نه زمان", description: "چطور انرژی خود را برای کارهای مهم حفظ کنیم؟", category: "Mindset" }
    ],
    Challenge: [
        { title: "عبور از منطقه امن", description: "آخرین باری که کاری واقعا سخت انجام دادید کی بود؟", category: "Mindset" },
        { title: "رهبری در بحران", description: "چطور در شرایط سخت تصمیمات درست بگیریم؟", category: "Business" }
    ]
};

export class SageAgent {
    static suggestTopic(vibe: "Social" | "Focus" | "Challenge"): Topic {
        const options = TOPICS[vibe] || TOPICS["Social"];
        const randomIndex = Math.floor(Math.random() * options.length);
        return options[randomIndex];
    }
}
