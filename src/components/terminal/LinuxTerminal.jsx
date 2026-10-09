import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLenis } from '../../contexts/LenisContext';
import { useTheme } from '../../contexts/ThemeContext';

// Virtual filesystem files and content
const FILESYSTEM = {
  '~': {
    type: 'dir',
    children: {
      'README.md': {
        type: 'file',
        content: `# Welcome to Bikash Dhakal's Portfolio Terminal 🚀
------------------------------------------------------------
Navigate and explore the website just like a Linux shell:

  • Type 'cat bio.txt'       to read Bikash's background and story.
  • Type 'cat skills.txt'    to view technical skills and proficiencies.
  • Type 'cat facts.json'    to inspect quick profile facts in JSON.
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
      'projects': {
        type: 'dir',
        children: {
          'aether.txt': {
            type: 'file',
            content: `Project: Aether E-Commerce (2025)
Type:    Full Stack Application
Stack:   React, Node.js, PostgreSQL, Stripe, Tailwind CSS
Summary: Scalable e-commerce platform with real-time inventory management,
         sub-second product filtering, and smooth animated checkout flow.
Tip:     Run 'goto projects' to view project details.`,
          },
          'lumina.txt': {
            type: 'file',
            content: `Project: Lumina Dashboard (2024)
Type:    SaaS Analytics Platform
Stack:   Next.js, TypeScript, Tailwind, Chart.js, Prisma
Summary: Modern data visualization platform rendering live telemetry,
         user engagement funnels, and customizable widget dashboards.
Tip:     Run 'goto projects' to view project details.`,
          },
          'vortex.txt': {
            type: 'file',
            content: `Project: Vortex Portfolio (2024)
Type:    Creative WebGL Experience
Stack:   Three.js, GSAP, WebGL, React
Summary: Interactive 3D portfolio featuring procedural particle simulations,
         dynamic shader uniforms, and smooth scroll choreography.
Tip:     Run 'goto projects' to view project details.`,
          },
          'view-all.sh': {
            type: 'file',
            isExec: true,
            content: `#!/bin/bash\n# Navigates to the full Projects page\ngoto projects`,
          },
        },
      },
      'socials': {
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

const ASCII_NEOFETCH = `   ██████╗ ██████╗ 
   ██╔══██╗██╔══██╗
   ██████╔╝██║  ██║
   ██╔══██╗██║  ██║
   ██████╔╝██████╔╝
   ╚═════╝ ╚═════╝ `;

const SECTIONS = ['hero', 'about', 'experience', 'projects-preview', 'education', 'skills', 'deliver', 'contact'];

const QUICK_COMMANDS = [
  'help',
  'neofetch',
  'cat bio.txt',
  'cat skills.txt',
  'cd projects',
  'goto contact',
  'theme toggle',
  'clear',
];

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

  // Terminal scroll & input references
  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);
  const commandHistoryRef = useRef([]);

  // Scroll to bottom on new output
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  // Smooth scroll to a section on page
  const scrollToSection = useCallback(
    (sectionId) => {
      const targetId = sectionId === 'projects' ? 'projects-preview' : sectionId;
      const target = document.getElementById(targetId);
      if (target) {
        if (lenis) {
          lenis.scrollTo(target, { offset: -40, duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        return true;
      }
      return false;
    },
    [lenis]
  );

  // Initial welcome message on mount
  useEffect(() => {
    const welcomeEntry = {
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
            <span className="term-dim"> or click the action chips above to explore. Try </span>
            <span className="term-cyan term-bold">&apos;cd projects&apos;</span>
            <span className="term-dim"> or </span>
            <span className="term-yellow term-bold">&apos;cat bio.txt&apos;</span>
            <span className="term-dim">.</span>
          </div>
        </div>
      ),
    };

    setHistory([welcomeEntry]);
  }, []);

  // Helper to resolve directory node
  const getDirNode = useCallback((path) => {
    if (path === '~' || path === '/home/bikash' || path === '') {
      return FILESYSTEM['~'];
    }
    if (path === '~/projects' || path === 'projects') {
      return FILESYSTEM['~'].children['projects'];
    }
    if (path === '~/socials' || path === 'socials') {
      return FILESYSTEM['~'].children['socials'];
    }
    return null;
  }, []);

  // Execute terminal command
  const executeCommand = useCallback(
    (rawCmd) => {
      const trimmed = rawCmd.trim();
      if (!trimmed) {
        setHistory((prev) => [...prev, { type: 'cmd', cmd: '', cwd, output: null }]);
        return;
      }

      // Add to command history memory for arrow navigation
      commandHistoryRef.current.push(trimmed);
      setHistoryIndex(-1);

      const parts = trimmed.split(/\s+/);
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);

      let output = null;

      switch (command) {
        case 'help':
        case 'man': {
          output = (
            <div className="term-help" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div className="term-line term-cyan term-bold">
                Available Linux &amp; Portfolio Commands:
              </div>

              <div>
                <div className="term-line term-yellow term-bold">1. Navigation:</div>
                <div className="term-line term-dim">
                  • <span className="term-green">cd projects</span> / <span className="term-green">goto projects</span> — Navigate to Projects page
                </div>
                <div className="term-line term-dim">
                  • <span className="term-green">cd &lt;section&gt;</span> / <span className="term-green">goto &lt;sec&gt;</span> — Jump to (experience, skills, education, deliver, contact, home)
                </div>
                <div className="term-line term-dim">
                  • <span className="term-green">cd ~</span> / <span className="term-green">cd ..</span> — Return to root / home
                </div>
                <div className="term-line term-dim">
                  • <span className="term-green">open &lt;github|linkedin|email|projects&gt;</span> — Open link or page
                </div>
              </div>

              <div>
                <div className="term-line term-yellow term-bold">2. Files &amp; Content:</div>
                <div className="term-line term-dim">
                  • <span className="term-green">ls [-a] [-l]</span> — List files and directories
                </div>
                <div className="term-line term-dim">
                  • <span className="term-green">cat &lt;file&gt;</span> — Read file (e.g. cat bio.txt, cat skills.txt, cat facts.json)
                </div>
                <div className="term-line term-dim">
                  • <span className="term-green">pwd</span> — Print current working directory
                </div>
                <div className="term-line term-dim">
                  • <span className="term-green">tree</span> — Visual directory tree
                </div>
              </div>

              <div>
                <div className="term-line term-yellow term-bold">3. System &amp; Developer Info:</div>
                <div className="term-line term-dim">
                  • <span className="term-green">neofetch</span> — Developer specifications &amp; ASCII badge
                </div>
                <div className="term-line term-dim">
                  • <span className="term-green">whoami</span> — Identity and background
                </div>
                <div className="term-line term-dim">
                  • <span className="term-green">theme &lt;dark|light|toggle&gt;</span> — Switch portfolio theme
                </div>
                <div className="term-line term-dim">
                  • <span className="term-green">date</span>, <span className="term-green">uptime</span>, <span className="term-green">uname -a</span> — System metrics
                </div>
              </div>

              <div>
                <div className="term-line term-yellow term-bold">4. Utilities:</div>
                <div className="term-line term-dim">
                  • <span className="term-green">clear</span> — Clear terminal output
                </div>
                <div className="term-line term-dim">
                  • <span className="term-green">curl &lt;weather|quote|bio&gt;</span> — Fetch simulated network endpoints
                </div>
                <div className="term-line term-dim">
                  • <span className="term-green">history</span> — View command history
                </div>
                <div className="term-line term-dim">
                  • <span className="term-green">echo &lt;text&gt;</span> — Print formatted message
                </div>
              </div>
            </div>
          );
          break;
        }

        case 'clear':
        case 'cls': {
          setHistory([]);
          return;
        }

        case 'pwd': {
          const fullPath = cwd === '~' ? '/home/bikash' : `/home/bikash/${cwd.replace('~/', '')}`;
          output = <div className="term-line term-cyan">{fullPath}</div>;
          break;
        }

        case 'whoami': {
          output = (
            <div className="term-line">
              <span className="term-green term-bold">bikash</span> — Full Stack Engineer &amp; UI Designer from Kathmandu, Nepal.
            </div>
          );
          break;
        }

        case 'id': {
          output = (
            <div className="term-line term-dim">
              uid=1000(bikash) gid=1000(bikash) groups=1000(bikash),4(adm),24(cdrom),27(sudo),100(developers),101(creatives)
            </div>
          );
          break;
        }

        case 'uname': {
          if (args.includes('-a') || args.includes('-r')) {
            output = <div className="term-line term-dim">Linux portfolio-engine 6.8.0-generic #1 SMP PREEMPT x86_64 GNU/Linux</div>;
          } else {
            output = <div className="term-line term-dim">Linux</div>;
          }
          break;
        }

        case 'date': {
          output = <div className="term-line term-cyan">{new Date().toString()}</div>;
          break;
        }

        case 'uptime': {
          output = (
            <div className="term-line term-dim">
              up 42 days, 13:37, 1 user, load average: 0.08, 0.04, 0.01 (100% focused)
            </div>
          );
          break;
        }

        case 'history': {
          output = (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              {commandHistoryRef.current.map((item, idx) => (
                <div key={idx} className="term-line term-dim">
                  <span style={{ minWidth: '35px', display: 'inline-block', color: 'var(--subtle)' }}>{idx + 1}</span> {item}
                </div>
              ))}
            </div>
          );
          break;
        }

        case 'echo': {
          let text = args.join(' ');
          text = text
            .replace(/\$USER/g, 'bikash')
            .replace(/\$SHELL/g, '/bin/bash')
            .replace(/\$HOME/g, '/home/bikash')
            .replace(/\$PWD/g, cwd === '~' ? '/home/bikash' : `/home/bikash/${cwd}`);
          output = <div className="term-line term-foam">{text}</div>;
          break;
        }

        case 'theme': {
          const sub = args[0]?.toLowerCase();
          if (sub === 'dark') {
            setTheme('dark');
            output = <div className="term-line term-green">✔ Switched theme to Dark mode.</div>;
          } else if (sub === 'light') {
            setTheme('light');
            output = <div className="term-line term-green">✔ Switched theme to Light mode.</div>;
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
          output = (
            <div className="neofetch-card">
              <div className="neofetch-logo">{ASCII_NEOFETCH}</div>
              <div className="neofetch-info">
                <div className="term-line term-bold" style={{ borderBottom: '1px solid var(--line)', paddingBottom: '0.25rem' }}>
                  <span className="term-green">bikash</span>
                  <span className="term-dim">@</span>
                  <span className="term-cyan">portfolio</span>
                </div>
                <div className="neofetch-row">
                  <span className="neofetch-label">OS:</span>
                  <span className="neofetch-val">BikashOS Linux x86_64</span>
                </div>
                <div className="neofetch-row">
                  <span className="neofetch-label">Host:</span>
                  <span className="neofetch-val">Portfolio Web Engine v2.0 (React 19 + Vite)</span>
                </div>
                <div className="neofetch-row">
                  <span className="neofetch-label">Role:</span>
                  <span className="neofetch-val">Full Stack Developer &amp; UI Designer</span>
                </div>
                <div className="neofetch-row">
                  <span className="neofetch-label">Location:</span>
                  <span className="neofetch-val">Kathmandu, Nepal (Open to Remote)</span>
                </div>
                <div className="neofetch-row">
                  <span className="neofetch-label">Shell:</span>
                  <span className="neofetch-val">bash 5.2.26</span>
                </div>
                <div className="neofetch-row">
                  <span className="neofetch-label">Theme:</span>
                  <span className="neofetch-val">{theme.toUpperCase()} mode</span>
                </div>
                <div className="neofetch-row">
                  <span className="neofetch-label">Core Stack:</span>
                  <span className="neofetch-val">React, Node.js, TypeScript, Next.js, Framer Motion</span>
                </div>
                <div className="neofetch-row">
                  <span className="neofetch-label">Status:</span>
                  <span className="neofetch-val term-green">● Open for work &amp; collaboration</span>
                </div>
                <div className="color-blocks">
                  <span className="color-block" style={{ background: '#0c0c0c' }} />
                  <span className="color-block" style={{ background: '#f87171' }} />
                  <span className="color-block" style={{ background: '#4ade80' }} />
                  <span className="color-block" style={{ background: '#facc15' }} />
                  <span className="color-block" style={{ background: '#38bdf8' }} />
                  <span className="color-block" style={{ background: '#c084fc' }} />
                  <span className="color-block" style={{ background: '#2dd4bf' }} />
                  <span className="color-block" style={{ background: '#ededed' }} />
                </div>
              </div>
            </div>
          );
          break;
        }

        case 'ls':
        case 'dir': {
          const isAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
          const isLong = args.includes('-l') || args.includes('-la') || args.includes('-al');

          let targetDir = cwd;
          const pathArg = args.find((a) => !a.startsWith('-'));
          if (pathArg) {
            if (pathArg === 'projects' || pathArg === '~/projects') targetDir = '~/projects';
            else if (pathArg === 'socials' || pathArg === '~/socials') targetDir = '~/socials';
            else if (pathArg === '..' || pathArg === '~') targetDir = '~';
            else {
              output = <div className="term-line term-red">ls: cannot access &apos;{pathArg}&apos;: No such file or directory</div>;
              break;
            }
          }

          const dirNode = getDirNode(targetDir);
          if (!dirNode || !dirNode.children) {
            output = <div className="term-line term-red">ls: error reading directory</div>;
            break;
          }

          const entries = Object.keys(dirNode.children).filter((name) => {
            if (isAll) return true;
            return !name.startsWith('.');
          });

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
                      <span className="term-dim">Oct 09 2026</span>
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
                    <span
                      key={name}
                      className={`term-entry ${isDir ? 'is-dir' : item.isExec ? 'is-exec' : 'is-file'}`}
                    >
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
            output = <div className="term-line term-red">cat: missing file operand. Example: cat bio.txt</div>;
            break;
          }

          const targetFile = args[0].replace(/^~\//, '');
          let fileNode = null;

          if (cwd === '~') {
            if (FILESYSTEM['~'].children[targetFile]) {
              fileNode = FILESYSTEM['~'].children[targetFile];
            } else if (targetFile.startsWith('projects/')) {
              const subName = targetFile.replace('projects/', '');
              fileNode = FILESYSTEM['~'].children['projects'].children[subName];
            } else if (targetFile.startsWith('socials/')) {
              const subName = targetFile.replace('socials/', '');
              fileNode = FILESYSTEM['~'].children['socials'].children[subName];
            }
          } else if (cwd === '~/projects') {
            fileNode = FILESYSTEM['~'].children['projects'].children[targetFile];
          } else if (cwd === '~/socials') {
            fileNode = FILESYSTEM['~'].children['socials'].children[targetFile];
          }

          if (!fileNode) {
            output = <div className="term-line term-red">cat: {args[0]}: No such file or directory</div>;
          } else if (fileNode.type === 'dir') {
            output = <div className="term-line term-red">cat: {args[0]}: Is a directory</div>;
          } else {
            output = (
              <div className="term-ascii term-foam">
                {fileNode.content}
                {fileNode.url && (
                  <div style={{ marginTop: '0.4rem' }}>
                    <a href={fileNode.url} target="_blank" rel="noopener noreferrer" className="term-link-btn">
                      🔗 Open {fileNode.url}
                    </a>
                  </div>
                )}
                {targetFile === 'contact.txt' && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <a href="mailto:bikashdhakal546@gmail.com" className="term-link-btn">
                      ✉ Send Email
                    </a>
                    <a href="https://github.com/Dhakal009" target="_blank" rel="noopener noreferrer" className="term-link-btn">
                      GitHub ↗
                    </a>
                    <a href="https://linkedin.com/in/bikash-dhakal" target="_blank" rel="noopener noreferrer" className="term-link-btn">
                      LinkedIn ↗
                    </a>
                  </div>
                )}
                {(targetFile === 'projects' || targetFile.startsWith('projects/')) && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="term-link-btn"
                      onClick={() => navigate('/projects')}
                    >
                      🚀 View All Projects Page ↗
                    </button>
                  </div>
                )}
              </div>
            );
          }
          break;
        }

        case 'cd': {
          const dest = (args[0] || '~').trim().toLowerCase().replace(/\/$/, '');

          if (dest === '~' || dest === '/home/bikash' || dest === '' || dest === '/') {
            setCwd('~');
            output = <div className="term-line term-green">✔ Switched directory to ~ (/home/bikash)</div>;
          } else if (dest === 'projects' || dest === '~/projects' || dest === '/projects') {
            setCwd('~/projects');
            output = (
              <div className="term-line term-green">
                ✔ Navigating to <span className="term-bold">Projects</span> page (/projects)...
              </div>
            );
            setTimeout(() => navigate('/projects'), 400);
          } else if (dest === 'socials' || dest === '~/socials') {
            setCwd('~/socials');
            output = <div className="term-line term-green">✔ Changed directory to ~/socials</div>;
          } else if (dest === '..') {
            if (cwd !== '~') {
              setCwd('~');
              output = <div className="term-line term-green">✔ Switched back to ~</div>;
            } else {
              output = <div className="term-line term-dim">Already at root directory (~).</div>;
            }
          } else if (SECTIONS.includes(dest)) {
            const scrolled = scrollToSection(dest);
            if (scrolled) {
              output = <div className="term-line term-green">📍 Jumped to #{dest} section.</div>;
            } else {
              output = <div className="term-line term-red">cd: section #{dest} not found on this view</div>;
            }
          } else {
            output = (
              <div className="term-line term-red">
                cd: no such file or directory: {args[0]}
                <div className="term-dim" style={{ marginTop: '0.2rem' }}>
                  Available navigation targets: projects, experience, skills, education, deliver, contact, home
                </div>
              </div>
            );
          }
          break;
        }

        case 'goto':
        case 'nav':
        case 'jump': {
          const dest = (args[0] || '').toLowerCase().replace(/^[/#]/, '');
          if (!dest) {
            output = (
              <div className="term-line term-yellow">
                Usage: goto &lt;projects | experience | skills | education | deliver | contact | home&gt;
              </div>
            );
            break;
          }

          if (dest === 'projects') {
            output = <div className="term-line term-green">🚀 Navigating to /projects page...</div>;
            setTimeout(() => navigate('/projects'), 400);
          } else if (dest === 'home' || dest === 'hero') {
            if (window.location.pathname !== '/') {
              navigate('/');
            } else {
              scrollToSection('hero');
            }
            output = <div className="term-line term-green">🏠 Navigating to Home...</div>;
          } else if (SECTIONS.includes(dest)) {
            if (window.location.pathname !== '/') {
              navigate(`/#${dest}`);
            } else {
              scrollToSection(dest);
            }
            output = <div className="term-line term-green">📍 Scrolling to #{dest} section...</div>;
          } else {
            output = (
              <div className="term-line term-red">
                Unknown destination: &apos;{dest}&apos;. Try: projects, experience, skills, contact, education, deliver, home.
              </div>
            );
          }
          break;
        }

        case 'open': {
          const target = (args[0] || '').toLowerCase();
          if (target === 'github') {
            window.open('https://github.com/Dhakal009', '_blank');
            output = <div className="term-line term-green">✔ Opening GitHub profile in new tab...</div>;
          } else if (target === 'linkedin') {
            window.open('https://linkedin.com/in/bikash-dhakal', '_blank');
            output = <div className="term-line term-green">✔ Opening LinkedIn profile in new tab...</div>;
          } else if (target === 'twitter' || target === 'x') {
            window.open('https://twitter.com/bikash_dhakal', '_blank');
            output = <div className="term-line term-green">✔ Opening Twitter profile in new tab...</div>;
          } else if (target === 'email' || target === 'mail') {
            window.location.href = 'mailto:bikashdhakal546@gmail.com';
            output = <div className="term-line term-green">✔ Launching default email client to write Bikash...</div>;
          } else if (target === 'projects') {
            navigate('/projects');
            output = <div className="term-line term-green">✔ Navigating to /projects...</div>;
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

        case 'tree': {
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
│   ├── aether.txt
│   ├── lumina.txt
│   ├── vortex.txt
│   └── view-all.sh
└── socials/
    ├── github.url
    ├── linkedin.url
    └── email.url

2 directories, 13 files`}
            </div>
          );
          break;
        }

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
              <div className="term-ascii term-green">
{`HTTP/1.1 200 OK
Content-Type: application/json

{
  "name": "Bikash Dhakal",
  "title": "Full Stack Engineer & UI Designer",
  "status": "Available",
  "api": "v2.0"
}`}
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

        case 'sudo': {
          output = (
            <div className="term-line term-red">
              [sudo] password for visitor: <br />
              Permission denied: You already have full access as a welcome guest! 😄
            </div>
          );
          break;
        }

        case 'rm':
        case 'mkdir':
        case 'touch': {
          output = (
            <div className="term-line term-yellow">
              {command}: cannot modify: File system is mounted in read-only showcase mode.
            </div>
          );
          break;
        }

        case 'vim':
        case 'vi':
        case 'nano': {
          output = (
            <div className="term-line term-yellow">
              Launching {command}... Just kidding! Read files safely using &apos;cat &lt;file&gt;&apos; instead.
            </div>
          );
          break;
        }

        case 'exit':
        case 'reset': {
          setCwd('~');
          setHistory([
            {
              type: 'welcome',
              content: (
                <div className="term-line term-green">
                  Terminal session reset. Type &apos;help&apos; for commands.
                </div>
              ),
            },
          ]);
          return;
        }

        default: {
          output = (
            <div className="term-line term-red">
              command not found: {command}. Type <span className="term-cyan term-bold">&apos;help&apos;</span> to see available commands.
            </div>
          );
          break;
        }
      }

      setHistory((prev) => [
        ...prev,
        {
          type: 'cmd',
          cmd: rawCmd,
          cwd,
          output,
        },
      ]);
    },
    [cwd, getDirNode, navigate, scrollToSection, setTheme, theme, toggleTheme]
  );

  // Form submit handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeCommand(inputVal);
    setInputVal('');
  };

  // Keyboard navigation & tab completion
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const list = commandHistoryRef.current;
      if (list.length === 0) return;
      const nextIdx = historyIndex === -1 ? list.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(list[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const list = commandHistoryRef.current;
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
      const current = inputVal.trim();
      if (!current) return;

      const candidates = [
        'help',
        'neofetch',
        'whoami',
        'theme',
        'clear',
        'history',
        'pwd',
        'tree',
        'date',
        'uptime',
        'cat bio.txt',
        'cat skills.txt',
        'cat facts.json',
        'cat experience.txt',
        'cat education.txt',
        'cat contact.txt',
        'cat README.md',
        'cd projects',
        'cd experience',
        'cd skills',
        'cd contact',
        'goto projects',
        'goto experience',
        'goto contact',
        'open github',
        'open linkedin',
        'open email',
      ];

      const match = candidates.find((c) => c.startsWith(current.toLowerCase()));
      if (match) {
        setInputVal(match);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      setHistory((prev) => [
        ...prev,
        {
          type: 'cmd',
          cmd: `${inputVal}^C`,
          cwd,
          output: null,
        },
      ]);
      setInputVal('');
    }
  };

  // Copy terminal contents
  const handleCopy = () => {
    if (!terminalBodyRef.current) return;
    const text = terminalBodyRef.current.innerText;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Focus terminal input when clicking anywhere inside
  const handleContainerClick = (e) => {
    // Avoid stealing focus if user is clicking a link or button
    if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className={`terminal-container reveal ${isExpanded ? 'is-expanded' : ''} ${isMinimized ? 'is-minimized' : ''}`}
      onClick={handleContainerClick}
      role="region"
      aria-label="Interactive Linux Terminal"
    >
      {/* ---------- Window Header Bar ---------- */}
      <div className="terminal-header">
        <div className="terminal-controls">
          <button
            type="button"
            className="terminal-dot dot-close"
            title="Clear terminal session"
            aria-label="Clear session"
            onClick={(e) => {
              e.stopPropagation();
              setHistory([]);
            }}
          />
          <button
            type="button"
            className="terminal-dot dot-minimize"
            title="Toggle minimize"
            aria-label="Minimize terminal"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          />
          <button
            type="button"
            className="terminal-dot dot-maximize"
            title="Toggle full width view"
            aria-label="Expand terminal"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            title="Copy terminal contents"
          >
            {copied ? '✔ Copied' : 'Copy'}
          </button>

          <button
            type="button"
            className="terminal-btn-icon"
            onClick={(e) => {
              e.stopPropagation();
              setHistory([]);
            }}
            title="Clear terminal"
          >
            Clear
          </button>
        </div>
      </div>

      {/* ---------- Quick Action Chips Bar ---------- */}
      <div className="terminal-quick-chips" onClick={(e) => e.stopPropagation()}>
        <span className="terminal-chip-label">Quick Run:</span>
        {QUICK_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            className="terminal-chip"
            onClick={() => executeCommand(cmd)}
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* ---------- Terminal Output Body ---------- */}
      <div className="terminal-body" ref={terminalBodyRef}>
        {history.map((entry, index) => {
          if (entry.type === 'welcome') {
            return <div key={index}>{entry.content}</div>;
          }
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

        {/* Current Active Input Line */}
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
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            aria-label="Terminal command prompt"
            placeholder="Type 'help', 'neofetch', or 'cd projects'..."
          />
        </form>
      </div>

      {/* ---------- Terminal Footer Shortcuts ---------- */}
      <div className="terminal-footer-hint">
        <div className="terminal-keys-hint">
          <span><kbd className="term-key">Tab</kbd> Autocomplete</span>
          <span><kbd className="term-key">↑</kbd><kbd className="term-key">↓</kbd> History</span>
          <span><kbd className="term-key">Ctrl+L</kbd> Clear</span>
        </div>
        <span className="term-dim">bash 5.2.26</span>
      </div>
    </div>
  );
}
