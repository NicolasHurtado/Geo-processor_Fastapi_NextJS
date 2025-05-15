import logging
from typing import List, Tuple
from .schemas import Point, Bounds, Centroid

logger = logging.getLogger(__name__)

def calculate_bounds_and_centroid(points: List[Point]) -> Tuple[Bounds, Centroid]:
    """
    Calculate the geographic bounds (north, south, east, west) and the centroid
    from a list of points.
    """
    logger.info(f"Starting calculation of bounds and centroid for {len(points)} points.")

    if not points:
        logger.error("Attempted to calculate with an empty list of points.")
        raise ValueError("The list of points cannot be empty.")

    min_lat, max_lat = points[0].lat, points[0].lat
    min_lng, max_lng = points[0].lng, points[0].lng

    for i, point in enumerate(points):
        if not isinstance(point.lat, (int, float)) or not isinstance(point.lng, (int, float)):
            logger.error(f"Non-numeric coordinates found in point {i}: lat={point.lat}, lng={point.lng}")
            raise ValueError(f"Coordinates must be numeric. Error in point {i}.")

        min_lat, max_lat = min(min_lat, point.lat), max(max_lat, point.lat)
        min_lng, max_lng = min(min_lng, point.lng), max(max_lng, point.lng)

    bounds : Bounds = Bounds(
        north=max_lat,
        south=min_lat,
        east=max_lng,
        west=min_lng
    )

    sum_lat: float = sum(p.lat for p in points)
    sum_lng: float = sum(p.lng for p in points)

    centroid: Centroid = Centroid(
        lat=sum_lat / len(points),
        lng=sum_lng / len(points)
    )
    logger.info(f"Calculation completed. Bounds: {bounds}, Centroid: {centroid}")
    return bounds, centroid 