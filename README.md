# landingProjects

Витрины проектов Алихана Кабдуалы. Один репозиторий — один деплой на Vercel,
все проекты разложены по городам и площадкам внутри `/projects`.

```
/                                       → пока пусто (место под портфолио)
/projects                               → индекс всех проектов
/projects/kostanai/jasyl                → Jasyl — AI-мониторинг зелёных насаждений
                                          Qostanai Smart City Hackathon, кейс №1
/projects/kostanai/qa-vision            → QA Vision — контроль качества покраски кузова
                                          Qostanai AI-Sana Industry: Allur Challenge
/projects/almaty/itfest                 → IT Fest 2025 — фестиваль, два трека, сертификаты
/projects/almaty/itfest/kz-universe     → KZ UniVerse — платформа выбора вуза (трек Hackathon)
/projects/npai                          → NPAI — маркетплейс решений для промышленного IoT
                                          стартап, живёт отдельно от фестивалей
```

Иерархия повторяет реальную: KZ UniVerse родился на треке IT Fest и лежит
внутри его папки, а NPAI ездит по площадкам с 2024 года и висит отдельной
веткой — со страницы фестиваля на него ведёт ссылка, но подчинения нет.

Старые адреса `/jasyl` и `/qa-dashboard` остались рабочими: в `vercel.json`
стоят постоянные редиректы на новые пути.

## Как устроено

```
.
├── vercel.json          редиректы, поддомен, общие заголовки
├── projects/
│   ├── index.html       индекс со всеми проектами
│   ├── assets/          иконки и og-картинка индекса
│   ├── kostanai/{jasyl,qa-vision}/
│   ├── almaty/itfest/            + вложенный kz-universe/
│   └── npai/
└── .claude/launch.json  локальный предпросмотр
```

Каждый лендинг — один статический `index.html`: разметка, стили и скрипты
внутри файла, ноль зависимостей и ноль внешних запросов. Общий каркас
(сетка на курсоре, мобильное меню, типографика) один на все страницы,
различаются палитра и содержимое. Открыть локально можно просто двойным
кликом по файлу.

## Деплой на Vercel

Один проект Vercel на весь репозиторий:

1. **Add New → Project**, импортировать `Krazher220-Ceo/landingProjects`.
2. Framework Preset — **Other**, Build Command и Output Directory пустые.
3. **Settings → Domains** → добавить `alikhandev.com` и `www.alikhandev.com`.

## Поддомен projects.alikhandev.com

Работает как второй вход в те же файлы: `projects.alikhandev.com/npai/`
показывает то же, что `alikhandev.com/projects/npai/`.

1. В Vercel: **Settings → Domains → Add** → `projects.alikhandev.com`.
2. В DNS домена добавить запись, которую покажет Vercel — обычно
   `CNAME projects → cname.vercel-dns.com`.
3. Правило в `vercel.json` уже стоит: запросы с этого хоста переписываются
   в `/projects/*`, поэтому в адресе не будет повторяться слово `projects`.

Пока поддомен не добавлен, правило просто не срабатывает — ничего не ломается.

## Почта hi@alikhandev.com

На страницах стоит `mailto:hi@alikhandev.com`. Чтобы письма доходили,
адрес нужно завести пересылкой — сам домен ящик не создаёт.

**Вариант 1 — ImprovMX (бесплатно, нейм-серверы менять не надо).**

1. Зарегистрироваться на improvmx.com, добавить домен `alikhandev.com`.
2. В DNS добавить записи (актуальные значения ImprovMX покажет в панели):

   | Тип | Имя | Значение | Приоритет |
   |-----|-----|----------|-----------|
   | MX  | @   | `mx1.improvmx.com` | 10 |
   | MX  | @   | `mx2.improvmx.com` | 20 |
   | TXT | @   | `v=spf1 include:spf.improvmx.com ~all` | — |

3. Создать алиас `hi@` → личный ящик.

**Вариант 2 — Cloudflare Email Routing**, если DNS домена на Cloudflare.
**Вариант 3 — Zoho Mail**, если нужно ещё и отправлять письма с этого адреса.

## Что докинуть в assets

Секции подхватывают файлы сами — нет файла, нет секции:

- `projects/kostanai/qa-vision/assets/screen-1…6.png` — скриншоты дашборда
- `projects/kostanai/jasyl/assets/screen-1…6.png` — скриншоты приложения
- `projects/kostanai/jasyl/assets/certificate.jpg|pdf` — сертификат Jasyl
- `projects/almaty/itfest/assets/certificate.jpg` — сертификат IT Fest (уже на месте)

**Важно про скриншоты:** страница ищет сначала только `screen-1` и остальные
проверяет, лишь когда нашла первый, — иначе пустая секция каждый раз стучалась
бы по восемнадцати несуществующим адресам. Нумерацию начинать с `screen-1`.

## Почему в vercel.json стоит trailingSlash

Все пути внутри страниц относительные (`assets/certificate.jpg`). Если открыть
страницу без завершающего слэша, браузер считает базой корень домена и просит
`alikhandev.com/assets/…` — 404 на всех картинках. `"trailingSlash": true`
приводит адрес к каноничному виду, а в самих страницах на всякий случай стоит
короткий скрипт, проставляющий `<base>`, если слэша всё-таки нет.

## Локальный предпросмотр

```bash
cd /path/to/landings && python3 -m http.server 4321
```

Открыть `http://localhost:4321/projects/`.
