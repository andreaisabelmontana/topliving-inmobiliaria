"""Integration tests — hit the Flask app via its test client."""

import pytest

from app.main import create_app


@pytest.fixture
def client():
    app = create_app()
    app.testing = True
    return app.test_client()


def test_health_returns_healthy(client):
    r = client.get("/health")
    assert r.status_code == 200
    body = r.get_json()
    assert body["status"] == "healthy"
    assert "version" in body and "uptime_s" in body


def test_list_properties_returns_seed(client):
    r = client.get("/api/properties")
    assert r.status_code == 200
    assert len(r.get_json()) >= 1


def test_filter_properties_by_op(client):
    r = client.get("/api/properties?op=rent")
    assert r.status_code == 200
    assert all(p["op"] == "rent" for p in r.get_json())


def test_get_property_404(client):
    r = client.get("/api/properties/TL-DOESNOTEXIST")
    assert r.status_code == 404


def test_lead_missing_field_returns_422(client):
    r = client.post("/api/leads", json={"name": "x"})
    assert r.status_code == 422


def test_lead_created(client):
    r = client.post("/api/leads", json={
        "name": "Ana", "email": "a@b.com", "phone": "300", "msg": ""
    })
    assert r.status_code == 201
    assert r.get_json()["status"] == "received"


def test_metrics_endpoint_serves_prometheus_format(client):
    client.get("/health")
    r = client.get("/metrics")
    assert r.status_code == 200
    assert b"http_requests_total" in r.data
