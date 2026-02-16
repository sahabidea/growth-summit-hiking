import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ثبت درخواست عضویت",
    description:
        "به جامعه اوجِ رشد بپیوندید. فرم ثبت درخواست عضویت در جامعه کوهنوردی اختصاصی برای افراد رشد‌طلب.",
    openGraph: {
        title: "ثبت درخواست عضویت | اوجِ رشد",
        description:
            "به جامعه اوجِ رشد بپیوندید. کوهنوردی اختصاصی همراه با ذهن‌آگاهی و رشد شخصی.",
        images: [
            {
                url: "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771058072/mountain_hero_background_dark_1771057683768_uzbox7.jpg",
                width: 1200,
                height: 630,
                alt: "ثبت‌نام اوجِ رشد",
            },
        ],
    },
};

export default function ApplyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
