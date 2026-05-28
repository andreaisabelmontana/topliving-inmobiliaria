# REPORT — Assignment 2

**Course:** Software Development & DevOps · IE University · BCSAI · SDDO · 2025
**Project:** Top Living Inmobiliaria
**Scope of this report:** what changed between Assignment 1 and Assignment 2.

---

## 1. Code quality and refactoring

Starting from the Assignment 1 prototype (a single Flask file with inline HTML
and a list of dicts), the code was restructured around three boundaries:

```
app/
  domain/          ← Property (pure dataclass, frozen, no I/O)
  repositories/    ← PropertyRepo Protocol + InMemoryPropertyRepo
  services/        ← CatalogService (orchestrates search/sort)
  main.py          ← Flask wiring only — no business logic
```

This removed three classes of smells:

- **Long methods** in the original `index()` view → split into service +
  repository + view.
- **Hard-coded data** scattered across the view → moved to a single seed in
  `InMemoryPropertyRepo.seed()`.
- **Duplication** of price formatting in three templates → single helper
  (`formatPrice` in JS, `Property.price_per_m2` in Python).

SOLID compliance:

- **S** — Property holds *what a property is*, not *how it is searched*.
- **O** — Adding a new property `type` only adds a string to the `Kind`
  literal; the search path is closed for modification.
- **L** — `InMemoryPropertyRepo` is fully substitutable for any future
  `SqliteRepo` because both implement the `PropertyRepo` Protocol.
- **I** — The repo interface exposes only `all()` and `get()`; clients
  don't depend on persistence details.
- **D** — `CatalogService` receives a `PropertyRepo`, not a concrete class.

---

## 2. Testing and coverage

| Layer | File | What it asserts |
|------|------|-----------------|
| Unit (domain) | `tests/test_property.py` | invariants of `Property` (price-per-m², immutability) |
| Unit (service) | `tests/test_catalog.py` | search filters, case-insensitive city, lookup |
| Integration (API) | `tests/test_api.py` | Flask test client hits real routes |

**Coverage:** 87% (gate: 70%). The `pytest --cov-fail-under=70` flag breaks
the pipeline below the threshold. A coverage XML artifact is uploaded by CI
for review on every PR.

---

## 3. CI/CD

Pipeline file: `.github/workflows/ci.yml`. Stages:

```
checkout → ruff → pytest+cov → pip-audit → docker build → trivy → deploy
```

Branch gating: only `main` triggers the `deploy` and `pages` jobs. Pull
requests run everything *up to* deploy.

Secrets in use:

- `FLY_API_TOKEN` — Fly.io deploy token (production environment, requires
  approval in GitHub `environments` settings).
- `GITHUB_TOKEN` — auto-provided, used for `actions/deploy-pages@v4` and
  `ghcr.io` push.

---

## 4. Deployment & containerization

The `Dockerfile` is multi-stage:

- **build** stage installs dependencies into `~/.local`.
- **runtime** stage starts from a slim image and copies only the user-site
  packages and `app/`. The final image runs as user `topliving (uid=1001)`
  and exposes `gunicorn` on `:8000`.

Front-end is published to GitHub Pages directly from this folder (`site/`
acts as the Pages root). The Python API is deployed to Fly.io in `bog-1`.

---

## 5. Monitoring

The Flask app exposes two endpoints used by every observability tool:

- `GET /health` — JSON, includes app version, commit, uptime, and the
  status of dependencies (db / cache / s3 / smtp).
- `GET /metrics` — Prometheus exposition format. Counts every response by
  `(route, method, status)`.

`prometheus.yml` configures a 15s scrape against the API. `docker compose
up` brings up the whole stack (API + Prometheus + Grafana) locally so the
graders can verify end-to-end without external setup.

The live dashboard at [`/health.html`](health.html) renders the same data
the production dashboard would render — uptime, request totals, p50
latency, error count, and a 60-second sparkline.

---

## 6. Improvements summary

| Area | Before (Assignment 1) | After (Assignment 2) |
|------|-----------------------|----------------------|
| Code structure | Single `app.py` | Layered + hexagonal seam |
| Tests | 0 | 3 files, 87% coverage, gated |
| CI/CD | None | 5-stage GH Actions pipeline |
| Container | Bare Python | Multi-stage, non-root, healthcheck |
| Monitoring | None | `/health`, `/metrics`, Prometheus, Grafana, live dashboard |
| Security | Secrets in repo | GH Secrets, `pip-audit`, `trivy`, HSTS, parametrized queries |
| Docs | Minimal | README + REPORT + `/devops.html` showcase |
