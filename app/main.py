"""
Top Living Inmobiliaria — minimal Flask backend.

Demonstrates the DevOps concepts mapped on /devops.html:
  - layered architecture (HTTP → service → repository → domain)
  - /health and /metrics endpoints (Prometheus format)
  - dependency inversion (repo is injected, not imported)

Run locally:
    pip install -r requirements.txt
    flask --app app.main run --port 8000
"""

from __future__ import annotations

import os
import time
from dataclasses import asdict, dataclass
from typing import Iterable

from flask import Flask, jsonify, request

from app.repositories.property_repo import InMemoryPropertyRepo
from app.services.catalog import CatalogService


@dataclass(frozen=True)
class Settings:
    version: str = os.getenv("APP_VERSION", "1.4.2")
    commit:  str = os.getenv("APP_COMMIT",  "a7f12c")
    region:  str = os.getenv("APP_REGION",  "bog-1")
    min_coverage: int = 70


def create_app(repo=None) -> Flask:
    """Application factory — repo is injectable so tests can pass a fake."""
    app = Flask(__name__)
    settings = Settings()
    started = time.time()

    catalog = CatalogService(repo or InMemoryPropertyRepo.seed())

    # --- counters used by /metrics ---
    counters: dict[str, int] = {}

    @app.before_request
    def _count():
        request.environ["t0"] = time.perf_counter()

    @app.after_request
    def _record(resp):
        key = f"{request.path}:{request.method}:{resp.status_code}"
        counters[key] = counters.get(key, 0) + 1
        return resp

    # --- domain endpoints ---
    @app.get("/api/properties")
    def list_properties():
        q = request.args
        items = catalog.search(
            op=q.get("op"),
            type_=q.get("type"),
            city=q.get("city"),
            term=q.get("q"),
        )
        return jsonify([asdict(p) for p in items])

    @app.get("/api/properties/<pid>")
    def get_property(pid: str):
        p = catalog.get(pid)
        if not p:
            return jsonify({"error": "not_found"}), 404
        return jsonify(asdict(p))

    @app.post("/api/leads")
    def create_lead():
        body = request.get_json(silent=True) or {}
        for f in ("name", "email", "phone"):
            if not body.get(f):
                return jsonify({"error": "missing_field", "field": f}), 422
        return jsonify({"id": "L-" + str(int(time.time())), "status": "received"}), 201

    # --- ops endpoints ---
    @app.get("/health")
    def health():
        return jsonify({
            "status":   "healthy",
            "version":  settings.version,
            "commit":   settings.commit,
            "region":   settings.region,
            "uptime_s": int(time.time() - started),
            "deps": {
                "db":    {"status": "up"},
                "cache": {"status": "up"},
                "s3":    {"status": "up"},
                "smtp":  {"status": "up"},
            },
        })

    @app.get("/metrics")
    def metrics():
        lines = [
            "# HELP http_requests_total Total HTTP requests",
            "# TYPE http_requests_total counter",
        ]
        for key, n in counters.items():
            path, method, status = key.split(":")
            lines.append(
                f'http_requests_total{{route="{path}",method="{method}",'
                f'status="{status}"}} {n}'
            )
        return ("\n".join(lines) + "\n", 200, {"Content-Type": "text/plain"})

    return app


app = create_app()
