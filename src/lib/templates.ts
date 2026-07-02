import t1 from "@/assets/templates/t1.webp";
import t2 from "@/assets/templates/t2.webp";
import t3 from "@/assets/templates/t3.webp";
import t4 from "@/assets/templates/t4.webp";
import t5 from "@/assets/templates/t5.webp";

// Canvas is 1080x1920. Positions/sizes are percentages of canvas.
export type TextZone = {
  id: string;
  label: string;
  defaultText: string;
  // box (percent of canvas 0-100)
  x: number; // left
  y: number; // top
  w: number; // width
  fontSize: number; // px at 1080-wide canvas
  weight: 400 | 700 | 800 | 900;
  color: string; // css color
  align: "right" | "left" | "center";
  // optional soft shadow for legibility
  shadow?: boolean;
};

export type Template = {
  id: string;
  name: string;
  preview: string;
  // fixed background darkening overlay opacity 0..1 for text legibility
  overlay?: number;
  zones: TextZone[];
};

const YELLOW = "#f5b52c";
const RED = "#e63946";
const WHITE = "#ffffff";

export const TEMPLATES: Template[] = [
  {
    id: "1",
    name: "قالب 1 — تخيل",
    preview: t1.url,
    overlay: 0.15,
    zones: [
      { id: "a", label: "كلمة افتتاحية", defaultText: "تخيل..", x: 55, y: 8, w: 40, fontSize: 60, weight: 700, color: YELLOW, align: "right", shadow: true },
      { id: "b", label: "السطر الأول", defaultText: "أن تستيقظ كل يوم", x: 5, y: 15, w: 90, fontSize: 96, weight: 900, color: YELLOW, align: "right", shadow: true },
      { id: "c", label: "السطر الثاني", defaultText: "وأنت حر ماليا", x: 5, y: 25, w: 90, fontSize: 96, weight: 900, color: YELLOW, align: "right", shadow: true },
      { id: "d", label: "التذييل", defaultText: "لا دوام ..لا مدير", x: 30, y: 35, w: 65, fontSize: 44, weight: 700, color: WHITE, align: "right", shadow: true },
    ],
  },
  {
    id: "2",
    name: "قالب 2 — الفرصة",
    preview: t2.url,
    overlay: 0.2,
    zones: [
      { id: "a", label: "العنوان (أصفر)", defaultText: "الفرصة", x: 5, y: 52, w: 90, fontSize: 110, weight: 900, color: YELLOW, align: "right", shadow: true },
      { id: "b", label: "العنوان (أحمر)", defaultText: "أمامك الان", x: 5, y: 60, w: 90, fontSize: 110, weight: 900, color: RED, align: "right", shadow: true },
      { id: "c", label: "السطر 1", defaultText: "لا تحتاج الى رأس مال", x: 5, y: 70, w: 90, fontSize: 52, weight: 700, color: WHITE, align: "right", shadow: true },
      { id: "d", label: "السطر 2", defaultText: "لا تحتاج الى خبرة سابقة", x: 5, y: 75, w: 90, fontSize: 52, weight: 700, color: WHITE, align: "right", shadow: true },
      { id: "e", label: "السطر 3", defaultText: "كل ما تحتاجه هو هاتفك", x: 5, y: 80, w: 90, fontSize: 52, weight: 700, color: WHITE, align: "right", shadow: true },
      { id: "f", label: "التذييل", defaultText: "علق بـ CR للمزيد من المعلومات", x: 5, y: 92, w: 90, fontSize: 38, weight: 700, color: WHITE, align: "center", shadow: true },
    ],
  },
  {
    id: "3",
    name: "قالب 3 — السوق",
    preview: t3.url,
    overlay: 0.15,
    zones: [
      { id: "a", label: "العنوان (أصفر)", defaultText: "السوق", x: 5, y: 26, w: 90, fontSize: 110, weight: 900, color: YELLOW, align: "right", shadow: true },
      { id: "b", label: "العنوان (أبيض)", defaultText: "ينمو بسرعة", x: 5, y: 34, w: 60, fontSize: 110, weight: 900, color: WHITE, align: "right", shadow: true },
      { id: "c", label: "العنوان الفرعي", defaultText: "الشركات تدفع مقابل صناعة المحتوى", x: 5, y: 43, w: 90, fontSize: 48, weight: 700, color: WHITE, align: "right", shadow: true },
      { id: "d", label: "التذييل", defaultText: "علق بـ CR للمزيد من المعلومات", x: 5, y: 92, w: 90, fontSize: 38, weight: 700, color: WHITE, align: "center", shadow: true },
    ],
  },
  {
    id: "4",
    name: "قالب 4 — المكافآت",
    preview: t4.url,
    overlay: 0.2,
    zones: [
      { id: "a", label: "العنوان (أبيض)", defaultText: "مكافأت", x: 55, y: 22, w: 40, fontSize: 100, weight: 900, color: WHITE, align: "right", shadow: true },
      { id: "b", label: "العنوان (أصفر)", defaultText: "صناع المحتوى", x: 5, y: 22, w: 50, fontSize: 100, weight: 900, color: YELLOW, align: "right", shadow: true },
      { id: "c", label: "العنوان الفرعي", defaultText: "مشاهدات = أرباح", x: 30, y: 33, w: 65, fontSize: 54, weight: 700, color: WHITE, align: "right", shadow: true },
      { id: "d", label: "التذييل", defaultText: "علق بـ CR للمزيد من المعلومات", x: 5, y: 92, w: 90, fontSize: 38, weight: 700, color: WHITE, align: "center", shadow: true },
    ],
  },
  {
    id: "5",
    name: "قالب 5 — لماذا",
    preview: t5.url,
    overlay: 0.2,
    zones: [
      { id: "a", label: "العنوان", defaultText: "لماذا الكليبنج ؟", x: 5, y: 22, w: 90, fontSize: 96, weight: 900, color: WHITE, align: "right", shadow: true },
      { id: "b", label: "نقطة 1", defaultText: "● بدون رأس مال", x: 5, y: 36, w: 90, fontSize: 52, weight: 700, color: WHITE, align: "right", shadow: true },
      { id: "c", label: "نقطة 2", defaultText: "● مناسب للمبتدأين", x: 5, y: 43, w: 90, fontSize: 52, weight: 700, color: WHITE, align: "right", shadow: true },
      { id: "d", label: "نقطة 3", defaultText: "● هامش ربح مرتفع", x: 5, y: 50, w: 90, fontSize: 52, weight: 700, color: WHITE, align: "right", shadow: true },
      { id: "e", label: "CTA", defaultText: "ابدأ الان  وغير مستقبلك", x: 5, y: 60, w: 90, fontSize: 60, weight: 800, color: YELLOW, align: "right", shadow: true },
      { id: "f", label: "التذييل", defaultText: "علق بـ CR للمزيد من المعلومات", x: 5, y: 92, w: 90, fontSize: 38, weight: 700, color: WHITE, align: "center", shadow: true },
    ],
  },
];

export const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id);
