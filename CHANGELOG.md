# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-01-05

### UI/UX Polish
- **Layout Precision**: Changed Hero section alignment from `items-center` to `items-start` with fixed top padding (`pt-28/pt-40`) to eliminate dynamic gaps and provide consistent positioning across devices.
- **Mobile Refining**: Removed bottom "dead space" by setting mobile height to `auto` instead of `min-h-screen`, allowing the footer buttons to sit naturally below the content.

## [1.4.9] - 2026-01-05

### UI Polish
- **Mobile Experience**: Reduced the top margin of the Home Booking Form to `16px` (`mt-4`) to bring it visually closer to the header, making it the primary focal point.
- **Visual Stability**: Applied `min-h-screen` to the Booking Form container to ensure a "solid" background without gaps.
- **Stacking Logic**: Added `z-index: 50` to the global Footer to ensure it properly covers the fixed map at the bottom of the scroll.

## [1.4.8] - 2026-01-05

### UI Polish
- **Mobile Experience**: Extended the Booking Form height to `min-h-screen` to prevent background gaps (map appearing) when scrolling to the very bottom on taller mobile screens.

## [1.4.7] - 2026-01-05

### UI/UX
- **Focus Mode**: Automatically hides the global Navbar and floating Action Buttons (WhatsApp/Call) when on the `/reservar` page to prevent distractions and overlapping elements.

## [1.4.6] - 2026-01-05

### UX Improvements
- **Mobile Layout**: Implemented "Bottom Sheet" effect. The Map is now fixed in the background, and the Booking Form slides over it naturally on scroll, providing a native app-like experience.

## [1.4.5] - 2026-01-05

### Fixed
- **UI Geometry**: Enforced proper aspect ratio on the Back button using `aspect-square` and `flex-none` to prevent distortion on wider screens/containers.

## [1.4.4] - 2026-01-05

### UI/UX
- **Back Button**: Refined design to be a larger, perfect circle (`48px`) with shadow and border, improving visibility and hit area.

## [1.4.3] - 2026-01-05

### Fixed
- **Map Loading**: Solved race condition where map would sometimes fail to center. Implemented robust `onLoad` handler to guarantee perfect route visibility.
- **UX**: Enabled Pan/Zoom interactions on the confirmation map as requested.

## [1.4.2] - 2026-01-05

### Improved
- **Map Visualization**: Enhanced centering logic in `RouteMap` to fit the *entire* route path (polyline) rather than just start/end points.
- **Translations**: Externalized hardcoded strings ("Pax", "Maletas", "Inmediato") to locale files for full English/Spanish support.

## [1.4.1] - 2026-01-05

### Fixed
- **WhatsApp Button**: Fixed crash caused by data structure mismatch (`coords` vs `coordinates`).
- **Back Button**: Improved logic to use `history.back()` and fixed z-index layering issues for better responsiveness.
- **Interactions**: Added visual feedback and error logging for easier debugging.

## [1.4.0] - 2026-01-05

### Added
- **Uber-Style Booking Flow**: Implemented a new multi-step booking experience.
- **Dedicated Confirmation Page**: Created `/reservar` page with split layout (Desktop) and stacked layout (Mobile).
- **Route Visualization**: Integrated static Mapbox map to display trip route (Origin to Destination).

### Changed
- **Navigation**: "Confirmar Ruta" button now redirects to the dedicated confirmation page instead of opening a modal.
- **Cleanup**: Removed legacy `BookingModal` component.

## [1.3.8] - 2026-01-05

### Changed
- **Booking Form UI**: Complete redesign to "Light Mode" with "Uber-style" inputs (High Contrast Black/White).
- **Scheduling Workflow**: Implemented "Pickup Now" pill button and a dedicated Schedule Modal for better UX.
- **Input Styling**: Standardized Date, Time, Origin, Destination, Passengers, and Luggage inputs with consistent floating labels and monochrome aesthetics.
- **Calendar**: Refined CustomDatePicker styles (removed double borders/shadows, reduced padding) for a cleaner, flatter look.

## [1.3.7] - 2026-01-05

### Changed
- **Mobile UI (Prefix Selector)**: Optimized width to `100px` to balance flag visibility and phone number space. Reduced internal padding (`py-2`, `pl-2`) for a compact look.

## [1.3.6] - 2026-01-05

### Changed
- **Mobile UI (Prefix Selector)**: Increased width to `140px` and disabled shrinking (`flex-shrink-0`) to prevent layout compression. Reduced internal padding (`py-2`, `pl-2`) for a more compact and cleaner look.
- **Mobile UI (Calendar)**: Reduced container padding (`p-6` -> `p-3`) to maximize horizontal space, giving the days grid more room ("more air") as requested.

## [1.3.5] - 2026-01-05

### Changed
- **Mapbox API Upgrade**: Migrated from legacy Geocoding API to **Mapbox Search Box API** (Standard 2026).
  - Implemented `v1/suggest` for intelligent autocomplete with better POI recognition (e.g., "Sants Estació").
  - Implemented `v1/retrieve` for precise coordinate fetching.
  - Added **Session Tokens** (UUID) for API usage optimization.
  - configured `proximity` to Barcelona center (`2.1734, 41.3851`) to prioritize local results globally.

## [1.3.4] - 2026-01-05

### Added
- **International Phone Support**: Implemented a comprehensive country code selector supporting 35+ countries.
- **Auto-Detection**: Added logic to automatically detect the user's country based on browser locale (`navigator.language`) and pre-select the correct dialing prefix.
- **Validation**: Updated phone validation regex to accept international numbers (6-15 digits).
- **Countries Library**: Created `src/lib/countries.js` with metadata (flags, codes) for major countries.

## [1.3.3] - 2026-01-05

### Fixed
- **Z-Index Overlap**: Solved critical UI bug where Origin/Destination inputs were covering the DatePicker. Applied dynamic z-index `z-[60]` to active calendar container.
- **Form Layout**: Fixed container stacking context to ensure DatePicker floats above all subsequent fields.

### Changed
- **Input UX**: Replaced `+/-` counters with native **Dropdown Selectors** (`<select>`) for Passengers and Luggage, enabling faster input (matching Time selector style).
- **Passengers**: Increased maximum passenger limit from 8 to **15**.
- **Simplification**: Removed **Transfer Type** (Simple/Ida y Vuelta) functionality from Form, Booking Modal, and WhatsApp message as requested.

## [1.3.2] - 2026-01-05

### Changed
- **Desktop UI**: Split DatePicker behavior.
  - **Mobile**: Remains a centered Modal with dark background.
  - **Desktop**: Now uses a **Popover** (Dropdown) positioned relative to the input, with **no dark background**, matching the requested clean style.

## [1.3.1] - 2026-01-05

### Fixed
- **Mobile UI**: Fixed "cramped" look by reducing internal padding in form inputs.
- **Date Display**: Added `whitespace-nowrap` to prevent date text from breaking into two lines on small screens.
- **Calendar UX**: Changed DatePicker to a **Centered Modal** on mobile to ensure full visibility and prevent clipping.

## [1.3.0] - 2026-01-05

### Added
- **Booking Form Redesign**: Completely new layout with specific fields for Date, Time, Passengers, Luggage, and Transfer Type.
- **Custom DatePicker**: Bespoke "Clean White" calendar component with circular selection styles.
- **Smart Time Logic**: Strict future-only time filtering with 15-minute buffer and live refresh on interaction.
- **ErrorBoundary**: Added global crash handler for better debugging.

### Fixed
- **Timezone Bug**: Fixed date logic to use local time instead of UTC, preventing "yesterday" errors.
- **Crash Fixes**: Resolved ReferenceErrors and circular dependencies in form state.

## [1.2.5] - 2026-01-05

### Fixed
- **Translations**: Externalized hardcoded Booking Form strings to locale files (`es.json`, `en.json`) enabling full bilingual support for labels and placeholders.
- **UX**: Improved "My Location" display by accepting broader address types (neighborhoods, localities) to prevent showing raw coordinates when a specific street number is missing.

## [1.2.4] - 2026-01-05

### Fixed
- **Geolocation**: Fixed "My Location" button functionality by correcting coordinate order sent to Mapbox (Longitude, Latitude).
- **Logic**: Implemented dedicated `reverseGeocode` function to handle location-to-address conversion reliably.
- **Stability**: Restored full integrity of `BookingForm.jsx` after component structure issues.

## [1.2.3] - 2026-01-05

### Fixed
- **Runtime Error**: Removed unused `mapbox-gl` import in `src/lib/mapbox.js` which was causing crashes after the removal of the map component.

## [1.2.2] - 2026-01-05

### Fixed
- **Autocomplete Stacking**: Fixed Z-index issue where destination input container was overlapping the origin autocomplete dropdown. Implemented dynamic Z-index updates on focus.

## [1.2.1] - 2026-01-05

### Fixed
- **Dropdown Visibility**: Fixed issue where autocomplete suggestions were hidden due to container overflow clipping.

## [1.2.0] - 2026-01-05

### Optimized
- **Mobile First Experience**: Complete overhaul of booking flow for mobile users
  - **Hero Section**: Simplified simplified layout, shorter titles, and hidden functionality buttons on mobile
  - **Booking Form**: Optimized layout removing map visualization to focus on quick data entry
  - **Spacing**: Drastically reduced vertical gaps (from ~96px to ~32px) for immediate visibility of the form
- **Performance**: Removed `react-map-gl` visualization component from BookingForm (~80 lines less code)

### Changed
- **Map Removal**: visual map removed from BookingForm (backend logic preserved for geocoding/directions)
- **UI Adjustments**: 
  - Form now centered and occupies full right column on desktop
  - Sticky buttons (WhatsApp/Call) are the primary mobile Call-to-Actions
  - "Reserva Express" styling improved with larger text and icons

## [Unreleased]


## [1.1.0] - 2026-01-04

### Added
- **Booking Modal** (`BookingModal.jsx`): Premium dark-themed modal for booking confirmation
  - Guest checkout form with name and phone validation using `react-hook-form`
  - Visual route summary with origin, destination, time, and price
  - WhatsApp integration button for instant booking
  - Glassmorphism design with smooth animations
  - Login option placeholder for future Supabase Auth integration
- **WhatsApp Utilities** (`lib/whatsapp.js`):
  - `generateWhatsAppLink()`: Creates `wa.me` deep links with pre-filled booking details
  - `getCurrentLocation()`: Browser geolocation API wrapper for future "My Location" feature
- **Internationalization**: Added booking modal translations for Spanish and English (`booking.modal.*`)

### Changed
- **BookingForm Component**: Integrated modal trigger on "Confirmar Ruta" button click
- **Booking Flow**: User now sees confirmation modal before sending WhatsApp message with all booking details pre-filled

### Technical
- Environment variables properly configured for Mapbox and Supabase
- Form validation with Spanish phone number format (9 digits, optional +34 prefix)
- Direct WhatsApp messaging to +34 625 03 00 00

## [1.0.1] - 2026-01-04

### Perf
- Optimized usage of images by switching to `.webp` format in Hero section and Language Switcher.
- Improved application performance by refactoring `MobileLink` component to avoid re-declaration on every render.
- Cleaned up project files by removing redundant backups (`App.jsx.backup`).

