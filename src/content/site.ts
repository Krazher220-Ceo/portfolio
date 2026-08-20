import type { Bi } from "./projects";

export const CONTACT = {
  email: "hi@alikhandev.com",
  github: "https://github.com/Krazher220-Ceo",
  githubLabel: "github.com/Krazher220-Ceo",
  repo: "https://github.com/Krazher220-Ceo/portfolio",
  license: "https://github.com/Krazher220-Ceo/portfolio/blob/main/LICENSE",
  domain: "https://alikhandev.com",
  projectsIndex: "https://alikhandev.com/projects/",
  itFest: "https://alikhandev.com/projects/almaty/itfest/",
};

/** Хронология 2024 → 2026. Только события, названные в источниках. */
export type TimelineEvent = {
  year: string;
  city: Bi;
  title: Bi;
  note: Bi;
};

export const timeline: TimelineEvent[] = [
  {
    year: "2024",
    city: { ru: "Костанай", en: "Kostanay" },
    title: {
      ru: "Идея-баттлы и питч-сессии Qostanai Hub",
      en: "Idea battles and pitch sessions at Qostanai Hub",
    },
    note: {
      ru: "Первые выходы с NPAI: научился укладывать идею в короткий питч и слышать вопросы про деньги, а не про код.",
      en: "First outings with NPAI: learned to fit an idea into a short pitch, and to hear questions about money rather than code.",
    },
  },
  {
    year: "2024–2025",
    city: { ru: "Павлодар", en: "Pavlodar" },
    title: { ru: "Питч-площадка", en: "Pitch venue" },
    note: {
      ru: "Разговор с людьми из промышленного региона — там вопрос «а кто это купит» звучит предметнее всего.",
      en: "A conversation with people from an industrial region, where the question of who actually buys this lands hardest.",
    },
  },
  {
    year: "2025",
    city: { ru: "Костанай", en: "Kostanay" },
    title: {
      ru: "Qostanai AI-Sana Industry Hackathon · Allur Challenge",
      en: "Qostanai AI-Sana Industry Hackathon · Allur Challenge",
    },
    note: {
      ru: "1–3 ноября, КИнЭУ им. М. Дулатова. Первый продукт под реальный производственный кейс — QA Vision.",
      en: "1–3 November at Dulatov University. The first product built against a real manufacturing case — QA Vision.",
    },
  },
  {
    year: "2025",
    city: { ru: "Алматы", en: "Almaty" },
    title: { ru: "IT Fest 2025 — два трека", en: "IT Fest 2025 — two tracks" },
    note: {
      ru: "5–6 декабря. Суточный хакатон с KZ UniVerse и Startup Battle с NPAI: топ-30 команд, очная защита.",
      en: "5–6 December. A 24-hour hackathon with KZ UniVerse and Startup Battle with NPAI: top-30 teams, pitched in person.",
    },
  },
  {
    year: "2026",
    city: { ru: "Костанай", en: "Kostanay" },
    title: {
      ru: "Qostanai Smart City Hackathon · кейс №1",
      en: "Qostanai Smart City Hackathon · case No. 1",
    },
    note: {
      ru: "13–14 августа. Jasyl: собственный датасет, дообученная модель и работающее офлайн-приложение за двое суток.",
      en: "13–14 August. Jasyl: our own dataset, a fine-tuned model and a working offline app in two days.",
    },
  },
];

/** Стек по трём уровням владения — блок D из docx, дословно. */
export const stack = {
  confident: [
    "Python", "JavaScript", "HTML/CSS", "FastAPI", "aiogram", "Git",
  ],
  worked: [
    "PyTorch", "TensorFlow", "MobileNetV2", "EfficientNet", "YOLOv8",
    "Supabase", "Leaflet.js", "PWA", "Render", "Docker",
  ],
  learning: ["React", "n8n", "Ollama", "LM Studio"],
};
