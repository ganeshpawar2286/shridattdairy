import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';

export const LocationPickerMap = ({
  village = 'Ingali',
  pincode = '591242',
  latitude = 16.5682,
  longitude = 74.6534,
  onChange
}) => {
  const [lat, setLat] = useState(latitude);
  const [lng, setLng] = useState(longitude);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    setLat(latitude);
    setLng(longitude);
  }, [latitude, longitude]);

  const handleCoordinateChange = (newLat, newLng) => {
    const parsedLat = parseFloat(newLat) || 16.5682;
    const parsedLng = parseFloat(newLng) || 74.6534;
    setLat(parsedLat);
    setLng(parsedLng);
    if (onChange) {
      onChange({ latitude: parsedLat, longitude: parsedLng });
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleCoordinateChange(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          alert('Could not retrieve current location. Please set coordinates manually or choose village.');
        }
      );
    }
  };

  // Google Maps Embed URL or fallback OpenStreetMap / Map Preview
  const mapEmbedUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`
    : `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div style={{
      background: '#f8fafc',
      border: '1.5px solid #cbd5e1',
      borderRadius: '16px',
      padding: '1.2rem',
      marginTop: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={20} style={{ color: '#1b5e20' }} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
            Pin Drop Location ({village} - {pincode})
          </span>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          style={{
            background: '#e8f5e9',
            color: '#1b5e20',
            border: '1px solid #c8e6c9',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <Navigation size={14} /> Detect My Location
        </button>
      </div>

      {/* Map Iframe Embed */}
      <div style={{
        height: '200px',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #cbd5e1',
        position: 'relative',
        background: '#e2e8f0'
      }}>
        <iframe
          title="Delivery Location Map"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={mapEmbedUrl}
          allowFullScreen
        />
      </div>

      {/* Coordinate Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '0.8rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Latitude</label>
          <input
            type="number"
            step="0.0001"
            value={lat}
            onChange={(e) => handleCoordinateChange(e.target.value, lng)}
            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Longitude</label>
          <input
            type="number"
            step="0.0001"
            value={lng}
            onChange={(e) => handleCoordinateChange(lat, e.target.value)}
            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Compass size={13} /> Selected coordinates: <strong>{lat.toFixed(4)}, {lng.toFixed(4)}</strong> (Ingali / Chikkodi Taluka)
      </div>
    </div>
  );
};
