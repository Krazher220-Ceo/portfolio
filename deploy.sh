#!/usr/bin/env bash
# Деплой одной командой с Мака:  ./deploy.sh
# Заливает исходники в новый релиз на сервере, ставит зависимости, собирает,
# атомарно переключает symlink current и перезапускает pm2 без простоя
# (старый релиз работает, пока собирается новый). Хранит 3 последних релиза.
# Откат:  ./deploy.sh rollback
set -euo pipefail

HOST="${DEPLOY_HOST:-89.126.199.168}"
USER_="${DEPLOY_USER:-deploy}"
APP_DIR="${APP_DIR:-/var/www/portfolio}"
KEEP=3
SSH="ssh -o ConnectTimeout=10 $USER_@$HOST"

cd "$(dirname "$0")"

if [[ "${1:-}" == "rollback" ]]; then
  $SSH "set -e; cd $APP_DIR/releases; prev=\$(ls -1 | sort | tail -n 2 | head -n 1);
        cur=\$(basename \$(readlink -f $APP_DIR/current));
        [ \"\$prev\" != \"\$cur\" ] || { echo 'Нет предыдущего релиза'; exit 1; }
        ln -sfn $APP_DIR/releases/\$prev $APP_DIR/current.tmp && mv -Tf $APP_DIR/current.tmp $APP_DIR/current;
        rm -rf $APP_DIR/releases/\$cur;
        pm2 startOrReload $APP_DIR/ecosystem.config.cjs --update-env && pm2 save; echo \"Откат на \$prev\""
  exit 0
fi

REL="$(date +%Y%m%d%H%M%S)"
SHA="$(git rev-parse --short HEAD 2>/dev/null || echo nogit)"
[[ -z "$(git status --porcelain 2>/dev/null)" ]] || echo "⚠️  Есть незакоммиченные изменения — они тоже уедут на сервер."

echo "==> Загрузка исходников → $HOST:$APP_DIR/releases/$REL"
$SSH "mkdir -p $APP_DIR/releases/$REL"
rsync -az --delete \
  --exclude .git --exclude node_modules --exclude .next --exclude out \
  --exclude .vercel --exclude '.env*' --exclude .DS_Store --exclude .claude \
  ./ "$USER_@$HOST:$APP_DIR/releases/$REL/"

echo "==> Установка зависимостей и сборка на сервере"
$SSH "set -e
  cd $APP_DIR/releases/$REL
  cp deploy/ecosystem.config.cjs $APP_DIR/ecosystem.config.cjs
  # Если package-lock не менялся — берём node_modules прошлого релиза (быстро).
  if [ -e $APP_DIR/current/package-lock.json ] && cmp -s package-lock.json $APP_DIR/current/package-lock.json; then
    cp -a $APP_DIR/current/node_modules ./node_modules
  else
    npm ci --no-audit --no-fund
  fi
  export NEXT_TELEMETRY_DISABLED=1 VERCEL_GIT_COMMIT_SHA=$SHA-$REL
  npm run build

  echo '==> Переключение и перезапуск'
  ln -sfn $APP_DIR/releases/$REL $APP_DIR/current.tmp && mv -Tf $APP_DIR/current.tmp $APP_DIR/current
  pm2 startOrReload $APP_DIR/ecosystem.config.cjs --update-env
  pm2 save

  for i in \$(seq 1 30); do
    code=\$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/ru || true)
    [ \"\$code\" = 200 ] && break; sleep 1
  done
  [ \"\$code\" = 200 ] || { echo \"Приложение не отвечает (HTTP \$code). Откат: ./deploy.sh rollback\"; pm2 logs portfolio --lines 30 --nostream; exit 1; }
  echo \"Локально на сервере: HTTP \$code\"

  cd $APP_DIR/releases && ls -1 | sort | head -n -$KEEP | xargs -r rm -rf
"
echo "==> Проверка снаружи"
curl -sS -o /dev/null -w "https://alikhandev.com/ru → HTTP %{http_code}\n" https://alikhandev.com/ru || echo "HTTPS пока недоступен (DNS/сертификат?)"
echo "✅ Релиз $REL ($SHA) выложен"
