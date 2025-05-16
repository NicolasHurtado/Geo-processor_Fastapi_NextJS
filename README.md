# Geo-Processor Microservice Ecosystem

This project implements a microservice ecosystem designed to process sets of geographical coordinates. The system calculates the boundaries (North, South, East, West) and the centroid of these points, then allows their visualization on a web interface.

![image](https://github.com/user-attachments/assets/0a642f54-9ce3-46ef-87da-1153ab5d9aa1)


## System Architecture

The system follows a distributed microservice architecture, orchestrated with Docker Compose, and consists of the following main components:

1.  **Frontend (Next.js)**: An interactive web application built with Next.js and React. It allows users to input geographical coordinates, send the processing request, and visualize the results (centroid and boundaries) on an interactive map (Leaflet). It communicates with the API Gateway (NestJS).
2.  **API Gateway (NestJS)**: An intermediate service developed in NestJS. It acts as a gateway, receiving requests from the frontend. It handles input data validation, implements a caching system to optimize responses for repeated requests, and communicates with the Python backend service to perform geospatial calculations.
3.  **Processing Backend (Python/FastAPI)**: A microservice in Python using FastAPI. It contains the main logic for geospatial calculations. It receives validated coordinates from the API Gateway, calculates the centroid and boundaries, and returns the result.

The typical flow of a request is: `User -> Frontend (Next.js) -> API Gateway (NestJS) -> Backend (Python)`.

## Technologies Used

-   **Frontend**:
    -   Next.js (React Framework)
    -   TypeScript
    -   Tailwind CSS
    -   React Leaflet (for map visualization)
-   **API Gateway**:
    -   NestJS (Node.js Framework)
    -   TypeScript
    -   Class Validator & Class Transformer (for DTOs and validation)
    -   Cache Manager (for in-memory caching)
    -   Axios (for HTTP communication with the backend)
-   **Processing Backend**:
    -   Python 3.11
    -   FastAPI (Modern Python web framework)
    -   Pydantic (for data validation)
    -   Poetry (for dependency management)
-   **Containerization and Orchestration**:
    -   Docker
    -   Docker Compose
-   **Code Quality and Testing Tools**:
    -   ESLint, Prettier (for JavaScript/TypeScript)
    -   Ruff, MyPy, Pytest, Pytest-Cov (for Python)
    -   Jest (for tests in NestJS)
    -   Playwright (for E2E tests in Next.js)

## Prerequisites

Ensure you have the following programs installed on your system:
-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## Environment Configuration

Some services use environment variables for their configuration. These are managed through `.env` files located in their respective directories:
-   `api-nestjs/.env`: Configures the Python service URL and the API port.
-   `frontend-nextjs/.env`: Configures the NestJS API URL.

These files are already present in the repository with default configurations for the local Docker environment. If you need to make changes (e.g., for a different deployment), you can modify these files.

## How to Run the Ecosystem

1.  **Clone the repository** (if you haven't already).
2.  **Navigate to the project root**.
3.  **Build and start the services** using Docker Compose:
    ```bash
    docker-compose up --build -d
    ```
    The `-d` flag runs the containers in the background (detached mode).

4.  **To view the logs** of all services in real-time:
    ```bash
    docker-compose logs -f
    ```
    Or for a specific service (e.g., `api-nestjs`):
    ```bash
    docker-compose logs -f api-nestjs
    ```

5.  **To stop all services**:
    ```bash
    docker-compose down
    ```
    If you also want to remove volumes (this would delete cached data if stored in persistent volumes, although this project primarily uses in-memory cache):
    ```bash
    docker-compose down -v
    ```

## Accessing Services

Once the containers are running, you can access the services through the following ports on your local machine:

-   **Frontend (Next.js)**: `http://localhost:3000`
-   **API Gateway (NestJS)**: `http://localhost:3001`
    -   Main endpoint: `POST /geo/process`
-   **Backend (Python/FastAPI)**: `http://localhost:8000`
    -   Main endpoint: `POST /process`
    -   Root (to check status): `GET /`

## Development and Testing

### Hot Reloading
The `backend-python`, `api-nestjs`, and `frontend-nextjs` services are configured with volumes in `docker-compose.yml` that map local source code directories to the containers. This enables hot-reloading (automatic updates) when you make changes to the code, facilitating development.

### Linters and Formatters
To run linters and check code quality for each service (ensure containers are running):

-   **Backend Python (Ruff for linting, MyPy for types)**:
    ```bash
    docker-compose exec backend-python poetry run ruff check .
    docker-compose exec backend-python poetry run ruff format --check .
    docker-compose exec backend-python poetry run mypy .
    ```
-   **API NestJS (ESLint)**:
    ```bash
    docker-compose exec api-nestjs npm run lint
    ```
-   **Frontend Next.js (ESLint)**:
    ```bash
    docker-compose exec frontend-nextjs npm run lint
    ```

### Tests
To run tests for each service:

-   **Backend Python (Pytest)**:
    ```bash
    docker-compose exec backend-python poetry run pytest
    ```
    To view the coverage report:
    ```bash
    docker-compose exec backend-python poetry run pytest --cov=.
    ```
-   **API NestJS (Jest)**:
    -   Unit tests:
        ```bash
        docker-compose exec api-nestjs npm run test
        ```
    -   End-to-End (E2E) tests:
        ```bash
        docker-compose exec api-nestjs npm run test:e2e
        ```
-   **Frontend Next.js (Playwright)**:
        -   End-to-End (E2E) tests (ensure frontend and all backend services are running):
            ```bash
            docker-compose exec frontend-nextjs npm run test:e2e
            ```
        -   Then open ./frontend-nextjs/playwright-report/index.html
            ```

## Project Structure

```
geo-processor/
├── backend-python/     # FastAPI service (calculations)
│   ├── app/
│   ├── tests/
│   ├── pyproject.toml
│   └── Dockerfile
├── api-nestjs/         # NestJS API Gateway (validation, caching, orchestration)
│   ├── src/
│   ├── test/
│   ├── package.json
│   └── Dockerfile
├── frontend-nextjs/    # Next.js application (UI, user interaction)
│   ├── src/
    ├── tests/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml  # Orchestration of all services
└── README.md           # This file
```

## 📞 Contact

For any inquiries about the project, contact us at [nicolashurtado0712@gmail.com](mailto:nicolashurtado0712@gmail.com).

---

Developed with ❤️ by Nicolas Hurtado
