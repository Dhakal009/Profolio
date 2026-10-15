import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLenis } from '../../contexts/LenisContext';
import { useTheme } from '../../contexts/ThemeContext';
import '../terminal/terminal-enhancement.css';

/* ------------------------------------------------------------------ */
/*  Virtual filesystem                                                 */
/* ------------------------------------------------------------------ */
const FILESYSTEM = {
  '~': {
    type: 'dir',
    children: {
      'README.md': {
        type: 'file',
        content: `# Welcome to Bikash Dhakal's Portfolio Terminal 🚀
------------------------------------------------------------
Navigate and explore the website just like a Linux shell:

  • Type 'cat facts.json'    to inspect quick profile facts in JSON.
  • Type 'skills'            to see proficiency levels at a glance.
  • Type 'cat bio.txt'       to read Bikash's background and story.
  • Type 'grep <word>'       to search across every file.
  • Type 'cd projects'       to navigate to the Projects showcase page.
  • Type 'goto <section>'    to smoothly jump to any section (e.g. goto experience, goto contact).
  • Type 'theme toggle'      to switch between dark and light themes.
  • Type 'neofetch'          to see developer system specifications.
  • Type 'help'              to view the full command list.`,
      },
      'bio.txt': {
        type: 'file',
        content: `BIKASH DHAKAL — FULL STACK DEVELOPER & UI DESIGNER
============================================================
Location: Kathmandu, Nepal (Available for Remote Worldwide)
Focus:    Frontend Architecture, High-Performance APIs & Creative UI

Hey there! I am Bikash Dhakal, a passionate software engineer and
creative coder. I specialize in bridging the gap between elegant,
intuitive design and scalable, resilient engineering.

I build modern web experiences using React 19, TypeScript, Next.js,
and Node.js, combined with fluid animations powered by GSAP and
Framer Motion. Whether crafting complex client-side applications
with optimized rendering or architecting database-driven backend
services, I treat every project with craftsmanship and care.`,
      },
      'facts.json': {
        type: 'file',
        content: `{
  "name": "Bikash Dhakal",
  "role": "Full Stack Engineer & UI Designer",
  "location": "Kathmandu, Nepal (Open to Remote)",
  "specialties": [
    "React 19",
    "Node.js",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "PostgreSQL",
    "REST & GraphQL"
  ],
  "experience": "Independent Freelance & Open Source Contributor",
  "education": "B.Sc in CS & IT (2019 — 2023)",
  "status": "Available for select freelance projects & full-time roles",
  "passions": ["Creative Coding", "System Design", "Micro-interactions", "Performance Optimization"]
}`,
      },
      'skills.txt': {
        type: 'file',
        content: `[TECHNICAL PROFICIENCIES]
------------------------------------------------------------
• Frontend:    React 19, Next.js, TypeScript, Vue.js, Tailwind CSS, Redux, Zustand
• Backend:     Node.js, Express, Python, PostgreSQL, MongoDB, Redis, Prisma, REST, GraphQL
• Animation:   Framer Motion, GSAP, WebGL, Three.js, Canvas Micro-interactions
• DevOps:      Docker, Git/GitHub Actions, AWS, Vercel, CI/CD, Vite, Vitest
• Design:      Figma, Design Systems, Typography, WCAG 2.1 Accessibility`,
      },
      'experience.txt': {
        type: 'file',
        content: `[PROFESSIONAL EXPERIENCE]
------------------------------------------------------------
★ Independent Freelance Developer (2023 — Present)
  • Collaborating with international clients and startups to build
    high-performance web applications and interactive marketing sites.
  • Engineered scalable architectures achieving 95+ Lighthouse scores.
  • Designed and integrated secure RESTful and GraphQL backend APIs.

★ Open Source Contributor (2023 — Present)
  • Actively contributing to modern React UI libraries and dev tooling.
  • Exploring AI-driven development workflows and creative WebGL shaders.`,
      },
      'education.txt': {
        type: 'file',
        content: `[ACADEMIC BACKGROUND]
------------------------------------------------------------
🎓 B.Sc in Computer Science & Information Technology (2019 — 2023)
   Specialized in Software Engineering, Advanced Web Technologies,
   Database Management Systems, and Human-Computer Interaction.

💡 Continuous Learning & Research (2023 — Present)
   Deep diving into distributed systems, modern web standards,
   and fluid interaction design.`,
      },
      'contact.txt': {
        type: 'file',
        content: `[GET IN TOUCH WITH BIKASH]
------------------------------------------------------------
• Email:    bikashdhakal546@gmail.com
• GitHub:   https://github.com/Dhakal009
• LinkedIn: https://linkedin.com/in/bikash-dhakal
• Twitter:  https://twitter.com/bikash_dhakal
• Location: Kathmandu, Nepal (GMT+5:45)

Quick tip: Run 'open email' to compose an email, or 'open github' to view my code!`,
      },
      projects: {
        type: 'dir',
        children: {
          'ems.txt': {
            type: 'file',
            content: `Project: Employee Management System (EMS)
Type:    Enterprise Role-Based Dashboard
Stack:   React 19, Tailwind CSS, Context API, LocalStorage
Summary: Role-based task and workforce portal with Admin and Employee dashboards,
         task assignment workflows, and real-time task status tracking.
Live:    /demo/ems
Source:  https://github.com/Dhakal009/Profolio/tree/master/Projects/EMS`,
          },
          'live-chat.txt': {
            type: 'file',
            content: `Project: Live Chat Application
Type:    Full Stack Real-Time Messaging
Stack:   React 19, Node.js, Express, MongoDB, Socket.io, Tailwind CSS
Summary: Real-time bidirectional chat platform with JWT auth, online presence
         indicators, typing notifications, and unread message counters.
Live:    /demo/live-chat
Source:  https://github.com/Dhakal009/Profolio/tree/master/Projects/live-chat`,
          },
          'ecommerce-app.txt': {
            type: 'file',
            content: `Project: E-Commerce App
Type:    MERN Stack Online Storefront
Stack:   React 19, Node.js, Express, MongoDB, Tailwind CSS
Summary: Full-stack e-commerce storefront featuring product catalog browsing,
         category filtering, search, shopping cart drawer, and checkout flow.
Live:    /demo/ecommerce-app
Source:  https://github.com/Dhakal009/Profolio/tree/master/Projects/ecommerce-app`,
          },
          'view-all.sh': {
            type: 'file',
            isExec: true,
            content: `#!/bin/bash\n# Navigates to the full Projects page\ngoto projects`,
          },
        },
      },
      socials: {
        type: 'dir',
        children: {
          'github.url': { type: 'file', url: 'https://github.com/Dhakal009', content: 'https://github.com/Dhakal009' },
          'linkedin.url': { type: 'file', url: 'https://linkedin.com/in/bikash-dhakal', content: 'https://linkedin.com/in/bikash-dhakal' },
          'email.url': { type: 'file', url: 'mailto:bikashdhakal546@gmail.com', content: 'mailto:bikashdhakal546@gmail.com' },
        },
      },
      '.bashrc': {
        type: 'file',
        content: `alias ll='ls -la'\nalias cls='clear'\nalias projects='goto projects'\nalias contact='goto contact'`,
      },
      '.profile': {
        type: 'file',
        content: `export USER="bikash"\nexport SHELL="/bin/bash"\nexport HOME="/home/bikash"`,
      },
    },
  },
};

const HOME = FILESYSTEM['~'];
const DIRS = {
  '~': HOME,
  '~/projects': HOME.children.projects,
  '~/socials': HOME.children.socials,
};

const ASCII_NEOFETCH = `   ██████╗ ██████╗ 
   ██╔══██╗██╔══██╗
   ██████╔╝██║  ██║
   ██╔══██╗██║  ██║
   ██████╔╝██████╔╝
   ╚═════╝ ╚═════╝ `;

const SECTIONS = ['hero', 'about', 'projects', 'skills', 'education', 'deliver', 'contact'];

// Mirrors the aliases declared in ~/.bashrc
const ALIASES = {
  ll: 'ls -la',
  cls: 'clear',
  projects: 'goto projects',
  contact: 'goto contact',
};

const COMMANDS = [
  'help', 'man', 'clear', 'pwd', 'whoami', 'id', 'uname', 'date', 'uptime', 'history', 'echo',
  'theme', 'neofetch', 'fastfetch', 'ls', 'dir', 'cat', 'cd', 'goto', 'nav', 'jump', 'open',
  'tree', 'curl', 'ping', 'sudo', 'rm', 'mkdir', 'touch', 'vim', 'vi', 'nano', 'exit', 'reset',
  'skills', 'grep', 'find', 'top', 'fortune', 'cowsay', 'alias', 'bash', 'sh',
];

const QUICK_COMMANDS = [
  'cat facts.json',
  'skills',
  'neofetch',
  'cat bio.txt',
  'cd projects',
  'goto contact',
  'theme toggle',
  'help',
  'clear',
];

const HELP = [
  ['1. Navigation', [
    ['cd projects | goto projects', 'Open the Projects page'],
    ['goto <section>', 'Jump to experience, skills, education, deliver, contact, home'],
    ['cd ~ | cd ..', 'Return to home directory'],
    ['open <github|linkedin|email|twitter|projects>', 'Open a link or page'],
  ]],
  ['2. Files & content', [
    ['ls [-a] [-l]', 'List files and directories'],
    ['cat <file>', 'Read a file (cat facts.json, cat bio.txt …)'],
    ['grep <word>', 'Search every file for a word'],
    ['find <name>', 'Find files by name'],
    ['tree | pwd', 'Directory tree / working directory'],
    ['./view-all.sh', 'Run a script (inside ~/projects)'],
  ]],
  ['3. About Bikash', [
    ['skills', 'Proficiency levels as bars'],
    ['neofetch', 'Developer specs & ASCII badge'],
    ['whoami | id', 'Identity and background'],
    ['theme <dark|light|toggle>', 'Switch portfolio theme'],
    ['top | date | uptime | uname -a', 'System metrics'],
  ]],
  ['4. Utilities & fun', [
    ['clear', 'Clear output (also Ctrl+L)'],
    ['history | !!', 'Show history / repeat last command'],
    ['alias', 'Show shortcuts (ll, cls, projects, contact)'],
    ['curl <weather|quote|bio>', 'Fetch simulated endpoints'],
    ['echo <text> | fortune | cowsay <text>', 'Print something'],
  ]],
];

const SKILL_LEVELS = [
  ['Frontend', [['React 19', 95], ['TypeScript', 90], ['Next.js', 88], ['Tailwind CSS', 94]]],
  ['Backend', [['Node.js', 88], ['PostgreSQL', 82], ['GraphQL', 78], ['Python', 72]]],
  ['Animation', [['Framer Motion', 92], ['GSAP', 90], ['Three.js / WebGL', 75]]],
  ['DevOps', [['Git / CI-CD', 88], ['Docker', 75], ['AWS', 68]]],
];

const FORTUNES = [
  'There are only two hard things in CS: cache invalidation, naming things, and off-by-one errors.',
  'It works on my machine. Ship the machine.',
  'Make it work, make it right, make it fast. In that order.',
  'A good animation is one you only notice when it is missing.',
  'First, solve the problem. Then, write the code.',
  'Weeks of coding can save you hours of planning.',
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Resolve a directory path relative to cwd. Returns '~', '~/projects', '~/socials' or null.
function resolveDir(raw, cwd) {
  let p = (raw || '').trim().replace(/\/+$/, '');
  const absolute = p.startsWith('~') || p.startsWith('/');
  if (p === '' || p === '~' || p === '/' || p === '/home/bikash') return '~';
  if (p === '.') return cwd;
  if (p === '..') return '~';
  p = p.replace(/^~\//, '').replace(/^\.\//, '').replace(/^\/home\/bikash\//, '');
  const base = absolute ? '~' : cwd;
  if (base === '~' && HOME.children[p]?.type === 'dir') return `~/${p}`;
  return null;
}

// Resolve a file path relative to cwd.
function resolveFile(raw, cwd) {
  const slash = raw.lastIndexOf('/');
  let dir = cwd;
  let name = raw;
  if (slash !== -1) {
    dir = resolveDir(raw.slice(0, slash) || '/', cwd);
    name = raw.slice(slash + 1);
  }
  const node = dir ? DIRS[dir]?.children[name] : null;
  return { dir, name, node };
}

function allFiles() {
  const out = [];
  Object.entries(HOME.children).forEach(([name, node]) => {
    if (node.type === 'file') out.push({ path: name, node });
    else Object.entries(node.children).forEach(([n, f]) => out.push({ path: `${name}/${n}`, node: f }));
  });
  return out;
}

function Highlight({ line, term }) {
  const parts = line.split(new RegExp(`(${escapeRegExp(term)})`, 'ig'));
  return parts.map((part, i) =>
    part.toLowerCase() === term.toLowerCase() ? (
      <mark key={i} className="term-match">{part}</mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function commonPrefix(list) {
  return list.reduce((acc, s) => {
    let i = 0;
    while (i < acc.length && i < s.length && acc[i].toLowerCase() === s[i].toLowerCase()) i++;
    return acc.slice(0, i);
  });
}

function cowsay(text) {
  const t = text || 'Hire Bikash!';
  const bar = '-'.repeat(t.length + 2);
  return ` ${'_'.repeat(t.length + 2)}\n< ${t} >\n ${bar}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`;
}

/* ------------------------------------------------------------------ */
/*  Small presentational components                                    */
/* ------------------------------------------------------------------ */
function JsonView({ text }) {
  const nodes = useMemo(() => {
    const re = /("(?:\\.|[^"\\])*")(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?|[{}[\],]/g;
    const out = [];
    let last = 0;
    let key = 0;
    let m;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(text.slice(last, m.index));
      const [tok, str, colon] = m;
      if (str && colon) {
        out.push(<span key={key++} className="json-key">{str}</span>, colon);
      } else {
        let cls = 'json-punct';
        if (str) cls = 'json-str';
        else if (/^(true|false|null)$/.test(tok)) cls = 'json-bool';
        else if (/^-?\d/.test(tok)) cls = 'json-num';
        out.push(<span key={key++} className={cls}>{tok}</span>);
      }
      last = re.lastIndex;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }, [text]);

  return <pre className="term-json">{nodes}</pre>;
}

function CopyMini({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="term-link-btn term-copy-mini"
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(text).then(() => {
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        });
      }}
    >
      {ok ? '✔ Copied' : 'Copy'}
    </button>
  );
}

function FileOutput({ name, node, dir }) {
  const isJson = name.endsWith('.json');
  return (
    <div className="term-filecard">
      <div className="term-filecard-head">
        <span className="term-cyan term-bold">{name}</span>
        <span className="term-filecard-meta">
          <span className="term-dim">{isJson ? 'json · ' : ''}{node.content.length} bytes</span>
          <CopyMini text={node.content} />
        </span>
      </div>
      <div className="term-filecard-body">
        {isJson ? <JsonView text={node.content} /> : <div className="term-ascii term-foam">{node.content}</div>}

        {node.url && (
          <div className="term-actions-row">
            <a href={node.url} target="_blank" rel="noopener noreferrer" className="term-link-btn">
              🔗 Open {node.url}
            </a>
          </div>
        )}
        {name === 'contact.txt' && (
          <div className="term-actions-row">
            <a href="mailto:bikashdhakal546@gmail.com" className="term-link-btn">✉ Send Email</a>
            <a href="https://github.com/Dhakal009" target="_blank" rel="noopener noreferrer" className="term-link-btn">GitHub ↗</a>
            <a href="https://linkedin.com/in/bikash-dhakal" target="_blank" rel="noopener noreferrer" className="term-link-btn">LinkedIn ↗</a>
          </div>
        )}
        {dir === '~/projects' && (
          <div className="term-actions-row">
            <button
              type="button"
              className="term-link-btn"
              onClick={() => {
                const el = document.getElementById('projects');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              🚀 Jump to 3D Projects Gallery ↓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SkillBars() {
  return (
    <div className="term-skills">
      {SKILL_LEVELS.map(([group, items]) => (
        <div key={group} className="term-skill-group">
          <div className="term-line term-yellow term-bold">{group}</div>
          {items.map(([label, pct]) => {
            const filled = Math.round(pct / 5);
            return (
              <div key={label} className="term-skill-row term-line">
                <span className="term-skill-label term-foam">{label}</span>
                <span className="term-bar-fill">{'█'.repeat(filled)}</span>
                <span className="term-bar-empty">{'░'.repeat(20 - filled)}</span>
                <span className="term-dim term-skill-pct">{pct}%</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function LinuxTerminal() {
  const navigate = useNavigate();
  const { lenis } = useLenis();
  const { theme, setTheme, toggleTheme } = useTheme();

  const [cwd, setCwd] = useState('~');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputVal, setInputVal] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoTyping, setAutoTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // terminal owns the wheel only while focused

  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);
  const commandHistoryRef = useRef([]);
  const execRef = useRef(null);
  const autoRef = useRef({ active: false, timers: [] });

  // Keep the newest output in view (the body itself is a fixed-height scroll area)
  useEffect(() => {
    const el = terminalBodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history, isMinimized]);

  const scrollToSection = useCallback(
    (sectionId) => {
      const target = document.getElementById(sectionId);
      if (!target) return false;
      if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.2 });
      else target.scrollIntoView({ behavior: 'smooth' });
      return true;
    },
    [lenis]
  );

  // Shared by `goto`, `open`, and scripts
  const runGoto = useCallback(
    (destRaw) => {
      const dest = (destRaw || '').toLowerCase().replace(/^[/#]/, '');
      if (!dest) {
        return (
          <div className="term-line term-yellow">
            Usage: goto &lt;projects | skills | education | deliver | contact | home&gt;
          </div>
        );
      }
      if (dest === 'projects') {
        if (window.location.pathname !== '/') navigate('/#projects');
        else scrollToSection('projects');
        return <div className="term-line term-green">🚀 Scrolling to #projects 3D gallery...</div>;
      }
      if (dest === 'home' || dest === 'hero') {
        if (window.location.pathname !== '/') navigate('/');
        else scrollToSection('hero');
        return <div className="term-line term-green">🏠 Navigating to Home...</div>;
      }
      if (SECTIONS.includes(dest)) {
        if (window.location.pathname !== '/') navigate(`/#${dest}`);
        else scrollToSection(dest);
        return <div className="term-line term-green">📍 Scrolling to #{dest} section...</div>;
      }
      return (
        <div className="term-line term-red">
          Unknown destination: &apos;{dest}&apos;. Try: projects, experience, skills, contact, education, deliver, home.
        </div>
      );
    },
    [navigate, scrollToSection]
  );

  /* ---------- Boot: welcome banner, then auto-type `cat facts.json` ---------- */
  const finishAuto = useCallback((run) => {
    const a = autoRef.current;
    a.timers.forEach(clearTimeout);
    a.timers = [];
    if (!a.active) return;
    a.active = false;
    setAutoTyping(false);
    setInputVal('');
    if (run) execRef.current?.('cat facts.json');
  }, []);

  useEffect(() => {
    setHistory([
      {
        type: 'welcome',
        content: (
          <div className="term-welcome">
            <div className="term-line term-dim">
              Last login: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} on tty1
            </div>
            <div className="term-line term-cyan term-bold">
              Welcome to BikashOS v2.4 (x86_64-pc-linux-gnu) — Interactive Portfolio Shell
            </div>
            <div className="term-line" style={{ marginTop: '0.35rem' }}>
              <span className="term-dim">• System: </span>
              <span className="term-green">bikash@portfolio</span>
              <span className="term-dim"> | Status: </span>
              <span className="term-yellow">Full Stack Engineer & UI Designer</span>
            </div>
            <div className="term-line">
              <span className="term-dim">• Location: </span>
              <span className="term-foam">Kathmandu, Nepal (Open to Remote Worldwide)</span>
            </div>
            <div className="term-line" style={{ marginTop: '0.35rem' }}>
              <span className="term-dim">💡 Tip: Type </span>
              <span className="term-green term-bold">&apos;help&apos;</span>
              <span className="term-dim">, press </span>
              <span className="term-cyan term-bold">Tab</span>
              <span className="term-dim"> to autocomplete, or try </span>
              <span className="term-yellow term-bold">&apos;skills&apos;</span>
              <span className="term-dim"> and </span>
              <span className="term-yellow term-bold">&apos;grep react&apos;</span>
              <span className="term-dim">.</span>
            </div>
          </div>
        ),
      },
    ]);

    const a = autoRef.current;
    const cmd = 'cat facts.json';
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    a.active = true;
    setAutoTyping(true);

    if (reduce) {
      a.timers.push(setTimeout(() => finishAuto(true), 0));
    } else {
      const start = 700;
      const step = 55;
      [...cmd].forEach((_, i) => {
        a.timers.push(setTimeout(() => setInputVal(cmd.slice(0, i + 1)), start + i * step));
      });
      a.timers.push(setTimeout(() => finishAuto(true), start + cmd.length * step + 350));
    }

    return () => {
      a.timers.forEach(clearTimeout);
      a.timers = [];
      a.active = false;
    };
  }, [finishAuto]);

  /* ---------- Command execution ---------- */
  const executeCommand = useCallback(
    (rawCmd) => {
      let line = rawCmd.trim();
      if (!line) {
        setHistory((prev) => [...prev, { type: 'cmd', cmd: '', cwd, output: null }]);
        return;
      }

      if (line === '!!') line = commandHistoryRef.current.at(-1) || '';
      commandHistoryRef.current.push(rawCmd.trim());
      setHistoryIndex(-1);

      // Expand aliases (from ~/.bashrc)
      const first = line.split(/\s+/)[0];
      if (ALIASES[first]) line = ALIASES[first] + line.slice(first.length);

      const parts = line.split(/\s+/);
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);
      let output = null;

      const runScript = (name) => {
        const { node } = resolveFile(name, cwd);
        if (!node) return <div className="term-line term-red">{name}: No such file or directory</div>;
        if (!node.isExec) return <div className="term-line term-red">{name}: Permission denied</div>;
        const lines = node.content.split('\n').filter((l) => l && !l.startsWith('#'));
        return (
          <div>
            {lines.map((l, i) => (
              <div key={i} className="term-line term-dim">+ {l}</div>
            ))}
            {lines.map((l, i) => {
              const [c, a] = l.split(/\s+/);
              return c === 'goto' ? <div key={`r${i}`}>{runGoto(a)}</div> : null;
            })}
          </div>
        );
      };

      switch (command) {
        case 'help':
        case 'man': {
          output = (
            <div className="term-help" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div className="term-line term-cyan term-bold">Available Linux &amp; Portfolio Commands:</div>
              {HELP.map(([title, rows]) => (
                <div key={title}>
                  <div className="term-line term-yellow term-bold">{title}:</div>
                  {rows.map(([cmd, desc]) => (
                    <div key={cmd} className="term-line term-dim">
                      • <span className="term-green">{cmd}</span> — {desc}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
          break;
        }

        case 'clear':
        case 'cls':
          setHistory([]);
          return;

        case 'pwd': {
          const fullPath = cwd === '~' ? '/home/bikash' : `/home/bikash/${cwd.replace('~/', '')}`;
          output = <div className="term-line term-cyan">{fullPath}</div>;
          break;
        }

        case 'whoami':
          output = (
            <div className="term-line">
              <span className="term-green term-bold">bikash</span> — Full Stack Engineer &amp; UI Designer from Kathmandu, Nepal.
            </div>
          );
          break;

        case 'id':
          output = (
            <div className="term-line term-dim">
              uid=1000(bikash) gid=1000(bikash) groups=1000(bikash),4(adm),24(cdrom),27(sudo),100(developers),101(creatives)
            </div>
          );
          break;

        case 'uname':
          output = (
            <div className="term-line term-dim">
              {args.includes('-a') || args.includes('-r')
                ? 'Linux portfolio-engine 6.8.0-generic #1 SMP PREEMPT x86_64 GNU/Linux'
                : 'Linux'}
            </div>
          );
          break;

        case 'date':
          output = <div className="term-line term-cyan">{new Date().toString()}</div>;
          break;

        case 'uptime':
          output = (
            <div className="term-line term-dim">
              up 42 days, 13:37, 1 user, load average: 0.08, 0.04, 0.01 (100% focused)
            </div>
          );
          break;

        case 'top':
          output = (
            <div className="term-ascii term-foam">
              {`top - up 42 days, 1 user, load average: 0.08, 0.04, 0.01
Tasks:   6 total,   2 running,   4 sleeping

  PID USER    %CPU %MEM  COMMAND
 1001 bikash  42.0  8.1  vite --host
 1002 bikash  27.5  6.4  react-devtools
 1003 bikash  12.3  3.2  framer-motion --60fps
 1004 bikash   5.1  1.9  coffee.service
 1005 bikash   0.4  0.5  bug-hunter (sleeping)
 1006 bikash   0.0  0.1  imposter-syndrome (killed)`}
            </div>
          );
          break;

        case 'history':
          if (args[0] === '-c') {
            commandHistoryRef.current = [];
            output = <div className="term-line term-green">✔ History cleared.</div>;
          } else {
            output = (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                {commandHistoryRef.current.map((item, idx) => (
                  <div key={idx} className="term-line term-dim">
                    <span style={{ minWidth: '35px', display: 'inline-block', color: 'var(--subtle)' }}>{idx + 1}</span> {item}
                  </div>
                ))}
              </div>
            );
          }
          break;

        case 'alias':
          output = (
            <div>
              {Object.entries(ALIASES).map(([k, v]) => (
                <div key={k} className="term-line term-dim">
                  alias <span className="term-green">{k}</span>=&apos;{v}&apos;
                </div>
              ))}
            </div>
          );
          break;

        case 'echo': {
          const text = args
            .join(' ')
            .replace(/\$USER/g, 'bikash')
            .replace(/\$SHELL/g, '/bin/bash')
            .replace(/\$HOME/g, '/home/bikash')
            .replace(/\$PWD/g, cwd === '~' ? '/home/bikash' : `/home/bikash/${cwd.replace('~/', '')}`);
          output = <div className="term-line term-foam">{text}</div>;
          break;
        }

        case 'fortune':
          output = (
            <div className="term-line term-yellow">
              {FORTUNES[Math.floor(Math.random() * FORTUNES.length)]}
            </div>
          );
          break;

        case 'cowsay':
          output = <div className="term-ascii term-green">{cowsay(args.join(' '))}</div>;
          break;

        case 'skills':
          output = <SkillBars />;
          break;

        case 'theme': {
          const sub = args[0]?.toLowerCase();
          if (sub === 'dark' || sub === 'light') {
            setTheme(sub);
            output = <div className="term-line term-green">✔ Switched theme to {sub === 'dark' ? 'Dark' : 'Light'} mode.</div>;
          } else {
            toggleTheme();
            output = (
              <div className="term-line term-green">
                ✔ Toggled theme! (Current: <span className="term-bold">{theme === 'dark' ? 'light' : 'dark'}</span>)
              </div>
            );
          }
          break;
        }

        case 'neofetch':
        case 'fastfetch': {
          const rows = [
            ['OS:', 'BikashOS Linux x86_64'],
            ['Host:', 'Portfolio Web Engine v2.0 (React 19 + Vite)'],
            ['Role:', 'Full Stack Developer & UI Designer'],
            ['Location:', 'Kathmandu, Nepal (Open to Remote)'],
            ['Shell:', 'bash 5.2.26'],
            ['Theme:', `${theme.toUpperCase()} mode`],
            ['Core Stack:', 'React, Node.js, TypeScript, Next.js, Framer Motion'],
          ];
          output = (
            <div className="neofetch-card">
              <div className="neofetch-logo">{ASCII_NEOFETCH}</div>
              <div className="neofetch-info">
                <div className="term-line term-bold" style={{ borderBottom: '1px solid var(--line)', paddingBottom: '0.25rem' }}>
                  <span className="term-green">bikash</span>
                  <span className="term-dim">@</span>
                  <span className="term-cyan">portfolio</span>
                </div>
                {rows.map(([label, val]) => (
                  <div key={label} className="neofetch-row">
                    <span className="neofetch-label">{label}</span>
                    <span className="neofetch-val">{val}</span>
                  </div>
                ))}
                <div className="neofetch-row">
                  <span className="neofetch-label">Status:</span>
                  <span className="neofetch-val term-green">● Open for work &amp; collaboration</span>
                </div>
                <div className="color-blocks">
                  {['#0c0c0c', '#f87171', '#4ade80', '#facc15', '#38bdf8', '#c084fc', '#2dd4bf', '#ededed'].map((c) => (
                    <span key={c} className="color-block" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>
          );
          break;
        }

        case 'ls':
        case 'dir': {
          const flags = args.filter((a) => a.startsWith('-')).join('');
          const isAll = flags.includes('a');
          const isLong = flags.includes('l');
          const pathArg = args.find((a) => !a.startsWith('-'));
          const targetDir = pathArg ? resolveDir(pathArg, cwd) : cwd;

          if (!targetDir) {
            output = <div className="term-line term-red">ls: cannot access &apos;{pathArg}&apos;: No such file or directory</div>;
            break;
          }

          const dirNode = DIRS[targetDir];
          const entries = Object.keys(dirNode.children).filter((n) => isAll || !n.startsWith('.'));

          if (isLong) {
            output = (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div className="term-line term-dim">total {entries.length * 4}</div>
                {entries.map((name) => {
                  const item = dirNode.children[name];
                  const isDir = item.type === 'dir';
                  const perm = isDir ? 'drwxr-xr-x' : item.isExec ? '-rwxr-xr-x' : '-rw-r--r--';
                  const size = isDir ? '4096' : String(item.content?.length || 1024);
                  return (
                    <div key={name} className="term-line" style={{ display: 'flex', gap: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                      <span className="term-dim">{perm}</span>
                      <span className="term-dim">1 bikash bikash</span>
                      <span className="term-dim" style={{ minWidth: '45px', textAlign: 'right' }}>{size}</span>
                      <span className="term-dim">Oct 11 2026</span>
                      <span className={isDir ? 'term-cyan term-bold' : item.isExec ? 'term-green term-bold' : 'term-foam'}>
                        {name}{isDir ? '/' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          } else {
            output = (
              <div className="term-grid">
                {entries.map((name) => {
                  const item = dirNode.children[name];
                  const isDir = item.type === 'dir';
                  return (
                    <span key={name} className={`term-entry ${isDir ? 'is-dir' : item.isExec ? 'is-exec' : 'is-file'}`}>
                      {name}{isDir ? '/' : ''}
                    </span>
                  );
                })}
              </div>
            );
          }
          break;
        }

        case 'cat': {
          if (!args[0]) {
            output = <div className="term-line term-red">cat: missing file operand. Example: cat facts.json</div>;
            break;
          }
          const { dir, name, node } = resolveFile(args[0], cwd);
          if (!node) {
            output = <div className="term-line term-red">cat: {args[0]}: No such file or directory</div>;
          } else if (node.type === 'dir') {
            output = <div className="term-line term-red">cat: {args[0]}: Is a directory</div>;
          } else {
            output = <FileOutput name={name} node={node} dir={dir} />;
          }
          break;
        }

        case 'grep': {
          const term = args.join(' ').replace(/^['"]|['"]$/g, '');
          if (!term) {
            output = <div className="term-line term-yellow">Usage: grep &lt;word&gt; — searches every file</div>;
            break;
          }
          const hits = [];
          allFiles().forEach(({ path, node }) => {
            node.content.split('\n').forEach((text, i) => {
              if (text.toLowerCase().includes(term.toLowerCase())) hits.push({ path, n: i + 1, text });
            });
          });
          output = hits.length ? (
            <div>
              {hits.slice(0, 30).map((h, i) => (
                <div key={i} className="term-line term-grep-row">
                  <span className="term-cyan">{h.path}</span>
                  <span className="term-dim">:{h.n}:</span>
                  <Highlight line={h.text.trim()} term={term} />
                </div>
              ))}
              <div className="term-line term-dim">
                {hits.length} match{hits.length === 1 ? '' : 'es'}{hits.length > 30 ? ' (showing first 30)' : ''}
              </div>
            </div>
          ) : (
            <div className="term-line term-yellow">grep: no matches for &apos;{term}&apos;</div>
          );
          break;
        }

        case 'find': {
          const term = (args[0] || '').toLowerCase();
          const found = allFiles().filter(({ path }) => path.toLowerCase().includes(term));
          output = found.length ? (
            <div>
              {found.map(({ path }) => (
                <div key={path} className="term-line term-foam">./{path}</div>
              ))}
            </div>
          ) : (
            <div className="term-line term-yellow">find: nothing matches &apos;{args[0]}&apos;</div>
          );
          break;
        }

        case 'bash':
        case 'sh':
          output = args[0]
            ? runScript(args[0])
            : <div className="term-line term-yellow">Usage: bash &lt;script&gt; (try: cd projects, then bash view-all.sh)</div>;
          break;

        case 'cd': {
          const dest = (args[0] || '~').trim().toLowerCase().replace(/\/$/, '');

          if (dest === 'projects' || dest === '~/projects' || dest === '/projects') {
            setCwd('~/projects');
            output = (
              <div className="term-line term-green">
                ✔ Scrolling to <span className="term-bold">Projects</span> 3D gallery (#projects)...
              </div>
            );
            setTimeout(() => scrollToSection('projects'), 300);
          } else if (dest === 'home') {
            output = runGoto('home');
          } else if (SECTIONS.includes(dest)) {
            output = scrollToSection(dest)
              ? <div className="term-line term-green">📍 Jumped to #{dest} section.</div>
              : <div className="term-line term-red">cd: section #{dest} not found on this view</div>;
          } else {
            const d = resolveDir(dest, cwd);
            if (d) {
              setCwd(d);
              output = <div className="term-line term-green">✔ Changed directory to {d}</div>;
            } else {
              output = (
                <div className="term-line term-red">
                  cd: no such file or directory: {args[0]}
                  <div className="term-dim" style={{ marginTop: '0.2rem' }}>
                    Available navigation targets: projects, socials, experience, skills, education, deliver, contact, home
                  </div>
                </div>
              );
            }
          }
          break;
        }

        case 'goto':
        case 'nav':
        case 'jump':
          output = runGoto(args[0]);
          break;

        case 'open': {
          const target = (args[0] || '').toLowerCase();
          const external = {
            github: ['https://github.com/Dhakal009', 'GitHub'],
            linkedin: ['https://linkedin.com/in/bikash-dhakal', 'LinkedIn'],
            twitter: ['https://twitter.com/bikash_dhakal', 'Twitter'],
            x: ['https://twitter.com/bikash_dhakal', 'Twitter'],
          };
          if (external[target]) {
            window.open(external[target][0], '_blank', 'noopener,noreferrer');
            output = <div className="term-line term-green">✔ Opening {external[target][1]} profile in new tab...</div>;
          } else if (target === 'email' || target === 'mail') {
            window.location.href = 'mailto:bikashdhakal546@gmail.com';
            output = <div className="term-line term-green">✔ Launching default email client to write Bikash...</div>;
          } else if (target === 'projects') {
            if (window.location.pathname !== '/') navigate('/#projects');
            else scrollToSection('projects');
            output = <div className="term-line term-green">✔ Scrolling to #projects section...</div>;
          } else if (target === 'home') {
            navigate('/');
            output = <div className="term-line term-green">✔ Navigating to home...</div>;
          } else {
            output = (
              <div className="term-line term-yellow">
                Usage: open &lt;github | linkedin | email | twitter | projects | home&gt;
              </div>
            );
          }
          break;
        }

        case 'tree':
          output = (
            <div className="term-ascii term-cyan">
              {`.
├── README.md
├── bio.txt
├── facts.json
├── skills.txt
├── experience.txt
├── education.txt
├── contact.txt
├── projects/
│   ├── ems.txt
│   ├── live-chat.txt
│   ├── ecommerce-app.txt
│   └── view-all.sh
└── socials/
    ├── github.url
    ├── linkedin.url
    └── email.url

2 directories, 13 files`}
            </div>
          );
          break;

        case 'curl': {
          const target = (args[0] || '').toLowerCase();
          if (target === 'wttr.in' || target === 'weather') {
            output = (
              <div className="term-ascii term-cyan">
{`Weather: Kathmandu, Nepal
   \\   /     Clear Sky
    .-.      Temperature: +22°C (72°F)
 ― (   ) ―   Wind: 6 km/h ↗ NE
    \`-’      Humidity: 48%
   /   \\     Visibility: 10 km
Location: Kathmandu Valley, Nepal`}
              </div>
            );
          } else if (target === 'quote') {
            output = (
              <div className="term-line term-yellow">
                &ldquo;Simplicity is prerequisite for reliability.&rdquo; — Edsger W. Dijkstra
              </div>
            );
          } else if (target === 'bio' || target === 'api/bio') {
            output = (
              <div className="term-filecard">
                <div className="term-filecard-body">
                  <div className="term-line term-green">HTTP/1.1 200 OK</div>
                  <div className="term-line term-dim">Content-Type: application/json</div>
                  <JsonView
                    text={`{\n  "name": "Bikash Dhakal",\n  "title": "Full Stack Engineer & UI Designer",\n  "status": "Available",\n  "api": "v2.0"\n}`}
                  />
                </div>
              </div>
            );
          } else {
            output = (
              <div className="term-line term-yellow">
                Simulated curl endpoint. Try: curl wttr.in, curl quote, or curl bio
              </div>
            );
          }
          break;
        }

        case 'ping': {
          const host = args[0] || 'portfolio.local';
          output = (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div className="term-line term-dim">PING {host} (127.0.0.1) 56(84) bytes of data.</div>
              <div className="term-line term-green">64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms</div>
              <div className="term-line term-green">64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.038 ms</div>
              <div className="term-line term-dim">--- {host} ping statistics ---</div>
              <div className="term-line term-dim">2 packets transmitted, 2 received, 0% packet loss, time 1002ms</div>
            </div>
          );
          break;
        }

        case 'sudo':
          output = (
            <div className="term-line term-red">
              [sudo] password for visitor: <br />
              Permission denied: You already have full access as a welcome guest! 😄
            </div>
          );
          break;

        case 'rm':
        case 'mkdir':
        case 'touch':
          output = (
            <div className="term-line term-yellow">
              {command}: cannot modify: File system is mounted in read-only showcase mode.
            </div>
          );
          break;

        case 'vim':
        case 'vi':
        case 'nano':
          output = (
            <div className="term-line term-yellow">
              Launching {command}... Just kidding! Read files safely using &apos;cat &lt;file&gt;&apos; instead.
            </div>
          );
          break;

        case 'exit':
        case 'reset':
          setCwd('~');
          setHistory([
            {
              type: 'welcome',
              content: <div className="term-line term-green">Terminal session reset. Type &apos;help&apos; for commands.</div>,
            },
          ]);
          return;

        default:
          if (command.startsWith('./')) {
            output = runScript(command.slice(2));
          } else {
            output = (
              <div className="term-line term-red">
                command not found: {command}. Type <span className="term-cyan term-bold">&apos;help&apos;</span> to see available commands.
              </div>
            );
          }
          break;
      }

      setHistory((prev) => [...prev, { type: 'cmd', cmd: rawCmd, cwd, output }]);
    },
    [cwd, navigate, runGoto, scrollToSection, setTheme, theme, toggleTheme]
  );

  execRef.current = executeCommand;

  // Lets the site search run a command here (e.g. picking "neofetch" in the search modal)
  useEffect(() => {
    const onRun = (e) => {
      const cmd = e.detail?.command;
      if (!cmd) return;
      finishAuto(false);
      execRef.current?.(cmd);
    };
    window.addEventListener('portfolio:terminal-run', onRun);
    return () => window.removeEventListener('portfolio:terminal-run', onRun);
  }, [finishAuto]);

  const runChip = (cmd) => {
    finishAuto(false);
    executeCommand(cmd);
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (autoRef.current.active) return;
    executeCommand(inputVal);
    setInputVal('');
  };

  /* ---------- Tab completion ---------- */
  const completeInput = () => {
    const text = inputVal.replace(/^\s+/, '');
    if (!text) return;

    const hasSpace = /\s/.test(text);
    let prefix;
    let head;
    let pool;

    if (!hasSpace) {
      prefix = text;
      head = '';
      pool = [...COMMANDS, ...Object.keys(ALIASES)];
    } else {
      const cmd = text.split(/\s+/)[0].toLowerCase();
      const tokens = text.split(/\s+/);
      prefix = /\s$/.test(text) ? '' : tokens[tokens.length - 1];
      head = text.slice(0, text.length - prefix.length);

      const dirNode = DIRS[cwd];
      const here = Object.entries(dirNode.children).map(([n, v]) => (v.type === 'dir' ? `${n}/` : n));
      const nested = cwd === '~'
        ? ['projects', 'socials'].flatMap((d) => Object.keys(HOME.children[d].children).map((n) => `${d}/${n}`))
        : [];
      const files = [...here, ...nested].filter((n) => prefix.startsWith('.') || !n.startsWith('.'));

      if (['cat', 'ls', 'dir', 'grep', 'find'].includes(cmd)) pool = files;
      else if (['bash', 'sh'].includes(cmd)) pool = files.filter((f) => f.endsWith('.sh'));
      else if (cmd === 'cd') pool = [...here.filter((n) => n.endsWith('/')), ...SECTIONS, 'home', '..', '~'];
      else if (['goto', 'nav', 'jump'].includes(cmd)) pool = [...SECTIONS, 'projects', 'home'];
      else if (cmd === 'open') pool = ['github', 'linkedin', 'twitter', 'email', 'projects', 'home'];
      else if (cmd === 'theme') pool = ['dark', 'light', 'toggle'];
      else if (cmd === 'curl') pool = ['weather', 'quote', 'bio'];
      else pool = [];
    }

    const matches = [...new Set(pool.filter((p) => p.toLowerCase().startsWith(prefix.toLowerCase())))];
    if (matches.length === 0) return;

    if (matches.length === 1) {
      const m = matches[0];
      setInputVal(head + m + (m.endsWith('/') ? '' : ' '));
      return;
    }

    const common = commonPrefix(matches);
    if (common.length > prefix.length) {
      setInputVal(head + common);
    } else {
      setHistory((prev) => [
        ...prev,
        {
          type: 'cmd',
          cmd: inputVal,
          cwd,
          output: (
            <div className="term-grid">
              {matches.map((m) => (
                <span key={m} className={`term-entry ${m.endsWith('/') ? 'is-dir' : 'is-file'}`}>{m}</span>
              ))}
            </div>
          ),
        },
      ]);
    }
  };

  /* ---------- Keyboard ---------- */
  const handleKeyDown = (e) => {
    // Esc: hand scrolling back to the page
    if (e.key === 'Escape') {
      inputRef.current?.blur();
      return;
    }

    // Any key while the intro is typing: skip the animation and show the facts right away
    if (autoRef.current.active) {
      e.preventDefault();
      finishAuto(true);
      return;
    }

    const list = commandHistoryRef.current;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (list.length === 0) return;
      const nextIdx = historyIndex === -1 ? list.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(list[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= list.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(list[nextIdx] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      completeInput();
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setHistory([]);
    } else if (e.ctrlKey && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      setInputVal('');
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      // Let the browser copy when text is selected
      if (inputRef.current && inputRef.current.selectionStart !== inputRef.current.selectionEnd) return;
      e.preventDefault();
      setHistory((prev) => [...prev, { type: 'cmd', cmd: `${inputVal}^C`, cwd, output: null }]);
      setInputVal('');
    }
  };

  const handleCopy = () => {
    if (!terminalBodyRef.current) return;
    navigator.clipboard.writeText(terminalBodyRef.current.innerText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleContainerClick = (e) => {
    if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON' && !window.getSelection()?.toString()) {
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  /* ---------- Render ---------- */
  return (
    <div
      className={`terminal-container reveal ${isExpanded ? 'is-expanded' : ''} ${isMinimized ? 'is-minimized' : ''} ${isFocused ? 'is-focused' : ''}`}
      onClick={handleContainerClick}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsFocused(false);
      }}
      role="region"
      aria-label="Interactive Linux Terminal"
    >
      <div className="terminal-header">
        <div className="terminal-controls">
          <button
            type="button"
            className="terminal-dot dot-close"
            title="Clear terminal session"
            aria-label="Clear session"
            onClick={(e) => { e.stopPropagation(); setHistory([]); }}
          />
          <button
            type="button"
            className="terminal-dot dot-minimize"
            title="Toggle minimize"
            aria-label="Minimize terminal"
            onClick={(e) => { e.stopPropagation(); setIsMinimized((v) => !v); }}
          />
          <button
            type="button"
            className="terminal-dot dot-maximize"
            title="Toggle full width view"
            aria-label="Expand terminal"
            onClick={(e) => { e.stopPropagation(); setIsExpanded((v) => !v); }}
          />
        </div>

        <div className="terminal-title">
          <span>bikash@portfolio: {cwd} (bash)</span>
        </div>

        <div className="terminal-actions">
          <div className="terminal-status-badge">
            <span className="terminal-status-dot" aria-hidden="true" />
            <span>online</span>
          </div>
          <button
            type="button"
            className="terminal-btn-icon"
            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
            title="Copy terminal contents"
          >
            {copied ? '✔ Copied' : 'Copy'}
          </button>
          <button
            type="button"
            className="terminal-btn-icon"
            onClick={(e) => { e.stopPropagation(); setHistory([]); }}
            title="Clear terminal"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="terminal-quick-chips" onClick={(e) => e.stopPropagation()}>
        <span className="terminal-chip-label">Quick Run:</span>
        {QUICK_COMMANDS.map((cmd) => (
          <button key={cmd} type="button" className="terminal-chip" onClick={() => runChip(cmd)}>
            {cmd}
          </button>
        ))}
      </div>

      {/* Only while focused: data-lenis-prevent lets the wheel scroll the terminal; otherwise the page scrolls */}
      <div
        className="terminal-body"
        ref={terminalBodyRef}
        {...(isFocused ? { 'data-lenis-prevent': true } : {})}
      >
        {history.map((entry, index) => {
          if (entry.type === 'welcome') return <div key={index}>{entry.content}</div>;
          return (
            <div key={index} className="term-line">
              <div className="term-cmd-row">
                <span className="term-prompt">
                  <span className="term-prompt-user">bikash@portfolio</span>
                  <span className="term-prompt-sep">:</span>
                  <span className="term-prompt-path">{entry.cwd}</span>
                  <span className="term-prompt-char">$</span>
                </span>
                <span className="term-cmd-text">{entry.cmd}</span>
              </div>
              {entry.output && <div className="term-output">{entry.output}</div>}
            </div>
          );
        })}

        <form onSubmit={handleFormSubmit} className="term-input-line">
          <span className="term-prompt">
            <span className="term-prompt-user">bikash@portfolio</span>
            <span className="term-prompt-sep">:</span>
            <span className="term-prompt-path">{cwd}</span>
            <span className="term-prompt-char">$</span>
          </span>
          <input
            ref={inputRef}
            type="text"
            className="term-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={autoTyping}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            aria-label="Terminal command prompt"
            placeholder={autoTyping ? '' : "Type 'help', 'skills', or 'grep react'..."}
          />
        </form>
      </div>

      <div className="terminal-footer-hint">
        <div className="terminal-keys-hint">
          <span><kbd className="term-key">Tab</kbd> Autocomplete</span>
          <span><kbd className="term-key">↑</kbd><kbd className="term-key">↓</kbd> History</span>
          <span><kbd className="term-key">Ctrl+L</kbd> Clear</span>
          <span><kbd className="term-key">Ctrl+U</kbd> Wipe line</span>
          <span>
            {isFocused
              ? <><kbd className="term-key">Esc</kbd> Release scroll</>
              : 'Click to scroll terminal'}
          </span>
        </div>
        <span className="term-dim">bash 5.2.26</span>
      </div>
    </div>
  );
}