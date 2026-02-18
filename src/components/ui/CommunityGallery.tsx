"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronLeft, Camera } from "lucide-react";

const images = [
    "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-02-01_20-24-07_dogygr.jpg",
    "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-02-18_08-27-18_tkaoft.jpg",
    "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-01-02_14-22-49_gyjyrn.jpg",
    "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-02-18_08-26-58_ifpbyt.jpg",
    "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-02-18_08-26-54_ug6nf0.jpg",
    "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-02-18_08-27-05_t2jnix.jpg",
    "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-02-18_08-26-09_uhzh3u.jpg",
];

export default function CommunityGallery() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(true);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [reversedImages, setReversedImages] = useState<string[]>([]);

    useEffect(() => {
        setReversedImages([...images].reverse());
    }, []);

    // Initial Scroll to End (Right) to simulate RTL start
    useEffect(() => {
        if (scrollRef.current && mounted) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
            // Delay showing to avoid jump
        }
        if (!mounted) {
            setMounted(true);
        }
    }, [mounted]);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            // In LTR: 0 is Left, Max is Right.
            // We want to be at Right initially.
            // Scroll Left button (move view left) -> Needs scrollLeft > 0
            // Scroll Right button (move view right) -> Needs scrollLeft < scrollWidth - clientWidth
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.7; // Scroll 70% of screen width
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className={`mt-24 relative w-full group/gallery transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-display text-amber-100/90 mb-2 flex items-center justify-center gap-3">
                    <Camera className="w-8 h-8 text-amber-500" />
                    سفرهای قبلی و جامعه‌ای از جنس نور
                </h3>
                <div className="h-1 w-24 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0 mx-auto rounded-full" />
            </div>

            <div className="relative max-w-[95rem] mx-auto px-4 md:px-12">
                {/* Left Button (Scrolls Left / Negative) - Shows 'Next' content conceptually in RTL */}
                <div className={`absolute top-1/2 -translate-y-1/2 left-2 z-20 transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className="p-3 md:p-4 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-xl disabled:opacity-0 disabled:cursor-default transform hover:scale-110 active:scale-95"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                </div>

                {/* Right Button (Scrolls Right / Positive) - Shows 'Previous' content conceptually */}
                <div className={`absolute top-1/2 -translate-y-1/2 right-2 z-20 transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className="p-3 md:p-4 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-xl disabled:opacity-0 disabled:cursor-default transform hover:scale-110 active:scale-95"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                </div>

                {/* Slider Container - LTR forced for reliable math */}
                <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    dir="ltr"
                    className="flex gap-4 md:gap-8 overflow-x-auto pb-12 pt-8 px-4 md:px-12 snap-x snap-mandatory hide-scrollbar scroll-smooth"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {reversedImages.map((src, index) => (
                        <motion.div
                            key={index}
                            className="relative flex-shrink-0 snap-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <div className="w-[280px] h-[350px] md:w-[380px] md:h-[480px] rounded-[2.5rem] overflow-hidden relative group cursor-pointer border-2 border-white/5 hover:border-amber-500/50 transition-all duration-500 shadow-2xl bg-slate-900/50">
                                <img
                                    src={src}
                                    alt={`Community Trip`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1 filter brightness-90 group-hover:brightness-100"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                                {/* Content on Hover */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center">
                                    <span className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">خاطرات صعود</span>
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20 hover:bg-white/20 transition-colors">
                                        <p className="text-white text-sm font-medium text-center">مشاهده تصویر</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
