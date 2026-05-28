# Multi-stage Docker build for Top Living API.
# Builder installs deps to --user; runtime copies only what we need.

# ---------- build ----------
FROM python:3.12-slim AS build
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# ---------- runtime ----------
FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 \
    PATH=/root/.local/bin:$PATH

# only deps + app source
COPY --from=build /root/.local /root/.local
COPY app/ ./app

# run as non-root
RUN useradd -u 1001 -m topliving && chown -R topliving /app
USER topliving

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request,sys; \
                   urllib.request.urlopen('http://localhost:8000/health', timeout=2)" || exit 1

CMD ["gunicorn", "-b", "0.0.0.0:8000", "-w", "2", "app.main:app"]
