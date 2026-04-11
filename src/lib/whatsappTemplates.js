// lib/whatsappTemplates.js
// -------------------------------------------------------
// Pre-written WhatsApp payment reminder templates
// in 7 Indian languages + English.
// The placeholders {name}, {amount}, {business} are replaced
// dynamically before sending.
// -------------------------------------------------------

export const LANGUAGES = {
  en: { label: 'English', flag: '🇬🇧' },
  hi: { label: 'हिंदी', flag: '🇮🇳' },
  mr: { label: 'मराठी', flag: '🟠' },
  ta: { label: 'தமிழ்', flag: '🔵' },
  te: { label: 'తెలుగు', flag: '🟡' },
  gu: { label: 'ગુજરાતી', flag: '🟣' },
  bn: { label: 'বাংলা', flag: '🟢' },
}

// Each language has 3 tones: polite, friendly, urgent
export const TEMPLATES = {
  en: [
    {
      id: 'en_polite',
      tone: 'Polite',
      message: `Hello {name} 🙏,\n\nThis is a gentle reminder from *{business}* that you have a pending payment of *₹{amount}*.\n\nPlease clear it at your convenience. Thank you!`,
    },
    {
      id: 'en_friendly',
      tone: 'Friendly',
      message: `Hey {name}! 😊\n\nJust a quick reminder — you have *₹{amount}* pending with *{business}*.\n\nWould love to settle this soon. Let me know if you have any questions!`,
    },
    {
      id: 'en_urgent',
      tone: 'Urgent',
      message: `Dear {name},\n\n⚠️ *Payment Due* — ₹{amount} is outstanding with *{business}*.\n\nKindly make the payment at the earliest. Thank you.`,
    },
  ],

  hi: [
    {
      id: 'hi_polite',
      tone: 'विनम्र',
      message: `नमस्ते {name} 🙏,\n\n*{business}* की तरफ से याद दिलाना चाहते हैं कि आपका *₹{amount}* का भुगतान अभी बाकी है।\n\nकृपया जल्द भुगतान करें। धन्यवाद!`,
    },
    {
      id: 'hi_friendly',
      tone: 'दोस्ताना',
      message: `हेलो {name}! 😊\n\n*{business}* से बस एक छोटी सी याद दिलाना — आपका *₹{amount}* बाकी है।\n\nजल्दी निपटा लें! कोई सवाल हो तो बताएं।`,
    },
    {
      id: 'hi_urgent',
      tone: 'तत्काल',
      message: `प्रिय {name},\n\n⚠️ *भुगतान बाकी है* — *{business}* में ₹{amount} का भुगतान अभी तक नहीं हुआ।\n\nकृपया जल्द से जल्द भुगतान करें।`,
    },
  ],

  mr: [
    {
      id: 'mr_polite',
      tone: 'विनम्र',
      message: `नमस्कार {name} 🙏,\n\n*{business}* कडून आठवण करून देतो की तुमचे *₹{amount}* देणे बाकी आहे।\n\nकृपया लवकरात लवकर भरा. धन्यवाद!`,
    },
    {
      id: 'mr_friendly',
      tone: 'मैत्रीपूर्ण',
      message: `नमस्ते {name}! 😊\n\n*{business}* कडून एक छोटी आठवण — *₹{amount}* बाकी आहे.\n\nलवकर भरा! काही प्रश्न असल्यास सांगा।`,
    },
    {
      id: 'mr_urgent',
      tone: 'तातडीचे',
      message: `प्रिय {name},\n\n⚠️ *पेमेंट बाकी* — *{business}* मध्ये ₹{amount} अजून भरलेले नाही।\n\nताबडतोब भरण्याची विनंती आहे.`,
    },
  ],

  ta: [
    {
      id: 'ta_polite',
      tone: 'மரியாதையான',
      message: `வணக்கம் {name} 🙏,\n\n*{business}* சார்பாக நினைவூட்டுகிறோம் — உங்கள் *₹{amount}* தொகை நிலுவையில் உள்ளது.\n\nதயவுசெய்து விரைவில் செலுத்துங்கள். நன்றி!`,
    },
    {
      id: 'ta_urgent',
      tone: 'அவசர',
      message: `அன்புள்ள {name},\n\n⚠️ *கட்டணம் நிலுவை* — *{business}*-ல் ₹{amount} இன்னும் செலுத்தப்படவில்லை.\n\nமிக விரைவில் செலுத்துமாறு கேட்டுக்கொள்கிறோம்.`,
    },
  ],

  te: [
    {
      id: 'te_polite',
      tone: 'మర్యాదగా',
      message: `నమస్కారం {name} 🙏,\n\n*{business}* తరపున గుర్తుచేస్తున్నాం — మీ *₹{amount}* చెల్లింపు పెండింగ్‌లో ఉంది.\n\nదయచేసి త్వరగా చెల్లించండి. ధన్యవాదాలు!`,
    },
    {
      id: 'te_urgent',
      tone: 'అత్యవసర',
      message: `ప్రియమైన {name},\n\n⚠️ *చెల్లింపు పెండింగ్* — *{business}*లో ₹{amount} ఇంకా చెల్లించబడలేదు.\n\nవీలైనంత త్వరగా చెల్లించండి.`,
    },
  ],

  gu: [
    {
      id: 'gu_polite',
      tone: 'નમ્ર',
      message: `નમસ્તે {name} 🙏,\n\n*{business}* તરફથી યાદ અપાવવા ઇચ્છીએ છીએ — તમારી *₹{amount}* ની ચુકવણી બાકી છે.\n\nકૃપા કરીને જલ્દી ચૂકવો. ધન્યવાદ!`,
    },
    {
      id: 'gu_urgent',
      tone: 'તાત્કાલિક',
      message: `પ્રિય {name},\n\n⚠️ *ચુકવણી બાકી* — *{business}* માં ₹{amount} હજી ચૂકવ્યા નથી.\n\nકૃપા કરીને જલ્દીથી ચૂકવો.`,
    },
  ],

  bn: [
    {
      id: 'bn_polite',
      tone: 'বিনয়ী',
      message: `নমস্কার {name} 🙏,\n\n*{business}* থেকে মনে করিয়ে দিতে চাই — আপনার *₹{amount}* পেমেন্ট বাকি আছে।\n\nঅনুগ্রহ করে শীঘ্রই পরিশোধ করুন। ধন্যবাদ!`,
    },
    {
      id: 'bn_urgent',
      tone: 'জরুরি',
      message: `প্রিয় {name},\n\n⚠️ *পেমেন্ট বাকি* — *{business}*-এ ₹{amount} এখনও পরিশোধ হয়নি।\n\nযত তাড়াতাড়ি সম্ভব পরিশোধ করুন।`,
    },
  ],
}

// Helper: Replace {name}, {amount}, {business} in a template
export function fillTemplate(template, { name, amount, business }) {
  return template
    .replace(/{name}/g, name)
    .replace(/{amount}/g, amount.toLocaleString('en-IN'))
    .replace(/{business}/g, business)
}
