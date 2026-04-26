// lib/arabic-prompts.ts

export type Language = "auto" | "en" | "ar";

export const ARABIC_HOOKS = [
  "رأي غير شائع:",
  "٣ أخطاء يرتكبها المؤسسون عند بناء منتجاتهم...",
  "ما لا يخبرك به أحد عن ريادة الأعمال في المنطقة العربية...",
  "هل يمكن للمؤسسين العرب أن ينافسوا عالمياً؟",
  "الحقيقة التي يتجاهلها معظم صنّاع المحتوى:",
  "من مصر إلى العالم:",
  "اكتشفت أمراً غيّر طريقة عملي بالكامل:",
  "بعد سنوات في عالم ريادة الأعمال، تعلّمت درساً واحداً:",
];

export const ARABIC_CTAS = [
  "ما رأيك؟",
  "هل توافق؟",
  "جرّبها وقل لي رأيك.",
  "شاركها مع مؤسس يحتاجها.",
  "احفظها للرجوع إليها لاحقاً.",
  'اكتب "TEOS" إذا تريد التجربة.',
  "تابعني لمحتوى مشابه.",
];

export const ARABIC_HASHTAGS = {
  general: ["#الذكاء_الاصطناعي", "#رواد_الأعمال", "#الشركات_الناشئة", "#MENA"],
  egypt: ["#مصر", "#رواد_أعمال_مصر"],
  content: ["#صناع_المحتوى", "#تسويق_رقمي"],
  tech: ["#SaaS", "#AI", "#تكنولوجيا"],
  pi: ["#PiNetwork", "#شبكة_باي"],
};

export const ARABIC_BEST_TIMES = [
  "٩–١١ صباحاً",
  "١٢–٢ ظهراً",
  "٧–٩ مساءً",
  "١٠–١٢ ليلاً",
];

/** Detect Arabic vs English from prompt characters. */
export function detectLanguage(text: string): "ar" | "en" {
  if (!text) return "en";
  const arabicChars = text.match(/[\u0600-\u06FF]/g);
  const cleaned = text.replace(/\s/g, "");
  if (!arabicChars || cleaned.length === 0) return "en";
  return arabicChars.length / cleaned.length > 0.25 ? "ar" : "en";
}

export function resolveLanguage(language: Language, prompt: string): "ar" | "en" {
  if (language === "ar") return "ar";
  if (language === "en") return "en";
  return detectLanguage(prompt);
}

const PLATFORM_AR_STYLE: Record<string, string> = {
  X: "خطّاف عربي قصير وحاد. تويتة واحدة أقل من ٢٨٠ حرفاً، نبرة استفزازية فكرياً، بدون حشو، بدون ترجمة من الإنجليزية.",
  Twitter:
    "خطّاف عربي قصير وحاد. تويتة واحدة أقل من ٢٨٠ حرفاً، نبرة استفزازية فكرياً، بدون حشو.",
  LinkedIn:
    "منشور قيادة فكرية احترافي بنبرة مؤسس عربي حقيقي. ابدأ بخطّاف قوي في سطر واحد، ثم ٣ نقاط واضحة، ثم خلاصة شخصية، ثم سؤال مفتوح يدعو للحوار. استخدم فقرات قصيرة جداً مفصولة بأسطر فارغة.",
  Instagram:
    "كابشن عاطفي بنبرة صانع محتوى عربي. ابدأ بخطّاف يلامس الإحساس، ثم قصة قصيرة من ٣ إلى ٤ أسطر، ثم درس مكثّف، ثم CTA. استخدم رموز تعبيرية بذوق وليس بإفراط.",
  TikTok:
    "سكربت فيديو عربي قصير. اكتب: (١) خطّاف في أول ٣ ثوانٍ، (٢) ٣ مشاهد متتابعة بأفعال بصرية واضحة، (٣) CTA في النهاية. كل مشهد في سطر منفصل ومرقّم.",
  Threads:
    "بداية محادثة عربية قصيرة، نبرة صادقة وشخصية، تطرح سؤالاً أو رأياً يفتح نقاشاً.",
  Telegram:
    "تحديث مجتمعي عربي واضح ومباشر بنبرة صديق مقرّب من المجتمع. عنوان قصير، ثم تفاصيل في نقاط، ثم خطوة تالية.",
  WhatsApp:
    "ملاحظة قابلة للمشاركة، قصيرة، بنبرة مؤسس عربي يكتب لصديق. لا تتجاوز ٤ أسطر.",
};

const PLATFORM_EN_STYLE: Record<string, string> = {
  X: "Short sharp hook tweet, under 280 characters, contrarian or insight-driven.",
  Twitter: "Short sharp hook tweet, under 280 characters, contrarian or insight-driven.",
  LinkedIn:
    "Professional founder thought-leadership post: strong one-line hook, 3 clear points, personal takeaway, open question. Short paragraphs separated by blank lines.",
  Instagram:
    "Emotional creator caption: hook, mini story (3–4 lines), tight lesson, CTA. Tasteful emojis only.",
  TikTok:
    "Short video script: (1) 3-second hook, (2) 3 numbered scene beats with clear visual actions, (3) CTA at the end.",
  Threads: "Short honest conversation starter that opens a real discussion.",
  Telegram: "Clear community update: short title, bullet details, next step.",
  WhatsApp: "Short shareable founder note, max 4 lines, friendly tone.",
};

export function buildSystemPrompt(opts: {
  platform: string;
  tone: string;
  goal: string;
  lang: "ar" | "en";
  founderMode?: boolean;
}): string {
  const { platform, tone, goal, lang, founderMode } = opts;
  const platformKey = platform || "X";

  if (lang === "ar") {
    const style = PLATFORM_AR_STYLE[platformKey] || PLATFORM_AR_STYLE.X;
    return `أنت كبير كتّاب المحتوى في TEOS AI Engine. مهمتك كتابة محتوى عربي أصيل لرواد الأعمال وصنّاع المحتوى في منطقة الشرق الأوسط وشمال أفريقيا.

قواعد صارمة لا يمكن كسرها:
- اكتب بالعربية الفصحى الحديثة المفهومة، مع لمسة عامية مصرية خفيفة عند الحاجة لتقريب المعنى.
- لا تترجم من الإنجليزية. فكّر بالعربية أولاً، ثم اكتب بالعربية.
- استخدم تركيب جملة عربي طبيعي، وليس تركيباً إنجليزياً معرّباً.
- لا تستخدم كلمات إنجليزية إلا للأسماء التقنية الراسخة (مثل: SaaS، AI، Pi Network، LinkedIn).
- السطر الأول يجب أن يكون خطّافاً قوياً يوقف التمرير.
- النهاية يجب أن تحتوي على CTA عربي طبيعي وقصير.
- لا تستخدم علامات اقتباس مزدوجة أمريكية حول النص الكامل.
- لا تكتب "إليك المنشور" أو "هذا منشور لـ"، اكتب المنشور مباشرة.

السياق:
- المنصة: ${platformKey}
- النبرة المطلوبة: ${tone}
- الهدف من المنشور: ${goal}
${founderMode ? "- وضع المؤسس: مفعّل. اكتب بصوت مؤسس حقيقي يشارك تجربة شخصية، ليس بصوت إعلاني." : ""}

أسلوب المنصة:
${style}

أعد فقط النص النهائي للمنشور بالعربية، بدون شرح، بدون مقدمات، بدون عناوين تنظيمية.`;
  }

  const style = PLATFORM_EN_STYLE[platformKey] || PLATFORM_EN_STYLE.X;
  return `You are TEOS AI Engine's senior copywriter for founders and creators.

Strict rules:
- Write in clear, native English.
- Strong hook in line one.
- End with a clean, native CTA.
- Do not say "here is your post"; output the post directly.

Context:
- Platform: ${platformKey}
- Tone: ${tone}
- Goal: ${goal}
${founderMode ? "- Founder Mode: ON. Write as a real founder sharing experience, not marketing." : ""}

Platform style:
${style}

Return only the final post text. No preamble, no labels.`;
}

export function getArabicHashtags(prompt: string): string[] {
  const lower = (prompt || "").toLowerCase();
  const tags = new Set<string>();
  ARABIC_HASHTAGS.general.forEach((t) => tags.add(t));

  if (/مصر|cairo|egypt|قاهرة/i.test(prompt)) {
    ARABIC_HASHTAGS.egypt.forEach((t) => tags.add(t));
  }
  if (/محتوى|content|creator|صانع|تسويق|marketing/i.test(lower)) {
    ARABIC_HASHTAGS.content.forEach((t) => tags.add(t));
  }
  if (/saas|ai|ذكاء|تقني|tech|برمجة|منتج/i.test(lower)) {
    ARABIC_HASHTAGS.tech.forEach((t) => tags.add(t));
  }
  if (/pi|باي|pioneer|بايونير/i.test(lower)) {
    ARABIC_HASHTAGS.pi.forEach((t) => tags.add(t));
  }
  return Array.from(tags).slice(0, 7);
}

export function getEnglishHashtags(prompt: string): string[] {
  const lower = (prompt || "").toLowerCase();
  const tags = new Set<string>(["#TEOS", "#AI", "#Founders"]);
  if (/saas/i.test(lower)) tags.add("#SaaS");
  if (/startup|founder/i.test(lower)) tags.add("#Startup");
  if (/pi|pioneer/i.test(lower)) tags.add("#PiNetwork");
  if (/marketing/i.test(lower)) tags.add("#Marketing");
  if (/content|creator/i.test(lower)) tags.add("#ContentCreator");
  if (/mena|arab|egypt|middle east/i.test(lower)) tags.add("#MENA");
  return Array.from(tags).slice(0, 7);
}

export function pickArabicCTA(goal: string): string {
  const g = (goal || "").toLowerCase();
  if (/save|حفظ/i.test(g)) return "احفظها للرجوع إليها لاحقاً.";
  if (/share|مشاركة/i.test(g)) return "شاركها مع مؤسس يحتاجها.";
  if (/lead|عميل|اشتراك|conver/i.test(g)) return 'اكتب "TEOS" إذا تريد التجربة.';
  if (/follow|متابعة/i.test(g)) return "تابعني لمحتوى مشابه.";
  return "ما رأيك؟";
}

export function pickEnglishCTA(goal: string): string {
  const g = (goal || "").toLowerCase();
  if (/save/i.test(g)) return "Save this for later.";
  if (/share/i.test(g)) return "Share this with a founder who needs it.";
  if (/lead|conver/i.test(g)) return 'Comment "TEOS" if you want to try it.';
  if (/follow/i.test(g)) return "Follow for more like this.";
  return "What do you think?";
}

export function pickArabicBestTime(platform: string): string {
  const map: Record<string, string> = {
    X: "٩–١١ صباحاً",
    Twitter: "٩–١١ صباحاً",
    LinkedIn: "٨–١٠ صباحاً",
    Instagram: "٧–٩ مساءً",
    TikTok: "٧–١٠ مساءً",
    Threads: "١٢–٢ ظهراً",
    Telegram: "١٠–١٢ ليلاً",
    WhatsApp: "١٢–٢ ظهراً",
  };
  return map[platform] || "٧–٩ مساءً";
}

export function pickEnglishBestTime(platform: string): string {
  const map: Record<string, string> = {
    X: "9–11 AM",
    Twitter: "9–11 AM",
    LinkedIn: "8–10 AM",
    Instagram: "7–9 PM",
    TikTok: "7–10 PM",
    Threads: "12–2 PM",
    Telegram: "10 PM–12 AM",
    WhatsApp: "12–2 PM",
  };
  return map[platform] || "7–9 PM";
}

export function getArabicChecklist(platform: string): string[] {
  return [
    "خطّاف قوي في السطر الأول",
    "نبرة عربية أصيلة، ليست ترجمة",
    "تركيب جملة عربي سليم",
    "CTA عربي واضح في النهاية",
    "هاشتاغات عربية مناسبة للسياق",
    `صياغة متوافقة مع ${platform}`,
  ];
}

export function getEnglishChecklist(platform: string): string[] {
  return [
    "Strong hook in line one",
    "Clear narrative flow",
    "Native voice",
    "Clean CTA at the end",
    "Relevant hashtags",
    `${platform}-native formatting`,
  ];
}

export function buildArabicVideoScript(): string {
  return `المشهد ١ (٠–٣ ث): خطّاف بصري قوي يوقف التمرير فوراً.
المشهد ٢ (٣–٨ ث): اعرض المشكلة الحقيقية بصرياً مع نص قصير على الشاشة.
المشهد ٣ (٨–١٥ ث): قدّم الحل بطريقة سريعة وواضحة.
CTA: "تابعني لمزيد من النصائح، واكتب TEOS في التعليق."`;
}

export function buildEnglishVideoScript(): string {
  return `Scene 1 (0–3s): Strong visual hook that stops the scroll.
Scene 2 (3–8s): Show the real problem visually with a short on-screen line.
Scene 3 (8–15s): Reveal the solution clearly and fast.
CTA: "Follow for more, comment TEOS to try it."`;
}