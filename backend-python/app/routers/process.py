from fastapi import APIRouter, HTTPException, Body
import logging
from ..schemas import ProcessRequest, ProcessResponse
from ..services import calculate_bounds_and_centroid

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/process", response_model=ProcessResponse, tags=["GeoProcessing"])
async def process_points(request: ProcessRequest = Body(...)) -> ProcessResponse:
    """
    Processes a list of geographic points to calculate the centroid and bounds.

    - **points**: A list of objects, each with `lat` (latitude) and `lng` (longitude).
    """
    try:
        # Calculate the centroid and bounds of the points
        bounds, centroid = calculate_bounds_and_centroid(request.points)
        return ProcessResponse(centroid=centroid, bounds=bounds)

    except ValueError as ve:
        logger.error(f"Error in process_points: {str(ve)}")
        # This could capture errors from the service layer if Pydantic didn't catch them all,
        # or if there is specific validation logic in the service.
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # General catch for unexpected errors
        # In a production environment, this error should be logged.
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}") 