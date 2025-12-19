# 🚀 PROYECTO TAXI MOVIT - BITÁCORA DE DESARROLLO

## ⚠️ REGLAS DE ORO (LEER ANTES DE CADA SESIÓN)

### 1. GESTIÓN DE IMÁGENES Y ASSETS 📸
**¡CRÍTICO!** Cada vez que el usuario suba, mencione o pida usar una nueva imagen (ej: `Fira.jpg`, `NuevaFoto.png`):
1. Verificar si el archivo existe en `public/img`.
2. **SIEMPRE** ejecutar explícitamente: `git add public/img/NombreFoto.jpg`
3. Hacerlo ANTES o DURANTE el commit del código que usa la imagen.
*Razón: Si no se hace, la imagen funciona en local pero rompe la web en Netlify.*

### 2. DESPLIEGUE EN NETLIFY ☁️
- El proyecto usa **React 19** pero algunas librerías (`react-helmet-async`) piden React 18.
- Hemos creado un archivo `.npmrc` en la raíz con `legacy-peer-deps=true`. **NO BORRAR ESTE ARCHIVO**.
- Si falla el build con `ERESOLVE`, verificar que `.npmrc` sigue ahí.

### 3. SEO Y MULTI-IDIOMA 🌍
- El SEO es dinámico usando el componente `SEO.jsx`.
- Los textos están en `src/i18n/locales/es.json` y `en.json`.
- **Importante:** Al usar `useTranslation`, recordar siempre importar `i18n` si vamos a acceder al idioma: `const { t, i18n } = useTranslation();`. Si olvidamos `i18n`, la web se queda en blanco.

### 4. BRANDING
- Nombre oficial: **Taxi Movit**.
- Evitar usar "Taxi BCN" en textos visibles (solo usar como palabra clave SEO si es estrictamente necesario, pero priorizar "Taxi Movit").
