import React, { FormEvent } from 'react';
import { Point } from '../types/geo';
import PointInputRow from './PointInputRow';

interface PointsFormProps {
  points: Point[];
  onPointChange: (index: number, field: keyof Point, value: string) => void;
  onAddPoint: () => void;
  onRemovePoint: (index: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  // isRemoveDisabled se calculará dentro del map o se pasará como array
}

const PointsForm: React.FC<PointsFormProps> = ({
  points,
  onPointChange,
  onAddPoint,
  onRemovePoint,
  onSubmit,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit} className="mb-8 p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-300">Geographical Points:</h2>
      {points.map((point, index) => (
        <PointInputRow
          key={index}
          index={index}
          point={point}
          onPointChange={onPointChange}
          onRemovePoint={onRemovePoint}
          isRemoveDisabled={points.length <= 1} // Lógica para deshabilitar el botón
        />
      ))}
      <button
        type="button"
        onClick={onAddPoint}
        className="w-full mb-6 text-cyan-400 hover:text-cyan-300 border border-cyan-500 hover:border-cyan-400 focus:ring-4 focus:outline-none focus:ring-cyan-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-150"
      >
        + Add Point
      </button>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-3 text-center disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-150"
      >
        {isLoading ? 'Processing...' : 'Process Coordinates'}
      </button>
    </form>
  );
};

export default PointsForm; 