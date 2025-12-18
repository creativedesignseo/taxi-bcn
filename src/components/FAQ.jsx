import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:border-yellow-400 transition-colors">
            <button
                onClick={onClick}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            >
                <span className="font-bold text-lg text-slate-800 flex items-center gap-3">
                    <HelpCircle size={20} className="text-yellow-500" />
                    {question}
                </span>
                {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
            </button>
            <div
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-gray-600 leading-relaxed pl-8 border-l-2 border-yellow-200 ml-2">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQ = () => {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState(0);

    const questions = [
        { q: t('faq.q1'), a: t('faq.a1') },
        { q: t('faq.q2'), a: t('faq.a2') },
        { q: t('faq.q3'), a: t('faq.a3') },
        { q: t('faq.q4'), a: t('faq.a4') },
        { q: t('faq.q5'), a: t('faq.a5') },
    ];

    return (
        <section className="py-20 bg-slate-50" id="faq">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">{t('faq.title')}</h2>
                    <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
                </div>
                <div className="space-y-4">
                    {questions.map((item, index) => (
                        <FAQItem
                            key={index}
                            question={item.q}
                            answer={item.a}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
