import React from 'react';
import { ProcessResponse } from '../types/geo';

interface ResultsDisplayProps {
  result: ProcessResponse | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  if (!result) {
    return null;
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Results:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
        <div>
          <h3 className="text-lg font-medium mb-1 text-cyan-500">Centroid:</h3>
          <p>Latitude: {result.centroid.lat.toFixed(4)}</p>
          <p>Longitude: {result.centroid.lng.toFixed(4)}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-1 text-cyan-500">Bounds:</h3>
          <p>North: {result.bounds.north.toFixed(4)}</p>
          <p>South: {result.bounds.south.toFixed(4)}</p>
          <p>East: {result.bounds.east.toFixed(4)}</p>
          <p>West: {result.bounds.west.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay; 