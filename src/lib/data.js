import {
  SiLinkedin,
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiRedux,
  SiFigma,
  SiMongodb,
  SiPrettier,
  FaBitbucket,
  SiFirebase,
  SiVercel,
  SiApollographql,
  SiAxios,
  SiReactquery,
  SiSass,
  SiCanva,
  SiClaude,
  SiMui,
  SiBootstrap,
  SiReacthookform,
  SiAndroidstudio,
  SiEslint,
  SiJira,
  SiVite,
  SiOpenai,
  SiGooglegemini,
  SiGithubcopilot,
  SiZod,
  SiGit,
  SiNetlify,
  SiGithubactions,
  SiPostman,
  SiBitbucket,
  SiGithub,
  SiGmail,
  SiFastapi,
} from "react-icons/si";
import { MdVerifiedUser } from "react-icons/md";

export const personalInfo = {
  name: "Vedant Gour",
  role: "Frontend Developer",
  tagline:
    "Building immersive web experiences with modern tools and creative vision.",
  logo: "/assets/main-logo2-white.png",
  resumePath: "/assets/resume.pdf",
  profileImage: "/assets/profile.jpg",
  email: "vedantgour45@gmail.com",
  about: [
    "I’m a Frontend Developer with 2+ years of experience building scalable, high-performance web applications using React.js and TypeScript. I specialize in creating responsive, accessible, and user-focused interfaces with modern tools like Redux, React Query, and Tailwind CSS. Passionate about clean architecture and performance optimization.",
    "With a growing interest in AI-powered tools, I combine creative design thinking with AI to enhance development speed, code quality, and overall productivity.",
  ],
  stats: [
    { label: "Projects", value: "10+" },
    { label: "Technologies", value: "15+" },
    { label: "GitHub Stars", value: "50+" },
  ],
};

export const socials = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/vedantgour45",
    icon: SiLinkedin,
  },
  { name: "GitHub", url: "https://github.com/vedantgour45", icon: SiGithub },
  { name: "Email", url: "mailto:vedantgour45@gmail.com", icon: SiGmail },
];

export const skillCategories = [
  {
    title: "Core Web Technologies",
    skills: [
      { name: "HTML", level: 95, icon: SiHtml5 },
      { name: "CSS", level: 90, icon: SiCss3 },
      { name: "JavaScript", level: 90, icon: SiJavascript },
      { name: "TypeScript", level: 80, icon: SiTypescript },
    ],
  },

  {
    title: "Frontend Frameworks & Libraries",
    skills: [
      { name: "React.js", level: 90, icon: SiReact },
      { name: "Next.js", level: 85, icon: SiNextdotjs },
      { name: "Redux Toolkit", level: 80, icon: SiRedux },
      { name: "React Query", level: 75, icon: SiReactquery },
      { name: "React Hook Form", level: 75, icon: SiReacthookform },
    ],
  },
  {
    title: "Styling & UI",
    skills: [
      { name: "SCSS / Sass", level: 75, icon: SiSass },
      { name: "Tailwind CSS", level: 95, icon: SiTailwindcss },
      { name: "Material UI", level: 75, icon: SiMui },
      { name: "Bootstrap", level: 75, icon: SiBootstrap },
    ],
  },
  {
    title: "UI/UX & Design Collaboration",
    skills: [
      { name: "Figma", level: 65, icon: SiFigma },
      { name: "Canva", level: 65, icon: SiCanva },
    ],
  },
  {
    title: "API & Data Handling",
    skills: [
      { name: "REST APIs", level: 85, icon: SiFastapi },
      { name: "GraphQL", level: 70, icon: SiApollographql },
      { name: "Axios", level: 90, icon: SiAxios },
      { name: "Postman", level: 85, icon: SiPostman },
    ],
  },
  {
    title: "Tools & Platforms",
    skills: [
      { name: "Vite", level: 85, icon: SiVite },
      { name: "GitHub", level: 90, icon: SiGithub },
      { name: "Bitbucket", level: 75, icon: SiBitbucket },
      { name: "Firebase", level: 75, icon: SiFirebase },
      { name: "Jira", level: 70, icon: SiJira },
      { name: "Android Studio", level: 70, icon: SiAndroidstudio },
    ],
  },
  {
    title: "Type Safety & Code Quality",
    skills: [
      { name: "ESLint", level: 80, icon: SiEslint },
      { name: "Prettier", level: 85, icon: SiPrettier },
      { name: "Zod", level: 70, icon: SiZod },
      { name: "Yup", level: 70, icon: MdVerifiedUser },
      { name: "Husky (Pre-commit Hooks)", level: 70, icon: SiGit },
    ],
  },
  {
    title: "Deployment",
    skills: [
      { name: "Vercel", level: 85, icon: SiVercel },
      { name: "Netlify", level: 80, icon: SiNetlify },
      { name: "Firebase Hosting", level: 75, icon: SiFirebase },
      {
        name: "GitHub Actions",
        level: 65,
        icon: SiGithubactions,
      },
    ],
  },
  {
    title: "AI & Productivity Tools",
    skills: [
      { name: "ChatGPT", level: 90, icon: SiOpenai },
      { name: "Claude", level: 90, icon: SiClaude },
      { name: "Gemini", level: 90, icon: SiGooglegemini },
      { name: "Github Copilot", level: 90, icon: SiGithubcopilot },
    ],
  },
];

export const projects = [
  {
    id: 1,
    title: "Movie Pulse",
    subtitle: "Movies & TV Shows App",
    description:
      "A feature-rich entertainment platform to explore movies and TV shows, featuring trailers, cast details, ratings, and trending categories powered by the TMDB API.",
    tech: ["React", "Redux Toolkit", "Sass", "Axios", "TMDB API"],
    image: "/assets/project-movix-new.png",
    demo: "https://movix-movies.netlify.app/",
    code: "https://github.com/vedantgour45/movie-app",
    slug: "movix",
  },
  {
    id: 2,
    title: "LinkedIn Clone",
    subtitle: "Professional Networking Platform",
    description:
      "A comprehensive LinkedIn replica featuring Google authentication, real-time posts with image/video sharing, and a fully responsive professional interface.",
    tech: ["React", "Redux", "Firebase", "Styled Components"],
    image: "/assets/project1-linkedin.png",
    demo: "https://aspire-linked.netlify.app/",
    code: "https://github.com/vedantgour45/linkedin-clone",
    slug: "linkedin",
  },
  {
    id: 3,
    title: "Type Flow",
    subtitle: "Typing Speed Test",
    description:
      "A professional typing test platform that evaluates WPM and accuracy across multiple time modes with interactive chart visualizations and custom themes.",
    tech: ["React", "Firebase", "Material UI", "Chart.js", "Styled Components"],
    image: "/assets/project2-typingtest.png",
    demo: "https://keys-to-success-typing-test.netlify.app/",
    code: "https://github.com/vedantgour45/typing-test-website",
    slug: "typingtest",
  },
  {
    id: 4,
    title: "Swift Suite",
    subtitle: "AI-Powered Utility & Content Suite",
    description:
      "A sophisticated multipurpose dashboard integrating 11+ high-performance tools for content creators and developers. It features deep article summarization via GPT-based APIs, cross-language translation, and real-time grammar correction. Built with a focus on UX, the app includes localized history tracking, custom QR generation with image export, and developer utilities like JSON formatting—all wrapped in a premium, glassmorphic grid interface with seamless state persistence.",
    tech: ["React.js", "RTK Query", "Tailwind CSS", "RapidAPI"],
    image: "/assets/project4-swiftsuite.png",
    demo: "https://tools-swiftsuite.netlify.app/",
    code: "https://github.com/vedantgour45/SwiftSuite",
    slug: "swiftsuite",
  },
  {
    id: 5,
    title: "Number Hunter",
    subtitle: "Logic-based Game",
    description:
      "A sleek, interactive number-guessing game featuring real-time feedback, high-score persistence, and dynamic visual effects like screen shakes and confetti.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "/assets/project5-numberHunter.png",
    demo: "https://guess-vg-number.netlify.app/",
    code: "https://github.com/vedantgour45/Guess-my-number-game",
    slug: "guess-my-number",
  },
  {
    id: 6,
    title: "Personal Portfolio",
    subtitle: "Cinematic Developer Showcase",
    description:
      "A high-performance, immersive portfolio featuring fluid GSAP and Framer Motion animations and a refined glassmorphic UI. Designed to provide a premium user experience while showcasing complex frontend architecture.",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    image: "/assets/project6-portfolio.png",
    demo: "https://portfolio-vedant-gour.netlify.app/",
    code: "https://github.com/vedantgour45/my-portfolio",
    slug: "portfolio",
  },
];

export const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];
