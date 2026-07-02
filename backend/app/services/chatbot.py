#Test
"""
Chatbot service.

Design goals (per project spec):
- NEVER diagnose diseases.
- Provide educational info, basic symptom guidance, first-aid tips,
  preventive healthcare advice.
- Detect emergency/severe symptoms and immediately advise contacting
  emergency services, regardless of what the AI model returns.
- Maintain conversation memory (via chat history passed into the prompt).
- Support English and Hindi, with an architecture that's easy to extend
  to more languages.
- The OpenAI client is optional: if no API key is configured, a rule-based
  fallback keeps the chatbot fully functional for local development/demo.
"""
from typing import List, Tuple

from app.core.config import settings

try:
    from google import genai

    _client = (
    genai.Client(api_key=settings.GEMINI_API_KEY)
    if settings.GEMINI_API_KEY
    else None
)
except Exception:
    _client = None


# Keywords that suggest a medical emergency. This list is intentionally
# conservative (biased towards over-escalating) since missing a real
# emergency is far more dangerous than an unnecessary escalation prompt.
EMERGENCY_KEYWORDS = [
    "chest pain", "can't breathe", "cannot breathe", "difficulty breathing",
    "severe bleeding", "unconscious", "not breathing", "suicide", "self harm",
    "heart attack", "stroke", "seizure", "severe burn", "poisoning",
    "overdose", "choking", "severe injury", "accident", "snake bite",
    "high fever in infant", "blue lips", "no pulse",
]

SYSTEM_PROMPT = {
    "en": (
        "You are a Virtual Health Assistant for people in rural areas with "
        "limited digital literacy. Your role is strictly educational and "
        "supportive. Rules you must always follow: "
        "1) NEVER diagnose a specific disease or condition. "
        "2) NEVER prescribe medicines, dosages, or drug combinations. "
        "3) Give general health education, preventive care tips, and basic "
        "first-aid guidance only. "
        "4) Always recommend seeing a doctor or visiting a clinic for "
        "anything beyond mild, common concerns. "
        "5) If symptoms sound severe or life-threatening, clearly tell the "
        "user to contact emergency services or go to the nearest hospital "
        "immediately. "
        "6) Use simple, warm, plain language, short sentences, and avoid "
        "medical jargon, since users may have limited digital literacy. "
        "7) Be respectful of Indian rural context (limited transport, "
        "distance to hospitals, cost concerns) when giving practical advice."
    ),
    "hi": (
        "आप ग्रामीण क्षेत्रों के लोगों के लिए एक वर्चुअल हेल्थ असिस्टेंट हैं। "
        "आपकी भूमिका केवल शैक्षिक और सहायक जानकारी देने की है। नियम: "
        "1) कभी भी किसी बीमारी का निदान न करें। "
        "2) कभी भी दवा या खुराक न बताएं। "
        "3) केवल सामान्य स्वास्थ्य शिक्षा, बचाव के उपाय, और प्राथमिक उपचार की जानकारी दें। "
        "4) गंभीर लक्षणों में हमेशा डॉक्टर से मिलने या नजदीकी अस्पताल जाने की सलाह दें। "
        "5) यदि लक्षण गंभीर या जानलेवा लगें, तो तुरंत आपातकालीन सेवाओं से संपर्क करने के लिए कहें। "
        "6) सरल, सहज भाषा का प्रयोग करें।"
    ),
}

FALLBACK_REPLIES = {
    "en": (
        "Thanks for sharing that. I'm not able to diagnose conditions, but "
        "I can share general health guidance. For anything that feels "
        "serious or isn't improving, please consult a doctor or visit your "
        "nearest health center. Could you tell me a bit more about your "
        "symptoms (how long, how severe)?"
    ),
    "hi": (
        "जानकारी साझा करने के लिए धन्यवाद। मैं बीमारी का निदान नहीं कर सकता, "
        "लेकिन सामान्य स्वास्थ्य सलाह दे सकता हूं। यदि यह गंभीर लगे या ठीक न "
        "हो रहा हो, तो कृपया डॉक्टर से मिलें या नजदीकी स्वास्थ्य केंद्र जाएं। "
        "क्या आप अपने लक्षणों के बारे में थोड़ा और बता सकते हैं?"
    ),
}

EMERGENCY_REPLIES = {
    "en": (
        "⚠️ This sounds like it could be a medical emergency. Please call "
        "emergency services (dial 108 in India) or go to the nearest "
        "hospital immediately. Do not wait. If someone is with you, ask "
        "them to help you get to the hospital right away."
    ),
    "hi": (
        "⚠️ यह एक चिकित्सा आपातकाल हो सकता है। कृपया तुरंत आपातकालीन सेवा को "
        "कॉल करें (भारत में 108 डायल करें) या नजदीकी अस्पताल जाएं। इंतजार न "
        "करें। यदि आपके साथ कोई है, तो उनसे तुरंत अस्पताल ले जाने में मदद मांगें।"
    ),
}


def detect_emergency(message: str) -> bool:
    lowered = message.lower()
    return any(keyword in lowered for keyword in EMERGENCY_KEYWORDS)


def generate_reply(
    message: str, language: str, history: List[Tuple[str, str]]
) -> Tuple[str, bool]:
    """
    Returns (reply_text, escalate_to_emergency).
    `history` is a list of (sender, content) tuples, oldest first, used to
    give the model conversation memory.
    """
    language = language if language in SYSTEM_PROMPT else "en"
    is_emergency = detect_emergency(message)

    if is_emergency:
        # Always short-circuit to the safe emergency message - never let an
        # AI-generated response override an emergency detection.
        return EMERGENCY_REPLIES[language], True
    
    print("Gemini client initialized:", _client is not None)
    if _client is None:
        return FALLBACK_REPLIES[language], False

    messages = [{"role": "system", "content": SYSTEM_PROMPT[language]}]
    for sender, content in history[-10:]:
        role = "user" if sender == "user" else "assistant"
        messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": message})

    try:
        conversation = ""

        for sender, content in history[-10:]:
            if sender == "user":
                conversation += f"User: {content}\n"
            else:
                conversation += f"Assistant: {content}\n"

        conversation += f"User: {message}"

        response = _client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=f"""
    {SYSTEM_PROMPT[language]}

    Conversation:
    {conversation}
    """,
    )
        reply = response.text.strip()
        return reply, False

    except Exception as e:
        import traceback

        traceback.print_exc()
        raise