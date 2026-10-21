/**
 * Phase 1 — Feature 4: Scheme Eligibility Rules and Document Checklist Definitions.
 *
 * Rules and documents verified against official Government of India portals:
 * - PM-KISAN: https://pmkisan.gov.in/
 * - PMFBY: https://pmfby.gov.in/
 * - KCC: https://myscheme.gov.in/schemes/kcc
 * - Soil Health Card: https://soilhealth.dac.gov.in/
 * - PMKSY (PDMC): https://pmksy.gov.in/
 */

export type EligibilityResultStatus = "may_meet" | "may_not_meet" | "needs_verification";

export interface EligibilityOption {
  id: string;
  labelEn: string;
  labelHi: string;
  hintEn?: string;
  hintHi?: string;
}

export interface EligibilityQuestion {
  id: string;
  questionEn: string;
  questionHi: string;
  helpTextEn?: string;
  helpTextHi?: string;
  options: EligibilityOption[];
}

export interface DocumentItem {
  id: string;
  nameEn: string;
  nameHi: string;
  isMandatory: boolean;
  guidanceEn: string;
  guidanceHi: string;
}

export interface EvaluationResult {
  status: EligibilityResultStatus;
  titleEn: string;
  titleHi: string;
  explanationEn: string;
  explanationHi: string;
  matchedCriteriaEn: string[];
  matchedCriteriaHi: string[];
  issuesOrGapsEn: string[];
  issuesOrGapsHi: string[];
  nextStepsEn: string[];
  nextStepsHi: string[];
}

export interface EligibilityRuleSet {
  schemeId: string;
  schemeNameEn: string;
  schemeNameHi: string;
  shortCode: string;
  category: string;
  officialPortalUrl: string;
  officialPortalName: string;
  questions: EligibilityQuestion[];
  documents: DocumentItem[];
  evaluate: (answers: Record<string, string>) => EvaluationResult;
}

export const ELIGIBILITY_RULE_SETS: Record<string, EligibilityRuleSet> = {
  "pm-kisan": {
    schemeId: "pm-kisan",
    schemeNameEn: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    schemeNameHi: "पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)",
    shortCode: "PM-KISAN",
    category: "Income Support",
    officialPortalUrl: "https://pmkisan.gov.in/",
    officialPortalName: "PM-KISAN Official Portal (pmkisan.gov.in)",
    questions: [
      {
        id: "landholding",
        questionEn: "Does your family own cultivable agricultural land registered in your name?",
        questionHi: "क्या आपके परिवार के पास आपके या परिवार के नाम पर दर्ज खेती योग्य भूमि है?",
        helpTextEn: "Cultivable land in land records (Khasra/Khatauni/ROR) is a core requirement.",
        helpTextHi: "भू-अभिलेखों (खसरा/खतौनी) में खेती योग्य भूमि का दर्ज होना अनिवार्य शर्त है।",
        options: [
          {
            id: "yes",
            labelEn: "Yes, cultivable land is registered in my / family name",
            labelHi: "हाँ, मेरे या परिवार के नाम पर खेती योग्य भूमि दर्ज है",
          },
          {
            id: "no",
            labelEn: "No, I do not own cultivable land (landless laborer / tenant only)",
            labelHi: "नहीं, मेरे पास कोई कृषि भूमि दर्ज नहीं है (भूमिहीन / केवल बटाईदार)",
          },
        ],
      },
      {
        id: "exclusions",
        questionEn: "Do any exclusion criteria apply to your household (government employee, constitutional post, or income tax payee)?",
        questionHi: "क्या आपके परिवार पर कोई अपवाद लागू होता है (सरकारी कर्मचारी, संवैधानिक पद या आयकर दाता)?",
        helpTextEn: "Institutional landholders, current/retired government employees, and income tax payees are excluded.",
        helpTextHi: "संस्थागत ज़मीन मालिक, वर्तमान/सेवानिवृत्त सरकारी कर्मचारी और आयकर भरने वाले परिवार पात्र नहीं हैं।",
        options: [
          {
            id: "none",
            labelEn: "No, none of these exclusions apply to my household",
            labelHi: "नहीं, इनमें से कोई भी अपवाद मेरे परिवार पर लागू नहीं होता",
          },
          {
            id: "excluded",
            labelEn: "Yes, someone in the household is an income tax payee or government employee",
            labelHi: "हाँ, परिवार में कोई आयकर दाता या सरकारी कर्मचारी है",
          },
        ],
      },
      {
        id: "aadhaar_ekyc",
        questionEn: "Is your Aadhaar card linked with your bank account and is e-KYC completed?",
        questionHi: "क्या आपका आधार कार्ड बैंक खाते से जुड़ा है और ई-केवाईसी पूरी है?",
        helpTextEn: "Installments are disbursed strictly via Aadhaar-seeded NPCI bank transfer.",
        helpTextHi: "किस्तें केवल आधार से जुड़े बैंक खातों में डीबीटी के जरिए भेजी जाती हैं।",
        options: [
          {
            id: "yes",
            labelEn: "Yes, Aadhaar is linked to bank and e-KYC is completed",
            labelHi: "हाँ, आधार बैंक से लिंक है और ई-केवाईसी पूरी है",
          },
          {
            id: "not_sure",
            labelEn: "Not sure / e-KYC is still pending or needs update",
            labelHi: "निश्चित नहीं / ई-केवाईसी अभी बाकी है या अपडेट होना है",
          },
          {
            id: "no",
            labelEn: "No, Aadhaar is not linked to my bank account",
            labelHi: "नहीं, आधार मेरे बैंक खाते से लिंक नहीं है",
          },
        ],
      },
    ],
    documents: [
      {
        id: "aadhaar",
        nameEn: "Aadhaar Card (Mandatory)",
        nameHi: "आधार कार्ड (अनिवार्य)",
        isMandatory: true,
        guidanceEn: "Must be active and linked with your primary bank account and mobile number.",
        guidanceHi: "सक्रिय होना चाहिए और आपके बैंक खाते व मोबाइल नंबर से लिंक होना चाहिए।",
      },
      {
        id: "land_records",
        nameEn: "Land Ownership Records (Khasra / Khatauni / Jamabandi)",
        nameHi: "ज़मीन के कागज़ (खसरा / खतौनी / जमाबंदी)",
        isMandatory: true,
        guidanceEn: "Must show your name as registered landholder with survey or plot number.",
        guidanceHi: "इसमें आपका नाम भू-स्वामी के रूप में दर्ज होना चाहिए और खाता/खसरा नंबर साफ दिखना चाहिए।",
      },
      {
        id: "bank_passbook",
        nameEn: "Aadhaar-Seeded Bank Passbook / Statement",
        nameHi: "आधार-सीडेड बैंक पासबुक / विवरण",
        isMandatory: true,
        guidanceEn: "Account must be mapped on NPCI mapper to receive DBT installment transfers.",
        guidanceHi: "डीबीटी किस्तें प्राप्त करने के लिए खाता एनपीसीआई मैपर पर सक्रिय होना चाहिए।",
      },
      {
        id: "mobile_number",
        nameEn: "Active Mobile Number (for OTP e-KYC)",
        nameHi: "सक्रिय मोबाइल नंबर (ओटीपी ई-केवाईसी के लिए)",
        isMandatory: true,
        guidanceEn: "Required to receive verification OTPs and installment status SMS.",
        guidanceHi: "सत्यापन ओटीपी और किस्त स्थिति की जानकारी के लिए आवश्यक है।",
      },
    ],
    evaluate: (answers) => {
      const land = answers.landholding;
      const exclusions = answers.exclusions;
      const ekyc = answers.aadhaar_ekyc;

      if (land === "no") {
        return {
          status: "may_not_meet",
          titleEn: "May Not Meet Basic Criteria",
          titleHi: "मूल पात्रता के अनुकूल प्रतीत नहीं होते",
          explanationEn: "PM-KISAN is exclusively for farmer families who own cultivable agricultural land registered in their name. Landless agricultural laborers or non-owner cultivators do not qualify for direct income support under current scheme guidelines.",
          explanationHi: "पीएम-किसान केवल उन किसान परिवारों के लिए है जिनके नाम पर खेती योग्य भूमि दर्ज है। भूमिहीन कृषि मजदूर या बिना भू-स्वामित्व वाले काश्तकार वर्तमान नियमों के तहत इसके पात्र नहीं हैं।",
          matchedCriteriaEn: exclusions === "none" ? ["No exclusion criteria apply to your household"] : [],
          matchedCriteriaHi: exclusions === "none" ? ["आपके परिवार पर कोई अपवाद लागू नहीं होता"] : [],
          issuesOrGapsEn: ["Cultivable land registered in applicant's name is missing."],
          issuesOrGapsHi: ["आवेदक के नाम पर दर्ज खेती योग्य भूमि का अभाव।"],
          nextStepsEn: [
            "Explore allied agricultural schemes like Kisan Credit Card for allied activities or state tenant assistance programs.",
            "Review official exclusion criteria on pmkisan.gov.in.",
          ],
          nextStepsHi: [
            "पशुपालन या डेयरी से जुड़े किसान क्रेडिट कार्ड या राज्य की अन्य योजनाओं की जानकारी देखें।",
            "pmkisan.gov.in पर आधिकारिक नियम पढ़ें।",
          ],
        };
      }

      if (exclusions === "excluded") {
        return {
          status: "may_not_meet",
          titleEn: "May Not Meet Basic Criteria",
          titleHi: "मूल पात्रता के अनुकूल प्रतीत नहीं होते",
          explanationEn: "Operational guidelines of PM-KISAN specifically exclude institutional landholders, serving or retired government officers/employees, and households where a member pays income tax.",
          explanationHi: "पीएम-किसान के दिशानिर्देशों के अनुसार संस्थागत भू-स्वामी, सेवारत या सेवानिवृत्त सरकारी कर्मचारी और आयकर भरने वाले परिवार इस योजना के लिए अपात्र हैं।",
          matchedCriteriaEn: land === "yes" ? ["Holds cultivable agricultural land"] : [],
          matchedCriteriaHi: land === "yes" ? ["खेती योग्य भूमि उपलब्ध है"] : [],
          issuesOrGapsEn: ["Household meets one or more official exclusion criteria (income tax or government employment)."],
          issuesOrGapsHi: ["परिवार आधिकारिक अपवाद श्रेणी (आयकर दाता या सरकारी सेवा) में आता है।"],
          nextStepsEn: [
            "Check if any exemptions apply under state rules.",
            "Verify complete exclusion categories on the official portal.",
          ],
          nextStepsHi: [
            "आधिकारिक पोर्टल पर सभी अपवाद श्रेणियों की पूरी सूची देखें।",
          ],
        };
      }

      if (ekyc === "no" || ekyc === "not_sure") {
        return {
          status: "needs_verification",
          titleEn: "More Information or Action Required",
          titleHi: "अतिरिक्त जानकारी या कार्रवाई आवश्यक",
          explanationEn: "You appear to meet landholding and exclusion conditions, but Aadhaar-seeding and e-KYC are mandatory for PM-KISAN installment disbursals. Until your bank account is seeded with Aadhaar and e-KYC is confirmed, benefits cannot be transferred.",
          explanationHi: "आप भूमि और अपवाद संबंधी शर्तों को पूरा करते प्रतीत होते हैं, लेकिन किस्त प्राप्त करने के लिए आधार-सीडिंग और ई-केवाईसी अनिवार्य है। बैंक खाते में आधार लिंक और ई-केवाईसी के बिना राशि नहीं भेजी जा सकती।",
          matchedCriteriaEn: [
            "Cultivable agricultural land registered in family name",
            "No exclusion criteria (income tax / government employment) applied",
          ],
          matchedCriteriaHi: [
            "परिवार के नाम पर खेती योग्य भूमि दर्ज है",
            "कोई अपवाद (आयकर/सरकारी पद) लागू नहीं होता",
          ],
          issuesOrGapsEn: [
            "Aadhaar bank account seeding / e-KYC status requires completion or confirmation.",
          ],
          issuesOrGapsHi: [
            "बैंक खाते में आधार सीडिंग या ई-केवाईसी की पुष्टि बाकी है।",
          ],
          nextStepsEn: [
            "Complete OTP-based e-KYC on pmkisan.gov.in or visit a Common Service Center (CSC) with your biometric Aadhaar.",
            "Ensure your bank account is mapped on NPCI for Direct Benefit Transfer (DBT).",
          ],
          nextStepsHi: [
            "pmkisan.gov.in पर जाकर ओटीपी आधारित ई-केवाईसी करें या नजदीकी सीएससी केंद्र पर बायोमेट्रिक सत्यापन कराएं।",
            "अपने बैंक जाकर सुनिश्चित करें कि खाता एनपीसीआई से लिंक (DBT सक्षम) है।",
          ],
        };
      }

      return {
        status: "may_meet",
        titleEn: "May Meet Basic Criteria",
        titleHi: "मूल पात्रता के अनुकूल प्रतीत होते हैं",
        explanationEn: "Based on your answers, you appear to meet the primary eligibility criteria for PM-KISAN: you hold cultivable agricultural land, are not under exclusion categories, and have Aadhaar-linked banking.",
        explanationHi: "आपके जवाबों के अनुसार, आप पीएम-किसान की मुख्य पात्रता शर्तों को पूरा करते प्रतीत होते हैं: आपके पास खेती की ज़मीन है, कोई अपवाद लागू नहीं होता, और आधार बैंकिंग से जुड़ा है।",
        matchedCriteriaEn: [
          "Cultivable agricultural land registered in name",
          "Free from exclusion criteria (no income tax / constitutional post)",
          "Aadhaar-linked DBT banking and e-KYC ready",
        ],
        matchedCriteriaHi: [
          "नाम पर दर्ज खेती योग्य भूमि उपलब्ध है",
          "अपवाद श्रेणियों से मुक्त (कोई आयकर/सरकारी पद नहीं)",
          "आधार-सीडेड बैंक खाता और ई-केवाईसी तैयार है",
        ],
        issuesOrGapsEn: [],
        issuesOrGapsHi: [],
        nextStepsEn: [
          "Keep your Land Record (ROR/Khatauni) and Aadhaar passbook ready.",
          "Check registration on the official portal (pmkisan.gov.in) under New Farmer Registration or verify existing beneficiary status.",
        ],
        nextStepsHi: [
          "अपने ज़मीन के कागज़ (खसरा/खतौनी) और बैंक पासबुक तैयार रखें।",
          "आधिकारिक पोर्टल pmkisan.gov.in पर 'New Farmer Registration' में जाकर आवेदन करें या स्थिति जाँचें।",
        ],
      };
    },
  },

  pmfby: {
    schemeId: "pmfby",
    schemeNameEn: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    schemeNameHi: "प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई)",
    shortCode: "PMFBY",
    category: "Crop Insurance",
    officialPortalUrl: "https://pmfby.gov.in/",
    officialPortalName: "PMFBY Official Portal (pmfby.gov.in)",
    questions: [
      {
        id: "notified_crop",
        questionEn: "Are you cultivating a crop that is officially notified for insurance in your district this season?",
        questionHi: "क्या आप इस मौसम में अपने जिले में बीमा के लिए अधिसूचित फसल उगा रहे हैं?",
        helpTextEn: "Insurance coverage is available only for crops notified by your State Government for that season.",
        helpTextHi: "बीमा सुरक्षा केवल उन फसलों पर मिलती है जिन्हें आपकी राज्य सरकार ने उस मौसम के लिए अधिसूचित किया हो।",
        options: [
          {
            id: "yes",
            labelEn: "Yes, my crop is notified in my district for this season",
            labelHi: "हाँ, मेरी फसल इस मौसम में मेरे जिले में अधिसूचित है",
          },
          {
            id: "not_sure",
            labelEn: "Not sure if my crop is notified this season",
            labelHi: "मुझे पक्का नहीं पता कि मेरी फसल अधिसूचित है या नहीं",
          },
          {
            id: "no",
            labelEn: "No, this crop is not notified in my area",
            labelHi: "नहीं, यह फसल मेरे क्षेत्र में अधिसूचित नहीं है",
          },
        ],
      },
      {
        id: "farmer_type",
        questionEn: "What is your cultivation status for the insured farm plot?",
        questionHi: "बीमा कराए जाने वाले खेत पर आपकी खेती की स्थिति क्या है?",
        helpTextEn: "Both owner cultivators and tenant farmers / sharecroppers with agreements are eligible.",
        helpTextHi: "भूमि मालिक किसान और अनुबंध/घोषणा पत्र वाले बटाईदार/काश्तकार दोनों पात्र हैं।",
        options: [
          {
            id: "owner",
            labelEn: "Owner cultivator (farming on own registered land)",
            labelHi: "भूमि मालिक किसान (अपनी दर्ज ज़मीन पर खेती)",
          },
          {
            id: "tenant",
            labelEn: "Tenant farmer or sharecropper (with tenancy proof / sowing declaration)",
            labelHi: "काश्तकार या बटाईदार किसान (बटाईनामा या बुवाई घोषणा पत्र के साथ)",
          },
          {
            id: "none",
            labelEn: "Not currently cultivating any crop on this land",
            labelHi: "वर्तमान में इस भूमि पर कोई फसल नहीं उगाई है",
          },
        ],
      },
      {
        id: "deadline",
        questionEn: "Are you enrolling before the seasonal cut-off deadline set by your state government?",
        questionHi: "क्या आप राज्य सरकार द्वारा निर्धारित मौसमी अंतिम तिथि से पहले आवेदन कर रहे हैं?",
        helpTextEn: "Cut-off dates are strictly enforced (typically around 31 July for Kharif and 31 December for Rabi).",
        helpTextHi: "अंतिम तिथियों का कड़ाई से पालन होता है (खरीफ के लिए सामान्यतः 31 जुलाई और रबी के लिए 31 दिसंबर)।",
        options: [
          {
            id: "yes",
            labelEn: "Yes, applying before the seasonal cut-off date",
            labelHi: "हाँ, मौसमी अंतिम तारीख से पहले आवेदन कर रहा हूँ",
          },
          {
            id: "not_sure",
            labelEn: "Not sure of the current season's cut-off date",
            labelHi: "वर्तमान मौसम की अंतिम तारीख की जानकारी नहीं है",
          },
          {
            id: "passed",
            labelEn: "No, the cut-off date for this season has already passed",
            labelHi: "नहीं, इस मौसम की अंतिम तारीख बीत चुकी है",
          },
        ],
      },
    ],
    documents: [
      {
        id: "aadhaar",
        nameEn: "Aadhaar Card",
        nameHi: "आधार कार्ड",
        isMandatory: true,
        guidanceEn: "Proof of identity of the applying farmer.",
        guidanceHi: "आवेदक किसान की पहचान का आधिकारिक प्रमाण।",
      },
      {
        id: "land_proof",
        nameEn: "Land Record (ROR/7-12) or Tenancy Agreement",
        nameHi: "भू-अभिलेख (खतौनी/7-12) या बटाईदार अनुबंध पत्र",
        isMandatory: true,
        guidanceEn: "Land possession certificate or written agreement from land owner for tenant farmers.",
        guidanceHi: "ज़मीन का स्वामित्व प्रमाण या बटाईदार किसानों के लिए भू-स्वामी से अनुबंध पत्र।",
      },
      {
        id: "sowing_cert",
        nameEn: "Sowing Certificate / Crop Sown Self-Declaration",
        nameHi: "बुवाई प्रमाण पत्र / फसल बुवाई स्व-घोषणा",
        isMandatory: true,
        guidanceEn: "Certificate from Patwari / Village Revenue Officer or self-declaration of actual crop sown.",
        guidanceHi: "पटवारी या राजस्व अधिकारी द्वारा प्रमाणित या किसान द्वारा स्वयं प्रमाणित बुवाई पत्र।",
      },
      {
        id: "bank_passbook",
        nameEn: "Bank Passbook with Account Number & IFSC",
        nameHi: "बैंक पासबुक (खाता संख्या और आईएफएससी कोड सहित)",
        isMandatory: true,
        guidanceEn: "Claims are disbursed directly to this account in case of localized or seasonal crop loss.",
        guidanceHi: "फसल क्षति की स्थिति में क्लेम की राशि सीधे इसी खाते में भेजी जाती है।",
      },
    ],
    evaluate: (answers) => {
      const notified = answers.notified_crop;
      const farmerType = answers.farmer_type;
      const deadline = answers.deadline;

      if (farmerType === "none") {
        return {
          status: "may_not_meet",
          titleEn: "May Not Meet Basic Criteria",
          titleHi: "मूल पात्रता के अनुकूल प्रतीत नहीं होते",
          explanationEn: "PMFBY provides crop insurance strictly for active cultivators with an insurable interest in a sown crop. Non-cultivating individuals cannot enroll.",
          explanationHi: "पीएमएफबीवाई केवल उन सक्रिय किसानों के लिए है जिन्होंने वास्तव में फसल बोई है। जो खेती नहीं कर रहे, वे बीमा नहीं करा सकते।",
          matchedCriteriaEn: [],
          matchedCriteriaHi: [],
          issuesOrGapsEn: ["Applicant is not actively cultivating an insurable crop."],
          issuesOrGapsHi: ["आवेदक वर्तमान में बीमा योग्य फसल की खेती नहीं कर रहा है।"],
          nextStepsEn: ["Enroll once you take up seasonal crop cultivation."],
          nextStepsHi: ["जब आप मौसमी फसल की बुवाई करें, तब आवेदन करें।"],
        };
      }

      if (notified === "no") {
        return {
          status: "may_not_meet",
          titleEn: "May Not Meet Basic Criteria",
          titleHi: "मूल पात्रता के अनुकूल प्रतीत नहीं होते",
          explanationEn: "Under PMFBY, government subsidized crop insurance is restricted only to notified crops in notified insurance units. Unnotified crops are not covered under the central scheme.",
          explanationHi: "पीएमएफबीवाई के तहत सरकारी सब्सिडी वाली बीमा सुरक्षा केवल संबंधित क्षेत्र में अधिसूचित फसलों पर ही मिलती है। गैर-अधिसूचित फसलों पर यह लागू नहीं होती।",
          matchedCriteriaEn: [
            farmerType === "owner" ? "Owner cultivator status" : "Tenant cultivator with insurable interest",
          ],
          matchedCriteriaHi: [
            farmerType === "owner" ? "भूमि मालिक किसान की स्थिति" : "काश्तकार किसान की स्थिति",
          ],
          issuesOrGapsEn: ["The crop being cultivated is not officially notified for insurance in this area."],
          issuesOrGapsHi: ["उगाई जा रही फसल इस क्षेत्र में बीमा के लिए अधिसूचित नहीं है।"],
          nextStepsEn: [
            "Check if any horticultural or commercial insurance schemes cover your crop.",
            "Verify the list of notified crops on pmfby.gov.in.",
          ],
          nextStepsHi: [
            "pmfby.gov.in पर जाकर अपने जिले की अधिसूचित फसलों की सूची देखें।",
          ],
        };
      }

      if (deadline === "passed") {
        return {
          status: "may_not_meet",
          titleEn: "May Not Meet Basic Criteria (Cut-off Date Passed)",
          titleHi: "मूल पात्रता के अनुकूल प्रतीत नहीं होते (अंतिम तिथि समाप्त)",
          explanationEn: "The seasonal enrollment deadline for crop insurance has already passed. The insurance portal does not accept premium payments or registrations after the cut-off date.",
          explanationHi: "फसल बीमा के लिए इस मौसम की अंतिम तारीख बीत चुकी है। अंतिम तिथि के बाद पोर्टल पर प्रीमियम स्वीकार नहीं किया जा सकता।",
          matchedCriteriaEn: ["Active cultivator of notified crop"],
          matchedCriteriaHi: ["अधिसूचित फसल के सक्रिय किसान"],
          issuesOrGapsEn: ["Enrollment cut-off deadline for this season has expired."],
          issuesOrGapsHi: ["इस मौसम के लिए नामांकन की अंतिम तारीख समाप्त हो चुकी है।"],
          nextStepsEn: [
            "Plan enrollment for the upcoming agricultural season (Kharif or Rabi) before its designated cut-off date.",
          ],
          nextStepsHi: [
            "आगामी फसल मौसम (खरीफ या रबी) में बुवाई के तुरंत बाद अंतिम तारीख से पहले आवेदन करें।",
          ],
        };
      }

      if (notified === "not_sure" || deadline === "not_sure") {
        return {
          status: "needs_verification",
          titleEn: "State Notification Verification Required",
          titleHi: "राज्य अधिसूचना का सत्यापन आवश्यक",
          explanationEn: "Crop notification status and exact cut-off dates are declared by your state government each season. You need to confirm whether your specific crop is notified in your block and whether enrollment is still open.",
          explanationHi: "फसलों की अधिसूचना और अंतिम तारीखें हर मौसम में राज्य सरकार द्वारा तय की जाती हैं। आपको यह पुष्टि करनी होगी कि आपकी फसल आपके ब्लॉक में अधिसूचित है या नहीं और आवेदन खुला है या नहीं।",
          matchedCriteriaEn: [
            farmerType === "owner" ? "Owner cultivator with farm plot" : "Tenant farmer with cultivation rights",
          ],
          matchedCriteriaHi: [
            farmerType === "owner" ? "खेत के साथ भूमि मालिक किसान" : "काश्तकारी अधिकारों के साथ किसान",
          ],
          issuesOrGapsEn: ["Seasonal crop notification or application cut-off date requires confirmation."],
          issuesOrGapsHi: ["मौसमी फसल अधिसूचना या अंतिम तिथि की पुष्टि आवश्यक है।"],
          nextStepsEn: [
            "Visit your local agricultural office, bank branch, or pmfby.gov.in to check the seasonal cut-off calendar for your district.",
            "Non-loanee farmers can enroll directly through a Common Service Center (CSC) with a sowing certificate.",
          ],
          nextStepsHi: [
            "नजदीकी कृषि कार्यालय, बैंक शाखा या pmfby.gov.in पर जाकर अपने जिले का कट-ऑफ कैलेंडर देखें।",
            "गैर-ऋणी किसान सीएससी केंद्र जाकर बुवाई प्रमाण पत्र के साथ आवेदन कर सकते हैं।",
          ],
        };
      }

      return {
        status: "may_meet",
        titleEn: "May Meet Basic Criteria",
        titleHi: "मूल पात्रता के अनुकूल प्रतीत होते हैं",
        explanationEn: "You appear to meet the primary eligibility conditions for PMFBY: you are actively cultivating a notified crop in a notified area, and you are applying before the seasonal cut-off date.",
        explanationHi: "आप पीएमएफबीवाई की मुख्य शर्तों को पूरा करते प्रतीत होते हैं: आप अधिसूचित क्षेत्र में अधिसूचित फसल उगा रहे हैं और कट-ऑफ तारीख से पहले आवेदन कर रहे हैं।",
        matchedCriteriaEn: [
          "Cultivating a notified crop in designated insurance unit",
          farmerType === "owner" ? "Owner cultivator with land title" : "Tenant farmer with sowing declaration",
          "Applying within active seasonal cut-off window",
        ],
        matchedCriteriaHi: [
          "अधिसूचित क्षेत्र में अधिसूचित फसल की खेती",
          farmerType === "owner" ? "ज़मीन के कागज़ात के साथ भूमि मालिक" : "बुवाई घोषणा के साथ बटाईदार किसान",
          "सक्रिय मौसमी समय-सीमा के भीतर आवेदन",
        ],
        issuesOrGapsEn: [],
        issuesOrGapsHi: [],
        nextStepsEn: [
          "Loanee farmers are enrolled automatically by their lending bank (unless opted out in writing).",
          "Non-loanee farmers can apply via pmfby.gov.in or at the nearest CSC with their land record, sowing certificate, and bank passbook.",
        ],
        nextStepsHi: [
          "ऋणी किसानों का बीमा उनके बैंक द्वारा स्वतः कर दिया जाता है।",
          "गैर-ऋणी किसान pmfby.gov.in या नजदीकी सीएससी केंद्र पर जाकर भू-अभिलेख और बुवाई प्रमाण पत्र के साथ आवेदन करें।",
        ],
      };
    },
  },

  kcc: {
    schemeId: "kcc",
    schemeNameEn: "Kisan Credit Card (KCC) Scheme",
    schemeNameHi: "किसान क्रेडिट कार्ड (केसीसी) योजना",
    shortCode: "KCC",
    category: "Credit & Loan",
    officialPortalUrl: "https://myscheme.gov.in/schemes/kcc",
    officialPortalName: "myScheme Portal (myscheme.gov.in/schemes/kcc)",
    questions: [
      {
        id: "activity",
        questionEn: "Are you actively engaged in agriculture, crop production, or allied activities (dairy, poultry, fisheries)?",
        questionHi: "क्या आप सक्रिय रूप से खेती, फसल उत्पादन, या पशुपालन, डेयरी, मछली पालन में लगे हैं?",
        helpTextEn: "KCC is available for seasonal crops as well as animal husbandry, dairy, and fisheries.",
        helpTextHi: "केसीसी मौसमी फसलों के साथ-साथ पशुपालन, डेयरी और मत्स्य पालन के लिए भी उपलब्ध है।",
        options: [
          {
            id: "yes",
            labelEn: "Yes, active in agriculture or allied animal / fish husbandry",
            labelHi: "हाँ, मैं खेती या पशुपालन/मत्स्य पालन में सक्रिय रूप से लगा हूँ",
          },
          {
            id: "no",
            labelEn: "No, not engaged in farming or allied activities",
            labelHi: "नहीं, मैं कृषि या संबद्ध गतिविधियों में नहीं हूँ",
          },
        ],
      },
      {
        id: "tenure_type",
        questionEn: "What is your farming status or operational setup?",
        questionHi: "आपकी खेती या परिचालन की स्थिति क्या है?",
        helpTextEn: "Owner cultivators, tenant farmers, sharecroppers, and SHG/JLG members are eligible.",
        helpTextHi: "भू-स्वामी किसान, काश्तकार, बटाईदार और स्वयं सहायता समूह (SHG/JLG) के सदस्य पात्र हैं।",
        options: [
          {
            id: "owner",
            labelEn: "Owner cultivator with registered land records (Khasra/Khatauni)",
            labelHi: "भूमि मालिक किसान (खसरा/खतौनी भू-अभिलेख के साथ)",
          },
          {
            id: "tenant",
            labelEn: "Tenant farmer, oral lessee, or sharecropper",
            labelHi: "काश्तकार, पट्टेदार या बटाईदार किसान",
          },
          {
            id: "allied",
            labelEn: "Allied farmer (dairy / fisheries / poultry with livestock setup)",
            labelHi: "संबद्ध किसान (डेयरी/मछली पालन/मुर्गी पालन सेटअप के साथ)",
          },
          {
            id: "none",
            labelEn: "None of the above",
            labelHi: "उपरोक्त में से कोई नहीं",
          },
        ],
      },
      {
        id: "loan_standing",
        questionEn: "What is your repayment record on previous agricultural or bank loans?",
        questionHi: "पिछले कृषि या बैंक ऋणों पर आपका भुगतान रिकॉर्ड कैसा है?",
        helpTextEn: "Banks check credit history. First-time borrowers or borrowers with clear records qualify easily.",
        helpTextHi: "बैंक क्रेडिट रिकॉर्ड की जांच करते हैं। नए आवेदक या साफ़ रिकॉर्ड वाले आसानी से पात्र होते हैं।",
        options: [
          {
            id: "good",
            labelEn: "Good repayment record / No overdue default / First-time borrower",
            labelHi: "अच्छा रिकॉर्ड / कोई बकाया डिफ़ॉल्ट नहीं / पहली बार ऋण ले रहा हूँ",
          },
          {
            id: "not_sure",
            labelEn: "Have existing bank loan, not sure of credit status",
            labelHi: "पुराना ऋण है, क्रेडिट स्थिति के बारे में निश्चित नहीं हूँ",
          },
          {
            id: "default",
            labelEn: "Have an active unregularized default / overdue loan",
            labelHi: "बैंक में पुराना बकाया (डिफ़ॉल्ट) है जो नियमित नहीं हुआ है",
          },
        ],
      },
    ],
    documents: [
      {
        id: "kcc_form",
        nameEn: "Filled KCC Application Form",
        nameHi: "भरा हुआ केसीसी आवेदन पत्र",
        isMandatory: true,
        guidanceEn: "One-page simplified form available at all commercial, RRB, and cooperative bank branches.",
        guidanceHi: "सभी वाणिज्यिक, ग्रामीण और सहकारी बैंकों में उपलब्ध एक पन्ने का सरल फॉर्म।",
      },
      {
        id: "identity_proof",
        nameEn: "Identity Proof (Aadhaar / Voter ID / PAN)",
        nameHi: "पहचान प्रमाण (आधार कार्ड / वोटर आईडी / पैन कार्ड)",
        isMandatory: true,
        guidanceEn: "Official government-issued identity document.",
        guidanceHi: "सरकार द्वारा जारी वैध पहचान पत्र।",
      },
      {
        id: "address_proof",
        nameEn: "Address Proof",
        nameHi: "निवास का प्रमाण पत्र",
        isMandatory: true,
        guidanceEn: "Aadhaar Card, Voter Card, or electricity bill showing residential address.",
        guidanceHi: "आधार कार्ड, वोटर कार्ड या पते का कोई आधिकारिक प्रमाण।",
      },
      {
        id: "land_docs",
        nameEn: "Land Record / Cultivation Agreement",
        nameHi: "ज़मीन के कागज़ (खसरा/खतौनी) या बटाईनामा",
        isMandatory: true,
        guidanceEn: "Copies of land records showing cropping pattern, or tenancy agreement for tenant farmers.",
        guidanceHi: "खसरा/खतौनी की नकल या बटाईदार किसानों के लिए बटाई अनुबंध पत्र।",
      },
      {
        id: "photographs",
        nameEn: "Passport Size Photographs",
        nameHi: "पासपोर्ट आकार की रंगीन फोटो",
        isMandatory: true,
        guidanceEn: "Two recent passport-sized color photographs.",
        guidanceHi: "आवेदक की दो हालिया पासपोर्ट साइज रंगीन फोटो।",
      },
    ],
    evaluate: (answers) => {
      const activity = answers.activity;
      const tenure = answers.tenure_type;
      const loan = answers.loan_standing;

      if (activity === "no" || tenure === "none") {
        return {
          status: "may_not_meet",
          titleEn: "May Not Meet Basic Criteria",
          titleHi: "मूल पात्रता के अनुकूल प्रतीत नहीं होते",
          explanationEn: "Kisan Credit Cards are designed strictly for individuals engaged in agriculture, crop cultivation, or allied livestock/fisheries activities.",
          explanationHi: "किसान क्रेडिट कार्ड केवल उन व्यक्तियों के लिए है जो खेती, फसल उत्पादन या संबद्ध पशुपालन/मत्स्य गतिविधियों में सक्रिय रूप से लगे हैं।",
          matchedCriteriaEn: [],
          matchedCriteriaHi: [],
          issuesOrGapsEn: ["Applicant is not actively engaged in farming or allied agricultural activities."],
          issuesOrGapsHi: ["आवेदक कृषि या संबद्ध गतिविधियों में सक्रिय नहीं है।"],
          nextStepsEn: ["Explore general MSME or personal loan options from commercial banks."],
          nextStepsHi: ["व्यावसायिक बैंकों से सामान्य मुद्रा या व्यक्तिगत ऋण विकल्पों की जानकारी लें।"],
        };
      }

      if (loan === "default") {
        return {
          status: "may_not_meet",
          titleEn: "May Not Meet Basic Criteria (Active Overdue)",
          titleHi: "मूल पात्रता के अनुकूल प्रतीत नहीं होते (बकाया ऋण डिफ़ॉल्ट)",
          explanationEn: "Banks generally require past overdue agricultural or personal loan defaults to be regularized or settled before sanctioning fresh KCC limits.",
          explanationHi: "बैंकों के नियमों के अनुसार नया केसीसी जारी करने से पहले पुराने बकाया या डिफ़ॉल्ट ऋणों को नियमित या चुकता करना आवश्यक होता है।",
          matchedCriteriaEn: ["Active farmer / allied livestock operator"],
          matchedCriteriaHi: ["सक्रिय किसान / पशुपालक"],
          issuesOrGapsEn: ["Active overdue loan default recorded with bank."],
          issuesOrGapsHi: ["बैंक में पुराना बकाया ऋण डिफ़ॉल्ट दर्ज है।"],
          nextStepsEn: [
            "Visit your branch to regularize or restructure past overdue dues.",
            "Once credit standing is restored, submit a fresh KCC application.",
          ],
          nextStepsHi: [
            "अपनी बैंक शाखा जाकर पुराने बकाया को नियमित करने या समाधान करने की बात करें।",
            "रिकॉर्ड सही होने के बाद नया केसीसी आवेदन जमा करें।",
          ],
        };
      }

      if (tenure === "tenant" || loan === "not_sure") {
        return {
          status: "needs_verification",
          titleEn: "Bank Branch Discretion & Verification Required",
          titleHi: "बैंक शाखा सत्यापन एवं निर्णय आवश्यक",
          explanationEn: "You are engaged in agriculture. However, for tenant farmers/sharecroppers, or where past credit history is uncertain, credit sanction depends on the lending bank branch's inspection and verification of land tenancy.",
          explanationHi: "आप कृषि में सक्रिय हैं। हालांकि, बटाईदार/काश्तकार किसानों के लिए या जहां पुराना क्रेडिट रिकॉर्ड अनिश्चित हो, ऋण की स्वीकृति संबंधित बैंक शाखा के निरीक्षण और बटाईदारी सत्यापन पर निर्भर करती है।",
          matchedCriteriaEn: [
            "Engaged in agricultural / allied production",
            tenure === "tenant" ? "Cultivating as tenant / sharecropper" : "Operational setup available",
          ],
          matchedCriteriaHi: [
            "कृषि या संबद्ध उत्पादन में सक्रिय",
            tenure === "tenant" ? "काश्तकार/बटाईदार के रूप में खेती" : "परिचालन व्यवस्था उपलब्ध",
          ],
          issuesOrGapsEn: [
            tenure === "tenant"
              ? "Tenant / sharecropping documentation requires bank field verification."
              : "Credit record verification required by lending branch.",
          ],
          issuesOrGapsHi: [
            tenure === "tenant"
              ? "बटाईदारी या काश्तकारी के कागज़ात का बैंक सत्यापन आवश्यक है।"
              : "बैंक शाखा द्वारा पुराने क्रेडिट रिकॉर्ड की जांच आवश्यक है।",
          ],
          nextStepsEn: [
            "Submit the simplified one-page KCC form to your nearest rural or commercial bank branch.",
            "For loans up to ₹1.60 lakh, no collateral security is mandated by RBI guidelines.",
          ],
          nextStepsHi: [
            "नजदीकी ग्रामीण या बैंक शाखा में सरल एक पन्ने का केसीसी फॉर्म जमा करें।",
            "आरबीआई के नियमों के अनुसार ₹1.60 लाख तक के ऋण के लिए किसी गारंटी/बंधक की आवश्यकता नहीं होती।",
          ],
        };
      }

      return {
        status: "may_meet",
        titleEn: "May Meet Basic Criteria",
        titleHi: "मूल पात्रता के अनुकूल प्रतीत होते हैं",
        explanationEn: "You appear to meet the primary criteria for a Kisan Credit Card (active farmer/allied operator with verified land/setup and clean credit standing). You may qualify for concessional credit at 4% effective interest upon prompt repayment.",
        explanationHi: "आप किसान क्रेडिट कार्ड की मुख्य शर्तों को पूरा करते प्रतीत होते हैं (साफ़ रिकॉर्ड और ज़मीन/सेटअप के साथ सक्रिय किसान)। समय पर भुगतान करने पर आपको 4% की रियायती ब्याज दर पर ऋण मिल सकता है।",
        matchedCriteriaEn: [
          "Active in crop cultivation or allied activities",
          "Land ownership records / verified operational setup available",
          "Clean credit history / no active defaults",
        ],
        matchedCriteriaHi: [
          "फसल उत्पादन या संबद्ध गतिविधियों में सक्रिय",
          "ज़मीन के कागज़ात या सत्यापित परिचालन व्यवस्था उपलब्ध",
          "साफ़ क्रेडिट रिकॉर्ड / कोई बकाया डिफ़ॉल्ट नहीं",
        ],
        issuesOrGapsEn: [],
        issuesOrGapsHi: [],
        nextStepsEn: [
          "Fill out the standard 1-page KCC form and submit it with your Aadhaar, land record, and photo to any local bank.",
          "Interest subvention of 2% and prompt repayment incentive of 3% apply up to ₹3 lakh limit.",
        ],
        nextStepsHi: [
          "एक पन्ने का केसीसी फॉर्म भरकर अपने आधार, खसरा/खतौनी और फोटो के साथ नजदीकी बैंक शाखा में जमा करें।",
          "₹3 लाख तक के ऋण पर समय पर चुकाने पर 3% अतिरिक्त छूट (प्रभावी ब्याज 4%) मिलती है।",
        ],
      };
    },
  },

  "soil-health-card": {
    schemeId: "soil-health-card",
    schemeNameEn: "Soil Health Card (SHC) Scheme",
    schemeNameHi: "मृदा स्वास्थ्य कार्ड योजना (सॉइल हेल्थ कार्ड)",
    shortCode: "SHC",
    category: "Soil & Inputs",
    officialPortalUrl: "https://soilhealth.dac.gov.in/",
    officialPortalName: "Soil Health Card Portal (soilhealth.dac.gov.in)",
    questions: [
      {
        id: "land_access",
        questionEn: "Do you own or cultivate agricultural land anywhere in India?",
        questionHi: "क्या आप भारत में कहीं भी खेती योग्य ज़मीन के मालिक हैं या उस पर खेती करते हैं?",
        helpTextEn: "All farmers with agricultural holdings are eligible for free soil testing.",
        helpTextHi: "कृषि भूमि वाले सभी किसान निःशुल्क या न्यूनतम शुल्क पर मिट्टी जांच के पात्र हैं।",
        options: [
          {
            id: "yes",
            labelEn: "Yes, I hold or farm agricultural land",
            labelHi: "हाँ, मेरे पास खेती की ज़मीन है या मैं खेती करता हूँ",
          },
          {
            id: "no",
            labelEn: "No, I do not have agricultural land",
            labelHi: "नहीं, मेरे पास कोई कृषि भूमि नहीं है",
          },
        ],
      },
      {
        id: "sample_readiness",
        questionEn: "Are you ready to provide a soil sample from your farm plot (with assistance from agriculture staff)?",
        questionHi: "क्या आप कृषि विभाग के सहयोग से अपने खेत की मिट्टी का नमूना देने के लिए तैयार हैं?",
        helpTextEn: "Soil samples are collected using GPS coordinates and tested across 12 nutrient parameters.",
        helpTextHi: "खेत से जीपीएस आधारित नमूने लेकर 12 मुख्य पोषक तत्वों की जांच की जाती है।",
        options: [
          {
            id: "yes",
            labelEn: "Yes, ready to provide or have assistance to take soil sample",
            labelHi: "हाँ, मैं मिट्टी का नमूना देने के लिए तैयार हूँ",
          },
          {
            id: "not_sure",
            labelEn: "Not sure how/where soil samples are collected",
            labelHi: "मुझे निश्चित जानकारी नहीं है कि नमूना कैसे और कहाँ देना है",
          },
          {
            id: "no",
            labelEn: "No, cannot provide soil sample",
            labelHi: "नहीं, मिट्टी का नमूना नहीं दे सकता",
          },
        ],
      },
    ],
    documents: [
      {
        id: "id_proof",
        nameEn: "Aadhaar Card or State Farmer ID",
        nameHi: "आधार कार्ड या राज्य किसान पंजीकरण संख्या",
        isMandatory: true,
        guidanceEn: "Used to tag the soil test report and card to your farmer profile.",
        guidanceHi: "मिट्टी जांच रिपोर्ट और कार्ड को आपकी किसान प्रोफाइल से जोड़ने के लिए।",
      },
      {
        id: "plot_details",
        nameEn: "Land Ownership Details (Khasra / Survey Number / Village)",
        nameHi: "खेत की पहचान का विवरण (खसरा नंबर / खाता संख्या / गांव)",
        isMandatory: true,
        guidanceEn: "Required to record GPS coordinates and location of the sampled plot.",
        guidanceHi: "नमूने वाले खेत की जीपीएस लोकेशन और पहचान दर्ज करने के लिए आवश्यक।",
      },
      {
        id: "soil_sample",
        nameEn: "Representative Soil Sample from Field",
        nameHi: "खेत से लिया गया मिट्टी का नमूना",
        isMandatory: true,
        guidanceEn: "Collected to 15cm depth using V-notch method with local Agri Officer / KVK guidance.",
        guidanceHi: "कृषि अधिकारी या केवीके की देखरेख में 15 सेमी गहराई से V-आकार में लिया गया नमूना।",
      },
    ],
    evaluate: (answers) => {
      const land = answers.land_access;
      const sample = answers.sample_readiness;

      if (land === "no") {
        return {
          status: "may_not_meet",
          titleEn: "May Not Meet Basic Criteria",
          titleHi: "मूल पात्रता के अनुकूल प्रतीत नहीं होते",
          explanationEn: "Soil Health Cards are issued specifically for cultivable agricultural plots to give tailored nutrient and fertilizer recommendations.",
          explanationHi: "मृदा स्वास्थ्य कार्ड विशेष रूप से खेती के खेतों के लिए जारी किया जाता है ताकि मिट्टी अनुसार सही खाद की सिफारिश की जा सके।",
          matchedCriteriaEn: [],
          matchedCriteriaHi: [],
          issuesOrGapsEn: ["Applicant does not have access to an agricultural land plot."],
          issuesOrGapsHi: ["आवेदक के पास खेती की भूमि उपलब्ध नहीं है।"],
          nextStepsEn: ["Explore agricultural training or input subsidy programs once land is acquired."],
          nextStepsHi: ["कृषि प्रशिक्षण या अन्य सरकारी कार्यक्रमों की जानकारी देखें।"],
        };
      }

      if (sample === "no") {
        return {
          status: "may_not_meet",
          titleEn: "May Not Meet Basic Criteria",
          titleHi: "मूल पात्रता के अनुकूल प्रतीत नहीं होते",
          explanationEn: "Laboratory testing of a representative field soil sample is the mandatory basis for preparing a Soil Health Card report.",
          explanationHi: "खेत की मिट्टी की प्रयोगशाला जांच ही मृदा स्वास्थ्य कार्ड रिपोर्ट तैयार करने का एकमात्र आधार है।",
          matchedCriteriaEn: ["Has agricultural land"],
          matchedCriteriaHi: ["खेती योग्य भूमि उपलब्ध है"],
          issuesOrGapsEn: ["Soil sample cannot be provided for laboratory analysis."],
          issuesOrGapsHi: ["प्रयोगशाला जांच के लिए मिट्टी का नमूना उपलब्ध नहीं है।"],
          nextStepsEn: ["Contact your local Gram Panchayat or Krishi Vigyan Kendra for sample collection support."],
          nextStepsHi: ["नमूना एकत्र करने में मदद के लिए स्थानीय कृषि सहायक से संपर्क करें।"],
        };
      }

      if (sample === "not_sure") {
        return {
          status: "needs_verification",
          titleEn: "Local Agricultural Office Guidance Required",
          titleHi: "स्थानीय कृषि कार्यालय से मार्गदर्शन आवश्यक",
          explanationEn: "You have agricultural land, but soil sample collection cycles are conducted periodically by state agricultural extension workers or Krishi Vigyan Kendras (KVKs).",
          explanationHi: "आपके पास कृषि भूमि है, लेकिन मिट्टी के नमूने का संग्रह राज्य कृषि विभाग के कर्मचारियों या केवीके द्वारा समय-समय पर किया जाता है।",
          matchedCriteriaEn: ["Agricultural land holding confirmed"],
          matchedCriteriaHi: ["कृषि भूमि का स्वामित्व/काश्तकारी उपलब्ध"],
          issuesOrGapsEn: ["Need information on local sampling cycle and testing lab."],
          issuesOrGapsHi: ["स्थानीय नमूना संग्रह चक्र और जांच प्रयोगशाला की जानकारी आवश्यक है।"],
          nextStepsEn: [
            "Contact your block Agriculture Officer (AO) or visit soilhealth.dac.gov.in to find your nearest testing lab.",
            "Extension staff will help collect samples from your field using proper sampling protocols.",
          ],
          nextStepsHi: [
            "अपने ब्लॉक के कृषि अधिकारी से संपर्क करें या soilhealth.dac.gov.in पर नजदीकी लैब खोजें।",
            "कृषि कर्मचारी सही तरीके से आपके खेत से नमूना लेने में मदद करेंगे।",
          ],
        };
      }

      return {
        status: "may_meet",
        titleEn: "May Meet Basic Criteria",
        titleHi: "मूल पात्रता के अनुकूल प्रतीत होते हैं",
        explanationEn: "You appear to meet all requirements for a Soil Health Card: you have agricultural land and are ready to provide a soil sample. All Indian farmers qualify for free or nominal testing every 3 years.",
        explanationHi: "आप मृदा स्वास्थ्य कार्ड की सभी शर्तें पूरी करते हैं: आपके पास खेती की ज़मीन है और आप नमूना देने के लिए तैयार हैं। भारत के सभी किसान हर 3 साल में यह कार्ड पाने के पात्र हैं।",
        matchedCriteriaEn: [
          "Cultivable agricultural land available",
          "Soil sample collection readiness confirmed",
        ],
        matchedCriteriaHi: [
          "खेती योग्य भूमि उपलब्ध है",
          "मिट्टी का नमूना देने की तैयारी की पुष्टि",
        ],
        issuesOrGapsEn: [],
        issuesOrGapsHi: [],
        nextStepsEn: [
          "Provide your soil sample to your district testing laboratory or Krishi Vigyan Kendra.",
          "Track your card status or download completed reports from soilhealth.dac.gov.in.",
        ],
        nextStepsHi: [
          "अपने जिले की मृदा परीक्षण प्रयोगशाला या केवीके में नमूना जमा करें।",
          "soilhealth.dac.gov.in पर जाकर अपने कार्ड की स्थिति देखें या रिपोर्ट डाउनलोड करें।",
        ],
      };
    },
  },

  "pmksy-pdmc": {
    schemeId: "pmksy-pdmc",
    schemeNameEn: "PM Krishi Sinchayee Yojana — Per Drop More Crop (PMKSY-PDMC)",
    schemeNameHi: "प्रधानमंत्री कृषि सिंचाई योजना — प्रति बूंद अधिक फसल (पीएमकेएसवाई)",
    shortCode: "PMKSY (PDMC)",
    category: "Irrigation",
    officialPortalUrl: "https://pmksy.gov.in/",
    officialPortalName: "PMKSY Official Portal (pmksy.gov.in)",
    questions: [
      {
        id: "water_source",
        questionEn: "Do you have cultivable land with an assured irrigation water source (well, tubewell, canal, or farm pond)?",
        questionHi: "क्या आपके पास खेती योग्य भूमि और पानी का सुनिश्चित स्रोत (कुआं, नलकूप, नहर या तालाब) उपलब्ध है?",
        helpTextEn: "Micro-irrigation systems (drip/sprinkler) require an assured water source on or near the field.",
        helpTextHi: "सूक्ष्म सिंचाई (ड्रिप/फव्वारा) के लिए खेत पर या पास में पानी का सुनिश्चित स्रोत होना अनिवार्य है।",
        options: [
          {
            id: "yes",
            labelEn: "Yes, assured water source is available on or near the plot",
            labelHi: "हाँ, खेत पर या पास में पानी का सुनिश्चित स्रोत उपलब्ध है",
          },
          {
            id: "no",
            labelEn: "No, rainfed only / no assured water source",
            labelHi: "नहीं, केवल बारिश पर निर्भर / कोई पानी का स्रोत नहीं",
          },
        ],
      },
      {
        id: "farmer_category",
        questionEn: "What is your total operational landholding size?",
        questionHi: "आपकी खेती की कुल ज़मीन का आकार क्या है?",
        helpTextEn: "Small & Marginal farmers (up to 2 hectares) receive up to 55% subsidy; others receive up to 45%.",
        helpTextHi: "छोटे और सीमांत किसानों (2 हेक्टेयर तक) को 55% तक और अन्य किसानों को 45% तक सब्सिडी मिलती है।",
        options: [
          {
            id: "small_marginal",
            labelEn: "Small or Marginal farmer (up to 2 hectares / 5 acres) — eligible for up to 55% subsidy",
            labelHi: "छोटा या सीमांत किसान (2 हेक्टेयर / 5 एकड़ तक) — 55% तक सब्सिडी",
          },
          {
            id: "other",
            labelEn: "Other farmer (more than 2 hectares / 5 acres) — eligible for up to 45% subsidy",
            labelHi: "अन्य किसान (2 हेक्टेयर से अधिक) — 45% तक सब्सिडी",
          },
          {
            id: "none",
            labelEn: "No cultivable land holding",
            labelHi: "खेती योग्य भूमि नहीं है",
          },
        ],
      },
      {
        id: "pumping_setup",
        questionEn: "Do you have an electric, diesel, or solar pump to supply required water pressure for drip/sprinkler?",
        questionHi: "क्या आपके पास ड्रिप/स्प्रिंकलर चलाने के लिए बिजली, डीजल या सोलर पंप की व्यवस्था है?",
        helpTextEn: "Micro-irrigation requires adequate pressure to emit uniform water droplets.",
        helpTextHi: "ड्रिप और स्प्रिंकलर के सुचारू संचालन के लिए पर्याप्त पानी के दबाव की आवश्यकता होती है।",
        options: [
          {
            id: "yes",
            labelEn: "Yes, pump / pressure arrangement is available",
            labelHi: "हाँ, पंप या दबाव की व्यवस्था उपलब्ध है",
          },
          {
            id: "not_sure",
            labelEn: "Not sure of pressure requirements / planning solar pump",
            labelHi: "दबाव की आवश्यकता के बारे में निश्चित नहीं / सोलर पंप की योजना है",
          },
          {
            id: "no",
            labelEn: "No pump or pressure setup available",
            labelHi: "कोई पंप या दबाव की व्यवस्था नहीं है",
          },
        ],
      },
    ],
    documents: [
      {
        id: "aadhaar",
        nameEn: "Aadhaar Card",
        nameHi: "आधार कार्ड",
        isMandatory: true,
        guidanceEn: "Mandatory for farmer registration and DBT subsidy release.",
        guidanceHi: "किसान पंजीकरण और डीबीटी सब्सिडी भुगतान के लिए अनिवार्य।",
      },
      {
        id: "land_records",
        nameEn: "Land Records (7/12 extract / Jamabandi / ROR)",
        nameHi: "ज़मीन के कागज़ (7/12 नकल / खतौनी / जमाबंदी)",
        isMandatory: true,
        guidanceEn: "Proof that applicant owns or holds cultivable land for micro-irrigation installation.",
        guidanceHi: "प्रमाण कि आवेदक के पास सूक्ष्म सिंचाई लगाने योग्य भूमि उपलब्ध है।",
      },
      {
        id: "water_proof",
        nameEn: "Proof of Assured Water Source (Electricity Bill / Certificate)",
        nameHi: "पानी के स्रोत का प्रमाण (बिजली बिल या अधिकारी का प्रमाण पत्र)",
        isMandatory: true,
        guidanceEn: "Document proving existence of functional well, borewell, canal, or pond connection.",
        guidanceHi: "प्रमाण पत्र जो दर्शाता है कि खेत में चालू कुआं, बोरवेल, नहर या तालाब उपलब्ध है।",
      },
      {
        id: "bank_passbook",
        nameEn: "Bank Account Passbook (Aadhaar Linked)",
        nameHi: "बैंक खाता पासबुक (आधार से लिंक)",
        isMandatory: true,
        guidanceEn: "Subsidy amount will be transferred directly to this account via DBT.",
        guidanceHi: "सब्सिडी की राशि सीधे इसी खाते में डीबीटी द्वारा अंतरित की जाएगी।",
      },
      {
        id: "soil_water_test",
        nameEn: "Soil / Water Test Report (Conditional)",
        nameHi: "मृदा / जल परीक्षण रिपोर्ट (शर्त अनुसार)",
        isMandatory: false,
        guidanceEn: "Mandatory only if required by your specific state horticulture/agriculture guidelines.",
        guidanceHi: "केवल तब आवश्यक जब संबंधित राज्य के उद्यान विभाग के नियमों में अनिवार्य किया गया हो।",
      },
    ],
    evaluate: (answers) => {
      const water = answers.water_source;
      const category = answers.farmer_category;
      const pump = answers.pumping_setup;

      if (category === "none" || water === "no") {
        return {
          status: "may_not_meet",
          titleEn: "May Not Meet Basic Criteria",
          titleHi: "मूल पात्रता के अनुकूल प्रतीत नहीं होते",
          explanationEn: "PMKSY Per Drop More Crop subsidies are intended specifically for cultivable fields with an assured irrigation water source. Fields without an assured water supply cannot operate drip or sprinkler equipment.",
          explanationHi: "पीएमकेएसवाई की सूक्ष्म सिंचाई सब्सिडी केवल उन खेतों के लिए है जहां पानी का सुनिश्चित स्रोत उपलब्ध है। बिना पानी के स्रोत वाले खेतों में ड्रिप या फव्वारा प्रणाली नहीं चलाई जा सकती।",
          matchedCriteriaEn: [],
          matchedCriteriaHi: [],
          issuesOrGapsEn: ["Assured irrigation water source is missing on the plot."],
          issuesOrGapsHi: ["खेत पर सुनिश्चित सिंचाई जल स्रोत का अभाव।"],
          nextStepsEn: [
            "Explore watershed development or farm pond construction programs under PMKSY Other Interventions.",
            "Re-apply once an assured water source is established.",
          ],
          nextStepsHi: [
            "पीएमकेएसवाई के तहत खेत तालाब (फार्म पॉन्ड) निर्माण योजनाओं की जानकारी लें।",
            "पानी का स्रोत बनने के बाद पुनः आवेदन करें।",
          ],
        };
      }

      if (pump === "no" || pump === "not_sure") {
        return {
          status: "needs_verification",
          titleEn: "Field Feasibility & Pumping Verification Required",
          titleHi: "फील्ड व्यवहार्यता एवं पंपिंग सत्यापन आवश्यक",
          explanationEn: "You have land and a water source, but micro-irrigation systems require adequate water pressure (via electric, diesel, or solar pump). Your state horticulture officer or an empanelled vendor will conduct a field survey to verify water pressure feasibility.",
          explanationHi: "आपके पास ज़मीन और पानी का स्रोत है, लेकिन ड्रिप या स्प्रिंकलर चलाने के लिए पर्याप्त पानी के दबाव (पंप) की आवश्यकता होती है। राज्य उद्यान अधिकारी या अनुमोदित विक्रेता फील्ड सर्वे करके दबाव की जांच करेंगे।",
          matchedCriteriaEn: [
            "Cultivable land holding available",
            "Assured water source available",
            category === "small_marginal" ? "Eligible for Small/Marginal farmer subsidy (up to 55%)" : "Eligible for general farmer subsidy (up to 45%)",
          ],
          matchedCriteriaHi: [
            "खेती योग्य भूमि उपलब्ध है",
            "सुनिश्चित जल स्रोत उपलब्ध है",
            category === "small_marginal" ? "छोटे/सीमांत किसान सब्सिडी (55% तक) के पात्र" : "सामान्य किसान सब्सिडी (45% तक) के पात्र",
          ],
          issuesOrGapsEn: ["Water pressure / pumping arrangement needs technical inspection."],
          issuesOrGapsHi: ["पानी के दबाव या पंपिंग व्यवस्था का तकनीकी निरीक्षण आवश्यक है।"],
          nextStepsEn: [
            "Check PM-KUSUM scheme if you need a subsidized solar pump.",
            "Contact your district horticulture officer for a pre-installation field survey.",
          ],
          nextStepsHi: [
            "सोलर पंप की आवश्यकता होने पर पीएम-कुसुम योजना की जानकारी देखें।",
            "प्री-इंस्टॉलेशन फील्ड सर्वे के लिए जिला उद्यान अधिकारी से संपर्क करें।",
          ],
        };
      }

      const subsidyPct = category === "small_marginal" ? "55%" : "45%";
      return {
        status: "may_meet",
        titleEn: "May Meet Basic Criteria",
        titleHi: "मूल पात्रता के अनुकूल प्रतीत होते हैं",
        explanationEn: `You appear to meet the core eligibility criteria for PMKSY-PDMC micro-irrigation. Based on your landholding, you may qualify for up to ${subsidyPct} financial subsidy on approved drip or sprinkler equipment.`,
        explanationHi: `आप पीएमकेएसवाई सूक्ष्म सिंचाई योजना की मुख्य पात्रता पूरी करते प्रतीत होते हैं। आपकी ज़मीन के आकार के अनुसार आप अनुमोदित ड्रिप या स्प्रिंकलर सिस्टम पर ${subsidyPct} तक वित्तीय सब्सिडी पाने के पात्र हो सकते हैं।`,
        matchedCriteriaEn: [
          "Cultivable land with assured water source",
          `Farmer category: ${category === "small_marginal" ? "Small/Marginal (up to 55% subsidy)" : "Other (up to 45% subsidy)"}`,
          "Pump / pressure arrangement available",
        ],
        matchedCriteriaHi: [
          "सुनिश्चित जल स्रोत के साथ खेती की भूमि",
          `किसान श्रेणी: ${category === "small_marginal" ? "छोटा/सीमांत (55% तक सब्सिडी)" : "अन्य (45% तक सब्सिडी)"}`,
          "पंप या दबाव की व्यवस्था उपलब्ध",
        ],
        issuesOrGapsEn: [],
        issuesOrGapsHi: [],
        nextStepsEn: [
          "Submit your application through your state horticulture / agriculture DBT portal.",
          "Select an empanelled micro-irrigation manufacturer to prepare an indicative cost estimate for your plot.",
        ],
        nextStepsHi: [
          "अपने राज्य के उद्यानिकी / कृषि डीबीटी पोर्टल पर ऑनलाइन आवेदन करें।",
          "अपने खेत के लिए प्राक्कलन (एस्टिमेट) तैयार कराने के लिए अनुमोदित उपकरण निर्माता का चयन करें।",
        ],
      };
    },
  },
};

export function getEligibilityRuleSet(schemeId: string): EligibilityRuleSet | undefined {
  return ELIGIBILITY_RULE_SETS[schemeId];
}

export function getAllEligibilityRuleSets(): EligibilityRuleSet[] {
  return Object.values(ELIGIBILITY_RULE_SETS);
}
