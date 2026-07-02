import { useEffect, useState } from "react";
import { Calculator, Droplets, BookOpen, ChevronDown } from "lucide-react";
import { api } from "../services/api";
import type { HealthArticle, FAQ } from "../types";
import { useLanguage } from "../context/LanguageContext";

export default function HealthTips() {
  const { lang } = useLanguage();
  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    api.get<HealthArticle[]>("/api/articles", { params: { language: lang } }).then((r) => setArticles(r.data));
    api.get<FAQ[]>("/api/faqs", { params: { language: lang } }).then((r) => setFaqs(r.data));
  }, [lang]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900 flex items-center gap-2">
          <BookOpen className="text-brand-600" /> Health Articles
        </h1>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a) => (
            <article key={a.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <span className="inline-block rounded-full bg-care-50 text-care-600 text-xs font-semibold px-3 py-1">
                {a.category}
              </span>
              <h3 className="mt-3 font-display font-semibold text-ink-900">{a.title}</h3>
              <p className="mt-2 text-sm text-ink-500 line-clamp-4">{a.content}</p>
            </article>
          ))}
        </div>
      </div>

      <Calculators />

      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">Frequently Asked Questions</h2>
        <div className="mt-6 space-y-3 max-w-3xl">
          {faqs.map((f) => (
            <div key={f.id} className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-medium text-sm text-ink-900">{f.question}</span>
                <ChevronDown
                  className={`transition-transform text-ink-500 shrink-0 ml-3 ${openFaq === f.id ? "rotate-180" : ""}`}
                  size={18}
                />
              </button>
              {openFaq === f.id && <p className="px-5 pb-4 text-sm text-ink-500">{f.answer}</p>}
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
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="font-display font-semibold text-ink-900 flex items-center gap-2">
          <Calculator className="text-brand-600" size={20} /> BMI Calculator
        </h3>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-ink-700">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-ink-700">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            />
          </div>
          <button
            onClick={calcBmi}
            className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Calculate
          </button>
          {bmiResult && (
            <p className="text-sm text-ink-700">
              Your BMI is <span className="font-bold">{bmiResult.bmi}</span> ({bmiResult.category})
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="font-display font-semibold text-ink-900 flex items-center gap-2">
          <Droplets className="text-care-600" size={20} /> Water Intake Calculator
        </h3>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-ink-700">Weight (kg)</label>
            <input
              type="number"
              value={waterWeight}
              onChange={(e) => setWaterWeight(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-ink-700">Activity level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            onClick={calcWater}
            className="rounded-full bg-care-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-care-600"
          >
            Calculate
          </button>
          {waterResult && (
            <p className="text-sm text-ink-700">
              Aim for <span className="font-bold">{waterResult.liters_per_day}L</span> per day (~
              {waterResult.glasses_per_day} glasses)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
