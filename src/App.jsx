import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Star,
  Zap,
  Menu,
  X
} from 'lucide-react';

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('book'); // book | rates | fleet

  // Datos del formulario de reserva rápida
  const [bookingData, setBookingData] = useState({
    origin: '',
    destination: '',
    pickupTime: 'Ahora mismo'
  });

  // Número de la empresa
  const PHONE_NUMBER = "34625030000";
  const PHONE_DISPLAY = "+34 625 03 00 00";

  // Efecto para la barra de navegación al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función inteligente para construir el mensaje de WhatsApp
  const handleWhatsAppBooking = (e) => {
    if (e) e.preventDefault();

    const origin = bookingData.origin || "Mi ubicación actual";
    const dest = bookingData.destination || "A consultar";
    const time = bookingData.pickupTime;

    const text = `Hola, quiero pedir un taxi.%0A🚖 *Origen:* ${origin}%0A📍 *Destino:* ${dest}%0A⏰ *Hora:* ${time}`;

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen selection:bg-yellow-400 selection:text-black">

      {/* --- NAVIGATION --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <span className="text-2xl font-bold text-black">T</span>
            </div>
            <span className={`text-xl font-bold tracking-tighter ${isScrolled ? 'text-white' : 'text-white'}`}>
              TAXI<span className="text-yellow-400">BCN</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => window.scrollTo(0, 0)} className="text-white hover:text-yellow-400 font-medium transition-colors">Inicio</button>
            <button onClick={() => document.getElementById('servicios').scrollIntoView()} className="text-white hover:text-yellow-400 font-medium transition-colors">Servicios</button>
            <button onClick={() => document.getElementById('tarifas').scrollIntoView()} className="text-white hover:text-yellow-400 font-medium transition-colors">Tarifas</button>
            <button
              onClick={handleCall}
              className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-all flex items-center gap-2"
            >
              <Phone size={18} />
              {PHONE_DISPLAY}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 flex flex-col gap-6 md:hidden">
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-white border-b border-gray-800 pb-4">Inicio</a>
          <a href="#servicios" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-white border-b border-gray-800 pb-4">Servicios</a>
          <a href="#tarifas" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-white border-b border-gray-800 pb-4">Tarifas</a>
          <button onClick={handleCall} className="mt-4 w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
            <Phone /> Llamar Ahora
          </button>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Background Images with Effects */}
        <div className="absolute inset-0 z-0">
          {/* Mobile Image */}
          <div
            className="absolute inset-0 bg-cover bg-center md:hidden"
            style={{ backgroundImage: "url('/img/hero-mobile.jpg')" }}
          ></div>
          {/* Desktop Image */}
          <div
            className="absolute inset-0 bg-cover bg-center hidden md:block"
            style={{ backgroundImage: "url('/img/hero-desktop.jpg')" }}
          ></div>

          {/* Overlay and Blur Effect for Harmony */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

          {/* Subtle Glows (kept for premium feel) */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[150px]"></div>
        </div>


        <div className="container mx-auto px-4 z-10 relative mt-16 md:mt-0">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Text Content */}
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 text-sm font-semibold animate-fade-in-up">
                <Zap size={14} className="fill-yellow-400" />
                El taxi más rápido de Barcelona
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                Muévete por <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Barcelona</span> sin esperas.
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto md:mx-0">
                Servicio premium 24/7. Aeropuerto, Puerto y larga distancia.
                Reservas instantáneas vía WhatsApp prioritario.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <button
                  onClick={handleWhatsAppBooking}
                  className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 group"
                >
                  <MessageCircle className="group-hover:scale-110 transition-transform" />
                  Pedir por WhatsApp
                </button>
                <button
                  onClick={handleCall}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={20} />
                  Llamar
                </button>
              </div>
            </div>

            {/* Fast Booking Card (Simulated App UI) */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-transparent"></div>

              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="text-yellow-400" /> Reserva Express
              </h3>

              <div className="space-y-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400">
                    <MapPin size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="¿Dónde te recogemos?"
                    className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none"
                    value={bookingData.origin}
                    onChange={(e) => setBookingData({ ...bookingData, origin: e.target.value })}
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-[1.15rem] -top-4 h-4 w-0.5 bg-gray-700/50"></div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                    <MapPin size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Destino (Opcional)"
                    className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none"
                    value={bookingData.destination}
                    onChange={(e) => setBookingData({ ...bookingData, destination: e.target.value })}
                  />
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                    <Clock size={16} />
                  </div>
                  <select
                    className="bg-transparent w-full text-white focus:outline-none appearance-none cursor-pointer"
                    value={bookingData.pickupTime}
                    onChange={(e) => setBookingData({ ...bookingData, pickupTime: e.target.value })}
                  >
                    <option className="bg-slate-900 text-white" value="Ahora mismo">Lo antes posible (Ahora)</option>
                    <option className="bg-slate-900 text-white" value="En 15 minutos">En 15 minutos</option>
                    <option className="bg-slate-900 text-white" value="En 30 minutos">En 30 minutos</option>
                    <option className="bg-slate-900 text-white" value="Programar más tarde">Programar para más tarde</option>
                  </select>
                </div>

                <button
                  onClick={handleWhatsAppBooking}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl mt-4 transition-all hover:scale-[1.02] flex justify-center items-center gap-2 text-lg shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                >
                  Solicitar Taxi <ChevronRight size={20} />
                </button>
                <p className="text-center text-gray-500 text-xs mt-2">
                  Tiempo de respuesta medio: 2 minutos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-yellow-400 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* --- SERVICES / FEATURES --- */}
      <section id="servicios" className="py-20 px-4 bg-white relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Más que un simple trayecto</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Redefinimos la experiencia del taxi en Barcelona combinando tecnología, confort y profesionalidad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap size={32} />,
                title: "Inmediatez",
                desc: "Sin esperas innecesarias. Nuestra flota está distribuida estratégicamente por toda el área metropolitana de Barcelona."
              },
              {
                icon: <ShieldCheck size={32} />,
                title: "Seguridad Total",
                desc: "Vehículos higienizados, conductores profesionales certificados y trazabilidad del viaje en tiempo real."
              },
              {
                icon: <CreditCard size={32} />,
                title: "Pago Flexible",
                desc: "Paga como quieras: Efectivo, Tarjeta, Bizum o Contactless. Sin sorpresas ni costes ocultos."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl hover:shadow-xl transition-shadow border border-slate-100 group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-yellow-500 shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ESTIMATED RATES --- */}
      <section id="tarifas" className="py-20 px-4 bg-slate-900 text-white">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-800 pb-8 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">Destinos Frecuentes</h2>
              <p className="text-gray-400">Precios aproximados desde el centro de Barcelona.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-full bg-white text-black font-semibold text-sm">Tarifa 1 (Día)</button>
              <button className="px-4 py-2 rounded-full border border-gray-700 text-gray-400 font-semibold text-sm">Tarifa 2 (Noche/Finde)</button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { dest: "Aeropuerto T1/T2", price: "35€ - 40€", time: "25 min" },
              { dest: "Puerto Cruceros", price: "20€ - 25€", time: "15 min" },
              { dest: "Estación Sants", price: "15€ - 20€", time: "12 min" },
              { dest: "Park Güell", price: "22€ - 28€", time: "20 min" },
            ].map((route, idx) => (
              <div key={idx} className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 hover:border-yellow-400/50 transition-colors cursor-default">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-yellow-400/10 p-2 rounded-lg">
                    <MapPin className="text-yellow-400" size={20} />
                  </div>
                  <span className="text-xs font-mono text-gray-400 bg-black/30 px-2 py-1 rounded">~{route.time}</span>
                </div>
                <h4 className="font-bold text-lg mb-1">{route.dest}</h4>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{route.price}</p>
                <p className="text-xs text-gray-500 mt-2">*Precio estimado sujeto a tráfico</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- REVIEWS / SOCIAL PROOF --- */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="text-yellow-400 fill-yellow-400" size={24} />)}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8">"El mejor servicio de taxi que he usado en Barcelona. Rápido, limpio y el conductor súper amable."</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
              <img src="/img/Cliente.png" alt="User" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-900">Marc G.</p>
              <p className="text-sm text-gray-500">Cliente verificado</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold tracking-tighter mb-4 block">
              TAXI<span className="text-yellow-400">BCN</span>
            </span>
            <p className="text-gray-500 max-w-xs">
              Servicio oficial de taxi en el Área Metropolitana de Barcelona. Licencias oficiales y tarifas reguladas.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-yellow-400 cursor-pointer transition-colors" onClick={handleCall}>{PHONE_DISPLAY}</li>
              <li>info@taxibcn.com</li>
              <li>Barcelona, España</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer">Aviso Legal</li>
              <li className="hover:text-white cursor-pointer">Política de Privacidad</li>
              <li className="hover:text-white cursor-pointer">Cookies</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-900 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Taxi BCN Service. Todos los derechos reservados.
        </div>
      </footer>

      {/* --- STICKY MOBILE ACTION BAR --- */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden flex gap-3">
        <button
          onClick={handleCall}
          className="flex-1 bg-black text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 border border-gray-800"
        >
          <Phone size={20} /> Llamar
        </button>
        <button
          onClick={handleWhatsAppBooking}
          className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} /> WhatsApp
        </button>
      </div>

    </div>
  );
};

export default App;
