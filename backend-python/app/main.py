import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from .routers import process

# Basic logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

app = FastAPI(
    title="Geo-Processor Service",
    description="A service to process geographic coordinates and calculate bounds and centroids.",
    version="0.1.0"
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Custom handler for RequestValidationError from Pydantic.
    Returns a HTTP 400 Bad Request with the error details.
    """
    # You can customize how errors are displayed if you want.
    # By default, exc.errors() returns a list of dictionaries with details.
    # FastAPI already structures them well in the JSONResponse of 422.
    # Here we simply re-send the details but with code 400.
    error_messages = []
    for error in exc.errors():
        field = " -> ".join(str(loc) for loc in error["loc"])
        message = error["msg"]
        error_messages.append(f"field: '{field}', Error: {message}")
    
    # Logging the error can also be useful
    logger = logging.getLogger(__name__)
    client_host = request.client.host if request.client else "Unknown"
    request_body = await request.body()
    logger.warning(f"Validation error (400): {error_messages} - From: {client_host} - Payload: {request_body.decode('utf-8', errors='replace')}")
    
    return JSONResponse(
        status_code=400,
        content={"detail": exc.errors(), "message": "Validation error in the input. Please check the data sent."}
        # Alternatively, you could use: content={"detail": error_messages}
    )

app.include_router(process.router)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Geo-Processor Service"} 