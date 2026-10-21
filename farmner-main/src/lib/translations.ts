export type Language = "en" | "hi";

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: TranslationDictionary = {
  // Navigation
  "nav.home": { en: "Home", hi: "होम" },
  "nav.schemes": { en: "Schemes", hi: "योजनाएँ" },
  "nav.eligibility": { en: "Check Eligibility", hi: "पात्रता जाँचें" },
  "nav.documents": { en: "Required Documents", hi: "आवश्यक दस्तावेज़" },
  "nav.help": { en: "Help", hi: "मदद" },
  "nav.crop": { en: "Crop Disease", hi: "फसल रोग" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "nav.chat": { en: "Chat", hi: "चैट" },
  "nav.signIn": { en: "Sign In", hi: "साइन इन" },
  "nav.signOut": { en: "Sign Out", hi: "साइन आउट" },
  "nav.mainNav": { en: "Main navigation", hi: "मुख्य नेविगेशन" },
  "nav.mobileNav": { en: "Mobile navigation", hi: "मोबाइल नेविगेशन" },
  "sidebar.schemeExplorer": { en: "Scheme Explorer", hi: "योजना खोज" },

  // Common UI
  "common.save": { en: "Save", hi: "सेव करें" },
  "common.saving": { en: "Saving...", hi: "सेव हो रहा है..." },
  "common.cancel": { en: "Cancel", hi: "रद्द करें" },
  "common.language": { en: "Language selector", hi: "भाषा चयन" },
  "common.chooseLanguage": { en: "Choose language", hi: "भाषा चुनें" },
  "common.english": { en: "English", hi: "English" },
  "common.hindi": { en: "हिन्दी", hi: "हिन्दी" },
  "common.loading": { en: "Loading...", hi: "लोड हो रहा है..." },
  "common.allCategories": { en: "All Categories", hi: "सभी श्रेणियाँ" },
  "common.allStates": { en: "All States", hi: "सभी राज्य" },
  "common.viewDetails": { en: "View Details", hi: "विवरण देखें" },
  "common.back": { en: "Back", hi: "वापस" },
  "common.close": { en: "Close", hi: "बंद करें" },

  // Home Page (Feature 1)
  "home.title": { en: "Smart Kisaan", hi: "स्मार्ट किसान" },
  "home.portalBadge": { en: "Farmer Assistance Portal", hi: "किसान सहायता पोर्टल" },
  "home.tagline": {
    en: "Samarth Shayak — Simple Government Schemes for Indian Farmers",
    hi: "समर्थ सहायक — भारतीय किसानों के लिए सरल सरकारी योजना पोर्टल",
  },
  "home.welcome": {
    en: "Welcome. This app helps you find government schemes for farmers.",
    hi: "स्वागत है। यह ऐप किसानों के लिए सरकारी योजनाएँ खोजने में मदद करता है।",
  },
  "home.choose": {
    en: "Tap a big button to start.",
    hi: "शुरू करने के लिए बड़ा बटन दबाएँ।",
  },
  "home.languageHint": { en: "Choose language", hi: "भाषा चुनें" },
  "home.mainActions": { en: "Main Services", hi: "मुख्य सेवाएँ" },
  "home.mainActionsDesc": {
    en: "Tap any large card below to open the service directly.",
    hi: "सीधे सेवा शुरू करने के लिए नीचे दिए गए किसी भी बड़े कार्ड को दबाएँ।",
  },
  "home.schemes": { en: "Government Schemes", hi: "सरकारी योजनाएँ" },
  "home.schemesDesc": {
    en: "See farm schemes. Search by name or state.",
    hi: "खेती की योजनाएँ देखें। नाम या राज्य से खोजें।",
  },
  "home.eligibility": { en: "Check Eligibility", hi: "पात्रता देखें" },
  "home.eligibilityDesc": {
    en: "Open a scheme, fill your details, and see if it may fit you.",
    hi: "योजना खोलें, अपनी जानकारी भरें, और देखें कि यह आपके काम की है या नहीं।",
  },
  "home.documents": { en: "Required Documents", hi: "ज़रूरी कागज़" },
  "home.documentsDesc": {
    en: "See common papers like Aadhaar and land record. Open a scheme for a full list.",
    hi: "आधार और ज़मीन के कागज़ जैसे सामान्य दस्तावेज़ देखें। पूरी सूची के लिए योजना खोलें।",
  },
  "home.crop": { en: "Crop Disease Detection", hi: "फसल बीमारी जाँच" },
  "home.cropDesc": {
    en: "Photo check for crop disease.",
    hi: "फसल की तस्वीर से बीमारी जाँच।",
  },
  "home.cropSoon": { en: "Not available yet", hi: "अभी उपलब्ध नहीं" },
  "home.cropDisabledReason": {
    en: "Photo crop disease scanning is planned for Phase 2. This button is intentionally inactive in this prototype.",
    hi: "तस्वीर से फसल बीमारी की जाँच आगामी चरण 2 के लिए प्रस्तावित है। यह बटन वर्तमान प्रोटोटाइप में निष्क्रिय है।",
  },
  "home.help": { en: "Help / How to Use", hi: "मदद / कैसे चलाएँ" },
  "home.helpDesc": {
    en: "Simple steps to use this app.",
    hi: "ऐप चलाने के आसान चरण।",
  },
  "home.open": { en: "Open", hi: "खोलें" },
  "home.openAction": { en: "Open Service", hi: "सेवा खोलें" },
  "home.skipLink": { en: "Skip to main content", hi: "मुख्य सामग्री पर जाएँ" },
  "home.availableBadge": { en: "Available", hi: "उपलब्ध" },
  "home.upcomingBadge": { en: "Phase 2 (Upcoming)", hi: "चरण 2 (आगामी)" },
  "home.audioGuide": {
    en: "Listen to Page Instructions (Audio)",
    hi: "पेज के निर्देश सुनें (ऑडियो सहायता)",
  },
  "home.audioPlaying": {
    en: "Reading instructions aloud in English...",
    hi: "निर्देश हिन्दी में पढ़कर सुनाए जा रहे हैं...",
  },
  "home.audioStop": { en: "Stop Audio", hi: "आवाज़ बंद करें" },
  "home.audioNotSupported": {
    en: "Audio guidance is not supported on this browser.",
    hi: "इस ब्राउज़र में ऑडियो सहायता उपलब्ध नहीं है।",
  },
  "home.quickStepsTitle": {
    en: "How Smart Kisaan Works",
    hi: "स्मार्ट किसान कैसे काम करता है",
  },
  "home.quickStepsSubtitle": {
    en: "Three simple steps to access your farmer benefits",
    hi: "सरकारी लाभ पाने के 3 आसान चरण",
  },
  "home.step1Title": { en: "1. Find a Scheme", hi: "1. योजना चुनें" },
  "home.step1Desc": {
    en: "Search schemes for your state, crop, and category.",
    hi: "अपने राज्य, फसल और ज़रूरत के अनुसार योजना खोजें।",
  },
  "home.step2Title": { en: "2. Check Documents", hi: "2. कागज़ात देखें" },
  "home.step2Desc": {
    en: "Review required papers like Aadhaar, Land Record (7/12), and Bank Passbook.",
    hi: "आधार, ज़मीन के कागज़ (7/12, खसरा) और बैंक पासबुक तैयार रखें।",
  },
  "home.step3Title": { en: "3. Check Eligibility", hi: "3. पात्रता जाँचें" },
  "home.step3Desc": {
    en: "Save your farm details to see if the scheme fits you.",
    hi: "अपनी खेती का विवरण भरकर देखें कि आप पात्र हैं या नहीं।",
  },
  "home.helplineTitle": {
    en: "Kisan Call Center (Government Helpline)",
    hi: "किसान कॉल सेंटर (सरकारी हेल्पलाइन)",
  },
  "home.helplineDesc": {
    en: "Toll-Free Agricultural Support from Government of India",
    hi: "भारत सरकार द्वारा निःशुल्क कृषि सहायता एवं सलाह",
  },
  "home.helplineNumber": { en: "1800-180-1551", hi: "1800-180-1551" },
  "home.helplineTiming": {
    en: "6:00 AM – 10:00 PM (All 7 days)",
    hi: "सुबह 6:00 से रात 10:00 (सभी दिन)",
  },
  "home.helplineCall": {
    en: "Call Toll-Free Helpline",
    hi: "टोल-फ्री हेल्पलाइन पर कॉल करें",
  },

  // Scheme Explorer Page
  "schemes.title": { en: "Government Schemes", hi: "सरकारी योजनाएँ" },
  "schemes.pageHeading": { en: "Government Agriculture Schemes", hi: "सरकारी कृषि योजनाएँ" },
  "schemes.pageExplanation": {
    en: "Explore verified Indian government agriculture and farmer-welfare schemes with confirmed benefits, basic eligibility, required documents, and direct links to official government portals.",
    hi: "भारतीय किसानों के लिए केंद्र सरकार की सत्यापित कृषि एवं कल्याणकारी योजनाएँ — पक्के लाभ, मूल पात्रता, ज़रूरी कागज़ात और आधिकारिक सरकारी पोर्टल लिंक के साथ।",
  },
  "schemes.subtitle": {
    en: "Verified agricultural welfare programs for Indian farmers.",
    hi: "भारतीय किसानों के लिए सत्यापित सरकारी कल्याणकारी योजनाएँ।",
  },
  "schemes.search": {
    en: "Search by scheme name or keywords...",
    hi: "योजना का नाम या कीवर्ड खोजें...",
  },
  "schemes.searchLabel": { en: "Search Schemes", hi: "योजना खोजें" },
  "schemes.searchPlaceholder": {
    en: "Search by scheme name, crop, or keywords (e.g. PM-Kisan, Insurance, KCC, Irrigation)...",
    hi: "योजना का नाम, फसल या कीवर्ड लिखें (उदा. पीएम-किसान, बीमा, केसीसी, सिंचाई)...",
  },
  "schemes.clearSearch": { en: "Clear Search", hi: "खोज साफ़ करें" },
  "schemes.allCategories": { en: "All Categories", hi: "सभी श्रेणियाँ" },
  "schemes.categoryLabel": { en: "Category", hi: "श्रेणी" },
  "schemes.gridView": { en: "Grid View", hi: "ग्रिड दृश्य" },
  "schemes.listView": { en: "List View", hi: "सूची दृश्य" },
  "schemes.benefitType": { en: "Benefit Type:", hi: "लाभ प्रकार:" },
  "schemes.maxBenefit": { en: "Max Benefit:", hi: "अधिकतम लाभ:" },
  "schemes.viewDetails": { en: "View Scheme Details", hi: "योजना विवरण देखें" },
  "schemes.schemesCount": { en: "schemes", hi: "योजनाएँ" },
  "schemes.showingResults": { en: "Showing", hi: "प्रदर्शित" },
  "schemes.of": { en: "of", hi: "कुल" },
  "schemes.verifiedSchemes": { en: "verified schemes", hi: "सत्यापित योजनाएँ" },
  "schemes.verifiedBadge": { en: "Govt Verified", hi: "सरकारी सत्यापित" },
  "schemes.officialPortal": { en: "Official Portal", hi: "आधिकारिक पोर्टल" },
  "schemes.officialPortalAria": {
    en: "Opens official government website in a new tab",
    hi: "नई विंडो में आधिकारिक सरकारी वेबसाइट खुलती है",
  },
  "schemes.basicEligibility": { en: "Basic Eligibility:", hi: "मूल पात्रता:" },
  "schemes.requiredDocs": { en: "Required Documents:", hi: "आवश्यक दस्तावेज़:" },
  "schemes.keyBenefits": { en: "Key Benefits:", hi: "प्रमुख लाभ:" },
  "schemes.stateDependentNote": {
    en: "Note: Specific crops, quotas, or credit limits depend on state guidelines and require local confirmation.",
    hi: "नोट: विशिष्ट फसलों, कोटे या ऋण सीमा जैसे विवरण राज्य नियमों पर निर्भर करते हैं और स्थानीय पुष्टि आवश्यक है।",
  },
  "schemes.disclaimerTitle": { en: "Official Application Notice", hi: "आधिकारिक आवेदन सूचना" },
  "schemes.disclaimerText": {
    en: "Smart Kisaan provides verified scheme information to help farmers prepare. All scheme applications and fund transfers are conducted directly through official government portals and authorized banks. We do not charge fees or process applications directly.",
    hi: "स्मार्ट किसान केवल किसानों की तैयारी के लिए सत्यापित जानकारी प्रदान करता है। सभी योजनाओं के आवेदन और सब्सिडी भुगतान केवल आधिकारिक सरकारी पोर्टलों और बैंकों के माध्यम से होते हैं।",
  },
  "schemes.noResults": {
    en: "No schemes found matching your search. Try different keywords or reset filters.",
    hi: "आपकी खोज से मेल खाती कोई योजना नहीं मिली। कृपया अलग शब्द खोजें या फ़िल्टर हटाएँ।",
  },
  "schemes.noResultsTitle": { en: "No matching schemes found", hi: "कोई मेल खाती योजना नहीं मिली" },
  "schemes.resetFilters": { en: "Reset Search & Filters", hi: "खोज और फ़िल्टर रीसेट करें" },

  // Scheme Details Page
  "schemeDetails.notFoundTitle": { en: "Scheme not found", hi: "योजना नहीं मिली" },
  "schemeDetails.notFoundDesc": {
    en: "The requested scheme details could not be loaded. Please go back to the scheme explorer and try again.",
    hi: "मांगी गई योजना का विवरण लोड नहीं हो सका। कृपया योजना सूची पर वापस जाकर फिर से प्रयास करें।",
  },
  "schemeDetails.backToSchemes": { en: "Back to schemes", hi: "योजनाओं पर वापस" },
  "schemeDetails.quickActions": { en: "Quick actions", hi: "त्वरित कार्रवाई" },
  "schemeDetails.officialWebsite": { en: "Official website", hi: "आधिकारिक वेबसाइट" },
  "schemeDetails.officialWebsiteNotice": {
    en: "Opens official government portal in a new tab",
    hi: "नई विंडो में आधिकारिक सरकारी वेबसाइट खुलेगी",
  },
  "schemeDetails.eligibility": { en: "Verified Eligibility Criteria", hi: "सत्यापित पात्रता शर्तें" },
  "schemeDetails.eligibilityFallback": {
    en: "Eligibility details are not available yet for this scheme.",
    hi: "इस योजना के लिए अभी पात्रता विवरण उपलब्ध नहीं है।",
  },
  "schemeDetails.snapshot": { en: "Program Snapshot", hi: "योजना स्नैपशॉट" },
  "schemeDetails.maxBenefit": { en: "Maximum benefit", hi: "अधिकतम लाभ" },
  "schemeDetails.applicationDeadline": { en: "Application deadline", hi: "आवेदन अंतिम तिथि" },
  "schemeDetails.ministry": { en: "Ministry / Authority", hi: "मंत्रालय / विभाग" },
  "schemeDetails.notSpecified": { en: "Not specified", hi: "निर्दिष्ट नहीं" },
  "schemeDetails.openOrNotSpecified": { en: "Open or not specified", hi: "खुला है या निर्दिष्ट नहीं" },
  "schemeDetails.benefits": { en: "Key Benefits", hi: "योजना के मुख्य लाभ" },
  "schemeDetails.benefitsFallback": {
    en: "Benefit details are not available yet for this scheme.",
    hi: "इस योजना के लिए अभी लाभ विवरण उपलब्ध नहीं है।",
  },
  "schemeDetails.requiredDocs": { en: "Required Documents", hi: "आवश्यक दस्तावेज़" },
  "schemeDetails.requiredDocsSubtitle": {
    en: "Official documents specified for application verification",
    hi: "आवेदन सत्यापन के लिए आधिकारिक रूप से निर्धारित दस्तावेज़",
  },
  "schemeDetails.verificationNote": { en: "Official Verification & Local Rules", hi: "आधिकारिक सत्यापन एवं स्थानीय नियम" },
  "compare.back": { en: "← Back to Schemes", hi: "← योजनाओं पर वापस" },

  // Farmer Profile Card
  "profile.title": { en: "Farmer Profile", hi: "किसान प्रोफ़ाइल" },
  "profile.subtitle": {
    en: "Save your details once — Application Copilot uses it for eligibility on this scheme.",
    hi: "अपनी जानकारी एक बार सेव करें — उसी से पात्रता और योजना मूल्यांकन अपडेट होगा।",
  },
  "profile.save": { en: "Save Profile", hi: "प्रोफ़ाइल सेव करें" },
  "profile.saving": { en: "Saving...", hi: "सेव हो रहा है..." },
  "profile.name": { en: "Full Name", hi: "पूरा नाम" },
  "profile.namePlaceholder": { en: "e.g. Ramesh Kumar", hi: "जैसे: रमेश कुमार" },
  "profile.state": { en: "State", hi: "राज्य" },
  "profile.location": { en: "District / Village", hi: "ज़िला / गाँव" },
  "profile.locationPlaceholder": { en: "e.g. Ludhiana, Punjab", hi: "जैसे: लुधियाना, पंजाब" },
  "profile.category": { en: "Social Category", hi: "सामाजिक श्रेणी" },
  "profile.landholding": { en: "Landholding (Acres / Hectares)", hi: "ज़मीन का रकबा (एकड़ / हेक्टेयर)" },
  "profile.landholdingPlaceholder": { en: "e.g. 2.5 acres", hi: "जैसे: 2.5 एकड़" },
  "profile.cropType": { en: "Primary Crop", hi: "मुख्य फसल" },
  "profile.cropTypePlaceholder": { en: "e.g. Wheat, Rice", hi: "जैसे: गेहूं, धान" },
  "profile.incomeBand": { en: "Annual Income", hi: "वार्षिक आय" },
  "profile.businessType": { en: "Occupation / Activity", hi: "व्यवसाय / मुख्य गतिविधि" },
  "profile.savedCrops": { en: "Other Crops Grown", hi: "अन्य उगाई जाने वाली फसलें" },
  "profile.savedCropsPlaceholder": { en: "e.g. Mustard, Cotton", hi: "जैसे: सरसों, कपास" },
  "profile.saved": { en: "Profile saved successfully.", hi: "प्रोफ़ाइल सफलतापूर्वक सेव हो गई।" },

  // Application Copilot Panel
  "copilot.title": { en: "AI Application Copilot", hi: "आवेदन सहायक (पात्रता मार्गदर्शन)" },
  "copilot.subtitle": {
    en: "Rules-first guidance combining your profile, documents, and scheme criteria.",
    hi: "आपकी प्रोफ़ाइल, कागज़ात और योजना शर्तों को मिलाकर स्पष्ट मार्गदर्शन।",
  },
  "copilot.scorecard": { en: "Eligibility Scorecard", hi: "पात्रता परिणाम" },
  "copilot.documentReadiness": { en: "Document Readiness", hi: "कागज़ात तैयारी" },
  "copilot.checklist": { en: "Application Success Checklist", hi: "आवेदन चेकलिस्ट" },
  "copilot.matched": { en: "Why this fits you", hi: "यह आपके लिए क्यों उपयुक्त है" },
  "copilot.missing": { en: "Information still missing", hi: "बाकी बची जानकारी" },
  "copilot.risks": { en: "Things to watch out for", hi: "ध्यान देने योग्य बातें" },
  "copilot.steps": { en: "Next recommended steps", hi: "आगे के आवश्यक चरण" },
  "copilot.profileUsed": { en: "Profile details used", hi: "उपयोग की गई प्रोफ़ाइल" },
  "copilot.docsReady": { en: "documents ready", hi: "कागज़ात तैयार" },
  "copilot.likelyEligible": { en: "Likely Eligible", hi: "पात्र होने की संभावना" },
  "copilot.needsInfo": { en: "Needs More Info", hi: "और जानकारी चाहिए" },
  "copilot.atRisk": { en: "Possible Blocker", hi: "पात्रता में रुकावट संभव" },
  "copilot.dossier": { en: "Application Summary", hi: "आवेदन सारांश" },
  "copilot.dossierDesc": {
    en: "Export a reviewer-ready PDF with eligibility, documents, and next steps.",
    hi: "पात्रता, कागज़ात और अगले चरणों का सारांश पीडीएफ डाउनलोड करें।",
  },
  "copilot.exportDossier": { en: "Export PDF Summary", hi: "पीडीएफ सारांश डाउनलोड करें" },
  "copilot.exportSuccess": { en: "Application summary exported.", hi: "आवेदन सारांश डाउनलोड हो गया।" },
  "copilot.exportFailed": { en: "Could not export the summary.", hi: "सारांश डाउनलोड नहीं हो सका।" },

  // Help Page
  "help.title": { en: "How to use Smart Kisaan", hi: "स्मार्ट किसान कैसे चलाएँ" },
  "help.intro": {
    en: "Follow these steps. Use large buttons. You can switch Hindi and English anytime.",
    hi: "ये चरण अपनाएँ। बड़े बटन दबाएँ। हिन्दी और अंग्रेज़ी कभी भी बदल सकते हैं।",
  },
  "help.step1": { en: "1. Tap Government Schemes", hi: "1. सरकारी योजनाएँ दबाएँ" },
  "help.step1Desc": {
    en: "You will see a list of schemes. You can search or pick a state.",
    hi: "योजनाओं की सूची दिखेगी। आप खोज सकते हैं या राज्य चुन सकते हैं।",
  },
  "help.step2": { en: "2. Open one scheme", hi: "2. एक योजना खोलें" },
  "help.step2Desc": {
    en: "Read what the scheme is and who it is for.",
    hi: "पढ़ें कि योजना क्या है और किसके लिए है।",
  },
  "help.step3": { en: "3. Fill your farmer details", hi: "3. अपनी किसान जानकारी भरें" },
  "help.step3Desc": {
    en: "Write your state, crop, and land. Tap Save.",
    hi: "अपना राज्य, फसल और ज़मीन लिखें। सेव दबाएँ।",
  },
  "help.step4": { en: "4. Check eligibility", hi: "4. पात्रता देखें" },
  "help.step4Desc": {
    en: "The Application Copilot shows if the scheme may fit you, and what to do next.",
    hi: "आवेदन सहायक बताता है कि योजना आपके काम की हो सकती है या नहीं, और आगे क्या करें।",
  },
  "help.docsTitle": { en: "Papers you may need", hi: "जो कागज़ लग सकते हैं" },
  "help.docsIntro": {
    en: "Many farm schemes ask for these. The exact list is on each scheme page.",
    hi: "बहुत सी खेती योजनाओं में ये माँगे जाते हैं। सही सूची हर योजना के पेज पर है।",
  },
  "help.backHome": { en: "Back to Home", hi: "होम पर वापस" },
  "help.openSchemes": { en: "Open Government Schemes", hi: "सरकारी योजनाएँ खोलें" },

  // Phase Later (Upcoming) Page
  "phaseLater.comingSoon": { en: "coming soon", hi: "जल्द आ रहा है" },
  "phaseLater.desc": {
    en: "This feature is planned for a future phase and is not active in this prototype.",
    hi: "यह सुविधा आगामी चरण के लिए प्रस्तावित है और वर्तमान प्रोटोटाइप में सक्रिय नहीं है।",
  },
  "phaseLater.browseSchemes": { en: "Browse schemes", hi: "योजनाएँ देखें" },

  // Not Found Page
  "notFound.title": { en: "404 - Page Not Found", hi: "404 - पेज नहीं मिला" },
  "notFound.desc": {
    en: "The page you are looking for does not exist or has been moved.",
    hi: "आप जिस पेज को खोज रहे हैं वह मौजूद नहीं है या हटा दिया गया है।",
  },
  "notFound.returnHome": { en: "Return to Home", hi: "मुख्य पृष्ठ पर लौटें" },

  // Feature 4: Scheme Eligibility & Required-Document Checklist
  "eligibility.title": {
    en: "Scheme Eligibility & Document Checklist",
    hi: "योजना पात्रता एवं आवश्यक दस्तावेज़ चेकलिस्ट",
  },
  "eligibility.subtitle": {
    en: "Answer simple questions to see if you may meet basic criteria, and keep track of required papers.",
    hi: "सरल प्रश्नों के उत्तर देकर देखें कि क्या आप मूल मानदंड पूरे करते हैं, और ज़रूरी दस्तावेज़ तैयार रखें।",
  },
  "eligibility.disclaimer": {
    en: "Preliminary Guidance Only: This check is an indicative assessment based on published rules. It does not guarantee approval, grant official eligibility, or replace government verification.",
    hi: "केवल प्रारंभिक मार्गदर्शन: यह जाँच प्रकाशित नियमों पर आधारित अनुमानित मूल्यांकन है। यह सरकारी मंज़ूरी की गारंटी नहीं देती और न ही आधिकारिक प्रमाण पत्र का स्थान लेती है।",
  },
  "eligibility.selectSchemeLabel": {
    en: "Select a Government Scheme",
    hi: "सरकारी योजना चुनें",
  },
  "eligibility.selectSchemePlaceholder": {
    en: "-- Choose a Scheme to Check --",
    hi: "-- जाँच के लिए योजना चुनें --",
  },
  "eligibility.tabCheck": {
    en: "Eligibility Checker",
    hi: "पात्रता जाँच",
  },
  "eligibility.tabDocs": {
    en: "Document Checklist",
    hi: "दस्तावेज़ चेकलिस्ट",
  },
  "eligibility.questionsHeading": {
    en: "Eligibility Questions",
    hi: "पात्रता प्रश्न",
  },
  "eligibility.questionsSubtitle": {
    en: "Answer the questions below according to your farming profile. No personal information is stored or transmitted.",
    hi: "अपनी खेती के अनुसार नीचे दिए प्रश्नों के उत्तर दें। कोई भी व्यक्तिगत जानकारी सुरक्षित या भेजी नहीं जाती।",
  },
  "eligibility.answeredCount": {
    en: "Answered {answered} of {total} questions",
    hi: "{total} में से {answered} प्रश्नों के उत्तर दिए गए",
  },
  "eligibility.unansweredNote": {
    en: "Please answer all questions above to calculate your preliminary eligibility result.",
    hi: "प्रारंभिक परिणाम देखने के लिए कृपया ऊपर दिए गए सभी प्रश्नों के उत्तर दें।",
  },
  "eligibility.resultHeading": {
    en: "Preliminary Assessment Result",
    hi: "प्रारंभिक मूल्यांकन परिणाम",
  },
  "eligibility.stateMayMeet": {
    en: "May Meet Basic Criteria",
    hi: "प्राथमिक मानदंड पूरे हो सकते हैं",
  },
  "eligibility.stateMayNotMeet": {
    en: "May Not Meet Basic Criteria",
    hi: "प्राथमिक मानदंड पूरे नहीं होते प्रतीत होते",
  },
  "eligibility.stateNeedsVerification": {
    en: "More Information / Verification Required",
    hi: "अतिरिक्त जानकारी या आधिकारिक सत्यापन आवश्यक",
  },
  "eligibility.criteriaMatched": {
    en: "Criteria Appearing to Match:",
    hi: "अनुकूल पाए गए मानदंड:",
  },
  "eligibility.criteriaIssues": {
    en: "Conditions Inconsistent or Requiring Attention:",
    hi: "ध्यान देने योग्य या असंगत शर्तें:",
  },
  "eligibility.nextSteps": {
    en: "Recommended Next Steps:",
    hi: "सुझाए गए अगले कदम:",
  },
  "eligibility.resetAnswers": {
    en: "Reset Answers",
    hi: "उत्तर रीसेट करें",
  },
  "eligibility.viewChecklistForScheme": {
    en: "View Required Documents Checklist",
    hi: "इस योजना की आवश्यक दस्तावेज़ चेकलिस्ट देखें",
  },
  "eligibility.checkEligibilityBtn": {
    en: "Check Eligibility",
    hi: "पात्रता जाँचें",
  },
  "eligibility.officialPortal": {
    en: "Visit Official Scheme Portal",
    hi: "आधिकारिक योजना पोर्टल पर जाएँ",
  },
  "eligibility.officialPortalAria": {
    en: "(opens in a new tab)",
    hi: "(नए टैब में खुलता है)",
  },
  "eligibility.officialVerificationNote": {
    en: "Official government portal for verified rules, operational guidelines, and online application:",
    hi: "सत्यापित नियमों, दिशा-निर्देशों और ऑनलाइन आवेदन हेतु आधिकारिक सरकारी पोर्टल:",
  },
  "eligibility.noSchemeSelected": {
    en: "Please select an agricultural scheme above to start checking eligibility.",
    hi: "पात्रता जाँचने के लिए कृपया ऊपर से एक कृषि योजना चुनें।",
  },
  "eligibility.exploreAllSchemes": {
    en: "Browse All Schemes",
    hi: "सभी योजनाएँ देखें",
  },
  "checklist.heading": {
    en: "Required Documents Checklist",
    hi: "आवश्यक दस्तावेज़ चेकलिस्ट",
  },
  "checklist.subtitle": {
    en: "Officially specified documents for this scheme. Check them off as you collect them.",
    hi: "इस योजना हेतु आधिकारिक रूप से निर्धारित दस्तावेज़। कागज़ात जुटाते समय उन्हें टिक करते जाएँ।",
  },
  "checklist.disclaimer": {
    en: "Important: Checking off documents here is solely for your personal preparation. It does NOT submit, upload, or file any papers with the government.",
    hi: "महत्वपूर्ण: यहाँ टिक करने से केवल आपकी व्यक्तिगत तैयारी की ट्रैकिंग होती है। इससे कोई भी कागज़ सरकार के पास जमा या अपलोड नहीं होता।",
  },
  "checklist.progressLabel": {
    en: "Preparation Progress:",
    hi: "तैयारी की प्रगति:",
  },
  "checklist.readyCount": {
    en: "{ready} of {total} documents ready ({pct}%)",
    hi: "{total} में से {ready} दस्तावेज़ तैयार ({pct}%)",
  },
  "checklist.mandatoryBadge": {
    en: "Mandatory",
    hi: "अनिवार्य",
  },
  "checklist.conditionalBadge": {
    en: "Conditional / If Applicable",
    hi: "शर्तिया / यदि लागू हो",
  },
  "checklist.resetBtn": {
    en: "Reset Checklist",
    hi: "चेकलिस्ट रीसेट करें",
  },
  "checklist.allMandatoryReady": {
    en: "All mandatory documents are marked ready! Ensure legible physical copies and Aadhaar bank linking are in place before applying.",
    hi: "सभी अनिवार्य दस्तावेज़ तैयार हैं! आवेदन करने से पहले स्पष्ट प्रतियां और आधार बैंक लिंकिंग सुनिश्चित कर लें।",
  },
  "checklist.whyNeeded": {
    en: "Official requirement guidance:",
    hi: "आधिकारिक आवश्यकता निर्देश:",
  },
  "checklist.empty": {
    en: "No specific documents listed for this scheme.",
    hi: "इस योजना के लिए कोई विशिष्ट दस्तावेज़ सूचीबद्ध नहीं हैं।",
  },

  // Crop Disease Detection (Feature 5)
  "crop.title": { en: "Crop Disease Detection", hi: "फसल रोग की पहचान" },
  "crop.portalBadge": { en: "Local Foliage Health Screening", hi: "ऑन-डिवाइस पत्ती स्वास्थ्य परीक्षण" },
  "crop.subtitle": {
    en: "Upload or capture a photo of a crop leaf for instant, offline foliar screening. Runs entirely inside your browser — 100% private.",
    hi: "पत्ती की फोटो अपलोड या कैप्चर करके तुरंत ऑफ़लाइन स्वास्थ्य परीक्षण करें। पूरी तरह आपके ब्राउज़र में चलता है — 100% सुरक्षित।",
  },
  "crop.inputHeading": { en: "Provide a Crop Leaf Photo", hi: "फसल की पत्ती की फोटो दें" },
  "crop.inputSubtitle": {
    en: "Select a clear photo of an affected leaf, or capture one directly using your camera.",
    hi: "प्रभावित पत्ती की स्पष्ट फोटो चुनें या अपने कैमरे से सीधे फोटो खींचें।",
  },
  "crop.uploadBtn": { en: "Choose Leaf Photo", hi: "पत्ती की फोटो चुनें" },
  "crop.cameraBtn": { en: "Take Photo with Camera", hi: "कैमरे से फोटो लें" },
  "crop.fileHint": {
    en: "Supports JPG, JPEG, PNG, or WebP up to 10 MB. Camera access is requested only when you tap 'Take Photo'.",
    hi: "JPG, JPEG, PNG या WebP फ़ाइल 10 MB तक स्वीकार्य। कैमरा अनुमति केवल 'कैमरे से फोटो लें' दबाने पर ही माँगी जाती है।",
  },
  "crop.replaceBtn": { en: "Replace Photo", hi: "फोटो बदलें" },
  "crop.removeBtn": { en: "Remove Photo", hi: "फोटो हटाएं" },
  "crop.analyzeBtn": { en: "Analyze Leaf Health", hi: "पत्ती के स्वास्थ्य की जाँच करें" },
  "crop.analyzing": { en: "Analyzing foliage pixels...", hi: "पत्ती के पिक्सल का विश्लेषण हो रहा है..." },
  "crop.reanalyzeBtn": { en: "Re-analyze Image", hi: "पुनः जाँच करें" },
  "crop.sampleHeading": { en: "Or test with verified sample leaves:", hi: "या जांची गई नमूना पत्तियों से परीक्षण करें:" },
  "crop.sampleHealthy": { en: "Healthy Leaf", hi: "स्वस्थ पत्ती" },
  "crop.sampleBlight": { en: "Leaf Blight / Spots", hi: "झुलसा / काले धब्बे" },
  "crop.sampleChlorosis": { en: "Yellowing / Chlorosis", hi: "पीलापन / क्लोरोसिस" },
  "crop.resultHeading": { en: "Foliage Health Results", hi: "पत्ती स्वास्थ्य परिणाम" },
  "crop.confidenceLabel": { en: "Analysis Confidence:", hi: "विश्वसनीयता दर:" },
  "crop.severityLabel": { en: "Severity Level:", hi: "गंभीरता स्तर:" },
  "crop.severityNone": { en: "None (Healthy)", hi: "कोई नहीं (स्वस्थ)" },
  "crop.severityLow": { en: "Mild / Early Stage", hi: "हल्की / प्रारंभिक अवस्था" },
  "crop.severityMedium": { en: "Moderate", hi: "मध्यम" },
  "crop.severityHigh": { en: "Severe / Spreading", hi: "गंभीर / फैलने योग्य" },
  "crop.severityUncertain": { en: "Uncertain", hi: "अनिश्चित" },
  "crop.metricsHeading": { en: "Foliar Metrics Breakdown", hi: "पर्ण मैट्रिक्स विवरण" },
  "crop.leafCoverage": { en: "Leaf Coverage in Image", hi: "छवि में पत्ती का क्षेत्र" },
  "crop.healthyTissue": { en: "Healthy Green Pigment", hi: "स्वस्थ हरा वर्णक" },
  "crop.chlorosisTissue": { en: "Yellowing / Chlorosis", hi: "पीलापन / क्लोरोसिस" },
  "crop.necrosisTissue": { en: "Necrotic / Blight Lesions", hi: "काले-भूरे / सूखे धब्बे" },
  "crop.hydrationScore": { en: "Foliar Hydration Balance", hi: "पत्ती जलयोजन संतुलन" },
  "crop.explanationHeading": { en: "What This Indicates", hi: "इसका क्या अर्थ है" },
  "crop.recommendationsHeading": { en: "Recommended Safe Practical Steps", hi: "अनुशंसित सुरक्षित व्यावहारिक कदम" },
  "crop.disclaimerTitle": { en: "Important Farmer Advisory & Scope", hi: "महत्वपूर्ण किसान सलाह एवं दायरा" },
  "crop.disclaimerBody": {
    en: "This Phase 1 prototype performs on-device chromatic and structural pixel analysis to help farmers screen foliar symptoms. It is an educational assistive tool and not an official botanical lab diagnosis. Do NOT spray synthetic pesticides, herbicides, or fungicides without in-person confirmation from an authorized agricultural officer or agronomist.",
    hi: "यह फेज़ 1 प्रोटोटाइप पत्तियों के लक्षणों की प्राथमिक जाँच में सहायता के लिए ऑन-डिवाइस पिक्सल विश्लेषण करता है। यह एक शैक्षणिक सहायक टूल है, आधिकारिक प्रयोगशाला निदान नहीं। अधिकृत कृषि अधिकारी या विशेषज्ञ की पुष्टि के बिना किसी भी कीटनाशक या रासायनिक दवा का छिड़काव न करें।",
  },
  "crop.privacyGuarantee": {
    en: "100% Client-Side Privacy: Images are processed entirely inside your browser and never transmitted over the internet.",
    hi: "100% ऑन-डिवाइस गोपनीयता: छवियां पूरी तरह आपके ब्राउज़र में जांची जाती हैं और कभी भी इंटरनेट पर नहीं भेजी जातीं।",
  },
  "crop.kvkHelp": {
    en: "Need in-person agronomist advice? Call Kisan Call Centre (Toll-Free 1800-180-1551) or visit your nearest Krishi Vigyan Kendra (KVK).",
    hi: "विशेषज्ञ कृषि सलाह चाहिए? किसान कॉल सेंटर (टोल-फ्री 1800-180-1551) पर कॉल करें या नज़दीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।",
  },
  "crop.lossCompensation": {
    en: "Severe crop damage? Check eligibility for PMFBY (Pradhan Mantri Fasal Bima Yojana) to register loss claims within 72 hours of damage.",
    hi: "फसल का भारी नुकसान? 72 घंटे के भीतर नुकसान दर्ज कराने हेतु पीएम फसल बीमा योजना (PMFBY) की पात्रता देखें।",
  },
  "crop.checkPmfby": { en: "Check PMFBY Eligibility", hi: "पीएम फसल बीमा पात्रता जाँचें" },
  "crop.modelInfoHeading": { en: "Phase 1 Engine Architecture", hi: "फेज़ 1 इंजन की बनावट" },

  // Basic Accessibility Controls (Feature 6)
  "a11y.toolbarLabel": { en: "Accessibility controls", hi: "सुगमता नियंत्रण" },
  "a11y.textSize": { en: "Text Size", hi: "अक्षर आकार" },
  "a11y.normal": { en: "Normal", hi: "सामान्य" },
  "a11y.large": { en: "Large", hi: "बड़ा" },
  "a11y.extraLarge": { en: "Extra Large", hi: "अति बड़ा" },
  "a11y.textSizeAria": { en: "Text size: {size}", hi: "अक्षर आकार: {size}" },
  "a11y.contrast": { en: "Contrast", hi: "कंट्रास्ट" },
  "a11y.toggleHighContrast": { en: "Toggle High Contrast", hi: "उच्च कंट्रास्ट बदलें" },
  "a11y.highContrastEnabled": { en: "High Contrast (Active)", hi: "उच्च कंट्रास्ट (सक्रिय)" },
  "a11y.standardContrast": { en: "Standard Contrast", hi: "सामान्य कंट्रास्ट" },
  "a11y.reduceMotion": { en: "Reduce Motion", hi: "मोशन कम करें" },
  "a11y.reduceMotionDesc": {
    en: "Turns off animations and sliding effects for a calmer view.",
    hi: "एनिमेशन और स्लाइड प्रभाव बंद करें।",
  },
  "a11y.help": { en: "Accessibility Help", hi: "सुगमता सहायता" },
  "a11y.dialogTitle": { en: "Accessibility Support & Settings", hi: "सुगमता सहायता एवं सेटिंग्स" },
  "a11y.dialogIntro": {
    en: "Smart Kisaan is designed to be accessible, easy to read, and fully navigable using a keyboard or screen reader.",
    hi: "स्मार्ट किसान को सुगम, पढ़ने में आसान और कीबोर्ड या स्क्रीन रीडर से पूरी तरह चलाने योग्य बनाया गया है।",
  },
  "a11y.keyboardGuideTitle": { en: "Keyboard Navigation Guide", hi: "कीबोर्ड नेविगेशन निर्देश" },
  "a11y.keyboardTab": {
    en: "Use Tab and Shift+Tab to jump between buttons, links, and forms.",
    hi: "बटन, लिंक और फ़ॉर्म के बीच जाने के लिए Tab और Shift+Tab का उपयोग करें।",
  },
  "a11y.keyboardEnter": {
    en: "Press Enter or Spacebar to activate the focused button or link.",
    hi: "चयनित बटन या लिंक को दबाने के लिए Enter या Space दबाएँ।",
  },
  "a11y.keyboardEsc": {
    en: "Press Escape (Esc) to close dialogs, popups, or this help window.",
    hi: "डायलॉग या यह सहायता खिड़की बंद करने के लिए Escape (Esc) दबाएँ।",
  },
  "a11y.skipLinkGuide": {
    en: "Press Tab immediately after page load to reveal the 'Skip to main content' shortcut.",
    hi: "पेज लोड होते ही Tab दबाने पर 'सीधे मुख्य सामग्री पर जाएँ' लिंक दिखाई देता है।",
  },
  "a11y.phoneAssistanceTitle": { en: "Need Phone Voice Assistance?", hi: "फोन पर बोलकर सहायता चाहिए?" },
  "a11y.phoneAssistanceDesc": {
    en: "If you have difficulty reading or using the screen, call the national Kisan Call Centre toll-free at 1800-180-1551 for direct guidance from an agricultural advisor.",
    hi: "यदि आपको स्क्रीन पढ़ने में कठिनाई हो रही है, तो कृषि सलाहकार से सीधे मार्गदर्शन पाने के लिए किसान कॉल सेंटर टोल-फ्री 1800-180-1551 पर कॉल करें।",
  },
  "a11y.callHelpline": {
    en: "Call Kisan Helpline (Toll-Free 1800-180-1551)",
    hi: "किसान हेल्पलाइन पर कॉल करें (टोल-फ्री 1800-180-1551)",
  },
  "a11y.reset": { en: "Reset Accessibility Settings", hi: "सुगमता सेटिंग्स रीसेट करें" },
  "a11y.close": { en: "Close Window", hi: "खिड़की बंद करें" },
  "a11y.liveAnnounceTextSize": { en: "Text size changed to {size}", hi: "अक्षर आकार बदलकर {size} कर दिया गया" },
  "a11y.liveAnnounceContrastOn": { en: "High contrast mode activated", hi: "उच्च कंट्रास्ट मोड सक्रिय किया गया" },
  "a11y.liveAnnounceContrastOff": { en: "Standard contrast restored", hi: "सामान्य कंट्रास्ट पुनर्स्थापित किया गया" },
  "a11y.liveAnnounceMotionOn": { en: "Reduced motion enabled", hi: "मोशन कम करना सक्रिय किया गया" },
  "a11y.liveAnnounceMotionOff": { en: "Standard motion restored", hi: "सामान्य मोशन पुनर्स्थापित किया गया" },
  "a11y.liveAnnounceReset": {
    en: "Accessibility settings reset to default",
    hi: "सुगमता सेटिंग्स डिफ़ॉल्ट पर रीसेट कर दी गईं",
  },

  // Footer
  "footer.copyright": { en: "© 2026 Smart Kisaan", hi: "© 2026 स्मार्ट किसान" },
  "footer.accessibility": { en: "Accessibility", hi: "सुगमता (पहुंच)" },
  "footer.privacy": { en: "Privacy Policy", hi: "गोपनीयता नीति" },
  "footer.terms": { en: "Terms of Service", hi: "सेवा की शर्तें" },
  "footer.contact": { en: "Contact Us", hi: "संपर्क करें" },
};
