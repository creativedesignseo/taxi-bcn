/**
 * Generate WhatsApp link with pre-filled booking information
 * @param {Object} bookingData - Booking details
 * @param {Object} bookingData.origin - Origin location {address, coordinates}
 * @param {Object} bookingData.destination - Destination location {address, coordinates}
 * @param {number} bookingData.timeEstimate - Estimated time in minutes
 * @param {number} bookingData.priceEstimate - Estimated price in euros
 * @param {Object} userData - User information
 * @param {string} userData.name - Customer name
 * @param {string} userData.phone - Customer phone
 * @param {string} [userData.email] - Customer email (optional for guests)
 * @returns {string} WhatsApp deep link
 */
export function generateWhatsAppLink(bookingData, userData) {
  const WHATSAPP_NUMBER = '34625030000';
  
  // Generate Google Maps links with coordinates
  const originLat = bookingData.origin.coordinates[1];
  const originLng = bookingData.origin.coordinates[0];
  const destLat = bookingData.destination.coordinates[1];
  const destLng = bookingData.destination.coordinates[0];
  
  const originMapLink = `https://www.google.com/maps?q=${originLat},${originLng}`;
  const destMapLink = `https://www.google.com/maps?q=${destLat},${destLng}`;
  
  // Get current time in Spain timezone
  const now = new Date();
  const requestTime = now.toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const message = `Hola, quiero reservar un taxi:

*Hora de solicitud:* ${requestTime}

*Origen:* ${bookingData.origin.address}
Ver en mapa: ${originMapLink}

*Destino:* ${bookingData.destination.address}
Ver en mapa: ${destMapLink}

*Tiempo estimado:* ${bookingData.timeEstimate} min

*Datos del cliente:*
Nombre: ${userData.name}
Teléfono: ${userData.phone}${userData.email ? `\nEmail: ${userData.email}` : ''}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Get user's current location using browser Geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
}
