# Top Living Inmobiliaria — DevOps showcase

Public site: **Top Living Inmobiliaria** — a real-estate front-end inspired by
Zillow / Muppy, built as the course project for *Software Development & DevOps*
(IE University · BCSAI · SDDO · 2025).

The repo doubles as a DevOps reference: every concept covered in class is
applied and documented on the live site at [`/devops.html`](devops.html).

---

## Live preview

The `site/` folder is itself the GitHub Pages root. Once published:

| Page | What it shows |
|------|--------------|
| [`index.html`](index.html)       | Landing — featured properties, search, value props |
| [`properties.html`](properties.html) | Filterable catalog with sort + search |
| [`property.html`](property.html) | Property detail + lead form |
| [`about.html`](about.html)       | Company story + team metrics |
| [`devops.html`](devops.html)     | Maps every course concept onto this codebase |
| [`health.html`](health.html)     | Live health & metrics dashboard |
| [`health.json`](health.json)     | Static mirror of the `/health` API response |
| [`metrics.json`](metrics.json)   | Static mirror of `/metrics` output |

---

## Run locally

### 1. Just the front-end (what GitHub Pages serves)

```bash
cd site
python -m http.server 8080
# open http://localhost:8080
```

### 2. The Flask API (backend for the same data)

```bash
cd site
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
flask --app app.main run --port 8000
```

Endpoints:

```
GET  /api/properties            list (filters: op, type, city, q)
GET  /api/properties/<id>       detail
POST /api/leads                 contact form
GET  /health                    status + dependencies
GET  /metrics                   Prometheus exposition format
```

### 3. Full stack with Docker (API + Prometheus + Grafana)

```bash
cd site
docker compose up --build
# API        → http://localhost:8000
# Prometheus → http://localhost:9090
# Grafana    → http://localhost:3000  (anonymous, read-only)
```

---

## Test

```bash
pytest --cov=app --cov-report=term --cov-fail-under=70
```

Coverage gate: **70%**. The CI pipeline fails below that.

---

## Deploy

Pipeline: `.github/workflows/ci.yml`. On every push:

1. **Lint** with `ruff`
2. **Test + coverage** (gate at 70%)
3. **Dependency audit** with `pip-audit`
4. **Build & scan** Docker image with `trivy` (fails on HIGH/CRITICAL)
5. **Deploy**:
   - API → Fly.io (`main` only, `FLY_API_TOKEN` from GH Secrets)
   - Front-end → GitHub Pages (`main` only)

---

## Course concepts → where they live in the repo

| # | Concept                  | File / artifact |
|---|--------------------------|------------------|
| 1 | SDLC (iterative)         | `devops.html`, this README |
| 2 | Git workflow             | `devops.html` § 02 |
| 3 | Architecture (N-tier + hex) | `app/` layout |
| 4 | Design patterns          | `app/repositories/*`, `app/services/*` |
| 5 | Clean code / SOLID       | `app/domain/property.py` (frozen, single-responsibility) |
| 6 | Testing pyramid          | `tests/` |
| 7 | CI/CD                    | `.github/workflows/ci.yml` |
| 8 | Containers               | `Dockerfile`, `docker-compose.yml` |
| 9 | Monitoring               | `/health`, `/metrics`, `prometheus.yml`, `health.html` |
| 10 | Security                | `pip-audit`, `trivy`, non-root `USER`, secrets in GH |
| 11 | Scrum / process         | `devops.html` § 11 |

See [`REPORT.md`](REPORT.md) for the short improvement report.
