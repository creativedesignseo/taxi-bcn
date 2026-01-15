import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Clock, Users, MapPin, Check, Star, Calendar } from 'lucide-react';

const ToursPage = () => {
    useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const PHONE_NUMBER = "+34625030000";

    const handleCall = () => {
        window.location.href = `tel:${PHONE_NUMBER}`;
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent("Hola, quiero reservar el Tour a Montserrat.");
        window.open(`https://wa.me/${PHONE_NUMBER}?text=${text}`, '_blank');
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            <Helmet>
                <title>Tour Monasterio de Montserrat - Taxi Barcelona</title>
                <meta name="description" content="Descubre la montaña sagrada de Cataluña. Tour privado al Monasterio de Montserrat. 6 horas, hasta 7 personas, €180 por vehículo." />
            </Helmet>

            {/* ===== HERO SECTION ===== */}
            <section className="relative h-[750px] flex items-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <div 
                        className="absolute inset-0 z-10"
                        style={{ 
                            background: 'linear-gradient(152deg, rgb(10, 10, 10) 0%, rgba(10, 10, 10, 0.95) 50%, rgba(10, 10, 10, 0.9) 100%)' 
                        }}
                    />
                    <img 
                        src="/img/Sagrada-familia-02.webp" 
                        alt="Montserrat Mountains" 
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                </div>

                {/* Content */}
                <div className="relative z-20 container mx-auto px-4 md:px-16 lg:px-[70px] py-[50px]">
                    <div className="flex flex-col gap-8 max-w-2xl">
                        
                        {/* Back Link */}
                        <button 
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors w-fit"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-base">Volver a inicio</span>
                        </button>

                        {/* Badge */}
                        <span className="inline-block w-fit px-4 py-2 rounded-full bg-yellow-400 text-black text-sm font-bold">
                            Tour Montaña y Cultura
                        </span>

                        {/* Title */}
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                Tour Monasterio de
                            </h1>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-yellow-400 leading-tight">
                                Montserrat
                            </h1>
                        </div>

                        {/* Description */}
                        <p className="text-white/80 text-lg leading-relaxed max-w-xl">
                            Descubre la montaña sagrada de Cataluña. Un viaje inolvidable al Monasterio de Montserrat, hogar de la famosa Virgen Negra y la Escolanía más antigua de Europa.
                        </p>

                        {/* Stats Row */}
                        <div className="flex flex-wrap gap-6 md:gap-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-white/10">
                                    <Clock size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs uppercase tracking-wider">Duración</p>
                                    <p className="text-white font-bold">6 horas</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-white/10">
                                    <Users size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs uppercase tracking-wider">Capacidad</p>
                                    <p className="text-white font-bold">Hasta 7 personas</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-white/10">
                                    <MapPin size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs uppercase tracking-wider">Distancia</p>
                                    <p className="text-white font-bold">60 km desde BCN</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 mt-4">
                            <button 
                                onClick={handleWhatsApp}
                                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-xl font-bold transition-all"
                            >
                                <Phone size={18} />
                                Reservar Ahora
                            </button>
                            <button 
                                onClick={handleCall}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold border border-white/20 transition-all"
                            >
                                <Calendar size={18} />
                                Consultar Disponibilidad
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PRICE SECTION ===== */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4 md:px-16 lg:px-[70px]">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
                        
                        {/* Price Column */}
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                                Precio del Tour
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Tarifa fija por vehículo, no por persona. Ideal para familias y grupos pequeños.
                            </p>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-5xl md:text-6xl font-black text-slate-900">€180</span>
                                <span className="text-gray-500 text-lg">/ vehículo</span>
                            </div>
                            <p className="text-gray-500 text-sm">
                                * Precio para hasta 4 personas. Consultar suplemento para grupos mayores.
                            </p>
                        </div>

                        {/* Included Column */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-6">
                                Incluido en el precio:
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    'Recogida en tu hotel o ubicación',
                                    'Vehículo privado con aire acondicionado',
                                    'Conductor profesional bilingüe',
                                    'Paradas para fotos panorámicas',
                                    'Tiempo libre en el Monasterio',
                                    'Visita a la Virgen de Montserrat'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                            <Check size={14} className="text-green-600" />
                                        </div>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== ITINERARY SECTION ===== */}
            <section className="py-16 md:py-24 bg-slate-50">
                <div className="container mx-auto px-4 md:px-16 lg:px-[70px]">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Itinerario del Día
                        </h2>
                        <p className="text-gray-600">
                            Un recorrido diseñado para que disfrutes al máximo de Montserrat
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        {[
                            { time: '09:00', desc: 'Recogida en Barcelona (hotel o dirección indicada)' },
                            { time: '10:00', desc: 'Llegada a Montserrat y visita al Monasterio' },
                            { time: '11:30', desc: 'Escucha de la Escolanía (coro de niños) - según disponibilidad' },
                            { time: '12:30', desc: 'Tiempo libre para explorar, tiendas y miradores' },
                            { time: '14:00', desc: 'Regreso a Barcelona' },
                            { time: '15:00', desc: 'Llegada estimada a Barcelona' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 md:gap-8 py-5 border-b border-gray-200 last:border-b-0">
                                <span className="text-xl md:text-2xl font-bold text-slate-900 w-20 flex-shrink-0">
                                    {item.time}
                                </span>
                                <p className="text-gray-600 text-base md:text-lg">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS SECTION ===== */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4 md:px-16 lg:px-[70px]">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
                        Lo que dicen nuestros clientes
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            {
                                text: '"Experiencia increíble. El conductor fue muy amable y conocía todos los rincones de Montserrat."',
                                name: 'María G.',
                                stars: 5
                            },
                            {
                                text: '"Perfect tour! The driver spoke excellent English and the views were breathtaking."',
                                name: 'John S.',
                                stars: 5
                            },
                            {
                                text: '"Très professionnel. Je recommande vivement ce tour pour découvrir Montserrat."',
                                name: 'Pierre L.',
                                stars: 5
                            }
                        ].map((review, i) => (
                            <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(review.stars)].map((_, j) => (
                                        <Star key={j} size={18} className="text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    {review.text}
                                </p>
                                <p className="font-bold text-slate-900">{review.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA FOOTER SECTION ===== */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <img 
                        src="/img/Sagrada-familia-02.webp" 
                        alt="Montserrat" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#030213]/90" />
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        ¿Listo para descubrir Montserrat?
                    </h2>
                    <p className="text-white/70 max-w-xl mx-auto mb-8">
                        Reserva tu tour privado hoy y vive una experiencia única en la montaña sagrada de Cataluña.
                    </p>
                    <button 
                        onClick={handleCall}
                        className="inline-flex items-center gap-3 bg-[#030213] hover:bg-black text-white px-8 py-4 rounded-xl font-bold text-lg border border-white/20 transition-all"
                    >
                        <Phone size={20} />
                        Llamar para Reservar: 933 000 000
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ToursPage;
