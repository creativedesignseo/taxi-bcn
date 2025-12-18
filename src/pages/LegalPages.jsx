import React, { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

const LegalLayout = ({ title, children }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="font-sans text-slate-900 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <a href="/" className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-bold mb-8 transition-colors">
                    <ChevronLeft size={20} /> Volver al inicio
                </a>
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 border-b pb-6 border-yellow-400">{title}</h1>
                    <div className="prose prose-slate max-w-none text-gray-600 text-justify space-y-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const LegalNotice = () => (
    <LegalLayout title="Aviso Legal">
        <p>El presente Aviso Legal regula el uso del sitio web <strong>Taxi Movit</strong>. Al acceder y utilizar este sitio web, usted acepta las condiciones descritas a continuación.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-6">1. Identificación del Titular</h3>
        <p>En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa que el titular de este sitio web es:</p>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Nombre Comercial:</strong> Taxi Movit</li>
            <li><strong>Actividad:</strong> Servicios de transporte de viajeros en taxi y vehículos de alquiler con conductor.</li>
            <li><strong>Ubicación:</strong> Barcelona, España.</li>
            <li><strong>Contacto:</strong> A través de los canales habilitados en la web.</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-800 mt-6">2. Objeto</h3>
        <p>El sitio web facilita a los usuarios el acceso a información sobre servicios de taxi y traslados en Barcelona y su Área Metropolitana, así como la posibilidad de contactar para reservar servicios.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-6">3. Condiciones de Uso</h3>
        <p>El usuario se compromete a hacer un uso adecuado y lícito del sitio web y de sus contenidos, de conformidad con la legislación aplicable. Queda prohibido el uso del sitio web para fines ilícitos o lesivos contra Taxi Movit o terceros.</p>
    </LegalLayout>
);

export const PrivacyPolicy = () => (
    <LegalLayout title="Política de Privacidad">
        <p>En <strong>Taxi Movit</strong>, nos comprometemos a proteger su privacidad y a cumplir con la normativa vigente en materia de protección de datos (RGPD y LOPDGDD).</p>

        <h3 className="text-xl font-bold text-slate-800 mt-6">1. Responsable del Tratamiento</h3>
        <p>Taxi Movit, operando en el área metropolitana de Barcelona.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-6">2. Datos que Recopilamos</h3>
        <p>Recopilamos los datos mínimos necesarios para prestar el servicio de transporte solicitado:</p>
        <ul className="list-disc pl-6 space-y-2">
            <li>Datos de contacto (nombre, teléfono) facilitados vía WhatsApp o llamada telefónica.</li>
            <li>Datos de ubicación y destino para la gestión del trayecto.</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-800 mt-6">3. Finalidad del Tratamiento</h3>
        <ul className="list-disc pl-6 space-y-2">
            <li>Gestión de las reservas y prestación del servicio de taxi.</li>
            <li>Atención al cliente y comunicaciones relacionadas con el servicio.</li>
            <li>Cumplimiento de obligaciones legales y fiscales.</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-800 mt-6">4. Destinatarios de los Datos</h3>
        <p>Sus datos no serán cedidos a terceros, salvo obligación legal o cuando sea necesario para la prestación del servicio (ej. conductores asignados).</p>

        <h3 className="text-xl font-bold text-slate-800 mt-6">5. Derechos del Usuario</h3>
        <p>Usted puede ejercer sus derechos de acceso, rectificación, supresión, oposición y limitación del tratamiento contactando con nosotros a través de los medios facilitados en la web.</p>
    </LegalLayout>
);

export const CookiesPolicy = () => (
    <LegalLayout title="Política de Cookies">
        <p>Este sitio web utiliza cookies propias y de terceros para mejorar la experiencia de usuario y analizar el uso del sitio.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-6">1. ¿Qué son las Cookies?</h3>
        <p>Una cookie es un pequeño archivo de texto que se almacena en su navegador cuando visita una página web. Su utilidad es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa página.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-6">2. Tipos de Cookies que utilizamos</h3>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cookies Técnicas:</strong> Son aquellas que permiten la navegación a través de la página web y la utilización de las diferentes opciones o servicios que en ella existen (ej. selección de idioma).</li>
            <li><strong>Cookies de Análisis:</strong> Permiten el seguimiento y análisis del comportamiento de los usuarios para introducir mejoras en función del uso que hacen del servicio.</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-800 mt-6">3. Gestión de Cookies</h3>
        <p>Puede usted permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador (Chrome, Firefox, Safari, Edge).</p>
    </LegalLayout>
);

export default { LegalNotice, PrivacyPolicy, CookiesPolicy };
