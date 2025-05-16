'use client'; // Directiva para componentes de cliente en App Router

import { useState, FormEvent } from 'react';
import dynamic from 'next/dynamic'; // Importar dynamic
import { Point, ProcessRequest, ProcessResponse } from '../types/geo'; // Corregido
import PointsForm from '../components/PointsForm';
import ResultsDisplay from '../components/ResultsDisplay';
import ErrorAlert from '../components/ErrorAlert';

// Dynamic loading for the map component
const MapDisplay = dynamic(() => import('../components/MapDisplay'), {
  ssr: false, // Disable SSR for this component
  loading: () => <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center"><p className="text-gray-500">Loading map...</p></div>
});

// Interfaces to type the data, similar to the DTOs of the backend
// Eliminated from here

export default function HomePage() {
  const [points, setPoints] = useState<Point[]>([
    { lat: 40.7128, lng: -74.006 },
    { lat: 34.0522, lng: -118.2437 },
  ]);
  const [result, setResult] = useState<ProcessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePointChange = (index: number, field: keyof Point, value: string) => {
    const newPoints = points.map((point, i) => {
      if (i === index) {
        return { ...point, [field]: value };
      }
      return point;
    });
    setPoints(newPoints);
  };

  const addPoint = () => {
    setPoints([...points, { lat: '', lng: '' }]);
  };

  const removePoint = (index: number) => {
    if (points.length <= 1) {
        setError("Should have at least one point."); // Or not allow to remove the last one
        return;
    }
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
    if (error === "Should have at least one point.") {
        setError(null); // Clean error if now there are enough points
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    // Don't clean the result here to avoid the map disappearing immediately
    // setResult(null);

    const numericPoints = points.map(p => ({
      lat: parseFloat(p.lat as string),
      lng: parseFloat(p.lng as string),
    }));

    if (numericPoints.some(p => isNaN(p.lat) || isNaN(p.lng))) {
      setError('All latitudes and longitudes must be valid numbers.');
      setIsLoading(false);
      setResult(null);
      return;
    }
    if (numericPoints.length === 0) {
        setError('Please add at least one point.');
        setIsLoading(false);
        setResult(null);
        return;
    }

    const payload: ProcessRequest = { points: numericPoints };

    // Use the environment variable for the API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      setError('The API URL is not configured. Please check the environment variables.');
      setIsLoading(false);
      setResult(null);
      return;
    }

    try {
      const response = await fetch(apiUrl, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || `Error: ${response.status} ${response.statusText}`;
        setResult(null);
        throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
      }
      
      setResult(data as ProcessResponse);
    } catch (err: unknown) {
      let message = 'An error occurred while processing the request.';
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'string') {
        message = err;
      } else if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
        message = (err as { message: string }).message;
      }
      setError(message);
      setResult(null);
    }
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-gray-900 text-white">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-400">Geo Processor</h1>

        <PointsForm
          points={points}
          onPointChange={handlePointChange}
          onAddPoint={addPoint}
          onRemovePoint={removePoint}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <ErrorAlert message={error} />
        <ResultsDisplay result={result} />

        <div id="map-container" className="p-6 bg-gray-800 rounded-lg shadow-xl h-96 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400 shrink-0">Map:</h2>
          <div className="flex-grow rounded-lg overflow-hidden">
            <MapDisplay data={result} />
          </div>
        </div>
        </div>
      </main>
  );
}
