# Деплой на VPS (alikhandev.com)

Стек: Next.js 16 (`next start`) под pm2 на 127.0.0.1:3000, снаружи Caddy с автоматическим HTTPS.

| Файл | Где живёт | Зачем |
|---|---|---|
| `server-setup.sh` | запускается один раз от root | система, swap, deploy, Node 22, pm2, Caddy, ufw, fail2ban |
| `harden-ssh.sh` | один раз от root, после проверки входа под deploy | запрет входа root и по паролю |
| `Caddyfile` | `/etc/caddy/Caddyfile` | HTTPS + reverse proxy, www → без www |
| `ecosystem.config.cjs` | `/var/www/portfolio/` | конфиг pm2 |
| `../deploy.sh` | на Маке | `./deploy.sh` — выкладка, `./deploy.sh rollback` — откат |

Раскладка на сервере: `/var/www/portfolio/releases/<время>/`, `current → последний релиз`.
