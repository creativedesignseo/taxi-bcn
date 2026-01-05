# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

