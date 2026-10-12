export const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "rw", label: "RW" },
];

export const STRINGS = {
  en: {
    appName: "MaizeDx",
    appSubtitle: "Leaf disease diagnosis",

    nav_home: "Diagnose",
    nav_history: "History",
    nav_about: "About",

    disclaimer_short: "Research prototype — confirm treatment with an extension officer.",

    upload_title: "Check a maize leaf",
    upload_subtitle: "Take a clear photo of the leaf in good light, or choose one from your gallery.",
    upload_cta_empty: "Tap to take or choose a photo",
    upload_cta_hint: "JPEG or PNG",
    retake: "Choose a different photo",
    diagnose_button: "Diagnose this leaf",
    diagnosing: "Diagnosing…",
    error_prefix: "Couldn't complete the diagnosis:",
    error_generic_hint: "Check your connection and try again.",

    confidence_label: "Confidence",
    verify_title: "Verify with an extension officer",
    verify_body: "Confidence in this result is low. Treat it as a starting point, not a final answer, and confirm with an extension officer before acting.",

    description_label: "What to look for",
    recommendation_label: "Recommended action",

    flag_button: "This result looks wrong",
    flagged_confirmation: "Thanks — flagged for review.",
    save_result: "Save to history",
    new_diagnosis: "Diagnose another leaf",

    history_title: "Your diagnosis history",
    history_subtitle: "Saved on this device only — not shared with anyone.",
    history_empty_title: "No saved diagnoses yet",
    history_empty_body: "Results you save will appear here for quick reference in the field.",
    history_clear: "Clear history",

    about_title: "About this app",
    about_purpose_title: "What this does",
    about_purpose_body: "MaizeDx uses a machine learning model trained on maize leaves from Rwanda to identify Grey Leaf Spot, Northern Leaf Blight, and Common Rust, and to suggest management steps.",
    about_limits_title: "Its limits",
    about_limits_body: "This is a research prototype built as part of a Master's thesis at the University of Kigali. It covers three foliar diseases only, and its accuracy has not been validated for every growing condition. Always confirm before applying treatment.",
    about_privacy_title: "Your photos",
    about_privacy_body: "Photos are sent to the diagnosis server to generate a result and are not linked to your identity. Flagged images may be reviewed to improve future versions of the model.",
    about_contact_title: "Research contact",
    about_contact_body: "Cyubahiro Theotime — MSc Information Technology, University of Kigali. Supervised by Dr. Musabe Jean Bosco.",

    class_grey_leaf_spot: "Grey Leaf Spot",
    class_northern_leaf_blight: "Northern Leaf Blight",
    class_common_rust: "Common Rust",
    class_healthy: "Healthy Maize",

    offline_banner: "You're offline. Diagnosis needs a connection — saved history is still available.",
  },

  rw: {
    appName: "MaizeDx",
    appSubtitle: "Isuzuma ry'uburwayi bw'amababi",

    nav_home: "Suzuma",
    nav_history: "Amateka",
    nav_about: "Ibijyanye",

    disclaimer_short: "Iyi ni porogaramu y'ubushakashatsi — yemeze n'umujyanama w'ubuhinzi.",

    upload_title: "Suzuma ikibabi cy'ibigori",
    upload_subtitle: "Fata ifoto isobanutse y'ikibabi mu mucyo mwiza, cyangwa uhitemo ifoto usanzwe ufite.",
    upload_cta_empty: "Kanda ufate cyangwa uhitemo ifoto",
    upload_cta_hint: "JPEG cyangwa PNG",
    retake: "Hitamo indi foto",
    diagnose_button: "Suzuma iki kibabi",
    diagnosing: "Turimo gusuzuma…",
    error_prefix: "Isuzuma ntiryagenze neza:",
    error_generic_hint: "Reba interineti yawe hanyuma ugerageze nanone.",

    confidence_label: "Icyizere",
    verify_title: "Bimenyeshe umujyanama w'ubuhinzi",
    verify_body: "Icyizere muri iri suzuma ni gike. Rifate nk'intangiriro gusa, ntabwo ari igisubizo cya nyuma, hanyuma wemeze n'umujyanama w'ubuhinzi mbere yo gukora ikindi.",

    description_label: "Ibimenyetso wagenzura",
    recommendation_label: "Icyakorwa gisabwa",

    flag_button: "Iri suzuma ntiryo ndende",
    flagged_confirmation: "Murakoze — ryashyizwe kugira ngo risuzumwe.",
    save_result: "Bika mu mateka",
    new_diagnosis: "Suzuma ikindi kibabi",

    history_title: "Amateka y'ibyo wasuzumye",
    history_subtitle: "Bibitswe kuri iyi telefoni gusa — ntabwo bisangizwa n'undi muntu.",
    history_empty_title: "Nta suzuma ryabitswe",
    history_empty_body: "Ibyo uzabika bizagaragara hano kugira ngo ubireebe vuba uri mu murima.",
    history_clear: "Siba amateka",

    about_title: "Ibijyanye n'iyi porogaramu",
    about_purpose_title: "Icyo ikora",
    about_purpose_body: "MaizeDx ikoresha ubwenge bw'ubukorikori bwatojwe ku mababi y'ibigori yo mu Rwanda kugira ngo imenye Uburwayi bw'utudomo, Uburwayi bwo mu majyaruguru, n'Uburwayi bw'ibara ry'umuhondo, kandi itange inama.",
    about_limits_title: "Aho igarukira",
    about_limits_body: "Iyi ni porogaramu y'ubushakashatsi yakozwe mu bushakashatsi bwa Master mu Kaminuza ya Kigali. Igarukira ku burwayi butatu bw'amababi gusa, kandi ukuri kwayo ntabwo kwagenzuwe mu bihe byose by'ubuhinzi. Buri gihe wemeze mbere yo gukoresha umuti.",
    about_privacy_title: "Amafoto yawe",
    about_privacy_body: "Amafoto yoherezwa kuri seriveri y'isuzuma kugira ngo ivane igisubizo, kandi ntabwo ahujwe n'uwafashe ifoto. Amafoto yashyizweho kugira ngo asuzumwe ashobora gukoreshwa mu gutera imbere iyi porogaramu.",
    about_contact_title: "Uwakoze ubushakashatsi",
    about_contact_body: "Cyubahiro Theotime — Impamyabumenyi ya Master mu Ikoranabuhanga ry'Ikoranabuhanga, Kaminuza ya Kigali. Ayobowe na Dr. Musabe Jean Bosco.",

    class_grey_leaf_spot: "Uburwayi bw'utudomo (Grey Leaf Spot)",
    class_northern_leaf_blight: "Uburwayi bwo mu majyaruguru (Northern Leaf Blight)",
    class_common_rust: "Uburwayi bw'ibara ry'umuhondo (Common Rust)",
    class_healthy: "Ibigori bifite ubuzima bwiza",

    offline_banner: "Nta interineti ufite. Isuzuma rikeneye interineti — amateka wabitse arakiboneka.",
  },
};

export function useTranslation(lang) {
  return STRINGS[lang] || STRINGS.en;
}
