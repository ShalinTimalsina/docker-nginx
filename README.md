# Nginx + Node.js + Docker + Let’s Encrypt

This repository contains a production-oriented setup for running a Node.js application behind Nginx using Docker and Docker Compose, with HTTPS enabled via Let’s Encrypt (Certbot) and automatic certificate renewal.

---

## Architecture Overview

```
Internet
   |
   |  HTTP / HTTPS (80, 443)
   v
Nginx (Reverse Proxy + SSL)
   |
   |  Docker private network
   v
Node.js Application
```

Key characteristics:

- Nginx is the only public-facing service
- The Node.js application runs internally on port 3000
- SSL certificates are issued and renewed by Certbot
- Certificates are stored using Docker named volumes
- Designed for cloud servers such as AWS EC2

---

## Project Structure

```
.
├── docker-compose.yml
├── Dockerfile
├── .dockerignore
├── nginx/
│   └── nginx.conf
├── server.js
├── index.html
└── images/
```

---

## Requirements

The target server must have:

- Docker (v20 or newer recommended)
- Docker Compose v2
- A public domain or subdomain pointing to the server IP
- TCP ports 80 and 443 open in the firewall or cloud security group

---

## Domain and DNS Setup

Create an A record with your DNS provider:

```
app.yourdomain.com -> SERVER_PUBLIC_IP
```

Verify DNS resolution:

```bash
ping app.yourdomain.com
```

---

## Setup and Installation

### 1. Clone the Repository (on the server)

```bash
git clone git@github.com:<your-username>/<repository-name>.git
cd <repository-name>
```

---

### 2. Start Services in HTTP-Only Mode (Initial Run)

Before requesting SSL certificates, Nginx must run without HTTPS enabled.

Ensure the HTTPS server block is commented out in nginx/nginx.conf, then start the services:

```bash
docker compose up -d node-app nginx
```

Verify that HTTP works correctly:

```bash
curl http://app.yourdomain.com
```

---

### 3. Generate SSL Certificates (One-Time Step)

Run Certbot manually to issue the initial certificate:

```bash
docker compose run --rm \
  --entrypoint certbot \
  certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d app.yourdomain.com \
  --email your@email.com \
  --agree-tos \
  --no-eff-email
```

On success, Certbot will output a message similar to:

```
Congratulations! Your certificate and chain have been saved at:
```

---

### 4. Enable HTTPS in Nginx

Edit nginx/nginx.conf and re-enable the HTTPS server block.

Test and reload Nginx without downtime:

```bash
docker exec nginx nginx -t
docker exec nginx nginx -s reload
```

---

### 5. Start Certbot Auto-Renewal

Once certificates exist, start the Certbot renewal container:

```bash
docker compose up -d certbot
```

Test renewal logic safely:

```bash
docker exec certbot certbot renew --dry-run
```

---

## Security Measures

This setup includes the following security practices:

- HTTPS enforced with Let’s Encrypt
- Nginx version information hidden
- Backend technology headers removed
- Secure HTTP headers enabled
- Node.js container runs as a non-root user
- Internal Docker network isolation

---

## Scaling the Node.js Application

The Node.js service can be scaled horizontally:

```bash
docker compose up -d --scale node-app=3
```

Nginx automatically load-balances traffic across instances.

---

## Useful Commands

Stop all services while preserving volumes:

```bash
docker compose down
```

Full reset (removes containers, networks, and volumes including SSL certificates):

```bash
docker compose down -v
```

View logs:

```bash
docker compose logs -f nginx
docker compose logs -f node-app
```

---

## Important Notes

- Do not commit SSL certificates to version control
- Avoid running docker compose down -v in production unless intentionally resetting
- SSL data persists via Docker named volumes
- .dockerignore is used to keep images minimal and secure

---

## Status

- Production-style setup
- HTTPS enabled
- Automatic certificate renewal configured
- Suitable for AWS EC2 and similar environments

---

