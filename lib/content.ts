// All words and facts on the site live here, so they can be checked and edited in one place.
// Rule from the plan: no invented facts. Anything marked TODO still needs Prameela's input.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://prameelagogada.com"
).replace(/\/$/, "");

export const person = {
  name: "Gogada Prameela",
  firstName: "Prameela",
  role: "ECE Student | Software & Embedded Projects",
  degree: "B.Tech ECE",
  classOf: 2027,
  college: "Avanthi Institute of Engineering & Technology",
  location: "Vizianagaram, Andhra Pradesh",
  email: "prameelagogada4@gmail.com",
  github: "https://github.com/prameela-ai",
  // TODO(Prameela): add your LinkedIn profile URL. Buttons for it appear once this is set.
  linkedin: null as string | null,
  resume: "/resume.pdf",
  resumeEmbedded: "/resume-embedded.pdf",
};

export const description =
  "Gogada Prameela is a final-year B.Tech ECE student (2027) building C, Python and CAN-bus projects, looking for software and embedded systems roles.";

// Same words as public/intro.vtt (the spoken intro).
export const introTranscript =
  "Hi, I'm Prameela, a final-year ECE student who builds software and hardware projects. Have a look around!";

// TODO(Prameela): rewrite these three sentences in your own words. Drafted from your resume.
export const aboutSentences = [
  "I'm a final-year Electronics and Communication Engineering student at Avanthi Institute of Engineering & Technology, graduating in 2027.",
  "My final-year project is a bench-top car network: a Raspberry Pi 4 and two ESP32-S3 boards on a real CAN bus, tested by an automated pytest suite.",
  "I write C and Python, and I build web pages with AI coding tools, reviewing and testing every change they make.",
];

// TODO(Prameela): replace with your own one-line motto (this is the plan's example).
export const motto = "From the first CAN frame to the last test report.";

// Back of the ID card (click the card to flip it).
export const cardBack = {
  title: "What I do",
  items: [
    { label: "Embedded C on Linux", detail: "SocketCAN · DBC decoding" },
    { label: "Test automation", detail: "Python · pytest · fault injection" },
    { label: "CAN networks", detail: "Raspberry Pi 4 · ESP32-S3" },
    { label: "AI-assisted web dev", detail: "Next.js · React · Tailwind" },
    { label: "98% in SSC", detail: "Z.P.H. School, Jami" },
  ],
};

export const quickFacts = [
  { label: "Based in", value: "Vizianagaram, AP" },
  { label: "Studying", value: "B.Tech ECE, Avanthi Institute" },
  { label: "Batch", value: "2023–27" },
  { label: "Focus", value: "Software and embedded systems" },
];

export type SkillFamily = "Languages" | "Web" | "AI" | "Hardware" | "Protocols" | "Tools";

export type Skill = {
  symbol: string;
  name: string;
  family: SkillFamily;
  used: string;
};

export const skillFamilies: SkillFamily[] = ["Languages", "Web", "AI", "Hardware", "Protocols", "Tools"];

// TODO(Prameela): check each "used" line is how you would describe it.
export const skills: Skill[] = [
  { symbol: "C", name: "C", family: "Languages", used: "Decoding speed, RPM and temperature from CAN frames with a DBC file on Linux SocketCAN." },
  { symbol: "Py", name: "Python", family: "Languages", used: "The pytest fault-injection suite and PASS/FAIL reports in my CAN project." },
  { symbol: "Ml", name: "MATLAB", family: "Languages", used: "Engineering coursework and lab work." },
  { symbol: "Js", name: "JavaScript", family: "Web", used: "Learning it by building this portfolio." },
  { symbol: "Re", name: "React", family: "Web", used: "Every section of this site is a React component." },
  { symbol: "Nx", name: "Next.js", family: "Web", used: "The framework behind this site: pre-rendered pages, metadata and sitemap." },
  { symbol: "Tw", name: "Tailwind CSS", family: "Web", used: "All the styling on this site." },
  { symbol: "Th", name: "Three.js", family: "Web", used: "The swinging 3D ID card in the About section (React Three Fiber + Rapier)." },
  { symbol: "Vc", name: "Vibe coding", family: "AI", used: "I built this site by prompting, then reviewing, testing and committing each change." },
  { symbol: "Cl", name: "Claude", family: "AI", used: "My main coding assistant in VS Code for this site." },
  { symbol: "Cp", name: "GitHub Copilot", family: "AI", used: "Code suggestions while writing and debugging." },
  { symbol: "Rp", name: "Raspberry Pi", family: "Hardware", used: "A Raspberry Pi 4 is the gateway node of my bench-top CAN network." },
  { symbol: "Es", name: "ESP32", family: "Hardware", used: "Two ESP32-S3 boards act as the engine and ABS control units (ECUs)." },
  { symbol: "Cn", name: "CAN", family: "Protocols", used: "A three-node CAN bus on the bench, read with SocketCAN and decoded with a DBC file." },
  { symbol: "Ua", name: "UART", family: "Protocols", used: "Learning through the CAN project hardware." },
  { symbol: "Sp", name: "SPI", family: "Protocols", used: "Learning through the CAN project hardware." },
  { symbol: "Ic", name: "I²C", family: "Protocols", used: "Learning through the CAN project hardware." },
  { symbol: "Lx", name: "Linux", family: "Tools", used: "SocketCAN and the C decoder run on Linux on the Raspberry Pi." },
  { symbol: "Gt", name: "Git", family: "Tools", used: "Every working step of this site is a Git commit." },
  { symbol: "Pt", name: "pytest", family: "Tools", used: "Fault injection (invalid values, missing messages) with PASS/FAIL reports." },
];

export const canProject = {
  short: "CAN validation platform",
  title: "Automated Validation and Anomaly Detection for In-Vehicle CAN Networks",
  meta: "Final-year project · Sep 2026 – Apr 2027 · in progress",
  summary:
    "A bench-top car network: a Raspberry Pi 4 gateway and two ESP32-S3 boards acting as engine and ABS control units talk over a real CAN bus. A C program on Linux SocketCAN decodes the signals from a DBC file, and an automated pytest suite injects faults and produces PASS/FAIL reports.",
  bullets: [
    "Three-node CAN network on the bench: Raspberry Pi 4 gateway plus two ESP32-S3 ECUs (engine and ABS).",
    "C program on Linux SocketCAN that decodes speed, RPM and temperature from a DBC file and flags out-of-range values.",
    "Automated pytest suite with fault injection (invalid values, missing messages) that generates PASS/FAIL reports.",
    "Next: machine-learning detection of spoofed CAN messages, and decoding a 433 MHz tyre-pressure sensor with an RTL-SDR.",
  ],
  tags: ["Embedded C", "Python", "Linux", "Raspberry Pi", "ESP32", "CAN", "pytest"],
  phases: [
    { name: "Phase 1", label: "CAN + validation", status: "In progress" },
    { name: "Phase 2", label: "ML anomaly detection", status: "Next" },
    { name: "Phase 3", label: "Radio + final report", status: "Later" },
  ],
};

export const portfolioProject = {
  short: "This portfolio",
  title: "This portfolio",
  meta: "Oct 2026 · in progress",
  summary:
    "A single-page site built through AI-assisted development: I write the prompts, then review, test and commit each change. It has a 3D ID card with physics, an AI-generated video intro and light image fallbacks for phones.",
  bullets: [
    "3D ID card on a lanyard with real physics (React Three Fiber + Rapier) that drops in on scroll and flips on click.",
    "AI-generated video intro with captions and a transcript; phones get a lighter clip and a flat card.",
    "SEO and AI-search basics: metadata, link-preview image, sitemap, structured data and llms.txt.",
    "Lighthouse on mobile: Performance 90+, Accessibility 100, Best Practices 100, SEO 100.",
  ],
  tags: ["Next.js", "React Three Fiber", "Tailwind CSS", "Vercel", "AI-assisted"],
};

export const projects = [
  { id: "can", ...canProject },
  { id: "portfolio", ...portfolioProject },
];

export const journey = [
  { when: "2020", title: "SSC (10th)", detail: "Z.P.H. School, Jami · 98%" },
  { when: "2022", title: "Intermediate (12th)", detail: "Punyagiri Junior College · 65%" },
  { when: "2023", title: "B.Tech ECE starts", detail: "Avanthi Institute of Engineering & Technology · 75% so far" },
  { when: "Sep 2026", title: "CAN project starts", detail: "Final-year project on in-vehicle CAN validation" },
  { when: "2027", title: "Graduation", detail: "B.Tech ECE, expected" },
];

// Sections 6 and 7 stay hidden until there is enough real content (2 courses, 3 achievements).
export const learning: { title: string; issuer: string; when: string }[] = [];
export const achievements: { value: string; label: string }[] = [];
export const showLearning = learning.length >= 2;
export const showAchievements = achievements.length >= 3;

export const sections = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "journey", label: "Journey" },
  ...(showLearning ? [{ id: "learning", label: "Learning" }] : []),
  ...(showAchievements ? [{ id: "achievements", label: "Achievements" }] : []),
  { id: "contact", label: "Contact" },
];

export function sectionNumber(id: string) {
  return String(sections.findIndex((s) => s.id === id) + 1).padStart(2, "0");
}
