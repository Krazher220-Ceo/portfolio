import type { Bi } from "./projects";

/**
 * Реестр сертификатов. ЕДИНСТВЕННОЕ место, которое правится
 * при добавлении файла. Вёрстку трогать не нужно —
 * инструкция лежит в /public/certificates/README.md.
 */

export type CertStatus = "published" | "pending" | "festival-only";

export type Certificate = {
  /** = префикс имени файла */
  id: string;
  /** к какому проекту относится; null — общий */
  projectId: string | null;
  event: string;
  /** YYYY-MM */
  date: string;
  file: string | null;
  preview: string | null;
  /** Реальные пропорции превью: сертификат показывается целиком. */
  previewW: number;
  previewH: number;
  status: CertStatus;
  alt: Bi;
  note: Bi;
  /** Одна строка для резюме: note там не помещается. */
  short: Bi;
  /** для festival-only: куда вести за общим сертификатом */
  refersTo?: string;
};

export const certificates: Certificate[] = [
  {
    id: "04",
    projectId: null,
    event: "ШАГ · School of Active Citizens",
    date: "2025-05",
    file: "04-shag-qostanai-2025.jpg",
    preview: "04-shag-qostanai-2025-preview.webp",
    previewW: 900,
    previewH: 611,
    status: "published",
    short: {
      ru: "Именной; проект реализован за счёт городского бюджета",
      en: "Personal; the project was built with city budget funding",
    },
    alt: {
      ru: "Сертификат «Школы активных горожан» за проект благоустройства детской площадки во дворе дома по улице Алтынсарина, 7, Костанай, 2025",
      en: "Certificate from the School of Active Citizens for a project to rebuild the playground in the courtyard at 7 Altynsarin Street, Kostanay, 2025",
    },
    note: {
      ru: "Бесплатная программа ОЮЛ «Ассоциация развития социальных технологий» вместе с ERG Komek и Qostanai Hub: подростков учат бюджетной грамотности и подготовке заявок в «Бюджет народного участия». Проект — двор на Алтынсарина, 7: чертежи, смета и подписи жильцов, собранные по квартирам; он прошёл экспертный совет акимата, городское голосование и получил финансирование. Подпись: вице-президент ассоциации Сания Арапова.",
      en: "A free programme run by the Association for the Development of Social Technologies together with ERG Komek and Qostanai Hub: teenagers are taught budget literacy and how to file bids for the participatory budget. The project was the courtyard at 7 Altynsarin Street — drawings, a cost estimate and residents' signatures collected door to door; it passed the city administration's expert board, won the public vote and was funded. Signed by the association's vice-president, Saniya Arapova.",
    },
  },
  {
    id: "05",
    projectId: "npai",
    event: "Pizza Pitch · Qostanai Hub",
    /* На дипломе проставлен только год. 08 — по Qostanai Investment
       Forum 2025, в рамках которого проходил питчинг; месяц не
       подтверждён документом, поэтому оговорён в note. */
    date: "2025-08",
    file: "05-npai-pizza-pitch-2025.jpg",
    preview: "05-npai-pizza-pitch-2025-preview.webp",
    previewW: 860,
    previewH: 600,
    status: "published",
    short: {
      ru: "Третье место в конкурсе стартап-идей",
      en: "Third place in the startup idea contest",
    },
    alt: {
      ru: "Диплом за третье место в конкурсе стартап-идей Pizza Pitch, Qostanai Hub, Костанай, 2025",
      en: "Diploma for third place in the Pizza Pitch startup idea competition, Qostanai Hub, Kostanay, 2025",
    },
    note: {
      ru: "Третье место с NPAI. Pizza Pitch — открытый питчинг Astana Hub: короткая защита идеи перед залом и приглашёнными инвесторами. Подпись — Дамир Мнайдаров, директор костанайского филиала АКФ «Парк инновационных технологий» (юрлицо Astana Hub); на бланке логотипы Qostanai Hub и AMANAT, имя команды вписано от руки. Дата на дипломе — только год.",
      en: "Third place with NPAI. Pizza Pitch is Astana Hub's open pitching format: a short defence of an idea in front of the room and invited investors. Signed by Damir Mnaidarov, director of the Kostanay branch of the Technopark of Innovation Technologies cluster fund — Astana Hub's legal entity; the form carries the Qostanai Hub and AMANAT logos, with the team name written in by hand. The diploma is dated by year only.",
    },
  },
  {
    id: "01",
    projectId: "qa-vision",
    event: "Qostanai AI-Sana Industry Hackathon: Allur Challenge",
    date: "2025-11",
    file: "01-qa-vision-allur-2025.jpg",
    preview: "01-qa-vision-allur-2025-preview.webp",
    previewW: 900,
    previewH: 634,
    status: "published",
    short: {
      ru: "Именной; подписи КИнЭУ, МСЭ (ITU), Allur, Qostanai Hub",
      en: "Personal; signed by Dulatov University, the ITU, Allur and Qostanai Hub",
    },
    alt: {
      ru: "Сертификат участника Qostanai AI-Sana Industry Hackathon, кейс Allur, ноябрь 2025",
      en: "Certificate of participation, Qostanai AI-Sana Industry Hackathon, Allur case, November 2025",
    },
    note: {
      ru: "Подписи: президент КИнЭУ им. М. Дулатова, региональный директор офиса МСЭ для СНГ, руководитель Корпоративного университета Allur, директор Qostanai Hub.",
      en: "Signed by the president of Dulatov University, the ITU regional director for the CIS, the head of Allur's corporate university and the director of Qostanai Hub.",
    },
  },
  {
    id: "02",
    projectId: null,
    event: "IT Fest 2025",
    date: "2025-12",
    file: "02-itfest-2025.jpg",
    preview: "02-itfest-2025-preview.webp",
    previewW: 900,
    previewH: 636,
    status: "published",
    short: {
      ru: "Именной; республиканский фестиваль, Алматы",
      en: "Personal; national festival, Almaty",
    },
    alt: {
      ru: "Сертификат участника фестиваля IT Fest 2025, Алматы, декабрь 2025",
      en: "Certificate of participation, IT Fest 2025, Almaty, December 2025",
    },
    note: {
      ru: "Один общий сертификат на оба трека фестиваля. Председатель организационного комитета — Дузбаев Н. Т.",
      en: "One shared certificate for both festival tracks. Chair of the organising committee: N. T. Duzbayev.",
    },
  },
  {
    id: "03",
    projectId: "jasyl",
    event: "Qostanai Smart City Hackathon",
    date: "2026-08",
    file: "03-jasyl-qostanai-2026.jpg",
    preview: "03-jasyl-qostanai-2026-preview.webp",
    previewW: 900,
    previewH: 637,
    status: "published",
    short: {
      ru: "Выдан команде, не лично",
      en: "Issued to the team, not to a person",
    },
    alt: {
      ru: "Сертификат участия команды Jasyl в Qostanai Smart City Hackathon, Костанай, 2026",
      en: "Certificate of participation of team Jasyl in the Qostanai Smart City Hackathon, Kostanay, 2026",
    },
    note: {
      ru: "Выдан команде, а не лично: на бланке стоит название команды — Jasyl. Подписи: региональный директор офиса МСЭ для СНГ и директор костанайского филиала фонда «Astana Hub».",
      en: "Issued to the team, not to a person: the certificate carries the team name, Jasyl. Signed by the ITU regional director for the CIS and the director of the Kostanay branch of the Astana Hub foundation.",
    },
  },
  {
    id: "06",
    projectId: "agrovision",
    event: "Qostanai AgroTech Hackathon 2026 · победитель",
    date: "2026-09",
    file: "06-agrovision-winner-2026.jpg",
    preview: "06-agrovision-winner-2026-preview.webp",
    previewW: 900,
    previewH: 616,
    status: "published",
    short: {
      ru: "Первое место по кейсу «Олжа Агро»; выдан команде MusorDropp",
      en: "First place on the Olzha Agro case; issued to team MusorDropp",
    },
    alt: {
      ru: "Certificate of Achievement победителю AgroTech Hackathon 2026, команда Musor Dropp, Костанай, сентябрь 2026",
      en: "Certificate of Achievement for the winner of the AgroTech Hackathon 2026, team Musor Dropp, Kostanay, September 2026",
    },
    note: {
      ru: "Диплом победителя: первое место по кейсу №1 — распознавание сорняков по снимкам дрона. Выдан команде: на бланке название, под которым мы выступали, — Musor Dropp. Подписи: Е. Баярчук, CEO ТОО «Метод 2023», и Д. Мнайдаров, директор костанайского филиала Astana Hub.",
      en: "The winner's certificate: first place on case No. 1 — weed recognition from drone imagery. Issued to the team: it carries the name we competed under, Musor Dropp. Signed by Ye. Bayarchuk, CEO of Method 2023 LLP, and D. Mnaidarov, director of the Kostanay branch of Astana Hub.",
    },
  },
  {
    id: "07",
    projectId: "agrovision",
    event: "Qostanai AgroTech Hackathon 2026 · приз",
    date: "2026-09",
    file: "07-agrovision-prize-2026.jpg",
    preview: "07-agrovision-prize-2026-preview.webp",
    previewW: 900,
    previewH: 599,
    status: "published",
    short: {
      ru: "Денежный приз победителю — 500 000 ₸",
      en: "Cash prize for the winner — 500,000 ₸",
    },
    alt: {
      ru: "Сертификат на приз 500 000 тенге победителю Qostanai AgroTech Hackathon 2026",
      en: "Prize certificate for 500,000 tenge awarded to the winner of the Qostanai AgroTech Hackathon 2026",
    },
    note: {
      ru: "Приз победителю кейса — 500 000 ₸: общий фонд хакатона 1 000 000 ₸ делился поровну между двумя кейсами «Олжа Агро». Это табличка, которую вручают на сцене, — она же на фото команды.",
      en: "The case winner's prize — 500,000 ₸: the hackathon's 1,000,000 ₸ fund was split evenly between the two Olzha Agro cases. This is the board handed over on stage — the same one in the team photo.",
    },
  },
  {
    id: "08",
    projectId: "agrovision",
    event: "Qostanai AgroTech Hackathon 2026 · участие",
    date: "2026-09",
    file: "08-agrovision-appreciation-2026.jpg",
    preview: "08-agrovision-appreciation-2026-preview.webp",
    previewW: 900,
    previewH: 617,
    status: "published",
    short: {
      ru: "Сертификат участника; выдан команде",
      en: "Certificate of participation; issued to the team",
    },
    alt: {
      ru: "Certificate of Appreciation за участие в AgroTech Hackathon 2026, команда Musor Dropp, Костанай, сентябрь 2026",
      en: "Certificate of Appreciation for taking part in the AgroTech Hackathon 2026, team Musor Dropp, Kostanay, September 2026",
    },
    note: {
      ru: "Сертификат участника хакатона. Тоже командный, с теми же подписями, что и на дипломе победителя.",
      en: "The hackathon participation certificate. Also issued to the team, with the same signatures as the winner's certificate.",
    },
  },
];

/**
 * Треки фестиваля своего сертификата не имеют — они ссылаются на слот 02.
 * NPAI выступал на двух площадках: у Pizza Pitch свой диплом (слот 05),
 * у Startup Battle на IT Fest — общий фестивальный, поэтому он здесь тоже.
 */
export const festivalOnly: { projectId: string; certId: string }[] = [
  { projectId: "kz-universe", certId: "02" },
  { projectId: "npai", certId: "02" },
];

export const certById = (id: string) => certificates.find((c) => c.id === id);

export type ProjectCert = { cert: Certificate; festivalOnly: boolean };

/** Все документы проекта: сначала свои (в порядке реестра),
 *  затем общий фестивальный, если проект выступал на фестивале. */
export const certsForProject = (projectId: string): ProjectCert[] => {
  const own: ProjectCert[] = certificates
    .filter((c) => c.projectId === projectId)
    .map((cert) => ({ cert, festivalOnly: false }));
  const shared: ProjectCert[] = festivalOnly
    .filter((f) => f.projectId === projectId)
    .map((f) => certById(f.certId))
    .filter((c): c is Certificate => !!c)
    .map((cert) => ({ cert, festivalOnly: true }));
  return [...own, ...shared];
};
