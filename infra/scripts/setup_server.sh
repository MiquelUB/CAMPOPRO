#!/bin/bash
set -e

echo "=> Actualitzant el sistema..."
apt-get update && apt-get upgrade -y

echo "=> Instal·lant eines de seguretat..."
apt-get install -y ufw fail2ban unattended-upgrades curl

echo "=> Configurant UFW (Firewall)..."
ufw default deny incoming
ufw default allow outgoing
# Obrir port SSH (potser personalitzat)
ufw allow 22/tcp
# Obrir ports web
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable
ufw status

echo "=> Configurant Fail2ban..."
cat <<EOF > /etc/fail2ban/jail.local
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
findtime = 600
bantime = 3600
EOF
systemctl restart fail2ban
systemctl enable fail2ban

echo "=> Configurant Unattended-Upgrades..."
dpkg-reconfigure -f noninteractive unattended-upgrades

echo "=> Instal·lant Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl enable docker
systemctl start docker

echo "=> Seguretat bàsica aplicada amb èxit."
