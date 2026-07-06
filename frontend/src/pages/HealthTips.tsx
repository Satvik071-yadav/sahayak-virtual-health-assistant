import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Droplets, ChevronDown, Search, Bookmark, BookmarkCheck } from "lucide-react";
import { api } from "../services/api";
import type { HealthArticle, FAQ } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { Card, SectionHeading } from "../components/ui/primitives";
import Button from "../components/ui/Button";

export default function HealthTips() {
  const { lang } = useLanguage();
  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());

  useEffect(() => {
    api.get<HealthArticle[]>("/api/articles", { params: { language: lang } }).then((r) => setArticles(r.data));
    api.get<FAQ[]>("/api/faqs", { params: { language: lang } }).then((r) => setFaqs(r.data));
  }, [lang]);

  const categories = useMemo(() => Array.from(new Set(articles.map((a) => a.category))), [articles]);
  const filtered = useMemo(
    () =>
      articles.filter(
        (a) =>
          (!category || a.category === category) &&
          (a.title.toLowerCase().includes(query.toLowerCase()) || a.content.toLowerCase().includes(query.toLowerCase()))
      ),
    [articles, query, category]
  );

  function toggleBookmark(id: number) {
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div>
        <SectionHeading eyebrow="Learn" title="Health Articles" center={false} />

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors ${
              category === "" ? "bg-linear-to-r from-brand-600 to-accent-600 text-white border-transparent" : "border-slate-200 dark:border-white/10 text-ink-700 dark:text-ink-200"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors ${
                category === c ? "bg-linear-to-r from-brand-600 to-accent-600 text-white border-transparent" : "border-slate-200 dark:border-white/10 text-ink-700 dark:text-ink-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Pinterest-style masonry via CSS columns */}
        <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5">
          {filtered.map((a, i) => (
            <motion.article
              key={a.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05 }}
              className="break-inside-avoid"
            >
              <Card className="p-6" hover>
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-block rounded-full bg-care-50 dark:bg-care-500/10 text-care-600 dark:text-care-400 text-xs font-semibold px-3 py-1">
                    {a.category}
                  </span>
                  <button
                    onClick={() => toggleBookmark(a.id)}
                    className="text-ink-400 hover:text-brand-600 transition-colors"
                    aria-label="Bookmark article"
                  >
                    {bookmarks.has(a.id) ? <BookmarkCheck size={18} className="text-brand-600" /> : <Bookmark size={18} />}
                  </button>
                </div>
                <h3 className="mt-3 font-display font-semibold text-ink-900 dark:text-white">{a.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{a.content}</p>
              </Card>
            </motion.article>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-ink-500 py-12">No articles match your search.</p>
          )}
        </div>
      </div>

      <Calculators />

      <div>
        <SectionHeading eyebrow="Support" title="Frequently Asked Questions" center={false} />
        <div className="mt-6 space-y-3 max-w-3xl">
          {faqs.map((f) => (
            <div key={f.id} className="rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-ink-800 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-medium text-sm text-ink-900 dark:text-white">{f.question}</span>
                <ChevronDown
                  className={`transition-transform text-ink-500 shrink-0 ml-3 ${openFaq === f.id ? "rotate-180" : ""}`}
                  size={18}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === f.id ? "auto" : 0, opacity: openFaq === f.id ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-sm text-ink-500">{f.answer}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Calculators() {
  const [weight, setWeight] = useState(60);
  const [height, setHeight] = useState(165);
  const [bmiResult, setBmiResult] = useState<{ bmi: number; category: string } | null>(null);

  const [waterWeight, setWaterWeight] = useState(60);
  const [activity, setActivity] = useState("moderate");
  const [waterResult, setWaterResult] = useState<{ liters_per_day: number; glasses_per_day: number } | null>(null);

  async function calcBmi() {
    const { data } = await api.post("/api/tools/bmi", { weight_kg: weight, height_cm: height });
    setBmiResult(data);
  }

  async function calcWater() {
    const { data } = await api.post("/api/tools/water-intake", {
      weight_kg: waterWeight,
      activity_level: activity,
    });
    setWaterResult(data);
  }

  return (
    <div>
      <SectionHeading eyebrow="Tools" title="Quick Health Calculators" center={false} />
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <Card className="p-6" hover={false}>
          <h3 className="font-display font-semibold text-ink-900 dark:text-white flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300">
              <Calculator size={18} />
            </span>
            BMI Calculator
          </h3>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm text-ink-700 dark:text-ink-200">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-ink-700 dark:text-ink-200">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white px-4 py-2.5 text-sm"
              />
            </div>
            <Button onClick={calcBmi}>Calculate</Button>
            {bmiResult && (
              <p className="text-sm text-ink-700 dark:text-ink-200">
                Your BMI is <span className="font-bold">{bmiResult.bmi}</span> ({bmiResult.category})
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6" hover={false}>
          <h3 className="font-display font-semibold text-ink-900 dark:text-white flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-care-50 dark:bg-care-500/10 text-care-600 dark:text-care-400">
              <Droplets size={18} />
            </span>
            Water Intake Calculator
          </h3>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm text-ink-700 dark:text-ink-200">Weight (kg)</label>
              <input
                type="number"
                value={waterWeight}
                onChange={(e) => setWaterWeight(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-ink-700 dark:text-ink-200">Activity level</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white px-4 py-2.5 text-sm"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
            <Button variant="secondary" onClick={calcWater}>Calculate</Button>
            {waterResult && (
              <p className="text-sm text-ink-700 dark:text-ink-200">
                Aim for <span className="font-bold">{waterResult.liters_per_day}L</span> per day (~
                {waterResult.glasses_per_day} glasses)
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
