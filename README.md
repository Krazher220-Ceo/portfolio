# landingProjects

Витрины проектов Алихана Кабдуалы. Один репозиторий — один деплой на Vercel,
каждый проект живёт на своём пути домена `alikhandev.com`.

```
/                      → пока пусто (место под будущее портфолио)
/qa-dashboard          → QA Vision — контроль качества покраски кузова по фото
                         Хакатон Qostanai AI-Sana Industry: Allur Challenge, 1–3 ноября 2025
/jasyl                 → Jasyl — AI-мониторинг зелёных насаждений Костаная
                         Qostanai Smart City Hackathon, кейс №1
```

## Как устроено

```
.
├── vercel.json          общие правила для всех лендингов
├── qa-dashboard/
│   ├── index.html       один файл: разметка, стили и скрипты внутри
│   └── assets/          иконки, og-картинка, сертификат, скриншоты
└── jasyl/
    ├── index.html
    └── assets/
```

Каждый лендинг — статическая страница без зависимостей и без сборки:
никаких внешних запросов, открывается хоть с диска. Чтобы посмотреть локально,
достаточно открыть `index.html` в браузере.

## Деплой на Vercel

Один проект Vercel на весь репозиторий:

1. **Add New → Project**, импортировать `Krazher220-Ceo/landingProjects`.
2. Framework Preset — **Other**. Build Command и Output Directory оставить пустыми:
   репозиторий уже статический, собирать нечего.
3. **Settings → Domains** → добавить `alikhandev.com` и `www.alikhandev.com`.

После деплоя пути раздаются сами:

- `https://alikhandev.com/qa-dashboard`
- `https://alikhandev.com/jasyl`

Корень `/` пока отдаёт 404 — там появится портфолио. Чтобы временно
перебросить корень на один из проектов, добавить в `vercel.json`:

```json
"redirects": [{ "source": "/", "destination": "/qa-dashboard", "permanent": false }]
```

Новый лендинг добавляется папкой рядом: `mkdir новый-проект`, положить туда
`index.html` — путь `/новый-проект` заработает сам, отдельный проект Vercel
не нужен.

## Почта hi@alikhandev.com

На страницах стоит `mailto:hi@alikhandev.com`. Чтобы письма доходили,
адрес нужно завести пересылкой на личную почту — сам домен ящик не создаёт.

**Вариант 1 — ImprovMX (бесплатно, нейм-серверы менять не надо).**

1. Зарегистрироваться на improvmx.com, добавить домен `alikhandev.com`.
2. В DNS домена добавить записи (актуальные значения ImprovMX показывает в панели):

   | Тип | Имя | Значение | Приоритет |
   |-----|-----|----------|-----------|
   | MX  | @   | `mx1.improvmx.com` | 10 |
   | MX  | @   | `mx2.improvmx.com` | 20 |
   | TXT | @   | `v=spf1 include:spf.improvmx.com ~all` | — |

3. В панели ImprovMX создать алиас `hi@` → личный ящик (Gmail / iCloud).

**Вариант 2 — Cloudflare Email Routing (бесплатно, если DNS домена на Cloudflare).**
Email → Email Routing → Create address: `hi@alikhandev.com` → пересылка на личную почту.
MX-записи Cloudflare проставит сам.

**Вариант 3 — Zoho Mail (бесплатный тариф).** Полноценный ящик, если нужно
не только получать, но и отправлять письма с адреса `hi@alikhandev.com`.

Проверка после настройки: отправить письмо на `hi@alikhandev.com` с любого
другого адреса и убедиться, что оно пришло на личную почту.

## Что докинуть в assets

Секции подхватывают файлы сами — если файла нет, секция просто не показывается:

- `qa-dashboard/assets/screen-1…6.png` — скриншоты дашборда, секция «Экраны»
- `qa-dashboard/assets/certificate.jpg` — сертификат участника (уже на месте)
- `jasyl/assets/screen-1…6.png` и `jasyl/assets/certificate.jpg|pdf` — то же самое

Ничего в коде править не нужно: положил файл — блок появился.
