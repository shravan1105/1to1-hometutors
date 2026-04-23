import { useState, useEffect, useRef } from "react";
import { submitEnquiry, submitTutorApplication, submitBoardEnquiry } from "./submitHandlers";

/* ─── Design Tokens ─────────────────────────────────────────────────── */
const C = {
  navy:"#0B1F4E", navyDeep:"#060E2A", navyLight:"#162B6A",
  gold:"#D4A017", goldLight:"#F0B429", goldPale:"#FEF8E7",
  white:"#FFFFFF", off:"#F7F6F1", border:"#E4E1D5",
  muted:"#6B7280", text:"#1A1A2E", green:"#166534", greenBg:"#DCFCE7",
};

const AREAS = [
  "Dharampeth","Sadar","Ramdaspeth","Wardhaman Nagar","Civil Lines","Bajaj Nagar","Manish Nagar",
  "Sitabuldi","Pratap Nagar","Hingna","Wardha Road","Amravati Road","Laxmi Nagar","Ambazari",
  "Shankar Nagar","Trimurti Nagar","Ayodhya Nagar","Indora","Kamptee Road","Katol Road",
  "Somalwada","Nandanvan","Gokulpeth","Dhantoli","Itwari","Mahal","Gandhibagh","Lakadganj",
  "Bhandara Road","Umred Road","Wadi","Butibori","Nagpur East","Nagpur West","Nagpur Central",
  "All Areas Across Nagpur",
];

/* ─── Subject & Topic Data ──────────────────────────────────────────── */
const SB610 = {
  6:{
    "Science":["Food Sources & Components","Fibre to Fabric","Sorting Materials","Separation of Substances","Changes Around Us","Living & Non-Living Things","Body Movements","Motion & Measurement","Light & Shadows","Electricity & Circuits","Fun with Magnets","Water","Air","Garbage In Garbage Out"],
    "Mathematics":["Knowing Numbers","Whole Numbers","Playing with Numbers","Basic Geometry","Elementary Shapes","Integers","Fractions","Decimals","Data Handling","Mensuration","Algebra","Ratio & Proportion"],
    "English":["Grammar Basics","Reading Comprehension","Letter & Paragraph Writing","Prose — Literature","Poetry"],
    "Hindi":["व्याकरण","गद्य पाठ","पद्य पाठ","लेखन","अपठित गद्यांश"],
    "Marathi":["व्याकरण","गद्य","पद्य","लेखन — पत्र व निबंध"],
    "Social Science":["History — Early Civilisations","Geography — Earth & Maps","Civics — Community & Government"],
  },
  7:{
    "Science":["Nutrition in Plants","Nutrition in Animals","Fibre to Fabric","Heat & Temperature","Acids Bases & Salts","Physical & Chemical Changes","Weather Climate & Adaptation","Winds Storms & Cyclones","Soil","Respiration in Organisms","Transportation in Animals & Plants","Reproduction in Plants","Motion & Time","Electric Current","Light"],
    "Mathematics":["Integers","Fractions & Decimals","Data Handling","Simple Equations","Lines & Angles","Triangles","Congruence","Comparing Quantities","Rational Numbers","Perimeter & Area","Algebraic Expressions","Exponents & Powers","Symmetry","Visualising Solid Shapes"],
    "English":["Grammar — Tenses & Voice","Letter Writing","Comprehension","Prose Literature","Poetry"],
    "Hindi":["व्याकरण — संज्ञा, सर्वनाम","गद्य","पद्य","लेखन"],
    "Marathi":["व्याकरण","गद्य","पद्य","लेखन"],
    "Social Science":["History — Mediaeval India","Geography — Our Environment","Civics — State Government"],
  },
  8:{
    "Science":["Crop Production & Management","Microorganisms","Synthetic Fibres & Plastics","Metals & Non-metals","Coal & Petroleum","Combustion & Flame","Conservation of Plants & Animals","Cell Structure & Functions","Reproduction","Force & Pressure","Friction","Sound","Chemical Effects of Current","Lightning","Stars & Solar System","Pollution of Air & Water"],
    "Mathematics":["Rational Numbers","Linear Equations","Quadrilaterals","Data Handling","Squares & Square Roots","Cubes & Cube Roots","Comparing Quantities","Algebraic Expressions","Mensuration","Exponents","Factorisation","Introduction to Graphs","Direct & Inverse Proportions"],
    "English":["Grammar — Active Passive","Formal Letters & Reports","Comprehension","Prose","Poetry"],
    "Hindi":["व्याकरण","गद्य","पद्य","पत्र लेखन"],
    "Marathi":["व्याकरण","गद्य","पद्य","निबंध"],
    "Social Science":["History — Modern India","Geography — Resources","Civics — Parliament & Legislature"],
  },
  9:{
    "Science":["Matter in Our Surroundings","Is Matter Around Us Pure","Atoms & Molecules","Structure of Atom","Cell — Fundamental Unit of Life","Tissues","Diversity in Living Organisms","Motion","Force & Newton's Laws","Gravitation","Work Energy & Power","Sound","Why Do We Fall Ill","Natural Resources","Food & Food Production"],
    "Mathematics":["Number Systems","Polynomials","Coordinate Geometry","Linear Equations in 2 Variables","Introduction to Euclid's Geometry","Lines & Angles","Triangles","Quadrilaterals","Circles","Constructions","Heron's Formula","Surface Areas & Volumes","Statistics","Probability"],
    "English":["Grammar — All Topics","Writing — Essays Letters Reports","Prose — Literature","Poetry","Reading Comprehension"],
    "Hindi":["व्याकरण — संपूर्ण","गद्य","पद्य","लेखन"],
    "Social Science":["History — India & Contemporary World","Geography — Contemporary India","Economics — Indian Economy","Civics — Democratic Politics"],
  },
  10:{
    "Science":["Chemical Reactions & Equations","Acids Bases & Salts","Metals & Non-metals","Carbon & Compounds","Periodic Classification","Life Processes","Control & Coordination","Reproduction","Heredity & Evolution","Light — Reflection & Refraction","Human Eye","Electricity","Magnetic Effects","Sources of Energy","Environment","Natural Resources"],
    "Mathematics":["Real Numbers","Polynomials","Pair of Linear Equations","Quadratic Equations","Arithmetic Progressions","Triangles","Coordinate Geometry","Trigonometry","Applications of Trigonometry","Circles","Constructions","Areas Related to Circles","Surface Areas & Volumes","Statistics","Probability"],
    "English":["Grammar — Complete","Writing — Letters Articles Reports","Literature — First Flight","Literature — Footprints","Reading Skills"],
    "Hindi":["व्याकरण — संपूर्ण","गद्य","पद्य","लेखन — पत्र, निबंध"],
    "Social Science":["History — Nationalism in India","Geography — Resources & Development","Economics — Development","Civics — Power Sharing","Disaster Management"],
  },
};

const CBSE610 = {
  6:{ ...SB610[6], "Sanskrit":["Ruchira — Shashtha Bhaag","Vyaakaran Basics","Shloka Paath"] },
  7:{ ...SB610[7], "Sanskrit":["Ruchira — Saptam Bhaag","Vyaakaran","Translation"] },
  8:{ ...SB610[8], "Sanskrit":["Ruchira — Ashtam Bhaag","Vyaakaran","Literature"] },
  9:{ ...SB610[9], "Sanskrit":["Shemushi — Prathamo Bhaag","Vyaakaran Vithi","Abhyaas"] },
  10:{ ...SB610[10], "Sanskrit":["Shemushi — Dwiteeyo Bhaag","Vyaakaran Vithi","Literature & Comprehension"], "Computer Science":["Basics of HTML","Introduction to Python","Database & SQL","MS Office"] },
};

const SB_SCI_11 = {
  "Physics":["Measurement & Units","Kinematics","Laws of Motion","Work Energy Power","Gravitation","Properties of Solids & Fluids","Oscillations","Waves","Thermodynamics","Kinetic Theory of Gases","Electrostatics","Current Electricity"],
  "Chemistry":["Basic Concepts","Atomic Structure","Periodic Table","Chemical Bonding","States of Matter","Thermodynamics","Redox Reactions","Hydrogen","s-Block Elements","p-Block Elements","Organic Chemistry Basics","Hydrocarbons","Environmental Chemistry"],
  "Biology":["Living World","Biological Classification","Plant Kingdom","Animal Kingdom","Morphology of Plants","Anatomy of Plants","Structural Organisation — Animals","Cell — Structure & Function","Biomolecules","Cell Division"],
  "Mathematics":["Sets","Relations & Functions","Trigonometric Functions","Complex Numbers","Linear Inequalities","Permutations & Combinations","Binomial Theorem","Sequences & Series","Straight Lines","Conic Sections","Introduction to 3D Geometry","Limits & Derivatives","Statistics","Probability"],
  "English":["Hornbill — Prose","Snapshots — Supplementary","Grammar","Writing Skills","Flamingo / Kaleidoscope"],
};

const SB_SCI_12 = {
  "Physics":["Electrostatics","Capacitance","Current Electricity","Magnetic Field","Magnetism & Matter","Electromagnetic Induction","Alternating Current","EM Waves","Ray Optics","Wave Optics","Dual Nature of Radiation","Atoms","Nuclei","Semiconductor Devices","Communication Systems"],
  "Chemistry":["Solid State","Solutions","Electrochemistry","Chemical Kinetics","Surface Chemistry","Metallurgy","p-Block Elements","d & f Block Elements","Coordination Compounds","Haloalkanes & Haloarenes","Alcohols Phenols & Ethers","Aldehydes & Ketones","Carboxylic Acids","Amines","Biomolecules","Polymers","Chemistry in Everyday Life"],
  "Biology":["Sexual Reproduction in Plants","Human Reproduction","Reproductive Health","Genetics & Mendel's Laws","Molecular Basis of Inheritance","Evolution","Human Health & Disease","Strategies for Enhancement","Microbes in Human Welfare","Biotechnology Principles","Biotechnology Applications","Organisms & Populations","Ecosystem","Biodiversity","Environmental Issues"],
  "Mathematics":["Relations & Functions","Inverse Trigonometric Functions","Matrices","Determinants","Continuity & Differentiability","Applications of Derivatives","Integrals","Application of Integrals","Differential Equations","Vector Algebra","3D Geometry","Linear Programming","Probability"],
  "English":["Flamingo — Prose","Flamingo — Poetry","Vistas — Supplementary","Grammar","Writing — Articles Reports"],
};

const CBSE_SCI_11 = { ...SB_SCI_11 };
const CBSE_SCI_12 = { ...SB_SCI_12 };

const JEE_SUBJECTS = {
  "Physics":["Kinematics","Newton's Laws","Work Energy Power","Centre of Mass","Rotational Mechanics","Gravitation","Fluid Mechanics","SHM & Waves","Thermodynamics","Electrostatics","Current Electricity","Capacitors","Magnetic Field","Electromagnetic Induction","Alternating Current","Ray & Wave Optics","Modern Physics","Semiconductors"],
  "Chemistry":["Mole Concept","Atomic Structure","Periodic Table","Chemical Bonding","States of Matter","Thermodynamics","Equilibrium","Electrochemistry","Solid State","Coordination Compounds","GOC — Reaction Mechanisms","Hydrocarbons","Aldehydes & Ketones","Carboxylic Acids","Amines","Biomolecules","p-Block d-Block f-Block"],
  "Mathematics":["Quadratic Equations","Complex Numbers","Sequences & Series","Binomial Theorem","Permutations & Combinations","Matrices & Determinants","Functions","Limits Continuity Differentiability","Application of Derivatives","Integration — Indefinite & Definite","Differential Equations","Vectors","3D Geometry","Coordinate Geometry — Conics","Probability"],
};

const NEET_SUBJECTS = {
  "Physics":["Physical World & Measurement","Kinematics","Laws of Motion","Work Energy Power","Gravitation","Properties of Matter","Thermodynamics","Oscillations","Waves","Electrostatics","Current Electricity","Magnetism","Electromagnetic Induction","Optics","Dual Nature","Atoms & Nuclei","Semiconductors"],
  "Chemistry":["Atomic Structure","Periodic Table","Chemical Bonding","States of Matter","Thermodynamics","Equilibrium","Redox Reactions","p-Block Elements","Coordination Compounds","Haloalkanes","Alcohols Phenols Ethers","Aldehydes & Ketones","Carboxylic Acids","Amines","Biomolecules","Polymers"],
  "Biology — Botany":["Diversity of Living World","Morphology of Flowering Plants","Anatomy of Plants","Cell Biology & Division","Biomolecules","Photosynthesis","Plant Respiration","Plant Growth","Reproduction in Plants","Genetics & Evolution","Biotechnology","Ecology"],
  "Biology — Zoology":["Animal Kingdom","Human Digestive System","Breathing & Gas Exchange","Body Fluids & Circulation","Excretory System","Locomotion & Movement","Neural Control","Chemical Coordination","Human Reproduction","Reproductive Health","Evolution","Human Health & Disease","Ecosystem & Biodiversity"],
};

const BOARDS_CONFIG = [
  { key:"sb610",   label:"Class 6–10 · State Board",  icon:"📘", color:"#1E3A8A", accent:"#93C5FD", desc:"Maharashtra State Board",        subDesc:"All subjects — Science, Maths, English, Hindi, Marathi, SST", classes:[6,7,8,9,10], dataFn: cls => SB610[cls],   needsClass:true  },
  { key:"cbse610", label:"Class 6–10 · CBSE",          icon:"📗", color:"#14532D", accent:"#4ADE80", desc:"Central Board — NCERT",           subDesc:"All subjects — Science, Maths, English, Hindi, Sanskrit, SST", classes:[6,7,8,9,10], dataFn: cls => CBSE610[cls], needsClass:true  },
  { key:"sb1112",  label:"Class 11–12 · State Board",  icon:"📙", color:"#7C2D12", accent:"#FB923C", desc:"Maharashtra HSC — Science Only",  subDesc:"Physics · Chemistry · Biology · Mathematics · English", classes:[11,12], dataFn: cls => cls===11?SB_SCI_11:SB_SCI_12, needsClass:true  },
  { key:"cbse1112",label:"Class 11–12 · CBSE",          icon:"📕", color:"#581C87", accent:"#C084FC", desc:"CBSE Board — Science Only",       subDesc:"Physics · Chemistry · Biology · Mathematics · English", classes:[11,12], dataFn: cls => cls===11?CBSE_SCI_11:CBSE_SCI_12, needsClass:true },
  { key:"jee",     label:"JEE · Mains & Advanced",     icon:"⚛️", color:"#0C4A6E", accent:"#38BDF8", desc:"Joint Entrance Exam — PCM",       subDesc:"Physics · Chemistry · Mathematics", classes:null, dataFn: ()=>JEE_SUBJECTS, needsClass:false },
  { key:"neet",    label:"NEET · UG",                   icon:"🧬", color:"#052E16", accent:"#4ADE80", desc:"National Eligibility Exam — PCB", subDesc:"Physics · Chemistry · Biology (Botany + Zoology)", classes:null, dataFn: ()=>NEET_SUBJECTS, needsClass:false },
];

const WHY_FEATURES = [
  { icon:"🏠", t:"Tutor Comes to Your Home",        b:"Zero travel, zero stress. Your tutor arrives at your doorstep at a time that suits your family — morning, evening, or weekend." },
  { icon:"🎯", t:"100% One-to-One Attention",        b:"No batches, no distractions. Every minute of every session is dedicated entirely to your child's progress and doubts." },
  { icon:"🎓", t:"Class 6–12 · Both Boards",         b:"State Board and CBSE both covered — all subjects for junior classes, science-only for Class 11-12 and competitive exams." },
  { icon:"🏆", t:"Momentum-Vetted Tutors",           b:"3-stage screening. Only 1 in 5 applicants selected. Backed by Momentum Nagpur's 22-year coaching legacy." },
  { icon:"📚", t:"DPPs, Tests & Study Materials",    b:"Daily practice problems, chapter-wise test series, and curated study materials included with every programme." },
  { icon:"📊", t:"Monthly Progress Reports",         b:"Detailed written performance reports shared with parents each month. Full transparency, always." },
  { icon:"🔍", t:"Weekly Doubt-Clearing Sessions",   b:"Dedicated time each week to clear every pending doubt. No question is too small or too silly." },
  { icon:"📋", t:"Personalised Study Plans",         b:"Custom syllabus plan built for each student based on their level, exam target, and available hours." },
  { icon:"🌐", t:"All Nagpur Areas Covered",         b:"We send tutors to every corner of Nagpur — Dharampeth, Sadar, Wardhaman Nagar, Civil Lines, and everywhere beyond." },
  { icon:"📖", t:"Chapter-wise Assessments",         b:"After every chapter, a short assessment ensures mastery before moving forward. No gaps, no shortcuts." },
];

const FEATURES_SLIDER = [
  { icon:"🏠", color:"#1E3A8A", title:"Tutor at Your Doorstep",          desc:"Zero commute. Your tutor arrives at your home at your preferred time — morning, evening, or weekend.", tag:"Home Tutoring" },
  { icon:"🎯", color:"#14532D", title:"100% One-to-One Attention",        desc:"No batches. Every minute of every session belongs entirely to your child.", tag:"Personalised" },
  { icon:"📚", color:"#581C87", title:"Study Materials Provided",          desc:"Curated notes, chapter booklets, formula sheets, and revision material for every subject and board.", tag:"Resources" },
  { icon:"📝", color:"#7C2D12", title:"Daily Practice Problems (DPPs)",   desc:"DPPs designed subject-wise and chapter-wise to build speed, accuracy, and exam readiness.", tag:"DPPs" },
  { icon:"🧪", color:"#0C4A6E", title:"Test Series & Mock Tests",          desc:"Regular chapter tests and full-length mocks simulating board and competitive exam patterns.", tag:"Test Series" },
  { icon:"🏆", color:"#3B0764", title:"Exam-Oriented Coaching",            desc:"Syllabus mapped to CBSE, State Board, JEE, NEET — every lesson builds towards your target.", tag:"Exams" },
  { icon:"🔍", color:"#052E16", title:"Dedicated Doubt Sessions",          desc:"Structured weekly doubt-clearing time. No question is too small.", tag:"Doubt Clearing" },
  { icon:"📊", color:"#422006", title:"Monthly Progress Reports",          desc:"Detailed performance reports sent to parents each month. Full transparency, always.", tag:"Progress Tracking" },
  { icon:"🗓️", color:"#1E1B4B", title:"Fully Flexible Scheduling",         desc:"You choose the days, timings, and frequency. Classes built around your child's routine.", tag:"Flexible" },
  { icon:"👨‍🏫", color:"#0F172A", title:"Momentum-Vetted Tutors",           desc:"3-stage screening — credentials, demo class, background check. 1 in 5 applicants selected.", tag:"Verified Tutors" },
  { icon:"📖", color:"#1A2E05", title:"Chapter-wise Assessments",          desc:"After every chapter, a short test ensures mastery before moving forward.", tag:"Assessments" },
  { icon:"🎓", color:"#2D1B69", title:"Board + Competitive Together",      desc:"Simultaneous prep for school boards AND JEE/NEET — one tutor, one plan.", tag:"Dual Prep" },
  { icon:"🌐", color:"#0C0A09", title:"All Nagpur Areas Covered",           desc:"We serve every corner of Nagpur — from Dharampeth to Butibori and everywhere in between.", tag:"All of Nagpur" },
  { icon:"💬", color:"#1C1917", title:"Parent-Tutor Direct Communication", desc:"Parents can speak with the tutor directly anytime. No middlemen, full accountability.", tag:"Communication" },
];

const COURSES = [
  { id:1,  title:"Science Foundation",       classes:"Class 6–10",         type:"Long Term",  dur:"1 Year",    subs:["Science","Mathematics","English","SST"],       hi:false, desc:"Build strong fundamentals with concept-first teaching. Aligned to both State Board and CBSE." },
  { id:2,  title:"Board Exam Mastery",        classes:"Class 9–10",         type:"Long Term",  dur:"1 Year",    subs:["Science","Mathematics","English","SST"],       hi:false, desc:"Score 90%+ in boards — structured chapter-wise coverage, test series, and DPPs included." },
  { id:3,  title:"Class 11 Foundation",       classes:"Class 11",           type:"Long Term",  dur:"1 Year",    subs:["Physics","Chemistry","Biology/Maths","English"],hi:false, desc:"Master Class 11 — the most critical year for board and competitive exam preparation." },
  { id:4,  title:"Class 12 + Board Prep",     classes:"Class 12",           type:"Long Term",  dur:"1 Year",    subs:["Physics","Chemistry","Biology/Maths","English"],hi:false, desc:"Boards + entrance exam prep combined. Proven 90%+ results." },
  { id:5,  title:"JEE Mains Crash Course",    classes:"Class 12 / Dropper", type:"Short Term", dur:"3 Months",  subs:["Physics","Chemistry","Mathematics"],           hi:true,  desc:"Intensive sprint through full JEE Mains syllabus — daily DPPs, mock tests, doubt sessions." },
  { id:6,  title:"JEE Advanced Long Term",    classes:"Class 11–12",        type:"Long Term",  dur:"2 Years",   subs:["Physics","Chemistry","Mathematics"],           hi:true,  desc:"2-year IIT-targeting programme — weekly tests, DPPs, and full study material." },
  { id:7,  title:"NEET Crash Course",         classes:"Class 12 / Dropper", type:"Short Term", dur:"3 Months",  subs:["Physics","Chemistry","Biology"],               hi:true,  desc:"Full NEET syllabus in 3 months — 700+ score-oriented plan." },
  { id:8,  title:"NEET Long Term",            classes:"Class 11–12",        type:"Long Term",  dur:"2 Years",   subs:["Physics","Chemistry","Biology"],               hi:false, desc:"Systematic 2-year NEET preparation with monthly assessments and DPPs." },
  { id:9,  title:"Single Subject Focus",      classes:"Any Class",          type:"Flexible",   dur:"As needed", subs:["Any Subject"],                                 hi:false, desc:"Need help in one subject only? Pick any subject for any class — flexible duration." },
  { id:10, title:"Holiday Intensive",         classes:"Any Class",          type:"Short Term", dur:"2–4 Weeks", subs:["Choice of Subject"],                           hi:false, desc:"Summer or winter holiday programme — intensive revision and exam readiness boost." },
];

const MOCK_INQ = [
  { id:"1T1-291847", name:"Rohan Mehta",   cls:"Class 11 CBSE",       subs:"Physics, Maths",   area:"Dharampeth",     ph:"8010373753", status:"new",       time:"2 hrs ago"  },
  { id:"1T1-391021", name:"Prachi Desai",  cls:"NEET",                 subs:"Biology, Chem",    area:"Ramdaspeth",     ph:"91234 56789", status:"contacted", time:"5 hrs ago"  },
  { id:"1T1-190234", name:"Ananya Singh",  cls:"Class 9 State Board",  subs:"Science, Maths",   area:"Wardhaman Nagar",ph:"87654 32109", status:"new",       time:"1 day ago"  },
  { id:"1T1-882910", name:"Dev Patel",     cls:"JEE Mains",            subs:"PCM",              area:"Civil Lines",    ph:"99887 76655", status:"assigned",  time:"2 days ago" },
];
const MOCK_APP = [
  { id:"1T1-T-001", name:"Kavita Bhatt",   subs:"Chemistry, Biology",      cls:"Class 11–12, NEET", area:"Bajaj Nagar",     qual:"M.Sc. Chemistry",    exp:5, status:"pending"  },
  { id:"1T1-T-002", name:"Saurabh Rao",    subs:"Physics, Maths",          cls:"JEE, Class 11–12",  area:"Wardhaman Nagar", qual:"B.Tech IIT Bombay",  exp:3, status:"review"   },
  { id:"1T1-T-003", name:"Manisha Thakre", subs:"All Subjects Class 6–10", cls:"Class 6–10",        area:"Manish Nagar",    qual:"M.A. English, B.Ed.",exp:8, status:"approved" },
];
const SC={new:"#DBEAFE",contacted:"#FEF3C7",assigned:"#DCFCE7",pending:"#DBEAFE",review:"#FEF3C7",approved:"#DCFCE7"};
const ST={new:"#1E40AF",contacted:"#92400E",assigned:"#166534",pending:"#1E40AF",review:"#92400E",approved:"#166534"};

/* ─── Helpers ───────────────────────────────────────────────────────── */
const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
const Line  = ({light}) => <div style={{width:52,height:4,background:C.gold,borderRadius:2,margin:light?"8px 0 22px":"8px 0 26px"}}/>;
const H2    = ({children,light}) => <h2 style={{fontSize:"clamp(1.5rem,3vw,2.1rem)",fontWeight:700,color:light?C.white:C.navy,margin:"0 0 6px",fontFamily:"'Playfair Display',Georgia,serif"}}>{children}</h2>;
const Stars = ({n}) => <span style={{color:C.gold,fontSize:14}}>{"★".repeat(n)}</span>;
const INP   = {border:`1.5px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontSize:14,fontFamily:"sans-serif",color:C.text,outline:"none",background:C.off,width:"100%",boxSizing:"border-box"};
const LBL   = {fontSize:11,fontWeight:700,color:C.navy,fontFamily:"sans-serif",letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:5};

/* ─── Logo ──────────────────────────────────────────────────────────── */
function Logo({ onClick, size="md", animate=false }) {
  const h = size==="xl" ? 190 : size==="lg" ? 68 : 52;
  const isHero = size === "xl";
  return (
    <>
      <style>{`
        @keyframes logoEntrance {
          0%  { opacity:0; transform:scale(.82) translateY(-18px); filter:blur(6px); }
          60% { opacity:1; transform:scale(1.04) translateY(2px); filter:blur(0); }
          100%{ opacity:1; transform:scale(1) translateY(0); filter:blur(0); }
        }
        @keyframes logoGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(212,160,23,0), 0 0 30px 0 rgba(212,160,23,0); }
          50%      { box-shadow: 0 0 0 8px rgba(212,160,23,.12), 0 0 50px 12px rgba(212,160,23,.18); }
        }
        @keyframes shimmerSweep {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes ringPulse {
          0%,100% { transform:translate(-50%,-50%) scale(1);   opacity:.35; }
          50%      { transform:translate(-50%,-50%) scale(1.08); opacity:.08; }
        }
        .logo-hero-wrap {
          position: relative;
          display: inline-block;
          animation: logoEntrance .9s cubic-bezier(.22,1,.36,1) both;
        }
        .logo-hero-wrap::before {
          content:'';
          position:absolute; inset:-14px; border-radius:50%;
          background: radial-gradient(ellipse, rgba(212,160,23,.22) 0%, transparent 72%);
          animation: logoGlow 3s ease-in-out infinite;
          pointer-events:none; z-index:0;
        }
        .logo-hero-img {
          position:relative; z-index:1;
          border-radius:50%;
          filter: drop-shadow(0 8px 32px rgba(212,160,23,.35));
        }
        .logo-shimmer-ring {
          position:absolute; inset:-20px; border-radius:50%;
          border: 1.5px solid transparent;
          background: linear-gradient(#060e2a,#060e2a) padding-box,
                      linear-gradient(135deg, transparent 30%, rgba(212,160,23,.7) 50%, transparent 70%) border-box;
          background-size: 300% 300%;
          animation: shimmerSweep 3s linear infinite;
          pointer-events:none; z-index:0;
        }
        .logo-nav-img {
          transition: filter .3s, transform .3s;
        }
        .logo-nav-img:hover {
          filter: drop-shadow(0 0 8px rgba(212,160,23,.5));
          transform: scale(1.05);
        }
      `}</style>
      <div onClick={onClick} style={{ cursor: onClick ? "pointer" : "default", userSelect:"none" }}>
        {isHero ? (
          <div className="logo-hero-wrap">
            <div className="logo-shimmer-ring"/>
            <img
              src="/logo.jpg"
              alt="1 to 1 Home Tutors Nagpur"
              className="logo-hero-img"
              style={{ height: h, width: "auto", display: "block" }}
            />
          </div>
        ) : (
          <img
            src="/logo.jpg"
            alt="1 to 1 Home Tutors Nagpur"
            className="logo-nav-img"
            style={{ height: h, width: "auto", display: "block" }}
          />
        )}
      </div>
    </>
  );
}

/* ─── Nav ───────────────────────────────────────────────────────────── */
function Nav({ page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { id:"home",    l:"Home" },
    { id:"about",   l:"About" },
    { id:"tutors",  l:"Tutors" },
    { id:"courses", l:"Courses" },
    { id:"inquiry", l:"Book Counselling", highlight: true },
    { id:"join",    l:"Join as Tutor" },
    { id:"admin",   l:"Admin" },
  ];

  const navigate = (id) => { setPage(id); setMenuOpen(false); };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-hamburger      { display: flex !important; }
          .nav-contact-bar span.hide-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .nav-hamburger      { display: none !important; }
          .nav-mobile-menu    { display: none !important; }
        }
        .nav-mobile-menu-item:hover { background: rgba(255,255,255,.08) !important; }
        .nav-hamburger-line {
          display: block; width: 22px; height: 2px;
          background: #CBD5E0; border-radius: 2px;
          transition: all .25s;
        }
        .ham-open .nav-hamburger-line:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .ham-open .nav-hamburger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .ham-open .nav-hamburger-line:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <nav style={{ background:C.navy, borderBottom:`3px solid ${C.gold}`, position:"sticky", top:0, zIndex:300, boxShadow:"0 4px 24px rgba(0,0,0,.4)" }}>

        {/* ── Main bar ── */}
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 1.25rem", display:"flex", alignItems:"center", justifyContent:"space-between", height:66 }}>

          {/* Premium text brand mark — no image */}
          <div onClick={() => navigate("home")} style={{ cursor:"pointer", userSelect:"none", display:"flex", alignItems:"center", gap:0 }}>
            <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", position:"relative" }}>
              {/* Top decorative line */}
              <div style={{ height:1, background:`linear-gradient(to right,${C.gold},transparent)`, marginBottom:3, width:120 }}/>
              {/* Brand name */}
              <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
                <span style={{ color:C.gold, fontSize:20, fontWeight:800, fontFamily:"'Playfair Display',Georgia,serif", letterSpacing:"-.01em", lineHeight:1 }}>1</span>
                <span style={{ color:`${C.gold}80`, fontSize:14, fontWeight:400, fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1 }}>:</span>
                <span style={{ color:C.gold, fontSize:20, fontWeight:800, fontFamily:"'Playfair Display',Georgia,serif", letterSpacing:"-.01em", lineHeight:1 }}>1</span>
                <span style={{ color:"#94A3B8", fontSize:12.5, fontWeight:600, fontFamily:"sans-serif", letterSpacing:".02em", marginLeft:5, lineHeight:1 }}>Home Tutors</span>
              </div>
              {/* Tagline */}
              <div style={{ color:"#475569", fontSize:7, letterSpacing:".22em", textTransform:"uppercase", fontFamily:"sans-serif", marginTop:2, lineHeight:1 }}>Backed by Momentum Nagpur</div>
              {/* Bottom decorative line */}
              <div style={{ height:1, background:`linear-gradient(to right,${C.gold}55,transparent)`, marginTop:3, width:80 }}/>
            </div>
          </div>

          {/* Desktop links */}
          <div className="nav-desktop-links" style={{ display:"flex", gap:3 }}>
            {links.map(lk => (
              <button key={lk.id} onClick={() => navigate(lk.id)}
                style={{ background: page===lk.id ? C.gold : lk.highlight ? `${C.gold}20` : "transparent", color: page===lk.id ? C.navy : lk.highlight ? C.goldLight : "#CBD5E0", border: lk.highlight ? `1.5px solid ${C.gold}44` : "none", borderRadius:6, padding:"7px 12px", cursor:"pointer", fontSize:12, fontFamily:"sans-serif", fontWeight:600, transition:"all .15s" }}>
                {lk.l}
              </button>
            ))}
          </div>

          {/* Hamburger button — mobile only */}
          <button
            className={`nav-hamburger ${menuOpen ? "ham-open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            style={{ display:"none", flexDirection:"column", gap:6, background:"none", border:`1.5px solid rgba(255,255,255,.2)`, borderRadius:8, padding:"9px 10px", cursor:"pointer", alignItems:"center", justifyContent:"center", flexShrink:0 }}
            aria-label="Toggle menu">
            <span className="nav-hamburger-line" />
            <span className="nav-hamburger-line" />
            <span className="nav-hamburger-line" />
          </button>
        </div>

        {/* ── Contact strip ── */}
        <div className="nav-contact-bar" style={{ background:`${C.gold}15`, borderTop:`1px solid ${C.gold}28`, padding:"5px 1.25rem", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"sans-serif", fontSize:12, flexWrap:"wrap" }}>
          <span style={{ color:C.gold }}>📞</span>
          <span style={{ color:"#94A3B8" }}>Call/WhatsApp:</span>
          <strong style={{ color:C.goldLight }}>+91 8010373753</strong>
          <span className="hide-mobile" style={{ color:"#334155", margin:"0 4px" }}>|</span>
          <span className="hide-mobile" style={{ color:"#94A3B8" }}>✉ 1to1hometutornagpur@gmail.com</span>
          <span className="hide-mobile" style={{ color:"#334155", margin:"0 4px" }}>|</span>
          <span className="hide-mobile" style={{ color:"#94A3B8" }}>🕐 Mon–Sat 9AM–7PM</span>
        </div>

        {/* ── Area ticker strip ── */}
        <div style={{ background:C.navy, padding:"6px 0", overflow:"hidden", borderBottom:`1px solid ${C.gold}22` }}>
          <div style={{ display:"flex", gap:0, animation:"navTicker 28s linear infinite", whiteSpace:"nowrap" }}>
            {[...AREAS,...AREAS].map((a,i)=>(
              <span key={i} style={{ color:"#94A3B8", fontFamily:"sans-serif", fontSize:11, padding:"0 14px", flexShrink:0 }}>
                <span style={{ color:C.gold, marginRight:5 }}>📍</span>{a}
              </span>
            ))}
          </div>
          <style>{`@keyframes navTicker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
        </div>

        {/* ── Mobile dropdown menu ── */}
        {menuOpen && (
          <div
            className="nav-mobile-menu"
            style={{ background:C.navyDeep, borderTop:`1px solid ${C.gold}33`, padding:"8px 0 12px", animation:"slideDown .25s ease" }}>
            {links.map(lk => (
              <button
                key={lk.id}
                className="nav-mobile-menu-item"
                onClick={() => navigate(lk.id)}
                style={{ width:"100%", background: page===lk.id ? `${C.gold}18` : "transparent", color: page===lk.id ? C.gold : lk.highlight ? C.goldLight : "#CBD5E0", border:"none", borderLeft: page===lk.id ? `3px solid ${C.gold}` : "3px solid transparent", padding:"13px 24px", cursor:"pointer", fontSize:15, fontFamily:"sans-serif", fontWeight: page===lk.id ? 700 : 500, textAlign:"left", display:"flex", alignItems:"center", justifyContent:"space-between", transition:"background .15s" }}>
                {lk.l}
                {page === lk.id && <span style={{ color:C.gold, fontSize:16 }}>✓</span>}
                {lk.highlight && page !== lk.id && (
                  <span style={{ background:C.gold, color:C.navyDeep, fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:12, letterSpacing:".06em", textTransform:"uppercase" }}>Free</span>
                )}
              </button>
            ))}

            {/* Contact info inside mobile menu */}
            <div style={{ margin:"10px 20px 0", padding:"12px 16px", background:`${C.white}06`, borderRadius:10, border:`1px solid ${C.gold}22` }}>
              <div style={{ color:C.gold, fontSize:13, fontWeight:700, fontFamily:"sans-serif", marginBottom:6 }}>📞 +91 8010373753</div>
              <div style={{ color:"#94A3B8", fontSize:12, fontFamily:"sans-serif", marginBottom:3 }}>✉ 1to1hometutornagpur@gmail.com</div>
              <div style={{ color:"#94A3B8", fontSize:12, fontFamily:"sans-serif" }}>🕐 Mon–Sat, 9 AM – 7 PM</div>
              <button
                onClick={() => { window.open("https://wa.me/918010373753"); setMenuOpen(false); }}
                style={{ marginTop:10, width:"100%", background:"#25D366", color:C.white, border:"none", borderRadius:8, padding:"10px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"sans-serif" }}>
                💬 WhatsApp Us Now
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

/* ─── Board Enquiry Widget (reusable) ───────────────────────────────── */
function BoardEnquiryWidget({ compact = false }) {
  const [active, setActive]     = useState(null);
  const [selClass, setSelClass] = useState(null);
  const [selSubjects, setSub]   = useState([]);  // {name, topics:[]}
  const [openTopics, setOT]     = useState(null);
  const [step, setStep]         = useState(1); // 1=class, 2=subjects, 3=form
  const [form, setForm]         = useState({name:"",phone:"",area:""});
  const [done, setDone]         = useState(false);

  const cfg = BOARDS_CONFIG.find(b=>b.key===active);

  const selectBoard = (key) => {
    if (active===key) { setActive(null); reset(); return; }
    setActive(key); reset();
    const c = BOARDS_CONFIG.find(b=>b.key===key);
    if (!c.needsClass) setStep(2);
  };

  const reset = () => { setSelClass(null); setSub([]); setOT(null); setStep(1); setDone(false); };

  const toggleSubject = (sname) => {
    setSub(p => p.some(s=>s.name===sname) ? p.filter(s=>s.name!==sname) : [...p, {name:sname,topics:[]}]);
  };

  const toggleTopic = (sname, topic) => {
    setSub(p => p.map(s => s.name!==sname ? s : {
      ...s, topics: s.topics.includes(topic) ? s.topics.filter(t=>t!==topic) : [...s.topics, topic]
    }));
  };

  const selectAllTopics = (sname, allTopics) => {
    setSub(p => p.map(s => s.name!==sname ? s : {
      ...s, topics: s.topics.length===allTopics.length ? [] : [...allTopics]
    }));
  };

  const subjectsData = cfg ? cfg.dataFn(selClass) : null;

  const rows = [BOARDS_CONFIG.slice(0,2), BOARDS_CONFIG.slice(2,4), BOARDS_CONFIG.slice(4,6)];
  const rowLabels = ["Classes 6 – 10","Classes 11 – 12 (Science)","Competitive Entrance Exams"];

  return (
    <div id="boards-section">
      {/* Board grid */}
      <div style={{display:"flex",flexDirection:"column",gap:0}}>
        {rows.map((row,ri)=>(
          <div key={ri} style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:".14em",textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:10}}>
              {rowLabels[ri]}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {row.map(b=>{
                const isActive = active===b.key;
                const subData = b.dataFn(b.classes?b.classes[0]:null);
                const topicCount = Object.values(subData).flat().length;
                return (
                  <button key={b.key} onClick={()=>selectBoard(b.key)}
                    style={{background:isActive?`linear-gradient(135deg,${b.color}f0,${b.color}b0)`:C.white,border:isActive?`2px solid ${C.gold}`:`1.5px solid ${C.border}`,borderRadius:16,padding:"20px 18px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"flex-start",gap:14,transition:"all .2s",boxShadow:isActive?"0 6px 24px rgba(0,0,0,.2)":"0 2px 8px rgba(0,0,0,.04)"}}>
                    <div style={{fontSize:34,flexShrink:0}}>{b.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:15,fontWeight:700,color:isActive?C.white:C.navy,fontFamily:"'Playfair Display',Georgia,serif",marginBottom:3}}>{b.label}</div>
                      <div style={{fontSize:11.5,color:isActive?"#CBD5E0":C.muted,fontFamily:"sans-serif",lineHeight:1.5,marginBottom:8}}>{b.subDesc}</div>
                      <span style={{background:isActive?`${C.gold}33`:b.color+"18",borderRadius:20,padding:"3px 10px",fontSize:10.5,fontWeight:700,color:isActive?C.goldLight:b.color,fontFamily:"sans-serif"}}>
                        {Object.keys(subData).length} subjects · {topicCount}+ topics
                      </span>
                    </div>
                    <span style={{color:isActive?C.gold:C.muted,fontSize:18,flexShrink:0}}>{isActive?"▲":"▼"}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Panel */}
      {active && cfg && (
        <div style={{marginTop:16,border:`2px solid ${C.gold}`,borderRadius:18,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,.12)",animation:"expandIn .3s ease"}}>
          {/* Panel header */}
          <div style={{background:`linear-gradient(135deg,${cfg.color}f0,${cfg.color}a0)`,padding:"20px 24px",display:"flex",alignItems:"center",gap:14}}>
            <span style={{fontSize:32}}>{cfg.icon}</span>
            <div style={{flex:1}}>
              <div style={{color:C.white,fontSize:18,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif"}}>{cfg.label}</div>
              <div style={{color:"#CBD5E0",fontFamily:"sans-serif",fontSize:13,marginTop:2}}>{cfg.desc}</div>
            </div>
            {/* Step indicator */}
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {[1,2,3].map(s=>(
                <div key={s} style={{display:"flex",alignItems:"center",gap:4}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:step>=s?C.gold:`${C.white}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:step>=s?C.navyDeep:C.white,fontFamily:"sans-serif"}}>{s}</div>
                  {s<3&&<div style={{width:20,height:2,background:step>s?C.gold:`${C.white}30`}}/>}
                </div>
              ))}
            </div>
            <button onClick={()=>{setActive(null);reset();}} style={{background:`${C.white}20`,border:`1px solid ${C.white}30`,borderRadius:8,padding:"7px 14px",color:C.white,cursor:"pointer",fontSize:13,fontFamily:"sans-serif",fontWeight:600}}>✕ Close</button>
          </div>

          <div style={{padding:"24px",background:C.off}}>
            {/* STEP 1: Class Selection */}
            {cfg.needsClass && step===1 && (
              <div>
                <div style={{fontSize:15,fontWeight:700,color:C.navy,fontFamily:"sans-serif",marginBottom:4}}>Step 1 — Select Your Class</div>
                <div style={{fontSize:13,color:C.muted,fontFamily:"sans-serif",marginBottom:18}}>Which class are you looking for tutoring?</div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {cfg.classes.map(cls=>(
                    <button key={cls} onClick={()=>{setSelClass(cls);setStep(2);setSub([]);}}
                      style={{background:selClass===cls?C.navy:C.white,color:selClass===cls?C.white:C.navy,border:`2px solid ${selClass===cls?C.navy:C.border}`,borderRadius:12,padding:"16px 28px",fontSize:18,fontWeight:700,cursor:"pointer",fontFamily:"'Playfair Display',Georgia,serif",transition:"all .2s",boxShadow:selClass===cls?"0 4px 16px rgba(11,31,78,.3)":"0 2px 8px rgba(0,0,0,.06)"}}>
                      Class {cls}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Subject & Topic Selection */}
            {step===2 && subjectsData && (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div style={{fontSize:15,fontWeight:700,color:C.navy,fontFamily:"sans-serif"}}>
                    Step 2 — Select Subjects {selClass?`for Class ${selClass}`:""} &amp; Topics
                  </div>
                  {cfg.needsClass&&<button onClick={()=>{setStep(1);setSub([]);}} style={{fontSize:12,color:C.gold,background:"none",border:`1px solid ${C.gold}`,borderRadius:6,padding:"4px 10px",cursor:"pointer",fontFamily:"sans-serif"}}>← Change Class</button>}
                </div>
                <div style={{fontSize:13,color:C.muted,fontFamily:"sans-serif",marginBottom:18}}>
                  Click a subject to select it. Use "All Chapters" or pick specific topics inside.
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
                  {Object.entries(subjectsData).map(([sname,topics])=>{
                    const isSel = selSubjects.some(s=>s.name===sname);
                    const selSub = selSubjects.find(s=>s.name===sname);
                    const topicsOpen = openTopics===sname;
                    const selTopicCount = selSub?.topics.length||0;
                    return (
                      <div key={sname} style={{border:`1.5px solid ${isSel?C.gold:C.border}`,borderRadius:14,overflow:"hidden",background:C.white,boxShadow:isSel?"0 2px 12px rgba(212,160,23,.2)":"none",transition:"all .2s"}}>
                        {/* Subject row */}
                        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:isSel?C.goldPale:C.white}}>
                          <div onClick={()=>toggleSubject(sname)} style={{width:22,height:22,borderRadius:6,border:isSel?"none":`1.5px solid ${C.border}`,background:isSel?C.gold:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14,color:C.navyDeep,fontWeight:700}}>{isSel?"✓":""}</div>
                          <span onClick={()=>toggleSubject(sname)} style={{flex:1,fontSize:14,fontWeight:700,color:isSel?"#7A5C00":C.navy,cursor:"pointer",fontFamily:"sans-serif"}}>{sname}</span>
                          {isSel&&<span style={{fontSize:10.5,color:C.gold,fontFamily:"sans-serif",fontWeight:700,flexShrink:0}}>{selTopicCount?`${selTopicCount} topics`:"Full subject"}</span>}
                          <button onClick={()=>setOT(topicsOpen?null:sname)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 9px",fontSize:11,color:C.muted,cursor:"pointer",fontFamily:"sans-serif",flexShrink:0}}>{topicsOpen?"▲ Hide":"Chapters ▾"}</button>
                        </div>
                        {/* Topics */}
                        {topicsOpen&&(
                          <div style={{padding:"10px 14px 14px",background:"#FAFAF8"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                              <span style={{fontSize:11.5,color:C.muted,fontFamily:"sans-serif",fontWeight:600}}>Select specific chapters (or select whole subject above)</span>
                              {isSel&&<button onClick={()=>selectAllTopics(sname,topics)} style={{fontSize:11,color:C.gold,background:"none",border:`1px solid ${C.gold}55`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontFamily:"sans-serif"}}>{selTopicCount===topics.length?"Deselect All":"All Chapters"}</button>}
                            </div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                              {topics.map(topic=>{
                                const topicSel = selSub?.topics.includes(topic);
                                return (
                                  <span key={topic} onClick={()=>{if(!isSel)toggleSubject(sname); toggleTopic(sname,topic);}}
                                    style={{background:topicSel?C.navy:"#EEF2FF",color:topicSel?C.white:"#3730A3",fontSize:11,padding:"4px 10px",borderRadius:20,fontFamily:"sans-serif",cursor:"pointer",border:topicSel?`none`:`1px solid #C7D2FE`,transition:"all .15s"}}>
                                    {topicSel?"✓ ":""}{topic}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {selSubjects.length>0&&(
                  <div style={{marginTop:20,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.goldPale,border:`1.5px solid ${C.gold}55`,borderRadius:12,padding:"14px 18px"}}>
                    <div style={{fontFamily:"sans-serif",fontSize:13,color:"#7A5C00"}}>
                      <strong>{selSubjects.length} subject{selSubjects.length>1?"s":""} selected</strong>: {selSubjects.map(s=>s.name+(s.topics.length?` (${s.topics.length} chapters)`:""  )).join(", ")}
                    </div>
                    <button onClick={()=>setStep(3)} style={{background:C.navy,color:C.white,border:"none",borderRadius:8,padding:"10px 22px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif",flexShrink:0,marginLeft:12}}>Continue →</button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Submit Form */}
            {step===3 && (
              <div>
                <div style={{fontSize:15,fontWeight:700,color:C.navy,fontFamily:"sans-serif",marginBottom:4}}>Step 3 — Submit Your Enquiry</div>
                {done ? (
                  <div style={{background:C.greenBg,border:`1.5px solid #6EE7B7`,borderRadius:12,padding:"28px",textAlign:"center",color:C.green,fontFamily:"sans-serif"}}>
                    <div style={{fontSize:36,marginBottom:10}}>✅</div>
                    <strong style={{fontSize:16}}>Enquiry Submitted!</strong>
                    <p style={{margin:"10px 0 6px",fontSize:14}}>Our counsellor will call you within 24 hours.</p>
                    <div style={{background:C.white,borderRadius:10,padding:"12px 16px",marginTop:12,textAlign:"left"}}>
                      <div style={{fontSize:12,color:C.green,fontWeight:700,marginBottom:4}}>Your Enquiry Summary:</div>
                      <div style={{fontSize:12,color:"#065f46"}}><strong>Board:</strong> {cfg.label}</div>
                      {selClass&&<div style={{fontSize:12,color:"#065f46"}}><strong>Class:</strong> {selClass}</div>}
                      <div style={{fontSize:12,color:"#065f46"}}><strong>Subjects:</strong> {selSubjects.map(s=>s.name+(s.topics.length?` (${s.topics.length} ch.)`:""  )).join(", ")}</div>
                      <div style={{fontSize:11,color:"#065f46",marginTop:4}}>ID: 1T1-{Date.now().toString().slice(-6)}</div>
                    </div>
                  </div>
                ):(
                  <>
                    <div style={{background:C.white,borderRadius:10,border:`1px solid ${C.border}`,padding:"12px 16px",marginBottom:18,fontFamily:"sans-serif",fontSize:13}}>
                      <div style={{color:C.navy,fontWeight:700,marginBottom:4}}>Your selection:</div>
                      <div style={{color:C.muted}}>{cfg.label}{selClass?` · Class ${selClass}`:""} · {selSubjects.map(s=>s.name+(s.topics.length?` (${s.topics.length} chapters)`:""  )).join(", ")}</div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
                      <div><label style={LBL}>Name *</label><input style={INP} placeholder="Full name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
                      <div><label style={LBL}>Phone *</label><input style={INP} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/></div>
                      <div><label style={LBL}>Area in Nagpur</label>
                        <select style={INP} value={form.area} onChange={e=>setForm(p=>({...p,area:e.target.value}))}>
                          <option value="">Select area</option>{AREAS.map(a=><option key={a}>{a}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={()=>setStep(2)} style={{background:"none",border:`1.5px solid ${C.border}`,borderRadius:8,padding:"12px 22px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"sans-serif",color:C.muted}}>← Back</button>
                      <button onClick={async () => {
                          if(!form.name||!form.phone){alert("Please enter name and phone.");return;}
                          try {
                            const result = await submitBoardEnquiry({
                              name: form.name,
                              phone: form.phone,
                              area: form.area,
                              boardKey: active,
                              boardLabel: cfg.label,
                              selClass: selClass,
                              selectedSubjects: selSubjects
                            });
                            if (result.success) setDone(true);
                            else alert('Submission failed. Check console.');
                          } catch(e) {
                            console.error(e);
                            alert('Network error. Check console.');
                          }
                        }} style={{flex:1,background:C.gold,color:C.navyDeep,borderRadius:8,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif"}}>
                           Submit Enquiry — Counsellor Will Call Within 24 Hours
                         </button>
                    </div>
                    <p style={{textAlign:"center",fontSize:12,color:C.muted,fontFamily:"sans-serif",marginTop:10}}>💡 No fees during counselling. Pricing is personalised on the call.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`@keyframes expandIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

/* ─── Why Slider (scrolling down) ───────────────────────────────────── */
function WhySlider({ setPage }) {
  return (
    <div style={{background:C.off,padding:"60px 1.5rem",overflow:"hidden"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <H2>Why Choose 1 to 1 Home Tutors?</H2><Line/>
        <p style={{fontFamily:"sans-serif",color:C.muted,fontSize:14,marginBottom:32}}>Hover to pause · Every feature, every session.</p>
        <div style={{position:"relative",height:520,overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:70,background:`linear-gradient(to bottom,${C.off},transparent)`,zIndex:2,pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:70,background:`linear-gradient(to top,${C.off},transparent)`,zIndex:2,pointerEvents:"none"}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,animation:"scrollDown 24s linear infinite"}}
            onMouseEnter={e=>e.currentTarget.style.animationPlayState="paused"}
            onMouseLeave={e=>e.currentTarget.style.animationPlayState="running"}>
            {[...WHY_FEATURES,...WHY_FEATURES].map((f,i)=>(
              <div key={i} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 18px",display:"flex",gap:14,alignItems:"flex-start",transition:"box-shadow .2s",boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
                <div style={{fontSize:26,flexShrink:0}}>{f.icon}</div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:5,fontFamily:"'Playfair Display',Georgia,serif"}}>{f.t}</div>
                  <div style={{fontSize:13,color:C.muted,fontFamily:"sans-serif",lineHeight:1.7}}>{f.b}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:28}}>
          <button onClick={()=>setPage("inquiry")} style={{background:C.navy,color:C.white,border:"none",borderRadius:8,padding:"13px 32px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif"}}>Book Free Counselling Session →</button>
        </div>
      </div>
      <style>{`.scrollCol{animation:scrollDown 24s linear infinite}`+`@keyframes scrollDown{0%{transform:translateY(0)}100%{transform:translateY(-50%)}}`}</style>
    </div>
  );
}

/* ─── Features Slider ───────────────────────────────────────────────── */
function FeaturesSlider({ setPage }) {
  const [cur,setCur]=useState(0),[paused,setPaused]=useState(false);
  const total=FEATURES_SLIDER.length;
  useEffect(()=>{if(paused)return;const t=setInterval(()=>setCur(c=>(c+1)%total),3200);return()=>clearInterval(t);},[paused,total]);
  const go=i=>{setCur(i);setPaused(true);setTimeout(()=>setPaused(false),8000);};
  const f=FEATURES_SLIDER[cur];
  return (
    <div style={{background:C.navy,padding:"60px 1.5rem"}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <H2 light>What You Get with Every Tutor</H2><Line light/>
        <div style={{position:"relative",marginBottom:22}}>
          <div key={cur} style={{background:`linear-gradient(135deg,${f.color}f0,${f.color}99)`,border:`1.5px solid ${C.gold}44`,borderRadius:20,padding:"44px 50px",minHeight:250,display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",overflow:"hidden",animation:"slideIn .4s ease"}}>
            <div style={{position:"absolute",right:36,top:"50%",transform:"translateY(-50%)",fontSize:130,opacity:.08,pointerEvents:"none"}}>{f.icon}</div>
            <div style={{display:"inline-flex",alignItems:"center",background:`${C.gold}22`,border:`1px solid ${C.gold}44`,borderRadius:30,padding:"4px 14px",width:"fit-content",marginBottom:16}}>
              <span style={{color:C.gold,fontSize:10.5,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",fontFamily:"sans-serif"}}>{f.tag}</span>
            </div>
            <div style={{fontSize:36,marginBottom:14}}>{f.icon}</div>
            <h3 style={{color:C.white,fontSize:"clamp(1.3rem,3vw,1.85rem)",fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",margin:"0 0 12px",maxWidth:560}}>{f.title}</h3>
            <p style={{color:"#CBD5E0",fontFamily:"sans-serif",fontSize:15,lineHeight:1.8,maxWidth:540,margin:"0 0 22px"}}>{f.desc}</p>
            <button onClick={()=>setPage("inquiry")} style={{background:C.gold,color:C.navyDeep,border:"none",borderRadius:8,padding:"10px 24px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif",width:"fit-content"}}>Book Free Counselling →</button>
          </div>
          <button onClick={()=>go((cur-1+total)%total)} style={{position:"absolute",left:-20,top:"50%",transform:"translateY(-50%)",width:40,height:40,borderRadius:"50%",background:C.gold,color:C.navyDeep,border:"none",fontSize:18,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>‹</button>
          <button onClick={()=>go((cur+1)%total)} style={{position:"absolute",right:-20,top:"50%",transform:"translateY(-50%)",width:40,height:40,borderRadius:"50%",background:C.gold,color:C.navyDeep,border:"none",fontSize:18,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>›</button>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:7,marginBottom:28,flexWrap:"wrap"}}>
          {FEATURES_SLIDER.map((_,i)=><button key={i} onClick={()=>go(i)} style={{width:cur===i?26:9,height:9,borderRadius:9,background:cur===i?C.gold:`${C.white}26`,border:"none",cursor:"pointer",padding:0,transition:"all .3s"}}/>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(115px,1fr))",gap:8}}>
          {FEATURES_SLIDER.map((f2,i)=>(
            <button key={i} onClick={()=>go(i)} style={{background:cur===i?`${f2.color}cc`:`${C.white}08`,border:cur===i?`1.5px solid ${C.gold}`:`1px solid ${C.white}10`,borderRadius:10,padding:"9px 6px",cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
              <div style={{fontSize:18,marginBottom:3}}>{f2.icon}</div>
              <div style={{color:cur===i?C.gold:"#94A3B8",fontSize:9.5,fontFamily:"sans-serif",fontWeight:600,lineHeight:1.3}}>{f2.tag}</div>
            </button>
          ))}
        </div>
      </div>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────────────── */
const FAQS=[
  {q:"Are classes for both State Board and CBSE?",a:"Yes — expert tutors for Maharashtra State Board and CBSE from Class 6 to 12, for all subjects."},
  {q:"Do you serve all areas of Nagpur?",a:"Yes! We serve every area — Dharampeth, Sadar, Ramdaspeth, Wardhaman Nagar, Civil Lines, Bajaj Nagar, Manish Nagar, Hingna, Wardha Road, and every other locality across Nagpur."},
  {q:"Is 11-12 only for science stream?",a:"Yes — for Class 11 and 12 we currently offer tutoring only for the Science stream (Physics, Chemistry, Biology, Mathematics). Commerce and Arts may be added in a future phase."},
  {q:"How are tutors selected?",a:"3-stage vetting — credentials check, demo class review, background verification. Only 1 in 5 applicants joins."},
  {q:"Can I select specific chapters only?",a:"Absolutely. When you enquire using our Board & Subject selector, you can choose specific chapters/topics within any subject. You're not required to take the full subject."},
  {q:"Is there a demo class?",a:"Your first counselling session is completely free with zero commitment. A demo class can be arranged before you decide."},
  {q:"How are prices decided?",a:"Fees depend on class, board, subject, and duration — discussed and personalised on the counselling call."},
];
function FAQBox(){
  const [open,setOpen]=useState(null);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {FAQS.map((f,i)=>(
        <div key={i} style={{border:`1.5px solid ${open===i?C.gold:C.border}`,borderRadius:10,overflow:"hidden",transition:"border .2s"}}>
          <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",background:open===i?C.goldPale:C.off,border:"none",padding:"14px 18px",textAlign:"left",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"sans-serif",fontSize:13.5,fontWeight:600,color:C.navy}}>
            {f.q}<span style={{color:C.gold,fontSize:18,transform:open===i?"rotate(45deg)":"none",transition:"transform .2s",flexShrink:0}}>+</span>
          </button>
          {open===i&&<div style={{padding:"12px 18px 16px",fontFamily:"sans-serif",fontSize:13.5,color:C.muted,lineHeight:1.75,background:C.white}}>{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

/* ─── Animated Counter ──────────────────────────────────────────────── */
function Counter({ target, suffix="" }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting){ let s=0; const t=setInterval(()=>{ s+=Math.ceil(target/40); if(s>=target){setVal(target);clearInterval(t);}else setVal(s); },40); } },{threshold:.5});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── How It Works — cursor-interactive premium timeline ──────────────── */
function HowItWorks({ setPage }) {
  const STEPS = [
    { n:"01", icon:"📋", t:"Submit Enquiry",       d:"Fill our quick form — class, board, subject & Nagpur area. Takes under 2 minutes.",       color:"#1E3A8A" },
    { n:"02", icon:"📞", t:"Counsellor Calls",      d:"Our academic counsellor calls within 24 hours to understand your child's exact needs.",    color:"#14532D" },
    { n:"03", icon:"📍", t:"Location Verified",     d:"We confirm your exact area in Nagpur and match tutor availability near your home.",        color:"#7C2D12" },
    { n:"04", icon:"🎓", t:"Tutor Matched",          d:"2–3 vetted tutors near you are shortlisted — you choose who you're comfortable with.",     color:"#581C87" },
    { n:"05", icon:"🏠", t:"Sessions Begin",         d:"One-to-one classes at your home, on your schedule, at your pace. Zero commute.",           color:"#0C4A6E" },
  ];

  const [active, setActive]   = useState(null);
  const [cursorPos, setCursor] = useState({ x: 0, y: 0 });
  const [cursorVis, setCursorVis] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setCursorVis(true)}
      onMouseLeave={() => { setCursorVis(false); setActive(null); }}
      style={{ background:"#06091A", padding:"80px 1.5rem", position:"relative", overflow:"hidden", cursor:"none" }}
    >
      <style>{`
        @keyframes cursorPulse {
          0%,100% { transform:translate(-50%,-50%) scale(1); opacity:.9; }
          50%      { transform:translate(-50%,-50%) scale(1.18); opacity:.6; }
        }
        @keyframes stepReveal {
          from { opacity:0; transform:translateY(32px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes lineGrow {
          from { width:0; }
          to   { width:100%; }
        }
        @keyframes floatOrb {
          0%,100% { transform:translateY(0) scale(1); }
          50%      { transform:translateY(-18px) scale(1.05); }
        }
        .hiw-step-card {
          position:relative; border-radius:20px;
          padding:32px 24px; text-align:center;
          transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s, border-color .25s;
          cursor:none;
          animation: stepReveal .7s cubic-bezier(.22,1,.36,1) both;
        }
        .hiw-step-card:hover {
          transform: translateY(-10px) scale(1.025);
        }
        .hiw-step-num {
          transition: all .3s;
        }
        .hiw-step-card:hover .hiw-step-num {
          transform: scale(1.12);
          box-shadow: 0 0 0 6px rgba(212,160,23,.2), 0 0 24px 4px rgba(212,160,23,.3);
        }
        .hiw-cta-btn {
          transition: transform .2s, box-shadow .2s;
        }
        .hiw-cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 36px rgba(212,160,23,.5) !important;
        }
      `}</style>

      {/* Custom cursor */}
      {cursorVis && (
        <div style={{
          position:"absolute", left:cursorPos.x, top:cursorPos.y,
          width:40, height:40, borderRadius:"50%", pointerEvents:"none", zIndex:50,
          background:`radial-gradient(circle, rgba(212,160,23,.7) 0%, rgba(212,160,23,.0) 70%)`,
          transform:"translate(-50%,-50%)",
          animation:"cursorPulse 2s ease-in-out infinite",
          transition:"left .08s ease-out, top .08s ease-out",
        }}/>
      )}
      {cursorVis && (
        <div style={{
          position:"absolute", left:cursorPos.x, top:cursorPos.y,
          width:10, height:10, borderRadius:"50%", pointerEvents:"none", zIndex:51,
          background:C.gold, transform:"translate(-50%,-50%)",
          boxShadow:`0 0 10px ${C.gold}`,
          transition:"left .04s ease-out, top .04s ease-out",
        }}/>
      )}

      {/* Background floating orbs */}
      <div style={{position:"absolute",top:"10%",left:"5%",width:220,height:220,borderRadius:"50%",background:"radial-gradient(circle,rgba(212,160,23,.05) 0%,transparent 70%)",animation:"floatOrb 7s ease-in-out infinite",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"12%",right:"6%",width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,rgba(11,31,78,.6) 0%,transparent 70%)",animation:"floatOrb 9s ease-in-out infinite .5s",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"50%",right:"18%",width:140,height:140,borderRadius:"50%",background:"radial-gradient(circle,rgba(212,160,23,.04) 0%,transparent 70%)",animation:"floatOrb 6s ease-in-out infinite 1s",pointerEvents:"none"}}/>

      <div style={{ maxWidth:1060, margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* Section header */}
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(212,160,23,.1)", border:"1px solid rgba(212,160,23,.25)", borderRadius:30, padding:"6px 18px", marginBottom:16 }}>
            <span style={{ color:C.gold, fontSize:10, fontWeight:700, letterSpacing:".2em", textTransform:"uppercase", fontFamily:"sans-serif" }}>Simple Process</span>
          </div>
          <h2 style={{ color:C.white, fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:700, fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 8px" }}>How It Works</h2>
          <div style={{ width:48, height:3, background:`linear-gradient(to right,${C.gold},${C.goldLight})`, borderRadius:2, margin:"10px auto 16px" }}/>
          <p style={{ color:"#4A6080", fontFamily:"sans-serif", fontSize:14, maxWidth:480, margin:"0 auto" }}>From enquiry to your first home session — 5 effortless steps. Hover each step to explore.</p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div style={{ display:"none" }} className="hiw-desktop-row">
        </div>

        {/* Steps grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:16, marginBottom:52 }}>
          {STEPS.map((s, i) => {
            const isActive = active === i;
            return (
              <div
                key={i}
                className="hiw-step-card"
                onMouseEnter={() => setActive(i)}
                style={{
                  background: isActive
                    ? `linear-gradient(145deg,${s.color}cc,${s.color}88)`
                    : "rgba(255,255,255,.04)",
                  border: isActive
                    ? `1.5px solid rgba(212,160,23,.55)`
                    : "1.5px solid rgba(255,255,255,.07)",
                  boxShadow: isActive
                    ? `0 20px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(212,160,23,.2), inset 0 1px 0 rgba(255,255,255,.1)`
                    : "0 4px 20px rgba(0,0,0,.3)",
                  animationDelay: `${i * .12}s`,
                }}
              >
                {/* Connector line — only after each step except last, desktop feel */}
                {i < STEPS.length - 1 && (
                  <div style={{ position:"absolute", top:44, right:-8, width:16, height:2, background:isActive ? C.gold : "rgba(212,160,23,.2)", transition:"background .3s", zIndex:2, display:"none" }} className="hiw-connector"/>
                )}

                {/* Step number circle */}
                <div className="hiw-step-num" style={{
                  width:52, height:52, borderRadius:"50%", margin:"0 auto 14px",
                  background: isActive
                    ? `linear-gradient(135deg,${C.gold},${C.goldLight})`
                    : `rgba(212,160,23,.12)`,
                  border: isActive ? "none" : `1.5px solid rgba(212,160,23,.25)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700,
                  fontSize:13, color: isActive ? C.navyDeep : C.gold,
                }}>
                  {s.n}
                </div>

                {/* Icon */}
                <div style={{ fontSize:26, marginBottom:10, filter: isActive ? "drop-shadow(0 0 8px rgba(212,160,23,.5))" : "none", transition:"filter .3s" }}>
                  {s.icon}
                </div>

                {/* Title */}
                <div style={{
                  fontSize:14.5, fontWeight:700,
                  color: isActive ? C.white : "#8899AA",
                  fontFamily:"'Playfair Display',Georgia,serif",
                  marginBottom:10, transition:"color .25s",
                }}>
                  {s.t}
                </div>

                {/* Description */}
                <div style={{
                  fontSize:12, color: isActive ? "rgba(255,255,255,.78)" : "rgba(255,255,255,.28)",
                  fontFamily:"sans-serif", lineHeight:1.7, transition:"color .25s",
                }}>
                  {s.d}
                </div>

                {/* Active glow bottom bar */}
                {isActive && (
                  <div style={{
                    position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)",
                    width:"60%", height:2,
                    background:`linear-gradient(to right,transparent,${C.gold},transparent)`,
                    borderRadius:2,
                  }}/>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign:"center" }}>
          <button
            onClick={() => setPage("inquiry")}
            className="hiw-cta-btn"
            style={{
              background:`linear-gradient(135deg,${C.gold},${C.goldLight})`,
              color:C.navyDeep, border:"none", borderRadius:12,
              padding:"16px 44px", fontSize:15, fontWeight:700,
              cursor:"none", fontFamily:"sans-serif",
              boxShadow:"0 6px 28px rgba(212,160,23,.4)",
            }}
          >
            📞 Book Free Counselling Session →
          </button>
          <p style={{ color:"#2A3A50", fontFamily:"sans-serif", fontSize:12, marginTop:12 }}>Free · No commitment · Response within 24 hours</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Home ──────────────────────────────────────────────────────────── */
function Home({ setPage }) {
  return (
    <div>
      {/* Hero */}
      <div style={{background:`linear-gradient(150deg,${C.navyDeep} 0%,#0D1F52 45%,#112060 75%,#0B1A44 100%)`,padding:"88px 1.5rem 72px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        {/* Decorative background elements */}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:800,height:800,borderRadius:"50%",border:`1px solid ${C.gold}07`,pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:560,height:560,borderRadius:"50%",border:`1px solid ${C.gold}09`,pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:340,height:340,borderRadius:"50%",border:`1px solid ${C.gold}06`,pointerEvents:"none"}}/>
        {/* Diagonal light sweep */}
        <div style={{position:"absolute",top:0,left:"-30%",width:"60%",height:"100%",background:"linear-gradient(105deg,transparent 0%,rgba(212,160,23,.03) 50%,transparent 100%)",pointerEvents:"none",transform:"skewX(-15deg)"}}/>
        {/* Corner accent dots */}
        <div style={{position:"absolute",top:32,right:48,width:6,height:6,borderRadius:"50%",background:C.gold,opacity:.35,pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:60,right:72,width:3,height:3,borderRadius:"50%",background:C.gold,opacity:.25,pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:40,left:52,width:5,height:5,borderRadius:"50%",background:C.gold,opacity:.3,pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:70,left:78,width:3,height:3,borderRadius:"50%",background:C.gold,opacity:.2,pointerEvents:"none"}}/>

        <style>{`
          @keyframes heroFadeUp {
            from { opacity:0; transform:translateY(24px); }
            to   { opacity:1; transform:translateY(0); }
          }
          @keyframes goldPulse {
            0%,100% { text-shadow: 0 0 20px rgba(212,160,23,.0); }
            50%      { text-shadow: 0 0 40px rgba(212,160,23,.4), 0 0 80px rgba(212,160,23,.15); }
          }
          @keyframes badgeShimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .hero-h1-anim { animation: heroFadeUp .8s cubic-bezier(.22,1,.36,1) .25s both; }
          .hero-p-anim  { animation: heroFadeUp .8s cubic-bezier(.22,1,.36,1) .45s both; }
          .hero-cta-anim{ animation: heroFadeUp .8s cubic-bezier(.22,1,.36,1) .6s both; }
          .hero-chip-anim{ animation: heroFadeUp .8s cubic-bezier(.22,1,.36,1) .75s both; }
          .hero-cta-primary:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(212,160,23,.55) !important; }
          .hero-cta-primary { transition:transform .2s,box-shadow .2s; }
          .hero-cta-secondary:hover { background:rgba(255,255,255,.1) !important; border-color:rgba(255,255,255,.5) !important; transform:translateY(-2px); }
          .hero-cta-secondary { transition:all .2s; }
          .board-chip:hover { background:rgba(212,160,23,.2) !important; border-color:rgba(212,160,23,.7) !important; transform:translateY(-1px); color:#F0B429 !important; }
          .board-chip { transition:all .2s; }
        `}</style>

        <div style={{maxWidth:860,margin:"0 auto",position:"relative",zIndex:1}}>

          {/* Logo — animated */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:32}}>
            <Logo size="xl" onClick={()=>{}}/>
          </div>

          {/* Premium badge */}
          <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:28,
            background:`linear-gradient(135deg,rgba(212,160,23,.18),rgba(212,160,23,.08))`,
            border:`1px solid rgba(212,160,23,.4)`,borderRadius:40,padding:"9px 24px",
            backdropFilter:"blur(8px)"}}>
            <span style={{color:C.gold,fontSize:11,fontWeight:700,letterSpacing:".2em",textTransform:"uppercase",fontFamily:"sans-serif"}}>Backed by Momentum Nagpur</span>
            <span style={{color:`${C.gold}60`,fontSize:10}}>|</span>
            <span style={{color:C.goldLight,fontSize:11,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",fontFamily:"sans-serif"}}>22 Years of Excellence</span>
          </div>

          {/* ── HERO HEADLINE — premium, clean, no awkward gaps ── */}
          <div className="hero-h1-anim">
            <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:700,color:C.white,fontSize:"clamp(1.9rem,5.2vw,3.4rem)",lineHeight:1.2,marginBottom:10}}>
              Expert Home Tutoring
            </div>

            {/* Gold divider pill */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:12}}>
              <div style={{height:1,width:48,background:`linear-gradient(to right,transparent,${C.gold}88)`}}/>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.gold,opacity:.8}}/>
              <div style={{height:1,width:48,background:`linear-gradient(to left,transparent,${C.gold}88)`}}/>
            </div>

            {/* Class range — large gold */}
            <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:700,
              color:C.gold,fontSize:"clamp(2rem,5.5vw,3.6rem)",lineHeight:1.1,marginBottom:6,
              animation:"goldPulse 4s ease-in-out infinite"}}>
              Class 6 to 12
            </div>

            {/* Boards row 1: CBSE & State Board */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",gap:"0 14px",
              fontFamily:"'Playfair Display',Georgia,serif",fontWeight:600,
              color:"#CBD5E0",fontSize:"clamp(1rem,2.6vw,1.55rem)",lineHeight:1.4,marginBottom:4}}>
              <span>CBSE</span>
              <span style={{color:`${C.gold}55`,fontWeight:300,margin:"0 2px"}}>·</span>
              <span>State Board</span>
            </div>

            {/* Boards row 2: JEE & NEET */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",gap:"0 14px",
              fontFamily:"'Playfair Display',Georgia,serif",fontWeight:600,
              color:"#CBD5E0",fontSize:"clamp(1rem,2.6vw,1.55rem)",lineHeight:1.4,marginBottom:8}}>
              <span>JEE</span>
              <span style={{color:`${C.gold}55`,fontWeight:300,margin:"0 2px"}}>·</span>
              <span>NEET</span>
            </div>

            {/* One to One tagline — italic gold */}
            <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:500,fontStyle:"italic",
              color:C.goldLight,fontSize:"clamp(.95rem,2.4vw,1.35rem)",letterSpacing:".02em",marginTop:8}}>
              One to One &nbsp;·&nbsp; At Your Doorstep
            </div>
          </div>

          <p className="hero-p-anim" style={{color:"#94A3B8",fontSize:"clamp(.95rem,2vw,1.08rem)",maxWidth:560,margin:"18px auto 6px",fontFamily:"sans-serif",lineHeight:1.8}}>
            Personalised coaching at your home — by Momentum-vetted educators across every area of Nagpur.
          </p>
          <p style={{color:`${C.goldLight}99`,fontSize:12.5,fontFamily:"sans-serif",marginBottom:34,animation:"heroFadeUp .8s .5s both"}}>
            📍 Dharampeth · Sadar · Wardhaman Nagar · Civil Lines · Bajaj Nagar · and all areas across Nagpur
          </p>

          <div className="hero-cta-anim" style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:30}}>
            <button onClick={()=>setPage("inquiry")} className="hero-cta-primary"
              style={{background:`linear-gradient(135deg,${C.gold},${C.goldLight})`,color:C.navyDeep,border:"none",borderRadius:10,padding:"16px 36px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif",boxShadow:"0 4px 24px rgba(212,160,23,.45)"}}>
              📞 Book Free Counselling Session
            </button>
            <button onClick={()=>setPage("courses")} className="hero-cta-secondary"
              style={{background:"transparent",color:C.white,border:`2px solid rgba(255,255,255,.28)`,borderRadius:10,padding:"16px 28px",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"sans-serif"}}>
              View Courses →
            </button>
          </div>

          {/* Clickable board chips */}
          <div className="hero-chip-anim">
            <p style={{color:"#4B6280",fontFamily:"sans-serif",fontSize:12,marginBottom:10}}>⬇ Click to jump to your board and select subjects</p>
            <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
              {[
                {l:"Class 6–10 State Board",key:"sb610"},{l:"Class 6–10 CBSE",key:"cbse610"},
                {l:"Class 11–12 State Board",key:"sb1112"},{l:"Class 11–12 CBSE",key:"cbse1112"},
                {l:"JEE",key:"jee"},{l:"NEET",key:"neet"},
              ].map(chip=>(
                <button key={chip.key} className="board-chip" onClick={()=>{ scrollTo("boards-section"); }}
                  style={{background:`rgba(255,255,255,.07)`,border:`1.5px solid rgba(212,160,23,.38)`,borderRadius:30,padding:"8px 20px",color:"#A8C0D4",fontSize:12.5,fontFamily:"sans-serif",fontWeight:600,cursor:"pointer"}}>
                  {chip.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{background:`linear-gradient(135deg,${C.navyDeep},#0A1840)`,borderBottom:`1px solid rgba(212,160,23,.25)`,borderTop:`1px solid rgba(212,160,23,.15)`,padding:"28px 1.5rem"}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:16}}>
          {[[22,"+","Years Legacy"],[10000,"+","Students Mentored"],[500,"+","JEE/NEET Ranks"],[150,"+","Expert Tutors"]].map(([n,s,l])=>(
            <div key={l} style={{textAlign:"center",padding:"4px 12px"}}>
              <div style={{color:C.gold,fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",letterSpacing:"-.01em"}}>
                <Counter target={n} suffix={s}/>
              </div>
              <div style={{color:"#4A6080",fontSize:11,fontFamily:"sans-serif",marginTop:3,letterSpacing:".08em",textTransform:"uppercase"}}>{l}</div>
            </div>
          ))}
          <div style={{textAlign:"center",padding:"4px 12px"}}>
            <div style={{color:C.gold,fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif"}}>All</div>
            <div style={{color:"#4A6080",fontSize:11,fontFamily:"sans-serif",marginTop:3,letterSpacing:".08em",textTransform:"uppercase"}}>Nagpur Areas</div>
          </div>
        </div>
      </div>

      {/* Area ticker */}
      <div style={{background:C.navy,padding:"10px 0",overflow:"hidden",borderBottom:`1px solid ${C.gold}30`}}>
        <div style={{display:"flex",gap:0,animation:"ticker 32s linear infinite",whiteSpace:"nowrap"}}>
          {[...AREAS,...AREAS].map((a,i)=>(
            <span key={i} style={{color:"#94A3B8",fontFamily:"sans-serif",fontSize:13,padding:"0 18px"}}>
              <span style={{color:C.gold,marginRight:7}}>📍</span>{a}
            </span>
          ))}
        </div>
        <style>{`@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      </div>

      {/* Premium boards section — MOVED UP above Why section */}
      <div style={{background:C.white,padding:"60px 1.5rem"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <H2>Choose Your Board or Entrance Exam</H2><Line/>
          <p style={{fontFamily:"sans-serif",color:C.muted,fontSize:14,marginBottom:32,maxWidth:620}}>
            Select your board below — explore all subjects and topics chapter by chapter, pick exactly what you need, and submit your enquiry in 3 easy steps.
          </p>
          <BoardEnquiryWidget/>
        </div>
      </div>

      {/* Why section — MOVED DOWN below boards section */}
      <WhySlider setPage={setPage}/>

      {/* Features slider */}
      <FeaturesSlider setPage={setPage}/>

      {/* How It Works — Premium cursor-interactive timeline */}
      <HowItWorks setPage={setPage}/>

      {/* Testimonials */}
      <div style={{background:C.white,padding:"60px 1.5rem"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <H2>What Parents & Students Say</H2><Line/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20}}>
            {[
              {name:"Suresh Mehta",child:"Rohan – JEE 2024",text:"My son got AIR 2,847 in JEE Mains. The 1 to 1 home tutor covered everything — personalised attention made all the difference.",stars:5},
              {name:"Asha Deshpande",child:"Prachi – NEET 2024",text:"Prachi scored 680+ and got into a government medical college. The DPPs and test series were incredibly effective.",stars:5},
              {name:"Ravi Joshi",child:"Ananya – Class 10 State Board",text:"Ananya scored 92% in science. The tutor came to our home in Wardhaman Nagar — so convenient and genuinely effective.",stars:5},
              {name:"Kavita Rao",child:"Dev – Class 11 CBSE Physics",text:"Dev was struggling with Physics but after 3 months of home tutoring he was top of his class. Highly recommend!",stars:5},
            ].map(t=>(
              <div key={t.name} style={{background:C.off,borderRadius:14,padding:"24px 20px",border:`1px solid ${C.border}`,transition:"box-shadow .2s"}}>
                <Stars n={t.stars}/>
                <p style={{fontSize:13.5,color:C.muted,fontFamily:"sans-serif",lineHeight:1.8,margin:"12px 0 14px"}}>"{t.text}"</p>
                <div style={{fontSize:14,fontWeight:700,color:C.navy}}>{t.name}</div>
                <div style={{fontSize:12,color:C.gold,fontFamily:"sans-serif",fontWeight:600}}>{t.child}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gold CTA */}
      <div style={{background:`linear-gradient(135deg,${C.gold},#A87800)`,padding:"52px 1.5rem",textAlign:"center"}}>
        <div style={{maxWidth:580,margin:"0 auto"}}>
          <h2 style={{color:C.navyDeep,fontSize:"clamp(1.4rem,3vw,2rem)",fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",margin:"0 0 12px"}}>Start with a Free Counselling Session</h2>
          <p style={{color:"#3D2A00",fontFamily:"sans-serif",marginBottom:28,fontSize:15}}>No fee, no commitment. Our counsellor calls within 24 hours and guides you to the right tutor and plan.</p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>setPage("inquiry")} style={{background:C.navyDeep,color:C.white,border:"none",borderRadius:8,padding:"14px 30px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif"}}>Book Counselling Session</button>
            <a href="https://wa.me/918010373753" style={{background:"#25D366",color:C.white,textDecoration:"none",borderRadius:8,padding:"14px 26px",fontSize:15,fontWeight:700,fontFamily:"sans-serif"}}>💬 WhatsApp Now</a>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{background:C.white,padding:"60px 1.5rem"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <H2>Frequently Asked Questions</H2><Line/><FAQBox/>
        </div>
      </div>
    </div>
  );
}

/* ─── About ──────────────────────────────────────────────────────────── */
function About({ setPage }) {
  return (
    <div>
      <div style={{background:`linear-gradient(135deg,${C.navyDeep},${C.navy})`,padding:"52px 1.5rem 40px",textAlign:"center"}}>
        <h1 style={{color:C.white,fontSize:"clamp(1.7rem,4vw,2.7rem)",fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",margin:"0 0 12px"}}>About 1 to 1 Home Tutors</h1>
        <p style={{color:"#94A3B8",maxWidth:520,margin:"0 auto",fontFamily:"sans-serif",lineHeight:1.75}}>Backed by Momentum Nagpur — 22 years of coaching excellence, now at your doorstep</p>
      </div>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"56px 1.5rem"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:44}}>
          <div>
            <H2>22 Years. 10,000 Students. One Mission.</H2><Line/>
            <p style={{fontFamily:"sans-serif",color:C.muted,lineHeight:1.85,fontSize:14,marginBottom:14}}>Momentum Nagpur was founded in 2002 with a single mission — to provide world-class coaching to students across Nagpur. Over 22 years, we have mentored 10,000+ students and helped 500+ secure seats in IITs and top medical colleges.</p>
            <p style={{fontFamily:"sans-serif",color:C.muted,lineHeight:1.85,fontSize:14,marginBottom:22}}><strong style={{color:C.navy}}>1 to 1 Home Tutors</strong> brings the same quality, vetted educators, and proven methodology directly to your home — Class 6 to 12, both boards, JEE and NEET, across every area of Nagpur.</p>
            <button onClick={()=>setPage("inquiry")} style={{background:C.navy,color:C.white,border:"none",borderRadius:8,padding:"12px 26px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif"}}>Book Free Counselling</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[["22+","Years Legacy"],["10,000+","Students"],["500+","JEE/NEET Ranks"],["150+","Tutors"],["Class 6–12","All Classes"],["All Nagpur","Areas Covered"]].map(([v,l])=>(
              <div key={l} style={{background:C.navy,borderRadius:12,padding:"20px 16px",textAlign:"center"}}>
                <div style={{color:C.gold,fontSize:"clamp(1rem,2.5vw,1.5rem)",fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif"}}>{v}</div>
                <div style={{color:"#94A3B8",fontSize:11.5,fontFamily:"sans-serif",marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{background:C.navy,padding:"50px 1.5rem"}}>
        <div style={{maxWidth:760,margin:"0 auto",textAlign:"center"}}>
          <H2 light>Our Mission</H2><Line light/>
          <p style={{color:"#94A3B8",fontFamily:"sans-serif",lineHeight:1.85,fontSize:14.5}}>To make quality one-to-one education accessible to every student in Nagpur — from Class 6 through competitive exams — across every locality, regardless of whether they can travel to a coaching centre.</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Courses — Board enquiry at top, then standard courses below ───── */
function Courses({ setPage }) {
  const [ft,setFt]=useState("All");
  const types=["All","Long Term","Short Term","Flexible"];
  const shown=ft==="All"?COURSES:COURSES.filter(c=>c.type===ft);
  return (
    <div>
      {/* Board-wise enquiry FIRST */}
      <div style={{background:C.white,padding:"52px 1.5rem 40px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:C.goldPale,border:`1.5px solid ${C.gold}`,borderRadius:10,padding:"10px 18px",marginBottom:24}}>
            <span style={{fontSize:20}}>⭐</span>
            <span style={{color:"#7A5C00",fontFamily:"sans-serif",fontSize:14,fontWeight:700}}>Best way to enquire — select your exact board, class, subjects and chapters below</span>
          </div>
          <H2>Enquire by Board, Class & Subject</H2><Line/>
          <p style={{fontFamily:"sans-serif",color:C.muted,fontSize:14,marginBottom:28,maxWidth:620}}>
            Choose your board, class, and subjects. Pick specific chapters if needed. Submit your enquiry — our counsellor will call within 24 hours with a personalised plan and pricing.
          </p>
          <BoardEnquiryWidget/>
        </div>
      </div>

      {/* Divider */}
      <div style={{background:C.off,padding:"10px 1.5rem"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",gap:12}}>
          <div style={{flex:1,height:1,background:C.border}}/>
          <span style={{fontFamily:"sans-serif",fontSize:12,color:C.muted,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase"}}>OR choose from our packaged programmes below</span>
          <div style={{flex:1,height:1,background:C.border}}/>
        </div>
      </div>

      {/* Standard courses */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"40px 1.5rem 60px"}}>
        <H2>Packaged Courses & Programmes</H2><Line/>
        <div style={{background:C.goldPale,border:`1px solid ${C.gold}55`,borderRadius:10,padding:"12px 18px",fontFamily:"sans-serif",fontSize:13,color:"#7A5C00",marginBottom:24,display:"inline-flex",alignItems:"center",gap:8}}>
          <span>💡</span><span><strong>Fees not listed here.</strong> Pricing is personalised and shared on your free counselling call.</span>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:28,background:C.off,borderRadius:10,padding:6,width:"fit-content"}}>
          {types.map(t=><button key={t} onClick={()=>setFt(t)} style={{background:ft===t?C.navy:"transparent",color:ft===t?C.white:C.muted,border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontSize:13,fontFamily:"sans-serif",fontWeight:600}}>{t}</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
          {shown.map(c=>(
            <div key={c.id} style={{background:c.hi?C.navy:C.white,border:c.hi?`2px solid ${C.gold}`:`1px solid ${C.border}`,borderRadius:14,padding:24,position:"relative",transition:"transform .2s"}}>
              {c.hi&&<div style={{position:"absolute",top:-11,right:18,background:C.gold,color:C.navyDeep,fontSize:9.5,fontWeight:700,padding:"4px 12px",borderRadius:20,fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:".08em"}}>High Demand</div>}
              <div style={{fontSize:11,color:c.hi?C.goldLight:C.gold,fontFamily:"sans-serif",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>{c.type} · {c.dur}</div>
              <div style={{fontSize:17,fontWeight:700,color:c.hi?C.gold:C.navy,marginBottom:4,fontFamily:"'Playfair Display',Georgia,serif"}}>{c.title}</div>
              <div style={{fontSize:12,color:c.hi?"#94A3B8":C.muted,fontFamily:"sans-serif",marginBottom:8}}>🎓 {c.classes}</div>
              <p style={{fontSize:13,color:c.hi?"#94A3B8":C.muted,fontFamily:"sans-serif",lineHeight:1.7,marginBottom:12}}>{c.desc}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                {c.subs.map(s=><span key={s} style={{background:c.hi?"#FFFFFF15":C.goldPale,color:c.hi?"#CBD5E0":"#7A5C00",fontSize:10.5,padding:"3px 10px",borderRadius:20,fontFamily:"sans-serif",fontWeight:600}}>{s}</span>)}
              </div>
              <div style={{fontSize:12,color:c.hi?"#64748B":C.muted,fontFamily:"sans-serif",marginBottom:16}}>✅ DPPs · Test Series · Study Materials · Progress Reports</div>
              <button onClick={()=>setPage("inquiry")} style={{width:"100%",background:c.hi?C.gold:C.navy,color:c.hi?C.navyDeep:C.white,border:"none",borderRadius:8,padding:"11px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif"}}>Enquire — Pricing on Call</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



/* ─── Inquiry ────────────────────────────────────────────────────────── */
function Inquiry() {
  const [f, setF] = useState({
    name: "", parent: "", phone: "", email: "",
    class_: "", board: "", subjects: "", area: "",
    type: "Long Term", msg: ""
  });
  const [done, setDone]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const classes = [
    "Class 6","Class 7","Class 8","Class 9","Class 10",
    "Class 11","Class 12","JEE Mains","JEE Advanced","NEET"
  ];

  const handleSubmit = async () => {
    if (!f.name || !f.phone) {
      setErr("Please enter your name and phone number.");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      const result = await submitEnquiry(f);
      if (result.success) {
        setDone(true);
      } else {
        setErr("Something went wrong. Please WhatsApp us directly.");
      }
    } catch (e) {
      setErr("Network error. Please check your connection and try again.");
    }
    setLoading(false);
  };

  const wrapStyle = {
    maxWidth: 760,
    margin: "0 auto",
    padding: "52px 1.5rem"
  };

  const cardStyle = {
    background: C.white,
    borderRadius: 16,
    border: "1px solid " + C.border,
    padding: "36px 44px",
    boxShadow: "0 4px 24px rgba(0,0,0,.06)"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18
  };

  const noteStyle = {
    background: C.goldPale,
    border: "1px solid " + C.gold,
    borderRadius: 8,
    padding: "11px 16px",
    marginTop: 14,
    fontFamily: "sans-serif",
    fontSize: 13,
    color: "#7A5C00"
  };

  const errStyle = {
    background: "#FEF2F2",
    border: "1.5px solid #FCA5A5",
    borderRadius: 8,
    padding: "11px 16px",
    marginTop: 14,
    fontFamily: "sans-serif",
    fontSize: 13,
    color: "#991B1B"
  };

  const btnStyle = {
    marginTop: 18,
    width: "100%",
    background: loading ? "#94A3B8" : C.navy,
    color: C.white,
    border: "none",
    borderRadius: 8,
    padding: "14px",
    fontSize: 15,
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    fontFamily: "sans-serif",
    transition: "background .2s"
  };

  const successStyle = {
    background: C.greenBg,
    border: "1.5px solid #6EE7B7",
    borderRadius: 10,
    padding: "32px",
    textAlign: "center",
    color: C.green,
    fontFamily: "sans-serif"
  };

  const subStyle = {
    textAlign: "center",
    fontSize: 12,
    color: C.muted,
    fontFamily: "sans-serif",
    marginTop: 12
  };

  return (
    <div style={wrapStyle}>
      <H2>Book a Free Counselling Session</H2>
      <Line />
      <div style={cardStyle}>
        <p style={{ fontFamily: "sans-serif", color: C.muted, fontSize: 14, marginBottom: 26 }}>
          Fill in your details. Our counsellor calls within 24 hours — completely free, no commitment.
        </p>

        {done ? (
          <div style={successStyle}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
            <strong style={{ fontSize: 18 }}>Counselling Session Booked!</strong>
            <p style={{ margin: "12px 0 6px", fontSize: 14 }}>
              Our counsellor will call <strong>{f.phone}</strong> within 24 hours.
            </p>
            <p style={{ fontSize: 12, color: "#065f46" }}>
              Reference ID: 1T1-{Date.now().toString().slice(-6)}
            </p>
          </div>
        ) : (
          <div>
            <div style={gridStyle}>

              <div>
                <label style={LBL}>Student Name *</label>
                <input style={INP} type="text" placeholder="Full name"
                  value={f.name} onChange={set("name")} />
              </div>

              <div>
                <label style={LBL}>Parent Name</label>
                <input style={INP} type="text" placeholder="Parent / Guardian"
                  value={f.parent} onChange={set("parent")} />
              </div>

              <div>
                <label style={LBL}>Phone Number *</label>
                <input style={INP} type="tel" placeholder="+91 XXXXX XXXXX"
                  value={f.phone} onChange={set("phone")} />
              </div>

              <div>
                <label style={LBL}>Email</label>
                <input style={INP} type="email" placeholder="email@example.com"
                  value={f.email} onChange={set("email")} />
              </div>

              <div>
                <label style={LBL}>Class / Exam</label>
                <select style={INP} value={f.class_} onChange={set("class_")}>
                  <option value="">Select class or exam</option>
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={LBL}>Board</label>
                <select style={INP} value={f.board} onChange={set("board")}>
                  <option value="">Select board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="Maharashtra State Board">Maharashtra State Board</option>
                  <option value="JEE / NEET (Competitive)">JEE / NEET (Competitive)</option>
                </select>
              </div>

              <div>
                <label style={LBL}>Subjects Needed</label>
                <input style={INP} type="text" placeholder="e.g. Physics, Chemistry, Maths"
                  value={f.subjects} onChange={set("subjects")} />
              </div>

              <div>
                <label style={LBL}>Your Area in Nagpur</label>
                <select style={INP} value={f.area} onChange={set("area")}>
                  <option value="">Select your area</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LBL}>Course Type</label>
                <select style={INP} value={f.type} onChange={set("type")}>
                  <option value="Long Term">Long Term</option>
                  <option value="Short Term">Short Term</option>
                  <option value="Flexible / Single Subject">Flexible / Single Subject</option>
                </select>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LBL}>Additional Requirements</label>
                <textarea
                  style={{ border: "1.5px solid " + C.border, borderRadius: 8, padding: "10px 14px", fontSize: 14, fontFamily: "sans-serif", color: C.text, outline: "none", background: C.off, width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 80 }}
                  placeholder="Preferred schedule, specific topics, or any other info…"
                  value={f.msg}
                  onChange={set("msg")}
                />
              </div>

            </div>

            {err ? <div style={errStyle}>⚠️ {err}</div> : null}

            <div style={noteStyle}>
              💡 <strong>No fees during counselling.</strong> Pricing is personalised and shared on the call.
            </div>

            <button onClick={handleSubmit} disabled={loading} style={btnStyle}>
              {loading ? "⏳ Submitting — please wait..." : "Book Free Counselling Session"}
            </button>

            <p style={subStyle}>
              Or WhatsApp: <strong style={{ color: C.navy }}>+91 8010373753</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Join ───────────────────────────────────────────────────────────── */
function Join() {
  const [f, setF] = useState({
    name: "", phone: "", email: "", qual: "",
    subjects: "", classes: "", area: "", exp: "", avail: "", about: ""
  });
  const [done, setDone]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!f.name || !f.phone) {
      setErr("Please enter your name and phone number.");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      const result = await submitTutorApplication(f);
      if (result.success) {
        setDone(true);
      } else {
        setErr("Something went wrong. Please WhatsApp us directly.");
      }
    } catch (e) {
      setErr("Network error. Please check your connection and try again.");
    }
    setLoading(false);
  };

  const wrapStyle = {
    maxWidth: 760,
    margin: "0 auto",
    padding: "52px 1.5rem"
  };

  const cardStyle = {
    background: C.white,
    borderRadius: 16,
    border: "1px solid " + C.border,
    padding: "36px 44px"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18
  };

  const btnStyle = {
    marginTop: 20,
    width: "100%",
    background: loading ? "#94A3B8" : C.navy,
    color: C.white,
    border: "none",
    borderRadius: 8,
    padding: "14px",
    fontSize: 15,
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    fontFamily: "sans-serif"
  };

  const errStyle = {
    background: "#FEF2F2",
    border: "1.5px solid #FCA5A5",
    borderRadius: 8,
    padding: "11px 16px",
    marginTop: 14,
    fontFamily: "sans-serif",
    fontSize: 13,
    color: "#991B1B"
  };

  const successStyle = {
    background: C.greenBg,
    border: "1.5px solid #6EE7B7",
    borderRadius: 10,
    padding: "28px",
    textAlign: "center",
    color: C.green,
    fontFamily: "sans-serif"
  };

  const fields = [
    { l: "Full Name *",      k: "name",     p: "Your full name",            t: "text"   },
    { l: "Phone *",          k: "phone",    p: "+91 XXXXX XXXXX",           t: "tel"    },
    { l: "Email",            k: "email",    p: "email@example.com",         t: "email"  },
    { l: "Qualification",    k: "qual",     p: "e.g. M.Sc., B.Tech, B.Ed.", t: "text"   },
    { l: "Subjects",         k: "subjects", p: "Maths, Physics, English…",  t: "text"   },
    { l: "Experience (yrs)", k: "exp",      p: "Years of teaching",         t: "number" },
  ];

  return (
    <div style={wrapStyle}>
      <H2>Join as a Home Tutor</H2>
      <Line />
      <div style={{ background: C.navy, borderRadius: 12, padding: "18px 22px", marginBottom: 26, display: "flex", gap: 20, flexWrap: "wrap" }}>
        {["Flexible Hours", "Competitive Pay", "Momentum Brand Backing", "All Nagpur Areas"].map(b => (
          <div key={b} style={{ display: "flex", alignItems: "center", gap: 7, color: "#CBD5E0", fontFamily: "sans-serif", fontSize: 12.5 }}>
            <span style={{ color: C.gold }}>✦</span>{b}
          </div>
        ))}
      </div>
      <div style={cardStyle}>
        {done ? (
          <div style={successStyle}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
            <strong style={{ fontSize: 16 }}>Application Received!</strong>
            <p style={{ margin: "10px 0 6px", fontSize: 14 }}>Our team will review your profile within 48 hours.</p>
            <p style={{ fontSize: 12 }}>ID: 1T1-T-{Date.now().toString().slice(-6)}</p>
          </div>
        ) : (
          <div>
            <div style={gridStyle}>

              {fields.map(({ l, k, p, t }) => (
                <div key={k}>
                  <label style={LBL}>{l}</label>
                  <input style={INP} type={t} placeholder={p} value={f[k]} onChange={set(k)} />
                </div>
              ))}

              <div>
                <label style={LBL}>Classes / Exams</label>
                <input style={INP} type="text" placeholder="e.g. Class 6–10, JEE, NEET"
                  value={f.classes} onChange={set("classes")} />
              </div>

              <div>
                <label style={LBL}>Your Area</label>
                <select style={INP} value={f.area} onChange={set("area")}>
                  <option value="">Select area</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LBL}>Availability</label>
                <input style={INP} type="text" placeholder="e.g. Weekdays 4–8 PM, Weekends"
                  value={f.avail} onChange={set("avail")} />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LBL}>About You</label>
                <textarea
                  style={{ border: "1.5px solid " + C.border, borderRadius: 8, padding: "10px 14px", fontSize: 14, fontFamily: "sans-serif", color: C.text, outline: "none", background: C.off, width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 88 }}
                  placeholder="Background, teaching style, achievements…"
                  value={f.about}
                  onChange={set("about")}
                />
              </div>

            </div>

            {err ? <div style={errStyle}>⚠️ {err}</div> : null}

            <button onClick={handleSubmit} disabled={loading} style={btnStyle}>
              {loading ? "⏳ Submitting..." : "Submit Application"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Admin ──────────────────────────────────────────────────────────── */
function Admin() {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd]           = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [tab, setTab]           = useState("inquiries");
  const [enquiries, setEnquiries]   = useState([]);
  const [applications, setApps]     = useState([]);
  const [boardEnqs, setBoardEnqs]   = useState([]);
  const [loadingData, setLoadingData] = useState(false);
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "Momentum@2025";

  const tryUnlock = async () => {
    if (pwd === ADMIN_PASSWORD) {
      setUnlocked(true);
      setPwdError(false);
      setLoadingData(true);
      try {
        const { fetchEnquiries, fetchApplications, fetchBoardEnquiries } = await import("./submitHandlers");
        const [enqs, apps, bEnqs] = await Promise.all([
          fetchEnquiries(),
          fetchApplications(),
          fetchBoardEnquiries(),
        ]);
        setEnquiries(enqs);
        setApps(apps);
        setBoardEnqs(bEnqs);
      } catch (e) {
        console.error("Error loading data:", e);
      }
      setLoadingData(false);
    } else {
      setPwdError(true);
      setPwd("");
    }
  };

  const statusColors = {
    new:       { bg:"#DBEAFE", text:"#1E40AF" },
    contacted: { bg:"#FEF3C7", text:"#92400E" },
    assigned:  { bg:"#DCFCE7", text:"#166534" },
    pending:   { bg:"#DBEAFE", text:"#1E40AF" },
    review:    { bg:"#FEF3C7", text:"#92400E" },
    approved:  { bg:"#DCFCE7", text:"#166534" },
  };

  const getStatus = (s) => statusColors[s] || { bg:"#F3F4F6", text:"#374151" };

  const cardStyle = {
    background: C.white,
    border: "1px solid " + C.border,
    borderRadius: 12,
    padding: "18px 22px",
    marginBottom: 12
  };

  const nameStyle = { fontSize:15, fontWeight:700, color:C.navy };
  const idStyle   = { fontSize:12, color:C.muted, fontFamily:"sans-serif" };
  const metaStyle = { display:"flex", gap:18, flexWrap:"wrap", fontFamily:"sans-serif", fontSize:13, color:C.muted };

  if (!unlocked) {
    return (
      <div style={{ minHeight:"70vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
        <div style={{ background:C.white, borderRadius:20, border:"1px solid " + C.border, padding:"48px 40px", maxWidth:400, width:"100%", textAlign:"center", boxShadow:"0 8px 32px rgba(0,0,0,.08)" }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:C.navy, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:28 }}>🔒</div>
          <h2 style={{ color:C.navy, fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, marginBottom:6 }}>Admin Access</h2>
          <p style={{ color:C.muted, fontFamily:"sans-serif", fontSize:13, marginBottom:24 }}>Restricted to authorised team members only.</p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={pwd}
            onChange={e => { setPwd(e.target.value); setPwdError(false); }}
            onKeyDown={e => { if (e.key === "Enter") tryUnlock(); }}
            style={{ border: pwdError ? "1.5px solid #EF4444" : "1.5px solid " + C.border, borderRadius:8, padding:"12px 14px", fontSize:16, fontFamily:"sans-serif", color:C.text, outline:"none", background:C.off, width:"100%", boxSizing:"border-box", marginBottom: pwdError ? 8 : 16, textAlign:"center", letterSpacing:"0.15em" }}
          />
          {pwdError && <p style={{ color:"#EF4444", fontSize:12, fontFamily:"sans-serif", marginBottom:12 }}>Incorrect password. Please try again.</p>}
          <button onClick={tryUnlock}
            style={{ width:"100%", background:C.navy, color:C.white, border:"none", borderRadius:8, padding:"13px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"sans-serif" }}>
            Login to Dashboard
          </button>
          <p style={{ color:C.muted, fontSize:11, fontFamily:"sans-serif", marginTop:16 }}>
            Contact your web administrator if you forgot the password.
          </p>
        </div>
      </div>
    );
  }

  const totalEnqs = enquiries.length + boardEnqs.length;
  const newEnqs   = enquiries.filter(e => e.status === "new").length +
                    boardEnqs.filter(e => e.status === "new").length;

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"52px 1.5rem" }}>
      <H2>Admin Dashboard</H2><Line/>

      {loadingData ? (
        <div style={{ textAlign:"center", padding:"60px 0", fontFamily:"sans-serif", color:C.muted }}>
          ⏳ Loading live data from Firebase...
        </div>
      ) : (
        <div>
          {/* Metric cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))", gap:14, marginBottom:32 }}>
            {[
              [String(newEnqs),          "New Enquiries",         C.gold],
              [String(totalEnqs),        "Total Enquiries",       C.navy],
              [String(applications.length), "Tutor Applications", C.navyLight],
              [String(boardEnqs.length), "Board Widget Enquiries",C.navy],
            ].map(([v,l,col]) => (
              <div key={l} style={{ background:C.white, border:"1px solid " + C.border, borderRadius:12, padding:"17px 18px" }}>
                <div style={{ fontSize:28, fontWeight:700, color:col, fontFamily:"'Playfair Display',Georgia,serif" }}>{v}</div>
                <div style={{ fontSize:12, color:C.muted, fontFamily:"sans-serif", marginTop:3 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:8, marginBottom:24, background:C.off, borderRadius:10, padding:6, width:"fit-content", flexWrap:"wrap" }}>
            {[
              ["inquiries",    "Student Enquiries"],
              ["board",        "Board Enquiries"],
              ["applications", "Tutor Applications"],
            ].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ background:tab===id ? C.navy : "transparent", color:tab===id ? C.white : C.muted, border:"none", borderRadius:8, padding:"9px 16px", cursor:"pointer", fontSize:13, fontFamily:"sans-serif", fontWeight:600 }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Enquiries Tab ── */}
          {tab === "inquiries" && (
            <div>
              {enquiries.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px", color:C.muted, fontFamily:"sans-serif", background:C.white, borderRadius:12, border:"1px solid " + C.border }}>
                  No enquiries yet. When students submit the form they will appear here.
                </div>
              ) : enquiries.map(i => {
                const sc = getStatus(i.status);
                return (
                  <div key={i.id} style={cardStyle}>
                    <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:10 }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <span style={nameStyle}>{i.student_name || "Unknown"}</span>
                        <span style={idStyle}>1T1-{i.id.slice(-6).toUpperCase()}</span>
                      </div>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ background:sc.bg, color:sc.text, fontSize:11, fontWeight:700, padding:"3px 11px", borderRadius:20, fontFamily:"sans-serif" }}>
                          {i.status || "new"}
                        </span>
                        <span style={{ fontSize:12, color:C.muted, fontFamily:"sans-serif" }}>{i.created_at}</span>
                      </div>
                    </div>
                    <div style={metaStyle}>
                      <span>👤 {i.parent_name || "—"}</span>
                      <span>📞 {i.phone}</span>
                      <span>🎓 {i.class_selected || "—"}</span>
                      <span>📚 {i.board || "—"}</span>
                      <span>📖 {i.subjects || "—"}</span>
                      <span>📍 {i.area || "—"}</span>
                      <span>🗂 {i.course_type || "—"}</span>
                    </div>
                    {i.message && (
                      <div style={{ marginTop:8, fontFamily:"sans-serif", fontSize:13, color:C.muted, background:C.off, borderRadius:8, padding:"8px 12px" }}>
                        💬 {i.message}
                      </div>
                    )}
                    <div style={{ marginTop:10, display:"flex", gap:8 }}>
                      <a href={"tel:" + i.phone}
                        style={{ background:C.navy, color:C.white, textDecoration:"none", borderRadius:7, padding:"7px 16px", fontSize:12, fontWeight:700, fontFamily:"sans-serif" }}>
                        📞 Call Now
                      </a>
                      <a href={"https://wa.me/91" + i.phone.replace(/\D/g,"")}
                        target="_blank" rel="noreferrer"
                        style={{ background:"#25D366", color:C.white, textDecoration:"none", borderRadius:7, padding:"7px 16px", fontSize:12, fontWeight:700, fontFamily:"sans-serif" }}>
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Board Enquiries Tab ── */}
          {tab === "board" && (
            <div>
              {boardEnqs.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px", color:C.muted, fontFamily:"sans-serif", background:C.white, borderRadius:12, border:"1px solid " + C.border }}>
                  No board widget enquiries yet.
                </div>
              ) : boardEnqs.map(i => (
                <div key={i.id} style={cardStyle}>
                  <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:10 }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={nameStyle}>{i.name || "Unknown"}</span>
                      <span style={idStyle}>1T1-B-{i.id.slice(-6).toUpperCase()}</span>
                    </div>
                    <span style={{ fontSize:12, color:C.muted, fontFamily:"sans-serif" }}>{i.created_at}</span>
                  </div>
                  <div style={metaStyle}>
                    <span>📞 {i.phone}</span>
                    <span>📍 {i.area || "—"}</span>
                    <span>📋 {i.board_label || "—"}</span>
                    <span>🎓 {i.class_selected ? "Class " + i.class_selected : "—"}</span>
                  </div>
                  {i.topics_detail && (
                    <div style={{ marginTop:8, fontFamily:"sans-serif", fontSize:12.5, color:C.muted, background:C.off, borderRadius:8, padding:"8px 12px" }}>
                      📚 {i.topics_detail}
                    </div>
                  )}
                  <div style={{ marginTop:10, display:"flex", gap:8 }}>
                    <a href={"tel:" + (i.phone || "")}
                      style={{ background:C.navy, color:C.white, textDecoration:"none", borderRadius:7, padding:"7px 16px", fontSize:12, fontWeight:700, fontFamily:"sans-serif" }}>
                      📞 Call Now
                    </a>
                    <a href={"https://wa.me/91" + (i.phone || "").replace(/\D/g,"")}
                      target="_blank" rel="noreferrer"
                      style={{ background:"#25D366", color:C.white, textDecoration:"none", borderRadius:7, padding:"7px 16px", fontSize:12, fontWeight:700, fontFamily:"sans-serif" }}>
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Applications Tab ── */}
          {tab === "applications" && (
            <div>
              {applications.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px", color:C.muted, fontFamily:"sans-serif", background:C.white, borderRadius:12, border:"1px solid " + C.border }}>
                  No tutor applications yet.
                </div>
              ) : applications.map(a => {
                const sc = getStatus(a.status);
                return (
                  <div key={a.id} style={cardStyle}>
                    <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:10 }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <span style={nameStyle}>{a.name}</span>
                        <span style={idStyle}>1T1-T-{a.id.slice(-6).toUpperCase()}</span>
                      </div>
                      <span style={{ background:sc.bg, color:sc.text, fontSize:11, fontWeight:700, padding:"3px 11px", borderRadius:20, fontFamily:"sans-serif" }}>
                        {a.status || "pending"}
                      </span>
                    </div>
                    <div style={metaStyle}>
                      <span>📞 {a.phone}</span>
                      <span>🎓 {a.qualification || "—"}</span>
                      <span>📚 {a.subjects || "—"}</span>
                      <span>📋 {a.classes || "—"}</span>
                      <span>📍 {a.area || "—"}</span>
                      <span>⏳ {a.experience_years || "—"} yrs</span>
                    </div>
                    {a.about && (
                      <div style={{ marginTop:8, fontFamily:"sans-serif", fontSize:12.5, color:C.muted, background:C.off, borderRadius:8, padding:"8px 12px" }}>
                        {a.about}
                      </div>
                    )}
                    <div style={{ marginTop:10, display:"flex", gap:8 }}>
                    <a href={"tel:" + (a.phone || "")}
                      style={{ background:C.navy, color:C.white, textDecoration:"none", borderRadius:7, padding:"7px 16px", fontSize:12, fontWeight:700, fontFamily:"sans-serif" }}>
                      📞 Call Now
                    </a>
                    <a href={"https://wa.me/91" + (a.phone || "").replace(/\D/g,"")}
                      target="_blank" rel="noreferrer"
                      style={{ background:"#25D366", color:C.white, textDecoration:"none", borderRadius:7, padding:"7px 16px", fontSize:12, fontWeight:700, fontFamily:"sans-serif" }}>
                      💬 WhatsApp
                    </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop:32, background:C.goldPale, border:"1px solid " + C.gold, borderRadius:12, padding:"16px 20px", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"sans-serif", fontSize:13, color:"#7A5C00" }}>View full database, export data, and manage records:</span>
            <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer"
              style={{ background:C.navy, color:C.white, textDecoration:"none", borderRadius:8, padding:"9px 20px", fontFamily:"sans-serif", fontSize:13, fontWeight:700 }}>
              Open Firebase Console →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────── */
function Footer({ setPage }) {
  return (
    <footer style={{background:`linear-gradient(180deg,${C.navyDeep} 0%,#040B1E 100%)`,borderTop:`2px solid rgba(212,160,23,.35)`,padding:"54px 1.5rem 28px"}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:36,marginBottom:40}}>
        <div>
          <Logo onClick={()=>setPage("home")} size="md"/>
          <p style={{color:"#94A3B8",fontSize:13,fontFamily:"sans-serif",lineHeight:1.8,marginTop:16}}>Home tutoring for Class 6–12 (CBSE & State Board), JEE & NEET — serving every area of Nagpur. Backed by Momentum Nagpur.</p>
          <a href="https://wa.me/918010373753" style={{display:"inline-block",marginTop:14,background:"#25D366",color:C.white,textDecoration:"none",borderRadius:8,padding:"9px 18px",fontSize:12,fontWeight:700,fontFamily:"sans-serif"}}>💬 WhatsApp Us</a>
        </div>
        <div>
          <div style={{color:C.goldLight,fontWeight:700,marginBottom:16,fontFamily:"sans-serif",fontSize:12,letterSpacing:".12em",textTransform:"uppercase"}}>Quick Links</div>
          {[["home","Home"],["about","About Us"],["tutors","Find Tutors"],["courses","Courses"],["inquiry","Book Counselling"],["join","Join as Tutor"]].map(([id,label])=>(
            <div key={id} style={{marginBottom:10}}><button onClick={()=>setPage(id)} style={{color:"#94A3B8",background:"none",border:"none",cursor:"pointer",fontSize:13,fontFamily:"sans-serif",padding:0,transition:"color .2s"}}>{label}</button></div>
          ))}
        </div>
        <div>
          <div style={{color:C.goldLight,fontWeight:700,marginBottom:16,fontFamily:"sans-serif",fontSize:12,letterSpacing:".12em",textTransform:"uppercase"}}>Boards & Exams</div>
          {["Class 6–10 · State Board","Class 6–10 · CBSE","Class 11–12 · State Board (Science)","Class 11–12 · CBSE (Science)","JEE Mains & Advanced","NEET UG"].map(s=>(
            <div key={s} style={{color:"#94A3B8",fontSize:12.5,fontFamily:"sans-serif",marginBottom:9}}>
              <span style={{color:C.gold,marginRight:6}}>→</span>{s}
            </div>
          ))}
        </div>
        <div>
          <div style={{color:C.goldLight,fontWeight:700,marginBottom:16,fontFamily:"sans-serif",fontSize:12,letterSpacing:".12em",textTransform:"uppercase"}}>Contact</div>
          <div style={{color:"#94A3B8",fontSize:13,fontFamily:"sans-serif",lineHeight:2.2}}>
            <div>📍 Nagpur, Maharashtra — All Areas</div>
            <div>📞 +91 8010373753</div>
            <div>✉ 1to1hometutornagpur@gmail.com</div>
            <div>🕐 Mon–Sat, 9 AM – 7 PM</div>
          </div>
          <div style={{marginTop:16,background:`rgba(212,160,23,.1)`,border:`1px solid rgba(212,160,23,.25)`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{color:C.gold,fontSize:10.5,fontWeight:700,fontFamily:"sans-serif",letterSpacing:".14em",textTransform:"uppercase"}}>Backed by Momentum Nagpur</div>
            <div style={{color:"#94A3B8",fontSize:12,fontFamily:"sans-serif",marginTop:5}}>22 Years · Nagpur's Trusted Coaching Brand</div>
          </div>
        </div>
      </div>
      <div style={{borderTop:`1px solid rgba(255,255,255,.07)`,paddingTop:20,textAlign:"center",color:"#3D5070",fontSize:12,fontFamily:"sans-serif"}}>
        © 2024 1 to 1 Home Tutors · A Momentum Nagpur Initiative · All Rights Reserved
      </div>
    </footer>
  );
}

/* ─── Root ───────────────────────────────────────────────────────────── */
export default function App() {
  const [page,setPage]=useState("home");
  const sp = (p) => { setPage(p); window.scrollTo({top:0,behavior:"smooth"}); };
  return (
    <div style={{fontFamily:"'Playfair Display',Georgia,serif",background:C.off,minHeight:"100vh",color:C.text}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`
        * { box-sizing: border-box; }
        ::selection { background: rgba(212,160,23,.28); color: #D4A017; }
        html { scroll-behavior: smooth; }
        button { cursor: pointer; }
        /* Premium scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #060E2A; }
        ::-webkit-scrollbar-thumb { background: rgba(212,160,23,.4); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(212,160,23,.7); }
        /* Mobile hero adjustments */
        @media (max-width: 480px) {
          .hero-badge-wrap { flex-direction: column !important; gap: 4px !important; text-align: center; padding: 10px 16px !important; }
          .hero-badge-sep  { display: none !important; }
          .hero-cta-anim > button { width: 100% !important; justify-content: center; }
          .hero-chip-anim > div > button { font-size: 11px !important; padding: 6px 13px !important; }
          .hiw-step-card { padding: 22px 16px !important; }
        }
        @media (max-width: 600px) {
          .hero-cta-anim { flex-direction: column; align-items: center; }
          .hero-cta-anim > button { width: min(340px, 90vw) !important; }
        }
        /* Nav mobile: keep brand readable */
        @media (max-width: 360px) {
          .nav-brand-name { font-size: 15px !important; }
        }
      `}</style>
      <Nav page={page} setPage={sp}/>
      {page==="home"    && <Home    setPage={sp}/>}
      {page==="about"   && <About   setPage={sp}/>}
      {page==="courses" && <Courses setPage={sp}/>}
      {page==="inquiry" && <Inquiry/>}
      {page==="join"    && <Join/>}
      {page==="admin"   && <Admin/>}
      <Footer setPage={sp}/>
    </div>
  );
}