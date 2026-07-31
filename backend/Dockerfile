# Stage 1: Build requirements
FROM python:3.12-slim as builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create venv
RUN python -m venv /opt/venv
# Make sure we use the venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.12-slim

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --group appuser

WORKDIR /app

# Install runtime dependencies (e.g., libpq for asyncpg)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy venv from builder
COPY --from=builder /opt/venv /opt/venv

# Ensure venv bin is in PATH
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONPATH=/app

# Copy application code
COPY --chown=appuser:appgroup ./app /app/app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Default command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
