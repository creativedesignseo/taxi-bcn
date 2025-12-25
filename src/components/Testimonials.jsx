import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
    const { t } = useTranslation();

    const testimonials = t('testimonials.reviews', { returnObjects: true });

    return (
        <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {t('testimonials.title')}
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {t('testimonials.subtitle')}
                    </p>
                    <div className="flex justify-center items-center gap-1 mt-6">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-3 text-white text-xl font-semibold">5.0</span>
                        <span className="text-gray-400 ml-2">({testimonials.length} {t('testimonials.reviews_count')})</span>
                    </div>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20"
                        >
                            {/* Quote Icon */}
                            <Quote className="w-10 h-10 text-yellow-400/30 mb-4" />

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-gray-300 text-base leading-relaxed mb-6 italic">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-lg">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{testimonial.name}</p>
                                    <p className="text-gray-400 text-sm">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Badge */}
                <div className="text-center mt-16">
                    <p className="text-gray-400 text-sm">
                        ✓ {t('testimonials.verified')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
