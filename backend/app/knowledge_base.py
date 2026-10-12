from sqlalchemy.orm import Session

from app.models_db import Disease

SEED_DATA = [
    {
        "code": "grey_leaf_spot",
        "name_en": "Grey Leaf Spot",
        "name_rw": "Uburwayi bw'utudomo dutukura ku mababi",
        "causal_organism": "Cercospora zeae-maydis",
        "symptoms_en": "Rectangular lesions parallel to leaf veins, buff to grey in colour, starting on lower canopy leaves.",
        "symptoms_rw": "Ibara ry'utudomo tumeze nk'urukiramende, dutukura cyangwa dufite ibara ry'ivu, bitangirira ku mababi yo hasi.",
        "fungicide_en": "Apply a triazole or strobilurin-based fungicide at early lesion onset; consult RAB extension for currently approved products.",
        "fungicide_rw": "Koresha imiti y'ubuvuzi bw'ibimera irimo triazole cyangwa strobilurin igihe utubara tugaragaye; baza umujyanama w'ubuhinzi wa RAB ku miti yemewe.",
        "timing_en": "Treat at first sign of lower-canopy lesions, before pollination if possible.",
        "timing_rw": "Vura ako kanya iyo ubonye ibimenyetso ku mababi yo hasi, byaba byiza mbere y'uko ibigori bitera vuba.",
        "cultural_practices_en": "Crop rotation, residue management, avoid dense planting to improve airflow.",
        "cultural_practices_rw": "Guhindura ibihingwa mu murima, gucunga ibisigazwa by'ibihingwa, kutabiba cyane kugira ngo umuyaga unyure neza.",
        "resistant_varieties_en": "Select locally available maize varieties with documented tolerance where possible.",
        "resistant_varieties_rw": "Hitamo imbuto z'ibigori zizwiho kwihanganira uburwayi, zihari mu Rwanda.",
    },
    {
        "code": "northern_leaf_blight",
        "name_en": "Northern Leaf Blight",
        "name_rw": "Uburwayi bw'amababi buva mu majyaruguru",
        "causal_organism": "Exserohilum turcicum",
        "symptoms_en": "Long cigar-shaped lesions, grey-green to tan, 2.5-15 cm, merging under heavy pressure.",
        "symptoms_rw": "Utudomo twagutse dumeze nk'itabi, hagati y'icyatsi n'ivu, ushobora kubona duhuriye iyo uburwayi bukabije.",
        "fungicide_en": "Apply fungicide as soon as lesions are confirmed, especially before tasseling.",
        "fungicide_rw": "Koresha imiti y'ubuvuzi bw'ibimera vuba nyuma yo kubona ibimenyetso, cyane cyane mbere y'uko ibigori bitangira gutera.",
        "timing_en": "Early infection before grain fill causes the greatest yield loss — treat early.",
        "timing_rw": "Kwandura kare mbere y'uko ibigori byuzura ni byo bitera igihombo kinini — vura hakiri kare.",
        "cultural_practices_en": "Rotate crops, till under infected residue, use certified seed.",
        "cultural_practices_rw": "Hindura ibihingwa, hindura ibisigazwa by'ibihingwa byanduye, koresha imbuto zemewe.",
        "resistant_varieties_en": "Prioritize varieties with known Northern Leaf Blight tolerance.",
        "resistant_varieties_rw": "Hitamo imbuto zizwiho kwihanganira uburwayi bw'amababi bwo mu majyaruguru.",
    },
    {
        "code": "common_rust",
        "name_en": "Common Rust",
        "name_rw": "Uburwayi bw'ibara ry'umuhondo",
        "causal_organism": "Puccinia sorghi",
        "symptoms_en": "Orange-brown pustules rupturing both leaf surfaces, spreading rapidly by wind.",
        "symptoms_rw": "Uducuraburindi twa orange-umukara duturika ku mpande zombi z'ababi, bikwirakwira vuba biturutse ku muyaga.",
        "fungicide_en": "Fungicide is most effective when applied before pustules become widespread.",
        "fungicide_rw": "Imiti y'ubuvuzi ikora neza iyo yakoreshejwe mbere y'uko uducuraburindi twaguka cyane.",
        "timing_en": "Monitor closely during 16-23°C periods when the pathogen spreads fastest.",
        "timing_rw": "Kurikirana neza mu gihe cy'ubushyuhe buri hagati ya 16-23°C aho uburwayi bwihuta gukwirakwira.",
        "cultural_practices_en": "Avoid excessive nitrogen application; ensure field airflow.",
        "cultural_practices_rw": "Irinde gushyira ifumbire ya azote nyinshi cyane; reba ko umuyaga unyura neza mu murima.",
        "resistant_varieties_en": "Rust-tolerant hybrid varieties reduce severity significantly.",
        "resistant_varieties_rw": "Imbuto z'ibigori zihanganira uburwayi zigabanya ingaruka zabwo cyane.",
    },
    {
        "code": "healthy",
        "name_en": "Healthy Maize",
        "name_rw": "Ibigori bifite ubuzima bwiza",
        "causal_organism": "N/A",
        "symptoms_en": "No disease symptoms detected on the submitted leaf image.",
        "symptoms_rw": "Nta bimenyetso by'uburwayi byabonetse ku babi yoherejwe.",
        "fungicide_en": "No treatment needed.",
        "fungicide_rw": "Nta muti ukenewe.",
        "timing_en": "Continue routine field monitoring.",
        "timing_rw": "Komeza gukurikirana umurima wawe uko bisanzwe.",
        "cultural_practices_en": "Maintain good agronomic practices to sustain plant health.",
        "cultural_practices_rw": "Komeza imikorere myiza y'ubuhinzi kugira ngo ibigori bikomeze kugira ubuzima bwiza.",
        "resistant_varieties_en": "N/A",
        "resistant_varieties_rw": "N/A",
    },
]


def seed_knowledge_base(db: Session) -> None:
    existing = db.query(Disease).count()
    if existing > 0:
        return
    for entry in SEED_DATA:
        db.add(Disease(**entry))
    db.commit()
