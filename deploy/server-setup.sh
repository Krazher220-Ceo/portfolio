#!/usr/bin/env bash
# Первичная настройка VPS (Ubuntu 24.04). Запускать ОДИН раз от root:
#   ssh -t root@89.126.199.168 'bash /root/server-setup.sh'
#
# Что делает: обновляет систему, swap 2 ГБ, пользователь deploy (sudo + твои
# SSH-ключи из /root/.ssh/authorized_keys), Node.js 22 + pm2 с автозапуском,
# Caddy, ufw (22/80/443), fail2ban.
# Чего НЕ делает: не отключает вход root/по паролю — это отдельный шаг
# harden-ssh.sh, ПОСЛЕ того как ты проверишь вход под deploy по ключу.
set -euo pipefail

DEPLOY_USER=deploy
APP_DIR=/var/www/portfolio
NODE_MAJOR=22

[[ $EUID -eq 0 ]] || { echo "Запусти от root"; exit 1; }
say() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

say "Обновление системы"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get -y -o Dpkg::Options::=--force-confold upgrade
apt-get install -y curl ca-certificates gnupg rsync ufw fail2ban debian-keyring debian-archive-keyring apt-transport-https unattended-upgrades

say "Swap 2 ГБ (сборка Next.js на 2 ГБ RAM без него может упасть по памяти)"
if ! swapon --show | grep -q /swapfile; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo 'vm.swappiness=10' > /etc/sysctl.d/99-swap.conf && sysctl -p /etc/sysctl.d/99-swap.conf
fi

say "Пользователь $DEPLOY_USER"
if ! id "$DEPLOY_USER" &>/dev/null; then
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
  echo "Задай пароль для $DEPLOY_USER (он нужен для sudo, НЕ для входа по SSH):"
  passwd "$DEPLOY_USER"
fi
usermod -aG sudo "$DEPLOY_USER"

say "SSH-ключи для $DEPLOY_USER (копирую из /root/.ssh/authorized_keys)"
if [[ ! -s /root/.ssh/authorized_keys ]]; then
  echo "ОШИБКА: у root нет ключей. Сначала на Маке: ssh-copy-id root@<IP>"; exit 1
fi
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" /home/$DEPLOY_USER/.ssh
install -m 600 -o "$DEPLOY_USER" -g "$DEPLOY_USER" /root/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/authorized_keys

say "Node.js $NODE_MAJOR + pm2"
if ! command -v node &>/dev/null || [[ "$(node -v)" != v$NODE_MAJOR.* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_$NODE_MAJOR.x | bash -
  apt-get install -y nodejs
fi
npm install -g pm2@latest
env PATH="$PATH:/usr/bin" pm2 startup systemd -u "$DEPLOY_USER" --hp /home/$DEPLOY_USER
install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$APP_DIR" "$APP_DIR/releases"

say "Caddy"
if ! command -v caddy &>/dev/null; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update && apt-get install -y caddy
fi
if [[ -f /root/Caddyfile ]]; then
  install -m 644 /root/Caddyfile /etc/caddy/Caddyfile
  caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
  systemctl reload caddy || systemctl restart caddy
fi

say "Файрвол ufw: СНАЧАЛА разрешаю SSH (22), потом 80/443, и только потом включаю"
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp   # HTTP/3
ufw --force enable
ufw status verbose

say "fail2ban (sshd: 5 неудачных попыток за 10 мин → бан на 1 час)"
cat > /etc/fail2ban/jail.local <<'JAIL'
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
backend  = systemd

[sshd]
enabled = true
JAIL
systemctl enable --now fail2ban
systemctl restart fail2ban
fail2ban-client status sshd

say "Готово. Не закрывай эту сессию root. В НОВОМ окне терминала проверь:"
echo "  ssh deploy@<IP>   → должен пустить БЕЗ пароля, затем:  sudo -v  (пароль deploy)"
echo "Только после этого запускай harden-ssh.sh."
