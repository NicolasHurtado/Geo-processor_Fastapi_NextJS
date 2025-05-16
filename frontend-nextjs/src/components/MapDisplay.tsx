'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Rectangle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression, LatLngBoundsExpression } from 'leaflet';
import { ProcessResponse } from '../types/geo';

// Arreglo para el icono por defecto de Leaflet que a veces no se carga
// delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapDisplayProps {
  data: ProcessResponse | null;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
        <p className="text-gray-500">The Map will be shown here when there are results.</p>
      </div>
    );
  }

  const centroidPosition: LatLngExpression = [data.centroid.lat, data.centroid.lng];
  const boundsExpression: LatLngBoundsExpression = [
    [data.bounds.south, data.bounds.west],
    [data.bounds.north, data.bounds.east],
  ];

  // Key to force the re-rendering of the MapContainer when the data changes
  const mapKey = data ? `${data.centroid.lat}-${data.centroid.lng}` : 'no-data';

  return (
    <MapContainer 
        key={mapKey} // Important to update the map
        center={centroidPosition} 
        zoom={6} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={centroidPosition}>
        <Tooltip>Centroid: ({data.centroid.lat.toFixed(4)}, {data.centroid.lng.toFixed(4)})</Tooltip>
      </Marker>
      <Rectangle bounds={boundsExpression} pathOptions={{ color: 'blue' }}>
        <Tooltip>Bounds</Tooltip>
      </Rectangle>
    </MapContainer>
  );
};

export default MapDisplay; 