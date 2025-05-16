"""
This file defines the data schemas for the FastAPI application.

- `Point`: Represents a geographic point with latitude and longitude.
- `ProcessRequest`: Represents a request to process a list of points.
- `ProcessResponse`: Represents a response that contains the centroid and bounds of a set of points.
"""
from typing import List
from pydantic import BaseModel, Field, validator

class Point(BaseModel):
    lat: float = Field(..., ge=-90, le=90, description="Latitude of the point")
    lng: float = Field(..., ge=-180, le=180, description="Longitude of the point")

class ProcessRequest(BaseModel):
    points: List[Point] = Field(..., min_length=1, description="List of points to process")

    @validator('points')
    def points_must_not_be_empty(cls, v):
        if not v:
            raise ValueError('The list of points cannot be empty')
        return v

class Centroid(BaseModel):
    lat: float
    lng: float

class Bounds(BaseModel):
    north: float
    south: float
    east: float
    west: float

class ProcessResponse(BaseModel):
    centroid: Centroid
    bounds: Bounds 