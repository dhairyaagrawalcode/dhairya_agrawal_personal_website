"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  FiArrowRight,
  FiTerminal,
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiFolder,
  FiMessageSquare,
  FiTrendingUp,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiInstagram,
  FiCheckCircle,
  FiYoutube,
} from "react-icons/fi";

// Static definitions for your primary routing links
const SOCIAL_LINKS = [
  {
    name: "GitHub",
    url: "https://github.com/dhairyaagrawalcode",
    icon: <FiGithub size={16} />,
    hoverColor: "hover:text-[#4FD1C5]",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/dhairya-agrawal-102307341/",
    icon: <FiLinkedin size={16} />,
    hoverColor: "hover:text-[#6C63FF]",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/dhairyaagrawal199/",
    icon: <FiInstagram size={16} />,
    hoverColor: "hover:text-[#f43f5e]",
  },
  {
    name: "Twitter",
    url: "https://x.com/dhairyaagr119",
    icon: <FiTwitter size={16} />,
    hoverColor: "hover:text-[#1DA1F2]",
  },
  {
    name: "Youtube",
    url: "https://www.youtube.com/@dhairyaagrawal119",
    icon: <FiYoutube size={16} />,
    hoverColor: "hover:text-[#FF0033]",
  },
];

// =========================================================
// NEW DETACHED HOOK SAFE COMPONENT FOR 3D CARDS
// =========================================================
function ProjectCard({ proj, idx }: { proj: any; idx: number }) {
  const xRotate = useMotionValue(0);
  const yRotate = useMotionValue(0);
  const radialGlowBg = useMotionValue(
    "radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0) 0%, transparent 70%)",
  );

  const handleMouseTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    xRotate.set(yPct * -10);
    yRotate.set(xPct * 10);

    radialGlowBg.set(
      `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(79, 209, 197, 0.09) 0%, rgba(108, 99, 255, 0.03) 45%, transparent 80%)`,
    );
  };

  const handleMouseReset = () => {
    xRotate.set(0);
    yRotate.set(0);
    radialGlowBg.set(
      "radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0) 0%, transparent 70%)",
    );
  };

  const springConfig = { stiffness: 180, damping: 20 };
  const xRotSpring = useSpring(xRotate, springConfig);
  const yRotSpring = useSpring(yRotate, springConfig);

  return (
    <div style={{ perspective: 1000 }} className="relative">
      <motion.div
        onMouseMove={handleMouseTilt}
        onMouseLeave={handleMouseReset}
        style={{
          rotateX: xRotSpring,
          rotateY: yRotSpring,
          background: radialGlowBg,
        }}
        whileHover={{ y: -4 }}
        className="p-5 bg-[#090d16] border border-white/[0.04] hover:border-[#6C63FF]/35 rounded-xl flex flex-col justify-between transition-colors duration-300 group shadow-lg relative overflow-hidden h-full transform-gpu select-none"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:16px_16px] transition-opacity duration-500 pointer-events-none z-0" />

        <div className="space-y-4 relative z-10 pointer-events-none">
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-gray-500 group-hover:text-[#4FD1C5] transition-all duration-300">
              <FiFolder size={15} />
            </div>
            <a
              href={proj.git_url}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 hover:text-white transition-colors text-xs flex items-center gap-1 font-mono font-bold"
            >
              <FiGithub size={13} /> <span>Code Base</span>
            </a>
          </div>

          <div className="transform-gpu group-hover:translate-z-10 transition-transform duration-300">
            <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-[#6C63FF] transition-colors duration-300">
              {proj.title}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mt-1.5">
              {proj.description}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-white/[0.03] flex flex-wrap gap-1 font-mono text-[9px] font-semibold text-gray-400 relative z-10 pointer-events-none">
          {Array.isArray(proj.tech) &&
            proj.tech.map((t: string, i: number) => (
              <span
                key={i}
                className="bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded text-gray-300 group-hover:border-[#6C63FF]/15 transition-colors duration-300"
              >
                {t}
              </span>
            ))}
        </div>
      </motion.div>
    </div>
  );
}

// =========================================================
// MAIN PORTFOLIO MODULE EXPORT
// =========================================================
export default function page() {
  const [showLoader, setShowLoader] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("journey");
  const [isNameHovered, setIsNameHovered] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [journey, setJourney] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [techInventory, setTechInventory] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const trailingConfig = { stiffness: 250, damping: 24 };
  const cursorXSpring = useSpring(cursorX, trailingConfig);
  const cursorYSpring = useSpring(cursorY, trailingConfig);

  const [isHoveredClickable, setIsHoveredClickable] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchPortfolioData = async () => {
      try {
        const { data: profileData } = await supabase
          .from("profile")
          .select("*")
          .maybeSingle();
        if (profileData) setProfile(profileData);

        const { data: journeyData } = await supabase
          .from("journey_timeline")
          .select("*")
          .order("sort_order", { ascending: true });
        if (journeyData) setJourney(journeyData);

        const { data: milestoneData } = await supabase
          .from("milestones")
          .select("*");
        if (milestoneData) setMilestones(milestoneData);

        const { data: skillData } = await supabase
          .from("tech_inventory")
          .select("*")
          .order("sort_order", { ascending: true });
        if (skillData) setTechInventory(skillData);

        const { data: projectData } = await supabase
          .from("real_projects")
          .select("*");
        if (projectData) setProjects(projectData);
      } catch (err) {
        console.error("Critical stream pipeline crash:", err);
      } finally {
        setShowLoader(false);
      }
    };

    fetchPortfolioData();

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      const target = e.target as HTMLElement;
      const isClickable = target.closest(
        'a, button, [role="button"], input, textarea, .hover-trigger-name',
      );
      setIsHoveredClickable(!!isClickable);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  const triggerSubmitHandshake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    try {
      const { error } = await supabase.from("contacts").insert([
        {
          name: formState.name,
          email: formState.email,
          message: formState.message,
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormState({ name: "", email: "", message: "" });
      }, 4000);
    } catch (err) {
      console.error("Form delivery abort fault:", err);
      alert("Submission error encountered.");
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#030712]" />;

  const profileName = profile?.name || "Dhairya Agrawal";
  const profileBio = profile?.bio || "Loading ecosystem profiles...";
  const profileCollege = profile?.college || "Newton School of Technology";
  const profileStart = profile?.timeline_start || "August 2026";
  const profilePhoto = profile?.photo_url;

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-[#6C63FF]/30 overflow-x-hidden font-sans relative antialiased scroll-smooth">
      <Analytics />
      <SpeedInsights />
      {/* PRECISE CORE DOT */}
      <motion.div
        className="hidden lg:block fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[99999] bg-[#4FD1C5]"
        style={{ x: cursorX, y: cursorY, transform: "translate(-50%, -50%)" }}
      />
      {/* INERTIAL TRAILING OUTER RING */}
      <motion.div
        className="hidden lg:block fixed top-0 left-0 rounded-full pointer-events-none z-[999] border border-[#6C63FF]/60 bg-transparent mix-blend-screen"
        animate={{
          width: isHoveredClickable ? 52 : 28,
          height: isHoveredClickable ? 52 : 28,
          borderColor: isHoveredClickable
            ? "rgba(79, 209, 197, 0.8)"
            : "rgba(108, 99, 255, 0.4)",
          backgroundColor: isHoveredClickable
            ? "rgba(108, 99, 255, 0.08)"
            : "rgba(0, 0, 0, 0)",
          boxShadow: isHoveredClickable
            ? "0px 0px 16px rgba(79, 209, 197, 0.3)"
            : "none",
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* HOVER PHOTO ASSIST POPUP */}
      <AnimatePresence>
        {isNameHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 3 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed top-0 left-0 pointer-events-none z-[999] w-48 h-60 rounded-2xl overflow-hidden border-2 border-[#4FD1C5] bg-[#090d16] shadow-2xl"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              marginLeft: "50px",
              marginTop: "-160px",
            }}
          >
            {profilePhoto && (
              <img
                src={profilePhoto}
                alt={profileName}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOADING OVERLAY SCREEN */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            className="fixed inset-0 bg-[#030712] z-[99999] flex flex-col items-center justify-center font-mono"
            exit={{
              y: "-100vh",
              transition: { ease: [0.76, 0, 0.24, 1], duration: 0.8 },
            }}
          >
            <div className="space-y-3 text-center">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "160px" }}
                transition={{ duration: 1.2 }}
                className="h-[2px] bg-gradient-to-r from-[#6C63FF] to-[#4FD1C5] mx-auto"
              />
              <h2 className="text-white font-black uppercase text-xs tracking-widest">
                {profileName}
              </h2>
              <div className="text-[10px] text-[#4FD1C5] tracking-widest animate-pulse mt-1">
                INITIALIZING PORTFOLIO_NODE...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-gradient-to-b from-[#6C63FF]/15 via-[#4FD1C5]/5 to-transparent blur-[140px] pointer-events-none z-0" />

      {/* LATERAL SOCIAL MEDIA DECK */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="hidden lg:flex fixed left-6 xl:left-10 bottom-0 flex-col items-center gap-5 z-40"
      >
        <div className="flex flex-col gap-4 bg-[#090d16]/40 backdrop-blur-md p-2.5 rounded-full border border-white/[0.03] shadow-2xl">
          {SOCIAL_LINKS.map((soc, idx) => (
            <a
              key={idx}
              href={soc.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-9 h-9 rounded-full flex items-center justify-center text-gray-400 bg-[#030712]/60 border border-white/[0.04] transition-all duration-300 group ${soc.hoverColor}`}
            >
              <motion.div whileHover={{ scale: 1.15, rotate: 6 }}>
                {soc.icon}
              </motion.div>
            </a>
          ))}
        </div>
        <div className="w-[1px] h-24 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>

      {/* NAVBAR */}
      <nav className="fixed top-0 inset-x-0 h-16 bg-[#030712]/75 backdrop-blur-md border-b border-white/[0.04] z-50">
        <div className="max-w-5xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <a href="#about" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#4FD1C5] flex items-center justify-center font-black text-xs group-hover:rotate-6 transition-transform">
              DA
            </div>
            <div>
              <span className="font-bold text-sm block tracking-tight group-hover:text-[#4FD1C5] transition-colors">
                {profileName}
              </span>
              <span className="text-[9px] text-gray-500 tracking-widest uppercase font-mono block mt-0.5">
                Dynamic Web-Node
              </span>
            </div>
          </a>
          <div className="bg-white/[0.02] border border-white/5 px-3 py-1 rounded-lg hidden md:flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4FD1C5] animate-pulse" />
            <span className="text-[10px] font-mono text-[#4FD1C5] font-bold uppercase tracking-wider">
              COLLEGE : {profileStart}
            </span>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        id="about"
        className="pt-40 pb-20 px-4 max-w-4xl mx-auto text-center space-y-8 relative z-10 min-h-[90vh] flex flex-col justify-center items-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6C63FF]/10 border border-[#6C63FF]/20 rounded-full text-[10px] font-mono font-bold tracking-wider text-[#818cf8]">
          <FiTerminal size={11} /> Live Runtime Ecosystem Verified
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
          <span className="block">
            Hi, I'm{" "}
            <span
              onMouseEnter={() => setIsNameHovered(true)}
              onMouseLeave={() => setIsNameHovered(false)}
              className="hover-trigger-name text-white hover:text-[#4FD1C5] cursor-crosshair border-b-2 border-dashed border-white/20 transition-colors"
            >
              {profileName}
            </span>
            .
          </span>
          <span className="bg-gradient-to-r from-[#6C63FF] via-[#818cf8] to-[#4FD1C5] bg-clip-text text-transparent block mt-1">
            Exploring Code & Web Architecture.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl font-normal">
          {profileBio}
        </p>

        <div className="p-4 bg-[#090d16] border border-white/[0.04] rounded-xl text-left max-w-xl w-full flex items-start gap-3 shadow-xl">
          <div className="p-2 rounded-lg bg-[#4FD1C5]/10 text-[#4FD1C5] mt-0.5">
            <FiBookOpen size={15} />
          </div>
          <div className="text-xs">
            <span className="font-mono font-bold text-gray-500 uppercase tracking-wide text-[10px] block">
              Academic Destination Node
            </span>
            <p className="text-gray-300 mt-0.5">
             B.Tech Undergrad student at{" "}
              <span className="text-white font-bold">{profileCollege}</span>{" "}
              
              .
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 pt-2 w-full max-w-md">
          <a
            href="#dashboard"
            className="h-11 px-6 rounded-xl bg-[#6C63FF] text-white font-mono text-xs font-bold tracking-wide flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#6C63FF]/20 group"
          >
            <span>EXPLORE MATRIX TIMELINE</span>
            <FiArrowRight
              size={12}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>

          <div className="flex lg:hidden items-center justify-center gap-3 w-full px-4">
            {SOCIAL_LINKS.map((soc, idx) => (
              <a
                key={idx}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 max-w-[110px] h-10 bg-[#090d16] border border-white/[0.04] rounded-xl flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 text-gray-400 hover:text-white"
              >
                <div className="text-gray-500">{soc.icon}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SYSTEM DASHBOARD TIMELINES */}
      <section
        id="dashboard"
        className="py-24 max-w-4xl mx-auto px-4 border-t border-white/[0.03] relative z-10"
      >
        <div className="flex justify-center mb-12">
          <div className="p-1 bg-[#090d16] border border-white/5 rounded-xl flex gap-1 font-mono max-w-sm w-full shadow-2xl">
            {["journey", "milestones", "skills"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all ${activeTab === tab ? "bg-[#6C63FF] text-white" : "text-gray-400 hover:text-white"}`}
              >
                {tab === "skills" ? "Tech Grid" : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[340px]">
          <AnimatePresence mode="wait">
            {activeTab === "journey" && (
              <motion.div
                key="journey"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="relative border-l border-white/10 ml-2 md:ml-28 space-y-6 text-left"
              >
                {journey.map((node, idx) => (
                  <div key={node.id || idx} className="relative pl-6 group">
                    <div className="absolute -left-[5px] top-2.5 w-2.5 h-2.5 rounded-full bg-[#030712] border-2 border-[#6C63FF] group-hover:border-[#4FD1C5] transition-colors" />
                    <div className="md:absolute md:-left-32 md:top-1.5 md:w-24 text-left md:text-right text-[10px] font-mono font-bold text-[#4FD1C5] uppercase tracking-wider mb-1 md:mb-0">
                      {node.period}
                    </div>
                    <div className="p-5 bg-[#090d16] border border-white/[0.04] rounded-xl transition-all shadow-xl group-hover:translate-x-1">
                      <div className="flex items-center gap-2 text-[#818cf8] text-[9px] font-mono font-bold uppercase">
                        <FiBriefcase size={11} /> <span>// {node.type}</span>
                      </div>
                      <h3 className="text-base font-bold text-white tracking-tight mt-1">
                        {node.role}
                      </h3>
                      <span className="text-xs font-mono font-bold text-gray-500 block mt-0.5">
                        {node.institution}
                      </span>
                      <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                        {node.description}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "milestones" && (
              <motion.div
                key="milestones"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left"
              >
                {milestones.map((mile, idx) => (
                  <div
                    key={mile.id || idx}
                    className="p-5 bg-[#090d16] border border-white/[0.04] rounded-xl flex flex-col justify-between shadow-xl hover:-translate-y-1 group transition-all"
                  >
                    <div className="space-y-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center text-xs">
                        <FiAward />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold bg-white/[0.03] text-gray-400 border border-white/5 px-2 py-0.5 rounded uppercase">
                          {mile.tag}
                        </span>
                        <h4 className="text-sm font-bold text-white tracking-tight mt-2">
                          {mile.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {mile.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-2.5 border-t border-white/[0.03] flex items-center gap-1.5 text-[11px] font-mono font-semibold text-amber-400">
                      <FiTrendingUp size={11} /> <span>{mile.award}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "skills" && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 text-left max-w-3xl mx-auto"
              >
                <div className="flex justify-between items-center px-2 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                  <span>
                    // INVENTORY_LOGS // {techInventory.length} MODULES DETECTED
                  </span>
                  <span className="text-[#4FD1C5] animate-pulse">
                    SYSTEM_STABLE
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {techInventory.map((skill, idx) => (
                    <motion.div
                      key={skill.id || idx}
                      whileHover={{ scale: 1.01, translateY: -2 }}
                      className="bg-[#090d16] border border-white/[0.03] hover:border-[#6C63FF]/30 rounded-xl p-5 shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#6C63FF]/5 to-transparent rounded-bl-full pointer-events-none group-hover:from-[#4FD1C5]/10 transition-all duration-500" />
                      <div className="space-y-3 relative z-10">
                        <div className="flex justify-between items-start gap-3">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-bold text-gray-500 tracking-wider uppercase block">
                              MODULE_0{idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-[#4FD1C5] transition-colors duration-300">
                              {skill.name}
                            </h4>
                          </div>
                          <span className="text-[9px] font-mono font-black tracking-wide bg-white/[0.02] border border-white/5 group-hover:border-[#6C63FF]/20 text-gray-400 group-hover:text-[#818cf8] px-2 py-0.5 rounded transition-all duration-300 uppercase shrink-0">
                            {skill.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-5 space-y-1.5 relative z-10">
                        <div className="h-[5px] w-full bg-black/50 rounded-full overflow-hidden p-[1px] border border-white/[0.02]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: skill.bar_width }}
                            transition={{ duration: 1.2, ease: "circOut" }}
                            className="h-full bg-gradient-to-r from-[#6C63FF] via-[#818cf8] to-[#4FD1C5] rounded-full relative"
                          >
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white blur-[1px] animate-pulse" />
                          </motion.div>
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-mono font-bold text-gray-600 group-hover:text-gray-400 transition-colors duration-300">
                          <span>BUFF_STATE: COMPILING</span>
                          <span className="text-[#4FD1C5]">
                            {skill.bar_width}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* REPOSITORIES / CODE PROJ */}
      <section
        id="projects"
        className="py-24 max-w-5xl mx-auto px-4 border-t border-white/[0.03] relative z-10"
      >
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold font-mono tracking-widest text-[#4FD1C5] uppercase block">
            / repositories
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Things I Have Coded
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {projects.map((proj, idx) => (
            <ProjectCard key={proj.id || idx} proj={proj} idx={idx} />
          ))}
        </div>
      </section>

      {/* CONTACT NODE */}
      <section
        id="contact"
        className="py-24 max-w-xl mx-auto px-4 border-t border-white/[0.03] relative z-10 text-center"
      >
        <div className="space-y-2 mb-10">
          <span className="text-xs font-bold font-mono tracking-widest text-[#4FD1C5] uppercase block">
            / communication
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Let's Connect!
          </h2>
        </div>
        <div className="bg-[#090d16] border border-white/[0.05] rounded-2xl p-6 shadow-2xl relative text-left">
          <form
            onSubmit={triggerSubmitHandshake}
            className="space-y-4 font-mono text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-500 font-bold block">
                  Your Identity Name:
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  placeholder="Your label name..."
                  className="w-full h-11 bg-black/30 border border-white/5 focus:border-[#6C63FF] rounded-xl px-4 text-white focus:outline-none font-sans"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-500 font-bold block">Email :</label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  placeholder="Return handshake mailbox..."
                  className="w-full h-11 bg-black/30 border border-white/5 focus:border-[#6C63FF] rounded-xl px-4 text-white focus:outline-none font-sans"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-gray-500 font-bold block">
                Message Payload Block:
              </label>
              <textarea
                rows={4}
                required
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                placeholder="Write your note sequence here..."
                className="w-full bg-black/30 border border-white/5 focus:border-[#6C63FF] rounded-xl p-4 text-white focus:outline-none font-sans resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 bg-[#6C63FF] text-white font-bold tracking-wider uppercase rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#5a52f5] active:scale-[0.99] transition-all shadow-lg cursor-pointer"
            >
              <FiMessageSquare size={13} /> <span>Transmit Payload</span>
            </button>
          </form>

          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#090d16]/98 rounded-2xl flex flex-col items-center justify-center text-center p-4 border border-emerald-500/20"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                  <FiCheckCircle />
                </div>
                <h4 className="text-xs font-bold font-mono text-white uppercase">
                  Payload Handshake Successful
                </h4>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.04] bg-[#030712] py-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-gray-500">
          <div>
            <span className="font-bold text-white block">
              {profileName} — Live Synchronized Core
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-wider text-gray-600 uppercase">
            DATABASE_ACTIVE // {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}
