import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Banknote, Landmark } from 'lucide-react';

const PaymentCard = ({ type, text, subtext, colorClass, children }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 shadow-lg transform transition-all hover:scale-105 ${colorClass} text-white flex flex-col justify-between h-32 w-full md:w-56 mx-auto`}>
        <div className="flex justify-between items-start">
            {children}
            <div className="opacity-80">
                {type === 'visa' && <span className="font-bold italic text-2xl tracking-tighter">VISA</span>}
                {type === 'mastercard' && (
                    <div className="flex -space-x-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/90"></div>
                        <div className="w-8 h-8 rounded-full bg-orange-400/90"></div>
                    </div>
                )}
            </div>
        </div>
        <div className="mt-auto">
            <p className="font-bold text-lg tracking-wide">{text}</p>
            <p className="text-xs opacity-75">{subtext}</p>
        </div>
        {/* Decor circle */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
    </div>
);

const PaymentMethods = () => {
    const { t } = useTranslation();

    return (
        <section className="py-16 bg-white border-t border-slate-100">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-2xl font-bold mb-2 text-slate-800">{t('payment.title')}</h3>
                <p className="text-gray-500 mb-8">{t('payment.subtitle')}</p>

                <div className="flex flex-wrap justify-center gap-6">
                    {/* Visa */}
                    <PaymentCard type="visa" text={t('payment.visa')} subtext="Credit/Debit" colorClass="bg-gradient-to-br from-blue-900 to-blue-700">
                        <CreditCard size={24} className="opacity-80" />
                    </PaymentCard>

                    {/* Mastercard */}
                    <PaymentCard type="mastercard" text={t('payment.mastercard')} subtext="Global Accepted" colorClass="bg-gradient-to-br from-gray-900 to-gray-800">
                        <div className="font-mono text-xs opacity-50">****</div>
                    </PaymentCard>

                    {/* Cash */}
                    <PaymentCard type="cash" text={t('payment.cash')} subtext="EUR" colorClass="bg-gradient-to-br from-green-600 to-emerald-500">
                        <Banknote size={24} className="opacity-80" />
                    </PaymentCard>

                    {/* All Cards / Contactless */}
                    <PaymentCard type="atm" text={t('payment.cards')} subtext="Contactless" colorClass="bg-gradient-to-br from-purple-700 to-indigo-600">
                        <Landmark size={24} className="opacity-80" />
                    </PaymentCard>
                </div>
            </div>
        </section>
    );
};

export default PaymentMethods;
