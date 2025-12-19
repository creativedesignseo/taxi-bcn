import React from 'react';
import { useTranslation } from 'react-i18next';

const PaymentMethods = () => {
    const { t } = useTranslation();

    const logos = [
        "/img/Group 5.svg",
        "/img/Group 6.svg",
        "/img/Group 7.svg",
        "/img/Group 8.svg",
        "/img/Group 9.svg",
        "/img/Group 10.svg",
    ];

    return (
        <section className="py-12 bg-white overflow-hidden border-t border-slate-100">
            <div className="container mx-auto px-4 mb-8 text-center">
                <h3 className="text-xl font-bold text-slate-800">{t('payment.title')}</h3>
                <p className="text-gray-400 text-sm">{t('payment.subtitle')}</p>
            </div>

            <div className="relative flex overflow-x-hidden">
                {/* Carrusel Infinito */}
                <div className="animate-marquee whitespace-nowrap flex items-center py-4">
                    {/* Primera tanda de logos */}
                    {logos.map((logo, idx) => (
                        <div key={`logo-1-${idx}`} className="mx-8 flex-shrink-0">
                            <img src={logo} alt="Payment Method" className="h-10 md:h-12 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                        </div>
                    ))}
                    {/* Segunda tanda de logos para el loop infinito */}
                    {logos.map((logo, idx) => (
                        <div key={`logo-2-${idx}`} className="mx-8 flex-shrink-0">
                            <img src={logo} alt="Payment Method" className="h-10 md:h-12 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                        </div>
                    ))}
                    {/* Tercera tanda de logos para pantallas muy anchas */}
                    {logos.map((logo, idx) => (
                        <div key={`logo-3-${idx}`} className="mx-8 flex-shrink-0">
                            <img src={logo} alt="Payment Method" className="h-10 md:h-12 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                        </div>
                    ))}
                </div>

                {/* Sombreado lateral para suavizar la entrada/salida */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-marquee {
                    animation: marquee 25s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}} />
        </section>
    );
};

export default PaymentMethods;
