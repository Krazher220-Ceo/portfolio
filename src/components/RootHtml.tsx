import type { ReactNode } from "react";
import { Onest, Inter, JetBrains_Mono } from "next/font/google";
import Shell from "@/components/Shell";
import type { Locale } from "@/i18n/dict";

/* Кириллица и латиница в одном семействе с одинаковыми метриками:
   иначе смена языка прыгает по высоте строк. unicode-range режет
   подмножества автоматически, шрифты хостятся со своего домена. */
const display = Onest({
  subsets: ["latin", "cyrillic"], weight: ["600", "700"],
  variable: "--font-display", display: "swap",
});
const body = Inter({
  subsets: ["latin", "cyrillic"], weight: ["400"],
  variable: "--font-body", display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"], weight: ["400"],
  variable: "--font-mono", display: "swap",
});

/**
 * Состояние проставляет сервер по языку маршрута — оно уже верное
 * в самой разметке, поэтому вспышки чужой темы не бывает в принципе,
 * а серверный и клиентский рендер не могут разойтись.
 *
 * Inline-скрипт остаётся ровно для двух вещей, которые сервер знать
 * не может: сохранённого предпочтения (посетитель, выбравший EN,
 * приходит на безпрефиксный адрес) и наличия точного указателя.
 * Он блокирующий и стоит до разметки — до первой отрисовки.
 */
const boot = `(function(){var d=document.documentElement;try{
var p=location.pathname,q=new URLSearchParams(location.search).get('lang');
var route=d.getAttribute('data-state'),want;
function save(v){try{localStorage.setItem('ak.state',v)}catch(e){}}
if(q==='en'||q==='ru'){want=q;save(q)}else{want=route;save(route)}
if(want!==route){
var m='/'+want+p.replace(/^\\/(ru|en)(?=\\/|$)/,'');
location.replace(m+location.search+location.hash);return}
if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches)d.dataset.cursor='on';
}catch(e){}})();`;

export default function RootHtml({
  locale, children,
}: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} data-state={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        {/* Без JS раскрытия не сработают, а текст обязан читаться. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <Shell locale={locale}>{children}</Shell>
      </body>
    </html>
  );
}
