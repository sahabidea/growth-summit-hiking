import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "برنامه‌های کوهنوردی",
    description:
        "مسیرهای کوهنوردی پیشنهادی هوش مصنوعی. تحلیل هوشمند روت‌های صعود بر اساس شرایط جوی و تعداد همنوردان.",
    openGraph: {
        title: "برنامه‌های کوهنوردی | اوجِ رشد",
        description:
            "مسیرهای کوهنوردی پیشنهادی با تحلیل هوشمند. درکه، توچال، کلک‌چال و دارآباد.",
        images: [
            {
                url: "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771058072/mountain_mist_minimal_1771057010986_gsyr9u.jpg",
                width: 1200,
                height: 630,
                alt: "برنامه‌های کوهنوردی اوجِ رشد",
            },
        ],
    },
};

export default function HikesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
