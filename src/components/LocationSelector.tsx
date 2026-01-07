import React from 'react';
import { LOCATIONS } from '../hooks/useProducts';

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
  return (
    <div style={{ 
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e9ecef'
    }}>
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: 'bold', 
        marginBottom: '12px',
        color: '#212529'
      }}>
        지역 선택
      </h3>
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        flexWrap: 'wrap'
      }}>
        {LOCATIONS.map((location) => (
          <button
            key={location.value}
            onClick={() => onLocationChange(location.value)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 'bold',
              border: '1px solid #e9ecef',
              borderRadius: '20px',
              backgroundColor: selectedLocation === location.value ? '#ff6f0f' : '#ffffff',
              color: selectedLocation === location.value ? '#ffffff' : '#4d5159',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {location.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LocationSelector;

