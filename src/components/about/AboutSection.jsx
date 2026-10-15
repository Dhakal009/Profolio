import { useState } from 'react';
import { motion } from 'framer-motion';
import LinuxTerminal from '../terminal/LinuxTerminal';

const BIO_DATA = {
  developer: 'Bikash Dhakal',
  role: 'Full Stack & Creative UI',
  location: 'Kathmandu, Nepal',
  status: 'Available for roles',
  stack: [
    'React 19 & Next.js',
    'TypeScript',
    'Three.js & WebGL',
    'Node.js & Systems',
  ],
  mission: 'Building fast, delightful digital experiences.',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.05,
    },
  },
};

const lineVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

function AboutSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(BIO_DATA, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="about-section-container w-full max-w-[1380px] mx-auto py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-center">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: JSON Profile Card (Short & Sweet with Anim)  */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-start text-left w-full">
          {/* Eyebrow index */}
          <div className="text-xs font-mono font-medium tracking-widest uppercase text-muted mb-3 flex items-center gap-2">
            <span className="w-6 h-[1px] bg-[var(--line-strong)] inline-block" />
            <span>01 / About Me</span>
          </div>

          {/* Clean Headline */}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foam leading-[1.2] mb-5">
            Building digital experiences with care &amp; engineering rigor.
          </h2>

          {/* JSON Card with subtle glowing backdrop & hover animation */}
          <div className="relative group w-full mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 rounded-2xl blur-xl opacity-40 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none" />

            <div className="relative rounded-xl border border-[var(--line-strong)] bg-[var(--surface-2)]/90 backdrop-blur-md overflow-hidden shadow-xl shadow-black/20 transition-all duration-300 group-hover:border-[var(--line)]">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--surface)] border-b border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
                  </div>
                  <span className="text-[11px] font-mono text-muted ml-1 flex items-center gap-1">
                    <span className="text-cyan-400 font-semibold">&#123;&#125;</span>
                    about.json
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyJson}
                  aria-label="Copy about JSON"
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-muted hover:text-foam bg-[var(--surface-2)] border border-[var(--line)] hover:border-[var(--line-strong)] transition-all"
                >
                  {copied ? (
                    <>
                      <span className="text-success text-[12px]">✔</span>
                      <span className="text-success">Copied!</span>
                    </>
                  ) : (
                    <>
                      <span className="opacity-70 text-[10px]">📋</span>
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>

              {/* JSON Animated Body */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="p-3.5 sm:p-4 font-mono text-xs sm:text-[13px] leading-relaxed select-text overflow-x-auto"
              >
                {/* Line 1: { */}
                <motion.div variants={lineVariants} className="flex items-center hover:bg-white/[0.04] px-1.5 py-0.5 rounded transition-colors">
                  <span className="text-subtle select-none w-5 text-right mr-3 text-[11px] opacity-40">1</span>
                  <span className="text-foam font-bold">&#123;</span>
                </motion.div>

                {/* Line 2: "developer": "Bikash Dhakal", */}
                <motion.div variants={lineVariants} className="flex items-center hover:bg-white/[0.04] px-1.5 py-0.5 rounded transition-colors">
                  <span className="text-subtle select-none w-5 text-right mr-3 text-[11px] opacity-40">2</span>
                  <span className="ml-3 text-cyan-400 font-medium">"developer"</span>
                  <span className="text-subtle mx-1">:</span>
                  <span className="text-emerald-400">"Bikash Dhakal"</span>
                  <span className="text-subtle">,</span>
                </motion.div>

                {/* Line 3: "role": "Full Stack & Creative UI", */}
                <motion.div variants={lineVariants} className="flex items-center hover:bg-white/[0.04] px-1.5 py-0.5 rounded transition-colors">
                  <span className="text-subtle select-none w-5 text-right mr-3 text-[11px] opacity-40">3</span>
                  <span className="ml-3 text-cyan-400 font-medium">"role"</span>
                  <span className="text-subtle mx-1">:</span>
                  <span className="text-emerald-400">"Full Stack &amp; Creative UI"</span>
                  <span className="text-subtle">,</span>
                </motion.div>

                {/* Line 4: "location": "Kathmandu, Nepal", */}
                <motion.div variants={lineVariants} className="flex items-center hover:bg-white/[0.04] px-1.5 py-0.5 rounded transition-colors">
                  <span className="text-subtle select-none w-5 text-right mr-3 text-[11px] opacity-40">4</span>
                  <span className="ml-3 text-cyan-400 font-medium">"location"</span>
                  <span className="text-subtle mx-1">:</span>
                  <span className="text-emerald-400">"Kathmandu, Nepal"</span>
                  <span className="text-subtle">,</span>
                </motion.div>

                {/* Line 5: "status": "Available for roles", with pulsing live dot */}
                <motion.div variants={lineVariants} className="flex items-center hover:bg-white/[0.04] px-1.5 py-0.5 rounded transition-colors flex-wrap">
                  <span className="text-subtle select-none w-5 text-right mr-3 text-[11px] opacity-40">5</span>
                  <span className="ml-3 text-cyan-400 font-medium">"status"</span>
                  <span className="text-subtle mx-1">:</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span>"Available for roles"</span>
                  </span>
                  <span className="text-subtle">,</span>
                </motion.div>

                {/* Line 6: "stack": [ */}
                <motion.div variants={lineVariants} className="flex items-center hover:bg-white/[0.04] px-1.5 py-0.5 rounded transition-colors">
                  <span className="text-subtle select-none w-5 text-right mr-3 text-[11px] opacity-40">6</span>
                  <span className="ml-3 text-cyan-400 font-medium">"stack"</span>
                  <span className="text-subtle mx-1">:</span>
                  <span className="text-amber-400">[</span>
                </motion.div>

                {/* Lines 7-10: Stack items */}
                {BIO_DATA.stack.map((item, idx, arr) => (
                  <motion.div
                    key={item}
                    variants={lineVariants}
                    className="flex items-center hover:bg-white/[0.04] px-1.5 py-0.5 rounded transition-colors"
                  >
                    <span className="text-subtle select-none w-5 text-right mr-3 text-[11px] opacity-40">{7 + idx}</span>
                    <span className="ml-7 text-amber-200">"{item}"</span>
                    {idx < arr.length - 1 && <span className="text-subtle">,</span>}
                  </motion.div>
                ))}

                {/* Line 11: ], */}
                <motion.div variants={lineVariants} className="flex items-center hover:bg-white/[0.04] px-1.5 py-0.5 rounded transition-colors">
                  <span className="text-subtle select-none w-5 text-right mr-3 text-[11px] opacity-40">11</span>
                  <span className="ml-3 text-amber-400">]</span>
                  <span className="text-subtle">,</span>
                </motion.div>

                {/* Line 12: "mission": ... */}
                <motion.div variants={lineVariants} className="flex items-center hover:bg-white/[0.04] px-1.5 py-0.5 rounded transition-colors">
                  <span className="text-subtle select-none w-5 text-right mr-3 text-[11px] opacity-40">12</span>
                  <span className="ml-3 text-cyan-400 font-medium">"mission"</span>
                  <span className="text-subtle mx-1">:</span>
                  <span className="text-emerald-400">"Building fast, delightful digital experiences."</span>
                </motion.div>

                {/* Line 13: } + blinking cursor */}
                <motion.div variants={lineVariants} className="flex items-center hover:bg-white/[0.04] px-1.5 py-0.5 rounded transition-colors">
                  <span className="text-subtle select-none w-5 text-right mr-3 text-[11px] opacity-40">13</span>
                  <span className="text-foam font-bold">&#125;</span>
                  <span className="inline-block w-1.5 h-3.5 bg-emerald-400 animate-pulse ml-1.5 align-middle" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Action links */}
          <div className="flex items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-foam text-bg font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity"
            >
              View Projects
            </a>
            <a
              href="https://github.com/Dhakal009"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[var(--line-strong)] text-muted hover:text-foam text-xs sm:text-sm font-mono transition-colors"
            >
              <span>GitHub</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Terminal (Wider & Compact Height)           */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 xl:col-span-7 w-full">
          <LinuxTerminal />
        </div>

      </div>
    </div>
  );
}

export default AboutSection;
