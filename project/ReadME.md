# Project README

This document collects setup and deployment notes for the booking microservice stack (app server, Consul, Jenkins, and related services).

## Overview
Services included:
- `app-server` (all microservices + Kafka)
- `consul-server`
- `jenkins-server`

Ports to open in the firewall:
- 0.0.0.0/0
- TCP: 3000, 8000, 8001, 8002, 8003, 8004, 8070, 8080, 8500, 9092, 19092, 29092, 29093

Database:
- Cloud SQL: PostgreSQL 17

---

## Install Jenkins (Ubuntu)
1. Update and install Java:
```bash
sudo apt update
sudo apt install fontconfig openjdk-17-jre -y
java -version
```

2. Add Jenkins repository and install:
```bash
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key

echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt-get update
sudo apt-get install jenkins -y
```

3. Get the initial Jenkins admin password:
```bash
cat /var/lib/jenkins/secrets/initialAdminPassword
```

4. Recommended Jenkins plugins:
- Blue Ocean
- Docker
- Go
- SSH Agent

5. Recommended credentials (examples):
- Docker credential: `docker-credential` (type: Docker)
- GitHub username/password: `github-credential`
- Secret text: `consul-http-url`, `consul-http-token`, `username`, `host`
- SSH private key: `ssh-key`

6. Configure a GitHub pipeline:
- Use “Pipeline script from SCM”
- Set repository URL and credentials
- Choose branch and enable webhook triggers

---

## Install Consul (KV)
1. Install prerequisites and Consul:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y unzip curl
curl -O https://releases.hashicorp.com/consul/1.16.0/consul_1.16.0_linux_amd64.zip
unzip consul_1.16.0_linux_amd64.zip
sudo mv consul /usr/bin/
consul --version
```

2. Create directories and set permissions:
```bash
sudo mkdir -p /etc/consul.d /opt/consul
sudo chmod -R 775 /etc/consul.d /opt/consul
```

3. Example `/etc/consul.d/consul.hcl`:
```hcl
data_dir = "/opt/consul"
log_level = "INFO"
server = true
bootstrap_expect = 1
bind_addr = "0.0.0.0"
client_addr = "0.0.0.0"
ui = true

acl {
  enabled = true
  default_policy = "deny"
  enable_token_persistence = true
  tokens {
    master = "replace-with-your-own-uuid-token"
  }
}
```

4. Create a systemd service `/etc/systemd/system/consul.service`:
```ini
[Unit]
Description=HashiCorp Consul - A service mesh solution
Documentation=https://www.consul.io/
Requires=network-online.target
After=network-online.target

[Service]
User=root
Group=root
ExecStart=/usr/bin/consul agent -config-dir=/etc/consul.d/
ExecReload=/bin/kill -HUP $MAINPID
KillMode=process
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

5. Enable and start Consul:
```bash
sudo systemctl daemon-reload
sudo systemctl enable consul
sudo systemctl start consul
sudo systemctl status consul
```

6. Access Consul UI at port `8500`. Add service configuration items and keys from each service's `config.json`.

---

## App VM Setup (Docker + Docker Compose)
1. Update and install required packages:
```bash
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
```

2. Add Docker repository and install Docker:
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt-cache policy docker-ce
sudo apt install docker-ce
sudo systemctl status docker
```

3. Add your user to the `docker` group:
```bash
sudo usermod -aG docker ${USER}
sudo su - ${USER}
groups
```

4. Install `docker-compose`:
```bash
sudo apt install docker-compose
```

---

## Domain, Nginx and TLS (example)
- Register DNS pointing your domain to the app VM IP.
- Create Nginx site in `/etc/nginx/sites-available`, e.g. `booking-fe.hozanna.site`:

```nginx
server {
  listen 80;
  listen [::]:80;
  server_name booking-fe.hozanna.site;

  location / {
      proxy_pass http://localhost:3000/;
  }
}
```

- Enable site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/booking-fe.hozanna.site /etc/nginx/sites-enabled
sudo systemctl reload nginx
```

- Obtain and deploy a TLS certificate with Certbot:
```bash
sudo certbot --nginx
# Select booking-fe.hozanna.site when prompted
```

After success you should see the certificate at:
- `/etc/letsencrypt/live/booking-fe.hozanna.site/fullchain.pem`
- `/etc/letsencrypt/live/booking-fe.hozanna.site/privkey.pem`

Certbot will schedule automatic renewals.

---

## Services & Webhooks
- Each repository should have a GitHub webhook configured to notify Jenkins on push events:
  - `http://<your-jenkins-ip>:8080/github-webhook/`
- Developer workflow:
  - Push to GitHub → webhook → Jenkins job builds/tests/deploys
- Example services in this project (for reference in Jenkins jobs):
- `field_service`
- `mini-soccer-fe` (frontend)
- `order_service`
- `payment_service`
- `user_service`
- **Kafka topics**: Register needed Kafka topics using the Kafka UI running on port `8070` (access `http://<your-host>:8070`). Use the UI to create the topics used by services (for example: `order-created`, `payment-updated`), or create topics via the `kafka-topics` CLI against the broker.

---

## Notes & Tips
- Keep Consul ACL master token secure (replace placeholder token).
- Store credentials securely in Jenkins (do not hardcode secrets in repos).
- Forward required ports on your infrastructure firewall to allow service access.
- Use each service's `config.json` to populate Consul KV entries.
- Verify Docker and Docker Compose versions before deploying.

---

## Quick Checklist
- **Firewall**: Open required ports
- **Database**: Provision Cloud SQL (Postgres 17)
- **Jenkins**: Install, add plugins, and configure credentials
- **Consul**: Install, configure ACLs, and add service keys
- **App VM**: Install Docker + Docker Compose, deploy services
- **Domain**: Configure Nginx and obtain TLS via Certbot
- **CI**: Configure GitHub webhooks to Jenkins