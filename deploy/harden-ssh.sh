#!/usr/bin/env bash
# Отключает вход root и вход по паролю. Запускать от root ПОСЛЕ того,
# как вход `ssh deploy@<IP>` по ключу и `sudo -v` проверены в отдельном окне.
#   ssh root@89.126.199.168 'bash /root/harden-ssh.sh'
set -euo pipefail
DEPLOY_USER=deploy
[[ $EUID -eq 0 ]] || { echo "Запусти от root"; exit 1; }

# Защита от потери доступа: без ключа у deploy и sudo — ничего не трогаем.
[[ -s /home/$DEPLOY_USER/.ssh/authorized_keys ]] || { echo "СТОП: у $DEPLOY_USER нет SSH-ключа"; exit 1; }
id -nG "$DEPLOY_USER" | grep -qw sudo || { echo "СТОП: $DEPLOY_USER не в группе sudo"; exit 1; }

# 00- чтобы перебить 50-cloud-init.conf (в sshd побеждает первое значение).
cat > /etc/ssh/sshd_config.d/00-hardening.conf <<'CONF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
CONF
sshd -t                      # синтаксическая проверка; при ошибке скрипт остановится
systemctl restart ssh
sshd -T | grep -Ei '^(permitrootlogin|passwordauthentication|kbdinteractiveauthentication)'
echo "Готово. Текущая сессия не оборвётся. Проверь в НОВОМ окне: ssh deploy@<IP>"
