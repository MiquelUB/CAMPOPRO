# Skill: Configuració d'Nginx amb Seguretat SSL i Headers

## Descripció
Aquest skill defineix com establir Nginx com a reverse proxy per protegir l'aplicació backend de FastAPI i el frontend. L'objectiu és aconseguir una nota A+ als tests de Qualys SSL Labs. Configura l'auto-renovació de Let's Encrypt (Certbot), els Headers de seguretat estrictes (HSTS, CSP, X-Frame-Options), limitacions de ràtio per Nginx (`limit_req`), proxy pel pas segur d'IPs reals i compressió per a millor rendiment.

## Template

```nginx
# [PLACEHOLDER_DIR]/nginx/conf.d/default.conf

# 1. Definició de Zones de Rate Limit a Nginx
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

# 2. Redirecció HTTP a HTTPS
server {
    listen 80;
    server_name campopro.cat www.campopro.cat;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name campopro.cat www.campopro.cat;

    # 3. Certificats SSL (generats per Certbot)
    ssl_certificate /etc/letsencrypt/live/campopro.cat/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/campopro.cat/privkey.pem;

    # 4. Paràmetres SSL forts (Nivell A+)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384";
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # 5. Headers de Seguretat
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.s3.eu-central-1.amazonaws.com; connect-src 'self' https://api.campopro.cat;" always;

    # 6. Compressió Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 7. Reverse Proxy a l'API Backend
    location /api/ {
        # Rate limiting per IP
        limit_req zone=mylimit burst=20 nodelay;

        proxy_pass http://api:8000/;
        
        # Passar l'IP real i protocol
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 8. WebSockets per missatgeria en temps real
    location /ws/ {
        proxy_pass http://api:8000/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

## Exemple d'ús
Cron d'auto-renovació pel servidor de Hetzner (`/etc/crontab`):

```bash
# Executar Let's Encrypt cada dia a les 02:00 de la matinada i recarregar Nginx si ha canviat el certificat
0 2 * * * root docker run --rm -v /etc/letsencrypt:/etc/letsencrypt -v /var/www/certbot:/var/www/certbot certbot/certbot renew --quiet && docker exec nginx_proxy nginx -s reload
```

## Validació
- Obrir https://www.ssllabs.com/ssltest/ i introduir el domini per validar el nivell A+.
- Intentar encastar la pàgina web en un `<iframe src="https://campopro.cat"></iframe>` des d'un altre domini. El navegador l'ha de bloquejar pel header `X-Frame-Options SAMEORIGIN`.
- Sobrecarregar la xarxa fent un _ping/curl_ de més de 10 peticions per segon; els extres fallaran amb HTTP 503 (Error de limitació per Nginx).

## Errors comuns
- **Deixar TLS 1.0 i 1.1 oberts**: Són vulnerables, només es permet TLS 1.2 i 1.3 per aplicacions modernes.
- **CSP (Content-Security-Policy) mal configurat**: Restringir massa el CSP pot trencar fonts o scripts externs; usar `unsafe-inline` al principi és un compromís fins que s'utilitzin Nonces rigorosos.
- **Oblidar propagar l'IP (`X-Real-IP`)**: Això causa que el Rate Limit de FastAPI o els logs guardin la IP interna del proxy de Docker en lloc del veritable usuari.
