// frontend-nextjs/src/types/geo.ts
export interface Point {
  lat: number | string;
  lng: number | string;
}

export interface ProcessRequest {
  points: { lat: number; lng: number }[];
}

export interface Centroid {
  lat: number;
  lng: number;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface ProcessResponse {
  centroid: Centroid;
  bounds: Bounds;
} 