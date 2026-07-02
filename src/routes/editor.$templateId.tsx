import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import Cropper from "react-easy-crop";
import { toPng } from "html-to-image";
import { getTemplate, type TextZone } from "@/lib/templates";
import { getCroppedImageUrl, type Area } from "@/lib/crop-image";

export const Route = createFileRoute("/editor/$templateId")({
  component: EditorPage,
  head: ({ params }) => ({
    meta: [
      { title: `تحرير القالب ${params.templateId} — TikTok Post Generator` },
      { name: "description", content: "حرّر قالبك: ارفع صورة، اقتصّها، غيّر النصوص، ثم نزّل PNG بحجم 1080×1920." },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">القالب غير موجود.</p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-destructive">حدث خطأ: {error.message}</p>
    </div>
  ),
});

const CANVAS_W = 1080;
const CANVAS_H = 1920;

function EditorPage() {
  const { templateId } = Route.useParams();
  const router = useRouter();
  const template = getTemplate(templateId);

  if (!template) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" dir="rtl">
        <div className="text-center">
          <p className="text-muted-foreground">القالب غير موجود.</p>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">العودة</Link>
        </div>
      </div>
    );
  }

  // texts state per zone
  const [texts, setTexts] = useState<Record<string, string>>(() =>
    Object.fromEntries(template.zones.map((z) => [z.id, z.defaultText])),
  );

  // photo state
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  // cropper transient state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, areaPx: Area) => {
    setCroppedAreaPixels(areaPx);
  }, []);

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const confirmCrop = async () => {
    if (!rawImage || !croppedAreaPixels) return;
    const url = await getCroppedImageUrl(rawImage, croppedAreaPixels, CANVAS_W, CANVAS_H);
    setCroppedUrl(url);
    setCropOpen(false);
  };

  const stageRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const exportPng = async () => {
    if (!stageRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(stageRef.current, {
        width: CANVAS_W,
        height: CANVAS_H,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: "#000000",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `tiktok-template-${template.id}.png`;
      a.click();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.navigate({ to: "/" })}
              className="rounded-md border border-border bg-secondary px-3 py-1.5 text-sm text-secondary-foreground transition hover:bg-muted"
            >
              → القوالب
            </button>
            <h1 className="text-base font-bold">{template.name}</h1>
          </div>
          <button
            onClick={exportPng}
            disabled={!croppedUrl || exporting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {exporting ? "...جارِ التصدير" : "تنزيل PNG (1080×1920)"}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[1fr_360px]">
        {/* Preview stage */}
        <section className="flex justify-center">
          <PreviewStage
            ref={stageRef}
            template={template}
            texts={texts}
            croppedUrl={croppedUrl}
            onPickPhoto={() => document.getElementById("photo-input")?.click()}
          />
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFilePick}
          />
        </section>

        {/* Sidebar controls */}
        <aside className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-bold text-foreground">الصورة</h2>
            <button
              onClick={() => document.getElementById("photo-input")?.click()}
              className="w-full rounded-md border border-dashed border-border bg-secondary/50 px-3 py-3 text-sm text-secondary-foreground transition hover:bg-secondary"
            >
              {croppedUrl ? "استبدال الصورة" : "رفع صورة"}
            </button>
            {croppedUrl && rawImage && (
              <button
                onClick={() => setCropOpen(true)}
                className="mt-2 w-full rounded-md border border-border bg-transparent px-3 py-2 text-xs text-muted-foreground transition hover:bg-secondary"
              >
                إعادة اقتصاص
              </button>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-bold text-foreground">النصوص</h2>
            <div className="space-y-3">
              {template.zones.map((z) => (
                <label key={z.id} className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">{z.label}</span>
                  <input
                    type="text"
                    value={texts[z.id]}
                    onChange={(e) => setTexts((s) => ({ ...s, [z.id]: e.target.value }))}
                    className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                    dir="rtl"
                  />
                </label>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Crop modal */}
      {cropOpen && rawImage && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-sm">اقتصّ الصورة لتناسب إطار 9:16</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCropOpen(false)}
                className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10"
              >
                إلغاء
              </button>
              <button
                onClick={confirmCrop}
                className="rounded-md bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground hover:opacity-90"
              >
                تأكيد
              </button>
            </div>
          </div>
          <div className="relative flex-1">
            <Cropper
              image={rawImage}
              crop={crop}
              zoom={zoom}
              aspect={CANVAS_W / CANVAS_H}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid
              restrictPosition={false}
              objectFit="contain"
            />
          </div>
          <div className="flex items-center gap-3 bg-black/70 px-4 py-3 text-white">
            <span className="text-xs">تكبير</span>
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-[color:var(--primary)]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Preview stage — the true 1080x1920 canvas, visually scaled to fit  */
/* ------------------------------------------------------------------ */

type StageProps = {
  template: ReturnType<typeof getTemplate>;
  texts: Record<string, string>;
  croppedUrl: string | null;
  onPickPhoto: () => void;
};

const PreviewStage = ({
  ref,
  template,
  texts,
  croppedUrl,
  onPickPhoto,
}: StageProps & { ref: React.RefObject<HTMLDivElement | null> }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const apply = () => setScale(el.clientWidth / CANVAS_W);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="w-full max-w-[420px]">
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-xl bg-black shadow-2xl"
        style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
      >
        <div
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${scale})`,
            transformOrigin: "top right",
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <StageInner
            ref={ref}
            template={template!}
            texts={texts}
            croppedUrl={croppedUrl}
            onPickPhoto={onPickPhoto}
          />
        </div>
      </div>
    </div>
  );
};

function StageInner({
  ref,
  template,
  texts,
  croppedUrl,
  onPickPhoto,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  template: NonNullable<ReturnType<typeof getTemplate>>;
  texts: Record<string, string>;
  croppedUrl: string | null;
  onPickPhoto: () => void;
}) {
  return (
    <div
      ref={ref}
      className="relative"
      style={{ width: CANVAS_W, height: CANVAS_H, background: "#111" }}
      dir="rtl"
    >
      {/* Photo layer */}
      {croppedUrl ? (
        <img
          src={croppedUrl}
          alt=""
          crossOrigin="anonymous"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <button
          type="button"
          onClick={onPickPhoto}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-900 text-neutral-300"
        >
          <div className="rounded-full bg-primary/20 px-8 py-6 text-[64px]">＋</div>
          <span className="text-[42px] font-bold">اضغط لرفع صورة</span>
          <span className="text-[28px] opacity-70">أي صورة، سنقتصّها لك</span>
        </button>
      )}

      {/* Overlay darken for text legibility */}
      {template.overlay && croppedUrl && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `rgba(0,0,0,${template.overlay})` }}
        />
      )}

      {/* Text zones */}
      {template.zones.map((z) => (
        <ZoneText key={z.id} zone={z} text={texts[z.id] ?? ""} />
      ))}
    </div>
  );
}

function ZoneText({ zone, text }: { zone: TextZone; text: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${zone.x}%`,
        top: `${zone.y}%`,
        width: `${zone.w}%`,
        color: zone.color,
        fontFamily: "var(--font-arabic)",
        fontWeight: zone.weight,
        fontSize: `${zone.fontSize}px`,
        lineHeight: 1.1,
        textAlign: zone.align,
        direction: "rtl",
        textShadow: zone.shadow ? "0 4px 24px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.6)" : undefined,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {text}
    </div>
  );
}
