# Skill: Hardening de Docker i Seguretat d'Entorn

## Descripció
Aquest skill documenta les millors pràctiques de seguretat en els contenidors Docker. S'usa builds multi-stage per mantenir l'imatge de producció mínima, es configuren usuaris no root, sistema de fitxers de només lectura, aïllament de xarxa en Compose i limits de recursos (CPU/Memòria). A més, explica l'ús de Docker Secrets en lloc de variables d'entorn en text pla al `docker-compose.yml`.

## Template

```dockerfile
# [PLACEHOLDER_DIR]/Dockerfile
# 1. Multi-stage build: etapa de construcció
FROM python:3.12-slim AS builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# 2. Etapa de producció final
FROM python:3.12-slim

# Evitar l'execució com a root
RUN groupadd -r campogroup && useradd -r -g campogroup campouser

WORKDIR /app

# Copiar dependències del builder
COPY --from=builder /root/.local /home/campouser/.local
ENV PATH=/home/campouser/.local/bin:$PATH

COPY src/ ./src/

# Canviar el propietari dels arxius a l'usuari no root
RUN chown -R campouser:campogroup /app

# Canvi d'usuari (Security Standard)
USER campouser

EXPOSE 8000

# Executar el servei
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# [PLACEHOLDER_DIR]/docker-compose.prod.yml
version: '3.8'

services:
  api:
    build: .
    restart: always
    read_only: true # Sistema d'arxius read-only
    tmpfs:
      - /tmp # Excepció temporal per a llibreries que requereixin escriptura temporal
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
    security_opt:
      - no-new-privileges:true # Impedeix escalar privilegis
    secrets:
      - db_password
    environment:
      # S'apunta a on es monta el secret a dins del contenidor
      - DB_PASSWORD_FILE=/run/secrets/db_password
    networks:
      - internal_net
      - proxy_net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15-alpine
    restart: always
    environment:
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password
    networks:
      - internal_net # Només xarxa interna, no exposada externament
    volumes:
      - pgdata:/var/lib/postgresql/data

networks:
  internal_net:
    internal: true # No hi ha accés a internet directament
  proxy_net:

secrets:
  db_password:
    file: ./secrets/db_password.txt

volumes:
  pgdata:
```

## Exemple d'ús
En la implementació de FastAPI, llegim el password mitjançant l'arxiu si existeix:

```python
import os

def get_db_password():
    file_path = os.environ.get('DB_PASSWORD_FILE')
    if file_path and os.path.exists(file_path):
        with open(file_path, 'r') as f:
            return f.read().strip()
    return os.environ.get('DB_PASSWORD', 'default')
```

## Validació
- Intentar obrir una shell interactiva dins del contenidor: `docker exec -it api_container sh`, i executar `touch /app/nou_fitxer`. S'hauria de denegar (Sistema Read-Only).
- Comprovar l'usuari de l'aplicació executant `whoami` dins el contenidor. Ha de ser `campouser` i no `root`.
- Validar les regles de xarxa intentant fer `ping db` des d'una altra xarxa docker diferent d'`internal_net`. L'accés s'ha de blocar.

## Errors comuns
- **Passar secrets com a variables d'entorn al docker-compose**: Es veuen amb un simple `docker inspect`. Usa sempre Secrets o gestors de claus externes.
- **Deixar contenidors executant-se com a Root**: Un atac de sortida de contenidor donaria control d'administrador al host (Hetzner).
- **Oblidar limitar els recursos**: Un contenidor infectat per un atac de criptomineria o amb un _memory leak_ assecarà tota la RAM de la VPS.
