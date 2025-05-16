import React from 'react';
import { Point } from '../types/geo';

interface PointInputRowProps {
  index: number;
  point: Point;
  onPointChange: (index: number, field: keyof Point, value: string) => void;
  onRemovePoint: (index: number) => void;
  isRemoveDisabled: boolean;
}

const PointInputRow: React.FC<PointInputRowProps> = ({
  index,
  point,
  onPointChange,
  onRemovePoint,
  isRemoveDisabled,
}) => {
  return (
    <div className="flex items-center gap-x-3 mb-4 p-3 border border-gray-700 rounded-md">
      <span className="text-gray-400">Point {index + 1}:</span>
      <div className="flex-grow">
        <label htmlFor={`lat-${index}`} className="sr-only">
          Latitude {index + 1}
        </label>
        <input
          type="text"
          id={`lat-${index}`}
          name={`lat-${index}`}
          placeholder="Latitude"
          className="block w-full p-2 text-sm text-gray-100 bg-gray-700 rounded-lg border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-400"
          value={point.lat}
          onChange={(e) => onPointChange(index, 'lat', e.target.value)}
          required
        />
      </div>
      <div className="flex-grow">
        <label htmlFor={`lng-${index}`} className="sr-only">
          Longitude {index + 1}
        </label>
        <input
          type="text"
          id={`lng-${index}`}
          name={`lng-${index}`}
          placeholder="Longitude"
          className="block w-full p-2 text-sm text-gray-100 bg-gray-700 rounded-lg border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-400"
          value={point.lng}
          onChange={(e) => onPointChange(index, 'lng', e.target.value)}
          required
        />
      </div>
      <button
        type="button"
        onClick={() => onRemovePoint(index)}
        disabled={isRemoveDisabled}
        className="p-2 text-red-500 hover:text-red-400 disabled:text-gray-500 disabled:cursor-not-allowed rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
        aria-label={`Remove point ${index + 1}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default PointInputRow; 