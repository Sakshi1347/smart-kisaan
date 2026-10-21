import type { SchemeRow } from "@/hooks/useSchemes";

/**
 * Phase 1 — Feature 3: Verified Indian Government Agriculture Schemes.
 *
 * All scheme details (benefits, eligibility, required documents, and portal links)
 * have been verified against official Government of India portals:
 * 1. PM-KISAN: https://pmkisan.gov.in/
 * 2. PMFBY: https://pmfby.gov.in/
 * 3. KCC: https://myscheme.gov.in/schemes/kcc
 * 4. Soil Health Card: https://soilhealth.dac.gov.in/
 * 5. PMKSY (PDMC): https://pmksy.gov.in/
 *
 * Details depending on state notifications (notified crops, local bank limits, seasonal deadlines)
 * are marked with requires_local_confirmation.
 */
export const VERIFIED_GOVERNMENT_SCHEMES: SchemeRow[] = [
  {
    id: "pm-kisan",
    external_id: "gov-pm-kisan-central",
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    title_hi: "पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)",
    short_code: "PM-KISAN",
    category: "Income Support",
    state: "Central",
    benefit_type: "Direct Cash",
    max_benefit: "₹6,000 / year",
    application_deadline: "Ongoing (Continuous Enrollment)",
    status: "active",
    ministry: "Ministry of Agriculture and Farmers Welfare, Govt of India",
    website_url: "https://pmkisan.gov.in/",
    official_portal_name: "PM-KISAN Official Portal (pmkisan.gov.in)",
    requires_local_confirmation: true,
    verification_note:
      "Verified via official portal pmkisan.gov.in. Aadhaar e-KYC and land seeding are mandatory for installment release under current operational guidelines.",
    verification_note_hi:
      "आधिकारिक पोर्टल pmkisan.gov.in से सत्यापित। वर्तमान नियमों के अनुसार किस्त प्राप्त करने के लिए आधार ई-केवाईसी और ज़मीन का सत्यापन अनिवार्य है।",
    description:
      "Direct income support of ₹6,000 per year provided in three equal four-monthly installments of ₹2,000 to all eligible landholding farmer families across India via Direct Benefit Transfer (DBT).",
    description_hi:
      "भारत के सभी पात्र भूमिधारक किसान परिवारों को प्रति वर्ष ₹6,000 की वित्तीय सहायता, जो ₹2,000 की तीन समान किस्तों में सीधे बैंक खाते में (डीबीटी) भेजी जाती है।",
    eligibility:
      "All landholder farmer families who have cultivable land registered in their names. Exclusions apply: institutional landholders, constitutional post holders, serving/retired government employees, and individuals who paid income tax in the last assessment year.",
    eligibility_hi:
      "खेती योग्य भूमि के मालिक सभी किसान परिवार। अपवाद: संस्थागत ज़मीन मालिक, संवैधानिक पदों पर आसीन व्यक्ति, सरकारी कर्मचारी, और आयकर भरने वाले परिवार इसके पात्र नहीं हैं।",
    benefits: [
      "₹6,000 annual direct income support in three equal installments of ₹2,000",
      "100% centrally funded Direct Benefit Transfer (DBT) into bank accounts",
      "Directly accessible via Aadhaar-linked bank accounts without intermediaries",
    ],
    benefits_hi: [
      "प्रति वर्ष ₹6,000 की सीधी आर्थिक मदद (₹2,000 की 3 समान किस्तों में)",
      "100% केंद्र सरकार द्वारा वित्तपोषित डीबीटी भुगतान",
      "सीधे आधार से जुड़े बैंक खाते में भुगतान बिना किसी बिचौलिए के",
    ],
    documents: [
      "Aadhaar Card (Mandatory & mobile-linked)",
      "Land Ownership Documents (Khasra / Khatauni / Jamabandi / ROR)",
      "Aadhaar-seeded & NPCI-mapped Bank Passbook",
      "Active Mobile Number for e-KYC Verification",
    ],
    documents_hi: [
      "आधार कार्ड (अनिवार्य और मोबाइल से लिंक)",
      "ज़मीन के मालिकाना हक के कागज़ (खसरा / खतौनी / जमाबंदी)",
      "आधार से जुड़ा बैंक खाता / पासबुक",
      "ई-केवाईसी के लिए सक्रिय मोबाइल नंबर",
    ],
    created_at: "2019-02-24",
  },
  {
    id: "pmfby",
    external_id: "gov-pmfby-central",
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    title_hi: "प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई)",
    short_code: "PMFBY",
    category: "Crop Insurance",
    state: "Central",
    benefit_type: "Insurance",
    max_benefit: "Sum Insured as per notified crop scale of finance",
    application_deadline: "Seasonal (Kharif: ~31 July, Rabi: ~31 Dec)",
    status: "active",
    ministry: "Ministry of Agriculture and Farmers Welfare, Govt of India",
    website_url: "https://pmfby.gov.in/",
    official_portal_name: "PMFBY Official Portal (pmfby.gov.in)",
    requires_local_confirmation: true,
    verification_note:
      "Verified via pmfby.gov.in. Notified crops, designated insurance companies, and seasonal cut-off dates depend on respective State Government seasonal notifications.",
    verification_note_hi:
      "pmfby.gov.in से सत्यापित। अधिसूचित फसलें, बीमा कंपनी और अंतिम तारीखें राज्य सरकार की मौसमी अधिसूचना पर निर्भर करती हैं।",
    description:
      "Comprehensive crop insurance protecting farmers against yield loss and crop failure caused by non-preventable natural risks like drought, flood, pests, and unseasonal weather.",
    description_hi:
      "प्राकृतिक आपदाओं (सूखा, बाढ़, कीट, बेमौसम बारिश, कटाई उपरांत नुकसान) से फसल क्षति पर सुरक्षा देने वाली व्यापक फसल बीमा योजना, जिसमें किसानों को बेहद कम प्रीमियम देना होता है।",
    eligibility:
      "All farmers including sharecroppers and tenant farmers cultivating notified crops in notified areas. Loanee farmers enrolled via lending banks; non-loanee farmers can enroll voluntarily via banks, CSCs, or the PMFBY portal before the seasonal cut-off date.",
    eligibility_hi:
      "अधिसूचित क्षेत्रों में अधिसूचित फसल उगाने वाले सभी किसान, जिनमें बटाईदार और काश्तकार भी शामिल हैं। गैर-ऋणी किसान भी सीएससी या बैंक से कट-ऑफ तारीख से पहले आवेदन कर सकते हैं।",
    benefits: [
      "Affordable farmer premium: 2% for Kharif crops, 1.5% for Rabi crops, and 5% for horticultural crops",
      "Balance actuarial premium subsidized jointly by Central and State Governments",
      "Coverage from pre-sowing to post-harvest localized risks and natural calamities",
    ],
    benefits_hi: [
      "किसानों के लिए न्यूनतम प्रीमियम: खरीफ फसलों पर 2%, रबी पर 1.5%, और बागवानी पर 5%",
      "बाकी का सारा प्रीमियम केंद्र और राज्य सरकार मिलकर सब्सिडी के रूप में भरती हैं",
      "बुवाई से लेकर कटाई के बाद तक के मौसमी और स्थानीय जोखिमों पर संपूर्ण सुरक्षा",
    ],
    documents: [
      "Aadhaar Card",
      "Land Possession Certificate (LPC) / Revenue Receipt or Tenancy Agreement",
      "Sowing Certificate or Self-Declaration of Sown Crop",
      "Bank Account Passbook (with IFSC and Account Number)",
    ],
    documents_hi: [
      "आधार कार्ड",
      "भू-स्वामित्व प्रमाण पत्र (एलपीसी) / लगान रसीद या बटाईदार अनुबंध पत्र",
      "बुवाई प्रमाण पत्र / फसल बुवाई स्व-घोषणा पत्र",
      "बैंक खाता पासबुक (खाता संख्या और आईएफएससी कोड)",
    ],
    created_at: "2016-01-13",
  },
  {
    id: "kcc",
    external_id: "gov-kcc-central",
    title: "Kisan Credit Card (KCC) Scheme",
    title_hi: "किसान क्रेडिट कार्ड (केसीसी) योजना",
    short_code: "KCC",
    category: "Credit & Loan",
    state: "Central",
    benefit_type: "Credit & Loan",
    max_benefit: "Up to ₹3 Lakh at 4% effective interest rate",
    application_deadline: "Ongoing (Apply via any commercial, RRB, or cooperative bank)",
    status: "active",
    ministry: "Department of Financial Services & Ministry of Agriculture and Farmers Welfare",
    website_url: "https://myscheme.gov.in/schemes/kcc",
    official_portal_name: "myScheme Portal (myscheme.gov.in/schemes/kcc)",
    requires_local_confirmation: true,
    verification_note:
      "Verified via myscheme.gov.in and RBI/NABARD guidelines. Credit limits depend on operational land size, cropping pattern, and issuing bank branch evaluation.",
    verification_note_hi:
      "myscheme.gov.in और आरबीआई/नाबार्ड दिशा-निर्देशों से सत्यापित। ऋण सीमा ज़मीन के आकार, फसल और बैंक शाखा के नियमों पर निर्भर करती है।",
    description:
      "Concessional institutional credit to farmers for crop production, post-harvest expenses, farm asset maintenance, and allied activities (dairy, fisheries, animal husbandry) with simplified banking procedures.",
    description_hi:
      "किसानों को फसल बुवाई, कटाई उपरांत खर्च, कृषि रखरखाव और पशुपालन/मत्स्य पालन के लिए बैंकों से रियायती ब्याज दर पर आसान ऋण उपलब्ध कराने वाली योजना।",
    eligibility:
      "Individual or joint farmers who are owner-cultivators, tenant farmers, oral lessees, sharecroppers, and Self Help Groups (SHGs) or Joint Liability Groups (JLGs). Also covers animal husbandry, dairy, and fish farmers.",
    eligibility_hi:
      "व्यक्तिगत या संयुक्त भू-स्वामी किसान, काश्तकार, पट्टेदार, बटाईदार किसान तथा स्वयं सहायता समूह (एसएचजी) या जेएलजी। साथ ही पशुपालक, डेयरी और मछली पालक किसान भी पात्र हैं।",
    benefits: [
      "Short-term crop loan up to ₹3,00,000 at base 7% interest rate",
      "Prompt Repayment Incentive of 3% subvention, reducing effective interest rate to 4% p.a.",
      "Collateral-free agricultural loan limit up to ₹1,60,000",
      "Revolving credit facility valid for 5 years with annual review",
    ],
    benefits_hi: [
      "₹3 लाख तक का अल्पकालिक फसली ऋण 7% की आधार ब्याज दर पर",
      "समय पर भुगतान करने पर 3% अतिरिक्त छूट, जिससे प्रभावी ब्याज दर केवल 4% प्रति वर्ष रह जाती है",
      "₹1.60 लाख तक के ऋण के लिए किसी गारंटी या बंधक की आवश्यकता नहीं",
      "5 वर्ष की वैधता वाली सुविधाजनक क्रेडिट लिमिट",
    ],
    documents: [
      "Duly filled KCC Application Form",
      "Identity Proof (Aadhaar Card / Voter ID / PAN Card)",
      "Address Proof",
      "Land Records (Khasra / Khatauni) or Tenancy / Sharecropping Agreement",
      "Recent Passport Size Photographs",
    ],
    documents_hi: [
      "भरा हुआ केसीसी आवेदन पत्र",
      "पहचान प्रमाण (आधार कार्ड / वोटर आईडी / पैन कार्ड)",
      "पते का प्रमाण पत्र",
      "ज़मीन के कागज़ (खसरा / खतौनी) या बटाईनामा",
      "पासपोर्ट साइज रंगीन फोटो",
    ],
    created_at: "1998-08-01",
  },
  {
    id: "soil-health-card",
    external_id: "gov-shc-central",
    title: "Soil Health Card (SHC) Scheme",
    title_hi: "मृदा स्वास्थ्य कार्ड योजना (सॉइल हेल्थ कार्ड)",
    short_code: "SHC",
    category: "Soil & Inputs",
    state: "Central",
    benefit_type: "Subsidies",
    max_benefit: "Free 12-parameter soil test & nutrient advisory card every 3 years",
    application_deadline: "Ongoing (Periodic soil sampling by District Agriculture Dept / KVK)",
    status: "active",
    ministry: "Ministry of Agriculture and Farmers Welfare, Govt of India",
    website_url: "https://soilhealth.dac.gov.in/",
    official_portal_name: "Soil Health Card Portal (soilhealth.dac.gov.in)",
    requires_local_confirmation: true,
    verification_note:
      "Verified via soilhealth.dac.gov.in and myscheme.gov.in. Testing cycles and physical/digital card distribution are coordinated by State Agriculture Departments and local KVKs.",
    verification_note_hi:
      "soilhealth.dac.gov.in और myscheme.gov.in से सत्यापित। मिट्टी जांच और कार्ड वितरण राज्य कृषि विभाग व कृषि विज्ञान केंद्रों द्वारा संचालित होता है।",
    description:
      "Assists farmers by testing farm soil across 12 nutrient parameters and providing customized crop-wise fertilizer dosage recommendations every 3 years to reduce input expenses and maintain soil fertility.",
    description_hi:
      "किसानों के खेत की मिट्टी की जांच कर हर 3 साल में मृदा स्वास्थ्य कार्ड दिया जाता है, जिसमें 12 पोषक तत्वों की स्थिति और फसल अनुसार संतुलित खाद-उर्वरक की सही मात्रा की सिफारिश होती है।",
    eligibility:
      "All farmers across all Indian states and Union Territories who own or cultivate agricultural land are eligible through their local state agricultural department or Krishi Vigyan Kendra (KVK).",
    eligibility_hi:
      "भारत के सभी राज्यों और केंद्र शासित प्रदेशों के सभी किसान जो खेती योग्य भूमि के मालिक हैं या उस पर खेती करते हैं।",
    benefits: [
      "Diagnostic test report covering 12 soil parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC)",
      "Crop-wise fertilizer and organic manure dosage recommendations to stop over-fertilization",
      "Helps reduce cultivation input costs by 8%–10% and improve crop yield by 5%–6%",
      "Issued free or at nominal laboratory charge by State Agriculture Departments",
    ],
    benefits_hi: [
      "खेत की मिट्टी के 12 मुख्य पोषक तत्वों की संपूर्ण जांच रिपोर्ट",
      "फसल अनुसार रासायनिक खाद और जैविक खाद की संतुलित सिफारिश",
      "अनावश्यक खाद के खर्च में 8%-10% बचत और पैदावार में सुधार",
      "कृषि विभाग द्वारा निःशुल्क या न्यूनतम शुल्क पर उपलब्ध",
    ],
    documents: [
      "Aadhaar Card or State Farmer ID",
      "Land Ownership Details (Survey / Khasra / Khata Number / Village)",
      "Soil Sample from field plot (collected according to official guidelines with Agri Officer assistance)",
    ],
    documents_hi: [
      "आधार कार्ड या राज्य किसान पंजीकरण संख्या",
      "खेत की पहचान का विवरण (खसरा नंबर / खाता संख्या / गांव)",
      "खेत से निर्धारित विधि द्वारा लिया गया मिट्टी का नमूना",
    ],
    created_at: "2015-02-19",
  },
  {
    id: "pmksy-pdmc",
    external_id: "gov-pmksy-pdmc-central",
    title: "PM Krishi Sinchayee Yojana — Per Drop More Crop (PMKSY-PDMC)",
    title_hi: "प्रधानमंत्री कृषि सिंचाई योजना — प्रति बूंद अधिक फसल (पीएमकेएसवाई)",
    short_code: "PMKSY (PDMC)",
    category: "Irrigation",
    state: "Central",
    benefit_type: "Subsidies",
    max_benefit: "Up to 55% subsidy on micro-irrigation unit cost",
    application_deadline: "Annual State Allocation Cycles (Apply via State Horticulture / Agri DBT Portal)",
    status: "active",
    ministry: "Department of Agriculture & Farmers Welfare, Ministry of Agriculture",
    website_url: "https://pmksy.gov.in/",
    official_portal_name: "PMKSY Official Portal (pmksy.gov.in)",
    requires_local_confirmation: true,
    verification_note:
      "Verified via pmksy.gov.in. Exact subsidy disbursement percentages and empanelled equipment manufacturers are administered through State Horticulture/Agriculture departments.",
    verification_note_hi:
      "pmksy.gov.in से सत्यापित। सब्सिडी का सटीक भुगतान और अनुमोदित उपकरण निर्माता राज्य के उद्यान/कृषि विभाग के माध्यम से तय होते हैं।",
    description:
      "Promotes micro-irrigation technologies (drip and sprinkler systems) by providing financial subsidies to conserve water, reduce fertilizer wash-off, and increase crop yields.",
    description_hi:
      "पानी की बचत और पैदावार बढ़ाने के लिए ड्रिप (टपक) और स्प्रिंकलर (फव्वारा) सिंचाई प्रणाली लगाने हेतु किसानों को वित्तीय अनुदान (सब्सिडी) उपलब्ध कराने वाली योजना।",
    eligibility:
      "Farmers with cultivable land and an assured water source (well, tubewell, canal, or farm pond). Small and marginal farmers receive higher subsidy support (up to 55%). FPOs, cooperatives, and farmer groups are also eligible.",
    eligibility_hi:
      "वे सभी किसान जिनके पास खेती योग्य भूमि और सिंचाई के लिए पानी का सुनिश्चित स्रोत उपलब्ध है। छोटे और सीमांत किसानों को 55% तक सब्सिडी मिलती है।",
    benefits: [
      "Financial subsidy up to 55% of indicative unit cost for Small & Marginal farmers",
      "Financial subsidy up to 45% of indicative unit cost for other farmers",
      "Water savings of 30%–50% and yield increase of 20%–40%",
      "Supports fertigation (fertilizer application through irrigation water), cutting input wastage",
    ],
    benefits_hi: [
      "छोटे और सीमांत किसानों को ड्रिप/स्प्रिंकलर लगाने पर 55% तक सरकारी सब्सिडी",
      "अन्य किसानों को 45% तक वित्तीय सब्सिडी सहायता",
      "30% से 50% पानी की बचत और 20% से 40% तक अधिक पैदावार",
      "ड्रिप के जरिए सीधे जड़ों में खाद देने की सुविधा जिससे खाद की भारी बचत",
    ],
    documents: [
      "Aadhaar Card",
      "Land Records (7/12 extract / Jamabandi / ROR showing land ownership)",
      "Proof of Assured Water Source (Certificate from local officer or electricity connection bill for pump)",
      "Bank Account Passbook (Aadhaar linked)",
      "Soil / Water Test Report (where mandated by state guidelines)",
    ],
    documents_hi: [
      "आधार कार्ड",
      "ज़मीन के कागज़ (7/12 नकल / खतौनी / जमाबंदी)",
      "पानी के स्रोत का प्रमाण (बोरवेल/कुएं का प्रमाण या बिजली बिल)",
      "बैंक खाता पासबुक (आधार से लिंक)",
      "मृदा/जल परीक्षण रिपोर्ट (यदि राज्य के नियमों में आवश्यक हो)",
    ],
    created_at: "2015-07-01",
  },
];

export function getLocalSchemeCatalog(): SchemeRow[] {
  return VERIFIED_GOVERNMENT_SCHEMES;
}
