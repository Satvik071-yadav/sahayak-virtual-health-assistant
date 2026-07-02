export type Lang = "en" | "hi";

const en = {
  nav_home: "Home",
  nav_about: "About",
  nav_chat: "Chatbot",
  nav_emergency: "Emergency",
  nav_hospitals: "Nearby Hospitals",
  nav_telemedicine: "Telemedicine",
  nav_tips: "Health Tips",
  nav_contact: "Contact",
  nav_login: "Log in",
  nav_register: "Sign up",
  nav_logout: "Log out",
  nav_dashboard: "Dashboard",

  hero_eyebrow: "Free health guidance for every village",
  hero_title: "Your health helper, always within reach",
  hero_subtitle:
    "Talk to Sahayak in plain English or Hindi. Get health guidance, first-aid tips, and connect with real doctors — no medical jargon, no confusion.",
  hero_cta_chat: "Start talking to Sahayak",
  hero_cta_emergency: "I need urgent help",

  quick_symptom: "Check my symptoms",
  quick_hospital: "Find a hospital nearby",
  quick_doctor: "Book a doctor",
  quick_bmi: "Check my BMI",
  quick_reminder: "Set a medicine reminder",
  quick_articles: "Read health tips",

  trust_no_diagnosis: "We guide, we never diagnose",
  trust_no_diagnosis_body:
    "Sahayak gives general health information only. For anything serious, we always point you to a real doctor.",
  trust_always_on: "Available day and night",
  trust_always_on_body: "Ask a question any time — Sahayak doesn't keep clinic hours.",
  trust_two_languages: "Speaks your language",
  trust_two_languages_body: "Switch freely between English and Hindi, mid-conversation.",

  emergency_banner: "In a medical emergency, call 108 immediately",

  footer_tagline: "Bringing trustworthy health guidance to every rural home.",
};

const hi: typeof en = {
  nav_home: "होम",
  nav_about: "हमारे बारे में",
  nav_chat: "चैटबॉट",
  nav_emergency: "आपातकाल",
  nav_hospitals: "नजदीकी अस्पताल",
  nav_telemedicine: "टेलीमेडिसिन",
  nav_tips: "स्वास्थ्य सुझाव",
  nav_contact: "संपर्क करें",
  nav_login: "लॉग इन करें",
  nav_register: "साइन अप करें",
  nav_logout: "लॉग आउट करें",
  nav_dashboard: "डैशबोर्ड",

  hero_eyebrow: "हर गांव के लिए मुफ्त स्वास्थ्य मार्गदर्शन",
  hero_title: "आपका स्वास्थ्य सहायक, हमेशा आपके पास",
  hero_subtitle:
    "सहायक से सरल अंग्रेज़ी या हिंदी में बात करें। स्वास्थ्य मार्गदर्शन, प्राथमिक उपचार की जानकारी पाएं, और असली डॉक्टरों से जुड़ें — कोई जटिल भाषा नहीं।",
  hero_cta_chat: "सहायक से बात शुरू करें",
  hero_cta_emergency: "मुझे तुरंत मदद चाहिए",

  quick_symptom: "मेरे लक्षण जांचें",
  quick_hospital: "नजदीकी अस्पताल खोजें",
  quick_doctor: "डॉक्टर से अपॉइंटमेंट लें",
  quick_bmi: "मेरा BMI जांचें",
  quick_reminder: "दवा रिमाइंडर सेट करें",
  quick_articles: "स्वास्थ्य सुझाव पढ़ें",

  trust_no_diagnosis: "हम मार्गदर्शन करते हैं, निदान नहीं",
  trust_no_diagnosis_body:
    "सहायक केवल सामान्य स्वास्थ्य जानकारी देता है। गंभीर मामलों में हम हमेशा असली डॉक्टर से मिलने की सलाह देते हैं।",
  trust_always_on: "दिन-रात उपलब्ध",
  trust_always_on_body: "किसी भी समय सवाल पूछें — सहायक के लिए कोई क्लिनिक समय नहीं है।",
  trust_two_languages: "आपकी भाषा में बात करता है",
  trust_two_languages_body: "बातचीत के बीच में भी अंग्रेज़ी और हिंदी में बदल सकते हैं।",

  emergency_banner: "चिकित्सा आपातकाल में तुरंत 108 पर कॉल करें",

  footer_tagline: "हर ग्रामीण घर तक विश्वसनीय स्वास्थ्य मार्गदर्शन पहुंचाना।",
};

export const translations = { en, hi };
export type TranslationKey = keyof typeof en;
