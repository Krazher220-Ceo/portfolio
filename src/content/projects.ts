/**
 * Контент проектов. Источник — прежние витрины в `landingProjects`,
 * из них взят ТОЛЬКО текст. Ни одной цифры, которой нет в источнике.
 * Витрин больше нет — разбор живёт здесь, поэтому объём средний:
 * задача, решение, инженерные решения, честный разбор ошибок,
 * измеренный результат и площадка. Без больших таблиц.
 */

export type Bi = { ru: string; en: string };
export type BiList = { ru: string[]; en: string[] };

export type Metric = {
  /** Число отсчитывается от нуля при входе в кадр. */
  value: number;
  suffix?: string;
  decimals?: number;
  /** Год — не количество: разряды в нём не группируются. */
  plain?: boolean;
  label: Bi;
};

export type Project = {
  slug: string;
  name: string;
  /** Фотография есть только у Jasyl. У остальных её нет — и вместо
   *  выдуманной картинки карточка честно показывает данные. */
  cover: string | null;
  coverAlt: Bi | null;
  /** Кадры с площадки. Только у того проекта, где они реально сняты. */
  gallery?: { src: string; alt: Bi }[];
  tagline: Bi;
  role: Bi;
  stack: string[];
  term: Bi;
  status: Bi;
  event: Bi;
  date: string;
  /** Про саму площадку: кто проводил, что просили, как всё шло. */
  venue: Bi;
  task: Bi;
  solution: Bi;
  tech: BiList;
  wrong: BiList;
  metrics: Metric[];
  result: Bi;
  otherwise: Bi;
  links: { demo?: string; repo?: string };
  certificateId: string | null;
};

export const projects: Project[] = [
  {
    slug: "jasyl",
    name: "Jasyl",
    cover: "jasyl-photo-app",
    coverAlt: {
      ru: "Экран осмотра дерева в приложении Jasyl на телефоне, снятый на площадке хакатона",
      en: "The tree-inspection screen of the Jasyl app on a phone, photographed at the hackathon venue",
    },
    gallery: [
      {
        src: "jasyl-photo-pitch",
        alt: {
          ru: "Защита проекта: на экране слайд «Проблема» — город не знает состояния своих деревьев",
          en: "The pitch: the slide on screen reads \"The problem\" — the city does not know the condition of its trees",
        },
      },
      {
        src: "jasyl-photo-jury",
        alt: {
          ru: "Жюри смотрит приложение вживую после защиты",
          en: "The jury looking at the running app after the pitch",
        },
      },
      {
        src: "jasyl-photo-teams",
        alt: {
          ru: "Команды, менторы и организаторы Qostanai Smart City Hackathon в зале после защит",
          en: "Teams, mentors and organisers of the Qostanai Smart City Hackathon in the hall after the pitches",
        },
      },
    ],
    tagline: {
      ru: "AI-мониторинг зелёных насаждений Костаная",
      en: "AI monitoring of Kostanay's urban trees",
    },
    role: {
      ru: "Разработка и ML — приложение и кроссплатформенные сборки, обучение модели, инференс-сервис, база и разграничение прав, офлайн-синхронизация",
      en: "Development and ML — the app and its cross-platform builds, model training, the inference service, the database and its access rules, offline sync",
    },
    stack: [
      "Vite", "React 18", "TypeScript", "PyTorch", "MobileNetV3-Large",
      "ONNX Runtime Web", "Supabase", "Leaflet", "Capacitor 6", "Electron 33",
    ],
    term: { ru: "2 дня", en: "2 days" },
    status: {
      ru: "Рабочий прототип, модель считается в браузере",
      en: "Working prototype, the model runs in the browser",
    },
    event: {
      ru: "Qostanai Smart City Hackathon · кейс №1",
      en: "Qostanai Smart City Hackathon · case No. 1",
    },
    date: "2026-08",
    venue: {
      ru: "Qostanai Smart City Hackathon, 13–14 августа 2026 года, кейс №1 — интеллектуальная система мониторинга зелёных насаждений. Двое суток в зале, ночная отладка синхронизации, утренняя пересборка презентации и защита перед жюри, менторами и другими командами. Команда — три человека и два ноутбука, школа-лицей №1 Костаная.",
      en: "Qostanai Smart City Hackathon, 13–14 August 2026, case No. 1 — an intelligent monitoring system for urban greenery. Two days in the hall, a night spent debugging sync, a morning rebuilding the deck, then the pitch in front of the jury, mentors and the other teams. The team: three people and two laptops, School-Lyceum No. 1, Kostanay.",
    },
    task: {
      ru: "Учёт зелёных насаждений ведётся на бумаге и в разрозненных таблицах. Аварийное дерево попадает в план работ уже после того, как ветка упала.",
      en: "The tree register is kept on paper and in scattered spreadsheets. A dangerous tree makes it into the work plan only after a branch has already come down.",
    },
    solution: {
      ru: "Житель фотографирует дерево, модель определяет состояние, объект встаёт на карту города с инвентарным номером, служба озеленения получает заявку с приоритетом. Приложение работает без интернета: снимки копятся на устройстве и уходят сами, когда связь вернётся.",
      en: "A resident photographs a tree, the model classifies its condition, the object lands on the city map with an inventory number, and the parks service receives a prioritised job. The app works offline: photos queue on the device and upload themselves once the connection returns.",
    },
    tech: {
      ru: [
        "Права — политиками Row Level Security в Postgres, а не скрытыми кнопками в интерфейсе. Политики DELETE нет ни у кого: муниципальный реестр не должен терять записи по клику.",
        "Каждая запись получает client_uid на клиенте, синхронизация делает upsert по нему — повторная отправка не плодит дубли.",
        "После хакатона та же модель переехала в браузер (ONNX Runtime Web): демо живёт без сервера и без холодного старта, реестр — на встроенном демо-наборе, и приложение честно помечает это плашкой.",
      ],
      en: [
        "Permissions live in Postgres Row Level Security policies, not in hidden buttons. Nobody has a DELETE policy: a municipal register must not lose records on a click.",
        "Every record gets a client_uid on the device, and sync upserts by it — resending never produces duplicates.",
        "After the hackathon the same model moved into the browser via ONNX Runtime Web: the demo runs with no server and no cold start, the register uses a bundled demo dataset, and the app labels that plainly.",
      ],
    },
    wrong: {
      ru: [
        "Точность 55% — это MVP, а не продакшн. Опасные классы модель ловит уверенно (аварийные ветви — precision 0,88), но путается на паре «здоровое / болезнь». Поэтому решение подтверждает человек, а не автомат.",
        "Background Sync не работает в Safari — пришлось делать три независимых триггера синхронизации, включая ручной.",
        "Породу дерева модель не определяет намеренно: на нашем объёме данных достоверно определить вид по фото нельзя, а неверная порода в муниципальном реестре хуже пустого поля.",
      ],
      en: [
        "55% accuracy is an MVP, not production. The model catches the dangerous classes confidently (hazardous branches: precision 0.88) but confuses healthy with diseased. So a human confirms the verdict, not the machine.",
        "Background Sync doesn't work in Safari, so sync needed three independent triggers, one of them manual.",
        "The model deliberately does not identify the species: on our volume of data that can't be done reliably from a photo, and a wrong species in a municipal register is worse than an empty field.",
      ],
    },
    metrics: [
      { value: 343, label: { ru: "фотографии в датасете, сплит по дереву 268 / 75", en: "photos in the dataset, split by tree 268 / 75" } },
      { value: 54.7, suffix: "%", decimals: 1, label: { ru: "лучшая точность на валидации", en: "best validation accuracy" } },
      { value: 0.55, decimals: 2, label: { ru: "macro F1 по шести классам", en: "macro F1 across six classes" } },
      { value: 16.8, suffix: " МБ", decimals: 1, label: { ru: "ONNX-модель для инференса на CPU", en: "ONNX model for CPU inference" } },
    ],
    result: {
      ru: "Полный цикл закрыт: собственный датасет, дообученная MobileNetV3-Large, приложение с офлайн-очередью, карта, цифровой паспорт объекта и выгрузка для акимата. Медиана уверенности модели — 0,93 на верных ответах против 0,68 на ошибочных: низкая уверенность сама помечает объект как требующий специалиста.",
      en: "The whole loop is closed: our own dataset, a fine-tuned MobileNetV3-Large, an app with an offline queue, the map, a digital passport per object and an export for the city administration. Median model confidence is 0.93 on correct answers against 0.68 on wrong ones — low confidence flags an object as needing a specialist on its own.",
    },
    otherwise: {
      ru: "Вопросы жюри и менторов оказались не про архитектуру, а про то, кто именно и в какой момент нажмёт кнопку, — и половина ответов у нас нашлась только на сцене. В следующий раз сценарий пользователя разбирается до защиты, а не во время неё.",
      en: "The questions from the jury and mentors weren't about architecture but about who exactly presses which button and when — and half our answers only surfaced on stage. Next time the user's path gets worked out before the pitch, not during it.",
    },
    links: { demo: "https://qostanai-smart-green-rho.vercel.app/" },
    certificateId: "03",
  },
  {
    slug: "qa-vision",
    name: "QA Vision",
    cover: null,
    coverAlt: null,
    tagline: {
      ru: "Контроль качества покраски кузова по фотографии",
      en: "Paint-quality control on car bodies, from a photograph",
    },
    role: {
      ru: "Разработка и архитектура — дашборд, сервис входа и API, модульная система ИИ, реестр детекций и расчёт KPI, выгрузки, роли и разграничение доступа",
      en: "Development and architecture — the dashboard, the login service and API, the pluggable AI module system, the detection registry and KPI maths, the exports, roles and access control",
    },
    stack: [
      "Python", "Streamlit", "Plotly", "FastAPI", "Roboflow", "Ultralytics YOLO",
      "PyTorch", "OpenCV", "pandas", "PyJWT", "Power BI", "Looker Studio",
    ],
    term: { ru: "3 дня", en: "3 days" },
    status: {
      ru: "Рабочий прототип, публичного демо нет",
      en: "Working prototype, no public demo",
    },
    event: {
      ru: "Qostanai AI-Sana Industry Hackathon · Allur Challenge",
      en: "Qostanai AI-Sana Industry Hackathon · Allur Challenge",
    },
    date: "2025-11",
    venue: {
      ru: "Qostanai AI-Sana Industry Hackathon, 1–3 ноября 2025 года, площадка КИнЭУ им. М. Дулатова. Организаторы — Международный союз электросвязи, Qostanai Hub и КИнЭУ; кейс дала автомобильная компания Allur. Два дня разработки, третий — защита. Призовой фонд 1 млн тенге, в финал вышли 13 команд: студенты вузов и колледжей, школьники. Менторы — специалисты НИТ, команды видеоаналитики Wildberries & Russ, стартапов Aman Online и Impro, эксперты МСЭ и инженер Allur по кейсу.",
      en: "Qostanai AI-Sana Industry Hackathon, 1–3 November 2025, at Dulatov University. Organised by the International Telecommunication Union, Qostanai Hub and the university; the case came from the car maker Allur. Two days of building, a third for the pitch. A prize fund of 1m tenge and 13 teams in the final: university and college students, and school students. Mentors came from NIT, the video-analytics teams of Wildberries & Russ, the startups Aman Online and Impro, ITU experts and Allur's own engineer on the case.",
    },
    task: {
      ru: "Контроль прокрашивания кузова на линии — это глаз контролёра под лампой. Один строже, другой мягче, к концу смены внимание падает, а спор решать нечем: кадра не осталось.",
      en: "Paint inspection on the line comes down to an inspector's eye under a lamp. One is stricter than the next, attention drops by the end of a shift, and there is no way to settle a dispute: no frame was kept.",
    },
    solution: {
      ru: "Оператор загружает снимок детали, компьютерное зрение находит дефекты прокрашивания и обводит их рамкой, каждая находка попадает в реестр детекций. Руководитель видит KPI смены, тренды по типам брака и выгружает данные в Power BI или Excel — без ручного заполнения журналов ОТК.",
      en: "An operator uploads a photo of a part, computer vision finds paint defects and boxes them, and every finding lands in the detection registry. The plant manager sees shift KPIs and defect trends and exports to Power BI or Excel — with no hand-filled inspection logs.",
    },
    tech: {
      ru: [
        "Модель — сменная деталь: Roboflow, локальный YOLO и произвольный HTTP-API реализуют один интерфейс load / detect / is_available. Переезд на локальную модель — правка конфига, а не переписывание дашборда: на заводе интернет может быть только в кабинете.",
        "Тяжесть — прозрачная формула, а не вторая сеть: площадь дефекта и уверенность, три порога. Её можно объяснить технологу.",
        "Реестр отделён от интерфейса: детекции пишутся в дневные CSV с фиксированной схемой, KPI считаются поверх них — те же данные одинаково открываются в дашборде, в Power BI и в Excel.",
      ],
      en: [
        "The model is a replaceable part: Roboflow, a local YOLO and an arbitrary HTTP API all implement one interface — load / detect / is_available. Moving to the local model is a config edit, not a dashboard rewrite: inside a plant the internet may exist only in the office.",
        "Severity is a transparent formula, not a second network: defect area and confidence, three thresholds. You can explain it to a process engineer.",
        "The registry is separate from the interface: detections go into daily CSVs with a fixed schema and KPIs are computed on top, so the same data opens identically in the dashboard, in Power BI and in Excel.",
      ],
    },
    wrong: {
      ru: [
        "Свою модель с нуля мы не обучали. За три дня выбор был между «одна модель и никакого продукта» и «весь конвейер с подключаемым детектором» — выбрали второе.",
        "Недоступный модуль возвращает «чисто». Если детектор не поднялся, кадр помечается как CLEAN и уходит в реестр. На витрине это незаметно, на линии — молчаливый пропуск брака.",
        "Цифр точности на витрине нет намеренно: валидационного набора, которому можно верить, за хакатон мы не собрали, а печатать красивый процент рядом с логотипом завода — тот случай, когда цифра хуже её отсутствия.",
      ],
      en: [
        "We didn't train our own model from scratch. In three days the choice was between one model and no product, or the whole pipeline with a pluggable detector — we took the second.",
        "An unavailable module returns \"clean\". If the detector fails to start, the frame is marked CLEAN and goes into the registry. On a showcase that passes unnoticed; on a line it is a silent miss.",
        "There are deliberately no accuracy figures on show: we never assembled a validation set worth trusting, and printing a flattering percentage next to a plant's logo is exactly the case where a number is worse than no number.",
      ],
    },
    metrics: [
      { value: 7787, label: { ru: "строк Python в проекте", en: "lines of Python in the project" } },
      { value: 4, label: { ru: "типа ИИ-модулей за одним интерфейсом", en: "kinds of AI module behind one interface" } },
      { value: 0.7, decimals: 2, label: { ru: "порог уверенности по умолчанию", en: "default confidence threshold" } },
      { value: 3, label: { ru: "роли доступа: суперадмин, руководитель, рабочий", en: "access roles: superadmin, plant manager, worker" } },
    ],
    result: {
      ru: "Работающий конвейер от входа оператора до файла в Power BI: три независимых сервиса, подключаемый детектор, реестр детекций и роли с разграничением по заводам. Призового места не заняли — его взяли три другие команды, и это честный результат: за три дня родился конвейер, но не готовая к цеху модель.",
      en: "A working pipeline from operator login to a file in Power BI: three independent services, a pluggable detector, a detection registry and roles scoped per plant. We didn't place — three other teams did, and that's a fair outcome: in three days we produced a pipeline, not a shop-floor-ready model.",
    },
    otherwise: {
      ru: "Первое, что нужно переделать: отказ модели обязан быть ошибкой, а не вердиктом «чисто». Второе — реестр на файлах не выдержит нескольких линий, пишущих одновременно; путь к PostgreSQL в проекте описан, но за три дня не пройден.",
      en: "First thing to redo: a model failure must raise an error, not return a \"clean\" verdict. Second, a file-based registry won't survive several lines writing at once; the path to PostgreSQL is written up in the project but wasn't walked in three days.",
    },
    links: { repo: "https://github.com/Krazher220-Ceo/qa-dashboard" },
    certificateId: "01",
  },
  {
    slug: "kz-universe",
    name: "KZ UniVerse",
    cover: null,
    coverAlt: null,
    tagline: {
      ru: "Единая платформа университетов Казахстана",
      en: "A single platform for Kazakhstan's universities",
    },
    role: {
      ru: "Разработка — каталог и карточки вузов, сравнение, аналитика, цепочка провайдеров ИИ, профиль и портфолио, Telegram-бот, сборка стенда к защите",
      en: "Development — the catalogue and university pages, comparison, analytics, the AI provider chain, profile and portfolio, the Telegram bot, and the demo rig for the pitch",
    },
    stack: [
      "Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Recharts",
      "Ollama", "Google Gemini 2.5 Flash Lite", "Telegram Bot API",
    ],
    term: { ru: "Сутки", en: "24 hours" },
    status: {
      ru: "Прототип, демо-стенд после хакатона выключен",
      en: "Prototype, the demo rig is switched off after the hackathon",
    },
    event: {
      ru: "IT Fest 2025 · трек Hackathon",
      en: "IT Fest 2025 · Hackathon track",
    },
    date: "2025-12",
    venue: {
      ru: "IT Fest 2025, Алматы, 5–6 декабря — один из крупнейших молодёжных фестивалей Казахстана в цифровых и креативных технологиях. Восемь направлений, альянс вузов (UIB, IITU, Astana IT University, KBTU) при поддержке фонда NNEF и акимата Алматы. Мы взяли суточный трек Hackathon: тему объявляют на месте, к утру должен быть работающий продукт, а не слайды.",
      en: "IT Fest 2025, Almaty, 5–6 December — one of Kazakhstan's largest youth festivals in digital and creative technology. Eight tracks, an alliance of universities (UIB, IITU, Astana IT University, KBTU) backed by the NNEF foundation and the Almaty city administration. We took the 24-hour Hackathon track: the theme is announced on the spot and by morning there has to be a working product, not slides.",
    },
    task: {
      ru: "Абитуриент собирает решение о вузе из десятка сайтов, слухов и старых таблиц с проходными баллами. Мы взяли ту часть темы, которую знаем на себе: как школьнику из области выбрать университет.",
      en: "An applicant assembles a decision about a university from a dozen websites, rumours and outdated score tables. We took the part of the theme we know first-hand: how a school student from the regions picks a university.",
    },
    solution: {
      ru: "Каталог университетов и программ, сравнение до трёх вузов по одинаковым параметрам, аналитика спроса и чат-помощник, который отвечает на вопросы о поступлении — и продолжает работать, когда облачная модель недоступна.",
      en: "A catalogue of universities and programmes, a side-by-side comparison of up to three of them on identical parameters, demand analytics, and a chat assistant that answers admissions questions — and keeps answering when the cloud model is unreachable.",
    },
    tech: {
      ru: [
        "Помощник устроен как цепочка: локальная модель через Ollama, облачный Gemini, встроенные правила. Ключа нет или интернет отвалился — чат всё равно отвечает. На защите интернет в зале ложится ровно в момент показа.",
        "Побочный эффект оказался важнее самой страховки: платформу можно поднять там, где облачные модели недоступны или запрещены политикой учреждения.",
        "Сайт и Telegram-бот работают с одними и теми же данными — не нужно поддерживать две версии справочника.",
      ],
      en: [
        "The assistant is a chain: a local model through Ollama, cloud Gemini, then built-in rules. No key or no internet — the chat still answers. At a pitch the venue Wi-Fi goes down exactly when you start the demo.",
        "The side effect turned out to matter more than the insurance: the platform can be stood up where cloud models are unavailable or barred by an institution's policy.",
        "The site and the Telegram bot work off the same data, so there is no second copy of the reference book to maintain.",
      ],
    },
    wrong: {
      ru: [
        "Это справочник с чат-интерфейсом, а не консультант: свежие проходные баллы и правила конкретного года нужно проверять на сайте вуза.",
        "15 вузов — не «все университеты Казахстана». В базе крупнейшие, остальные добавляются руками. Обещать полный охват на сутки разработки было бы враньём.",
        "3D-туры — заявленное направление, а не готовая функция: раздел и структура есть, панорам нет.",
      ],
      en: [
        "It is a reference book with a chat interface, not an adviser: current entry scores and the rules for a given year still have to be checked on the university's own site.",
        "15 universities is not \"all the universities of Kazakhstan\". The base holds the largest ones; the rest are added by hand. Promising full coverage after 24 hours of work would have been a lie.",
        "3D tours are a stated direction, not a finished feature: the section and the structure exist, the panoramas don't.",
      ],
    },
    metrics: [
      { value: 15, label: { ru: "университетов в базе", en: "universities in the base" } },
      { value: 19, label: { ru: "образовательных программ", en: "study programmes" } },
      { value: 3, label: { ru: "режима AI-помощника с фолбэками", en: "assistant modes with fallbacks" } },
      { value: 24, suffix: " ч", label: { ru: "на весь трек", en: "for the whole track" } },
    ],
    result: {
      ru: "За сутки закрыт весь путь абитуриента: каталог, карточка вуза, сравнение, аналитика, профиль с портфолио и Telegram-бот. Помощник отвечает в трёх режимах, и ни один из них не обязателен для запуска.",
      en: "In 24 hours the applicant's whole path was covered: catalogue, university page, comparison, analytics, a profile with a portfolio and a Telegram bot. The assistant answers in three modes, and none of them is required to run the project.",
    },
    otherwise: {
      ru: "Данные о вузах лежат в JSON рядом с кодом — на сутки хакатона это была разница между работающим каталогом и настройкой базы до утра. Цена честная: правки требуют деплоя, живой админки нет. Это первое, что придётся заменить, если проект жить дальше.",
      en: "University data sits in JSON next to the code — over a 24-hour hackathon that was the difference between a working catalogue and configuring a database until morning. The price is honest: edits need a deploy and there is no admin panel. That's the first thing to replace if the project is to go on.",
    },
    links: { repo: "https://github.com/Krazher220-Ceo/KZ-UniVerse" },
    certificateId: "02",
  },
  {
    slug: "npai",
    name: "NPAI",
    cover: null,
    coverAlt: null,
    tagline: {
      ru: "Маркетплейс готовых решений для промышленного IoT",
      en: "A marketplace of ready-made industrial IoT modules",
    },
    role: {
      ru: "Продукт и разработка — витрина маркетплейса, дашборды, Eco-модуль, вход и просмотр кода с защитой, экономика проекта, питч и ответы жюри",
      en: "Product and development — the marketplace front, the dashboards, the Eco module, login and protected code preview, the project economics, the pitch and the answers to the jury",
    },
    stack: ["JavaScript", "HTML/CSS", "Google OAuth", "IoT", "Power BI"],
    term: { ru: "С 2024 года, несколько площадок", en: "Since 2024, across several venues" },
    status: {
      ru: "Витрина на демо-данных, бэкенда и оплаты нет",
      en: "A front on demo data; no backend and no payments",
    },
    event: {
      ru: "Startup Battle, IT Fest 2025 · топ-30",
      en: "Startup Battle, IT Fest 2025 · top 30",
    },
    date: "2025-12",
    venue: {
      ru: "Проект идёт по площадкам с 2024 года: идея-баттлы и питч-сессии Qostanai Hub, питч-площадка в Петропавловске, Startup Battle на IT Fest 2025 в Алматы. Здесь код никого не интересует — спрашивают про рынок, про то, кто платит и почему именно вам, про конкурентов, которых вы не назвали. Половина того, что написано выше про рынок и модель, появилась именно из этих разговоров.",
      en: "The project has been touring venues since 2024: idea battles and pitch sessions at Qostanai Hub, a pitch venue in Petropavlovsk, and Startup Battle at IT Fest 2025 in Almaty. Nobody there cares about code — they ask about the market, about who pays and why you, about the competitors you failed to name. Half of what is written above about the market and the model came out of exactly those conversations.",
    },
    task: {
      ru: "Датчик температуры в цехе мебельной фабрики и такой же в цехе пищевого производства — это одна задача, решённая дважды двумя подрядчиками за двойные деньги. И так по всей стране.",
      en: "A temperature sensor in a furniture plant and the same sensor in a food plant are one task solved twice by two contractors for twice the money. And so it goes across the country.",
    },
    solution: {
      ru: "Витрина проверенных модулей: коды для датчиков, AI-модели и дашборды, которые ставятся за вечер. Как магазин приложений, только для производства. Данные при этом остаются на заводе: модуль ставится на его инфраструктуру.",
      en: "A shelf of vetted modules: sensor drivers, AI models and dashboards that install in an evening. Like an app store, but for manufacturing. The data stays at the plant: the module is installed on its own infrastructure.",
    },
    tech: {
      ru: [
        "Бесплатный Eco-модуль с публичными данными о качестве воздуха открыт без регистрации: одновременно польза городу и честная витрина — видно, как платформа работает.",
        "Просмотр кода перед покупкой — с ограничениями: юридическое соглашение, водяные знаки в примерах, отслеживание использования. Без этого разработчик не понесёт свой модуль на площадку.",
        "Два дашборда: полный для цеха и облегчённый для телефона руководителя.",
      ],
      en: [
        "The free Eco module with public air-quality data is open without registration: useful to the city and an honest shop window at the same time — you can see how the platform behaves.",
        "Code preview before purchase comes with limits: a legal agreement, watermarks in the samples, usage tracking. Without that no developer brings their module to the platform.",
        "Two dashboards: the full one for the shop floor and a lighter one for a manager's phone.",
      ],
    },
    wrong: {
      ru: [
        "Демо — фронтенд на демо-данных: покупки симулированы, кода за кнопкой «купить» нет. Каталог «50+ решений» — это витрина каталога, а не пятьдесят готовых проверенных модулей.",
        "Цифры рынка — оценки на основе открытых отраслевых отчётов, а не наша выручка. Выручки у проекта нет, продажи не запускались.",
        "Модульные IoT-устройства — идея, а не продукт: ни одной платы мы не разводили.",
      ],
      en: [
        "The demo is a front end on demo data: purchases are simulated and there is no code behind the buy button. A catalogue of \"50+ solutions\" is a catalogue front, not fifty finished, vetted modules.",
        "The market figures are estimates from public industry reports, not our revenue. The project has no revenue; sales were never started.",
        "Modular IoT hardware is an idea, not a product: we never laid out a single board.",
      ],
    },
    metrics: [
      { value: 30, label: { ru: "команд в очном финале Startup Battle", en: "teams in the in-person Startup Battle final" } },
      { value: 3, label: { ru: "города, где показывали проект", en: "cities where the project was shown" } },
      { value: 2024, plain: true, label: { ru: "год первого выхода на площадку", en: "the year of the first venue" } },
      { value: 4, label: { ru: "источника выручки в модели", en: "revenue streams in the model" } },
    ],
    result: {
      ru: "Прошли онлайн-отбор и попали в тридцатку команд, защищавшихся очно. Дальше не прошли. Отбор в тридцатку для первого выхода на площадку такого размера — нормальный результат, но переоценивать его не будем: до первого платящего клиента отсюда ещё далеко.",
      en: "We passed the online selection and made the thirty teams that pitched in person. We didn't go further. Making the top thirty on a first outing at a venue that size is a fair result, but we won't overrate it: the first paying customer is still a long way off.",
    },
    otherwise: {
      ru: "Половина того, что написано про рынок и модель, появилась из разговоров на площадках, а не из работы над кодом. Следующий шаг — не новая функция витрины, а бэкенд, оплата и одно настоящее внедрение: одно такое весит больше всех презентаций вместе взятых.",
      en: "Half of what we now say about the market and the model came out of conversations at venues, not out of writing code. The next step isn't another feature on the front — it's a backend, payments and one real deployment: one of those outweighs every presentation put together.",
    },
    links: {
      demo: "https://krazher220-ceo.github.io/npai-landing/",
      repo: "https://github.com/Krazher220-Ceo/npai-landing",
    },
    certificateId: "02",
  },
];

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
