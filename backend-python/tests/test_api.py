import pytest
from fastapi.testclient import TestClient
from app.main import app # Asegúrate de que app.main importa tu instancia de FastAPI

@pytest.fixture(scope="module") # scope="module" para que el cliente se cree una vez por módulo de prueba
def client():
    """Fixture to create a TestClient for the FastAPI application."""
    with TestClient(app) as c:
        yield c

# Pruebas para el endpoint raíz
def test_read_root(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Geo-Processor Service"}

# Clase para agrupar pruebas del endpoint /process
class TestProcessEndpoint:
    
    def test_process_points_valid(self, client: TestClient):
        payload = {
            "points": [
                {"lat": 40.7128, "lng": -74.0060},
                {"lat": 34.0522, "lng": -118.2437}
            ]
        }
        response = client.post("/process", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "centroid" in data
        assert "bounds" in data
        assert data["bounds"]["north"] == 40.7128
        assert data["bounds"]["south"] == 34.0522
        assert data["bounds"]["east"] == -74.0060 # Max lng
        assert data["bounds"]["west"] == -118.2437 # Min lng
        assert pytest.approx(data["centroid"]["lat"]) == (40.7128 + 34.0522) / 2
        assert pytest.approx(data["centroid"]["lng"]) == (-74.0060 + -118.2437) / 2

    def test_process_points_empty_list(self, client: TestClient):
        payload = {"points": []}
        response = client.post("/process", json=payload)
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data

    def test_process_points_missing_points_field(self, client: TestClient):
        payload = {}
        response = client.post("/process", json=payload)
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data

    def test_process_points_invalid_lat_lng_type(self, client: TestClient):
        payload = {
            "points": [
                {"lat": "not-a-float", "lng": -74.0060}
            ]
        }
        response = client.post("/process", json=payload)
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data

    def test_process_points_lat_out_of_range(self, client: TestClient):
        payload = {
            "points": [
                {"lat": 91.0, "lng": -74.0060}
            ]
        }
        response = client.post("/process", json=payload)
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data

    def test_process_points_lng_out_of_range(self, client: TestClient):
        payload = {
            "points": [
                {"lat": 40.0, "lng": -181.0}
            ]
        }
        response = client.post("/process", json=payload)
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data 