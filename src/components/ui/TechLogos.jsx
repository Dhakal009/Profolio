import React from 'react';

export const techLogos = [
  {
    title: 'React',
    href: 'https://react.dev',
    node: (
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--foam)] transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]">
        <svg className="w-5 h-5 text-[#61DAFB]" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
          <circle cx="0" cy="0" r="2.05" />
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
        <span className="text-sm font-medium tracking-tight whitespace-nowrap">React</span>
      </div>
    ),
  },
  {
    title: 'Next.js',
    href: 'https://nextjs.org',
    node: (
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--foam)] transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]">
        <svg className="w-5 h-5 text-[var(--foam)]" viewBox="0 0 180 180" fill="none">
          <mask id="next-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180" style={{ maskType: 'alpha' }}>
            <circle cx="90" cy="90" r="90" fill="black" />
          </mask>
          <g mask="url(#next-mask)">
            <circle cx="90" cy="90" r="90" fill="currentColor" />
            <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="var(--bg)" />
            <rect x="115" y="54" width="12" height="72" fill="var(--bg)" />
          </g>
        </svg>
        <span className="text-sm font-medium tracking-tight whitespace-nowrap">Next.js</span>
      </div>
    ),
  },
  {
    title: 'TypeScript',
    href: 'https://www.typescriptlang.org',
    node: (
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--foam)] transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]">
        <svg className="w-5 h-5 text-[#3178C6]" viewBox="0 0 128 128" fill="currentColor">
          <path d="M1.5 0h125c.8 0 1.5.7 1.5 1.5v125c0 .8-.7 1.5-1.5 1.5h-125c-.8 0-1.5-.7-1.5-1.5v-125c0-.8.7-1.5 1.5-1.5z" fill="#3178C6"/>
          <path d="M69.3 98.4c-2.3 1.4-5.2 2.4-8.8 3-3.6.6-7.5.9-11.7.9-5.1 0-9.6-.7-13.5-2.2-3.9-1.5-7.1-3.6-9.6-6.4-2.5-2.8-4.3-6.2-5.4-10.2-1.1-4-1.7-8.5-1.7-13.6 0-5.4.7-10.1 2-14.2s3.3-7.5 5.9-10.2c2.6-2.7 5.9-4.8 9.8-6.1 3.9-1.4 8.5-2.1 13.7-2.1 4.5 0 8.5.4 12.1 1.2 3.6.8 6.5 2 8.7 3.6l-5.6 11.2c-2.1-1.3-4.5-2.3-7.2-3-2.7-.7-5.5-1.1-8.5-1.1-3.3 0-6.2.4-8.7 1.3-2.5.9-4.6 2.2-6.2 4-1.6 1.8-2.8 4.1-3.6 6.8-.8 2.7-1.2 5.9-1.2 9.5 0 3.7.4 6.9 1.2 9.6.8 2.7 2 4.9 3.6 6.7 1.6 1.8 3.7 3.1 6.2 4 2.5.9 5.4 1.3 8.7 1.3 3.3 0 6.3-.4 9.1-1.3 2.8-.9 5.3-2.1 7.6-3.7l5 11.2zm52.4-59.5h-20.9v61.4h-14.8v-61.4h-20.9v-12h56.6v12z" fill="#FFF"/>
        </svg>
        <span className="text-sm font-medium tracking-tight whitespace-nowrap">TypeScript</span>
      </div>
    ),
  },
  {
    title: 'Tailwind CSS',
    href: 'https://tailwindcss.com',
    node: (
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--foam)] transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]">
        <svg className="w-5 h-5 text-[#38BDF8]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
        </svg>
        <span className="text-sm font-medium tracking-tight whitespace-nowrap">Tailwind CSS</span>
      </div>
    ),
  },
  {
    title: 'Node.js',
    href: 'https://nodejs.org',
    node: (
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--foam)] transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]">
        <svg className="w-5 h-5 text-[#5FA04E]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7.78v8.44L12 22l10-5.78V7.78L12 2zm0 2.31l7.8 4.51v6.36L12 19.69l-7.8-4.51V8.82L12 4.31z"/>
        </svg>
        <span className="text-sm font-medium tracking-tight whitespace-nowrap">Node.js</span>
      </div>
    ),
  },
  {
    title: 'Python',
    href: 'https://www.python.org',
    node: (
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--foam)] transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]">
        <svg className="w-5 h-5" viewBox="0 0 110 110" fill="none">
          <path d="M54.5 2C39.4 2 30 8.6 30 19.3V31h25v3.4H19.7C8.9 34.4 2 43.6 2 58.7c0 14.8 6.7 24.3 18.2 24.3H27v-12.8c0-8.9 7.4-16.1 16.3-16.1h25c7.3 0 13.2-5.9 13.2-13.2V19.3C81.5 8.6 72 2 54.5 2zM43.6 10.6c3.2 0 5.8 2.6 5.8 5.8 0 3.2-2.6 5.8-5.8 5.8-3.2 0-5.8-2.6-5.8-5.8 0-3.2 2.6-5.8 5.8-5.8z" fill="#387EB8"/>
          <path d="M55.5 108c15.1 0 24.5-6.6 24.5-17.3V79H55v-3.4h35.3c10.8 0 17.7-9.2 17.7-24.3 0-14.8-6.7-24.3-18.2-24.3H83v12.8c0 8.9-7.4 16.1-16.3 16.1H41.7c-7.3 0-13.2 5.9-13.2 13.2v21.6C28.5 101.4 38 108 55.5 108zm10.9-8.6c-3.2 0-5.8-2.6-5.8-5.8 0-3.2 2.6-5.8 5.8-5.8 3.2 0 5.8 2.6 5.8 5.8 0 3.2-2.6 5.8-5.8 5.8z" fill="#FFE052"/>
        </svg>
        <span className="text-sm font-medium tracking-tight whitespace-nowrap">Python</span>
      </div>
    ),
  },
  {
    title: 'PostgreSQL',
    href: 'https://www.postgresql.org',
    node: (
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--foam)] transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]">
        <svg className="w-5 h-5 text-[#4169E1]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
        <span className="text-sm font-medium tracking-tight whitespace-nowrap">PostgreSQL</span>
      </div>
    ),
  },
  {
    title: 'Docker',
    href: 'https://www.docker.com',
    node: (
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--foam)] transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]">
        <svg className="w-5 h-5 text-[#2496ED]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.186.185.186zm0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186zm-2.954 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H8.075a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm0 2.714h2.119a.186.186 0 00.185-.185V9.006a.185.185 0 00-.185-.186H8.075a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm-2.955 0h2.119a.186.186 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.12a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm13.782.784c-.407-.294-1.636-.372-2.385-.246-.14-.492-.475-.898-.946-1.157l-.37-.202-.321.272c-.64.544-1.464.832-2.316.812H2.336a.354.354 0 00-.353.353c-.027 1.58.27 3.149.88 4.606.75 1.765 2.012 3.256 3.655 4.316 2.053 1.328 4.49 2.034 6.98 2.034 7.637 0 10.37-4.484 10.49-7.388.005-.125-.03-.497-.109-.607z"/>
        </svg>
        <span className="text-sm font-medium tracking-tight whitespace-nowrap">Docker</span>
      </div>
    ),
  },
  {
    title: 'Framer Motion',
    href: 'https://motion.dev',
    node: (
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--foam)] transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]">
        <svg className="w-5 h-5 text-[#F08]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/>
        </svg>
        <span className="text-sm font-medium tracking-tight whitespace-nowrap">Framer Motion</span>
      </div>
    ),
  },
  {
    title: 'GSAP',
    href: 'https://gsap.com',
    node: (
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--foam)] transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]">
        <svg className="w-5 h-5 text-[#0AE448]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5l-4-3 4-3v6zm3-3l-4 3v-6l4 3z"/>
        </svg>
        <span className="text-sm font-medium tracking-tight whitespace-nowrap">GSAP</span>
      </div>
    ),
  },
  {
    title: 'Three.js',
    href: 'https://threejs.org',
    node: (
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--foam)] transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]">
        <svg className="w-5 h-5 text-[var(--foam)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2L2 20h20L12 2zm0 4.5L18.5 18H5.5L12 6.5z"/>
        </svg>
        <span className="text-sm font-medium tracking-tight whitespace-nowrap">Three.js</span>
      </div>
    ),
  },
  {
    title: 'Git',
    href: 'https://git-scm.com',
    node: (
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--foam)] transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]">
        <svg className="w-5 h-5 text-[#F05032]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.62 10.44L13.56 2.38a1.5 1.5 0 00-2.12 0L9.38 4.44l3.18 3.18a1.76 1.76 0 011.66.42 1.76 1.76 0 01.42 1.66l3.06 3.06a1.76 1.76 0 11-1.06 1.06l-2.85-2.85v4.29a1.77 1.77 0 11-1.5 0v-4.46L8.85 7.37 2.38 13.84a1.5 1.5 0 000 2.12l8.06 8.06a1.5 1.5 0 002.12 0l9.06-9.06a1.5 1.5 0 000-2.12z"/>
        </svg>
        <span className="text-sm font-medium tracking-tight whitespace-nowrap">Git</span>
      </div>
    ),
  },
  {
    title: 'Figma',
    href: 'https://www.figma.com',
    node: (
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--foam)] transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M8 12a4 4 0 100-8h4v8H8z" fill="#F24E1E"/>
          <path d="M12 4h4a4 4 0 110 8h-4V4z" fill="#FF7262"/>
          <path d="M12 12h4a4 4 0 110 8h-4v-8z" fill="#1ABCFE"/>
          <path d="M8 20a4 4 0 010-8h4v4a4 4 0 01-4 4z" fill="#0ACF83"/>
          <path d="M8 12a4 4 0 110-8h4v8H8z" fill="#A259FF"/>
        </svg>
        <span className="text-sm font-medium tracking-tight whitespace-nowrap">Figma</span>
      </div>
    ),
  },
];
