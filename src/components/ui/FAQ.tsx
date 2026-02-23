"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "چگونه می‌توانم در برنامه‌های اوج رشد شرکت کنم؟",
        answer: "برای شرکت در برنامه‌های ما کافیست در سایت ثبت‌نام کرده و سپس از طریق صفحه برنامه‌ها، صعود مورد نظر خود را انتخاب کرده و مراحل ثبت‌نام نهایی را طی کنید."
    },
    {
        question: "آیا برای شرکت در برنامه‌ها نیاز به تجهیزات حرفه‌ای دارم؟",
        answer: "برای برنامه‌های یک‌روزه و سبک، تجهیزات پایه‌ای مانند کفش مناسب و کوله‌پشتی کوچک کافیست. برای برنامه‌های تخصصی‌تر، چک‌لیست تجهیزات قبل از برنامه برای شما ارسال خواهد شد."
    },
    {
        question: "شرایط انصراف از برنامه به چه صورت است؟",
        answer: "در صورت انصراف تا ۴۸ ساعت قبل از شروع برنامه، کل مبلغ به کیف پول شما در سایت بازگردانده می‌شود. پس از آن متاسفانه امکان استرداد وجه وجود ندارد."
    },
    {
        question: "آیا برنامه‌های اوج رشد شامل بیمه می‌شود؟",
        answer: "بله، تمامی شرکت‌کنندگان در برنامه‌های رسمی باشگاه تحت پوشش بیمه حوادث کوهستان قرار می‌گیرند. (ارائه کد ملی و اطلاعات صحیح هنگام ثبت‌نام الزامی است)"
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleOpen = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 px-6 relative z-10 w-full">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-display mb-4 text-white drop-shadow-md">سوالات متداول</h2>
                    <p className="text-white/60 text-lg">پاسخِ پرسش‌های پرتکرار شما</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-colors"
                        >
                            <button
                                onClick={() => toggleOpen(index)}
                                className="w-full flex items-center justify-between p-6 text-right focus:outline-none"
                            >
                                <span className="text-white font-bold text-lg">{faq.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 text-amber-500 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                                />
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="p-6 pt-0 text-white/70 leading-relaxed text-justify">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
