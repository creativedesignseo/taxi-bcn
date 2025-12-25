import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
    const { t } = useTranslation();
    const testimonials = t('testimonials.reviews', { returnObjects: true });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-advance carousel every 5 seconds
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, testimonials.length]);

    const goToNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const goToPrevious = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const goToSlide = (index) => {
        setIsAutoPlaying(false);
        setCurrentIndex(index);
    };

    return (
        <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {t('testimonials.title')}
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
                        {t('testimonials.subtitle')}
                    </p>
                    <div className="flex justify-center items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-3 text-white text-xl font-semibold">5.0</span>
                        <span className="text-gray-400 ml-2">({testimonials.length} {t('testimonials.reviews_count')})</span>
                    </div>
                </div>

                {/* Carousel Container */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Main Testimonial Card */}
                    <div className="relative min-h-[400px] flex items-center justify-center">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentIndex
                                        ? 'opacity-100 scale-100 z-10'
                                        : 'opacity-0 scale-95 z-0'
                                    }`}
                            >
                                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-12 md:p-16 rounded-3xl border border-gray-700/50 shadow-2xl shadow-yellow-500/10">
                                    {/* Quote Icon */}
                                    <Quote className="w-16 h-16 text-yellow-400/20 mb-8 mx-auto" />

                                    {/* Stars */}
                                    <div className="flex gap-1 mb-8 justify-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-gray-200 text-xl md:text-2xl leading-relaxed mb-10 text-center italic font-light">
                                        "{testimonial.text}"
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-white font-semibold text-lg">{testimonial.name}</p>
                                            <p className="text-gray-400">{testimonial.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={goToPrevious}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-gray-800/80 hover:bg-yellow-500 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-gray-700 hover:border-yellow-500 z-20"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-gray-800/80 hover:bg-yellow-500 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-gray-700 hover:border-yellow-500 z-20"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-12">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-300 rounded-full ${index === currentIndex
                                        ? 'w-12 h-3 bg-yellow-400'
                                        : 'w-3 h-3 bg-gray-600 hover:bg-gray-500'
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
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
