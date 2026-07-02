import { createFileRoute, Link } from "@tanstack/react-router";
import { TEMPLATES } from "@/lib/templates";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }} dir="rtl">
      <header className="mx-auto max-w-6xl px-6 pt-14 pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          مولّد منشورات تيك توك
        </div>
        <h1 className="mt-6 text-5xl font-black tracking-tight text-foreground md:text-6xl">
          اختر قالباً وابدأ التصميم
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          خمسة قوالب جاهزة بتنسيق 1080×1920. ارفع صورتك، اقتصّها لتناسب الإطار،
          عدّل النصوص، ثم نزّل PNG بجودة عالية.
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <ol className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {TEMPLATES.map((t, i) => (
            <li key={t.id}>
              <Link
                to="/editor/$templateId"
                params={{ templateId: t.id }}
                className="group block overflow-hidden rounded-2xl border border-border/70 bg-card shadow-lg transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="relative aspect-[9/16] overflow-hidden bg-muted">
                  <img
                    src={t.preview}
                    alt={t.name}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow">
                    {i + 1}
                  </div>
                </div>
                <div className="px-3 py-3 text-center">
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
