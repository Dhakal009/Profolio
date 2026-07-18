(function() {
    // ============================================================
    // CONFIGURATION - Replace these placeholders with your data
    // ============================================================
    const CONFIG = {
        profileImage: 'assets/profile.png',
        resumePDF: '#', // e.g., 'assets/resume.pdf'
        githubLink: 'https://github.com/bikashdhakal',
        linkedinLink: 'https://linkedin.com/in/bikashdhakal',
        email: 'bikash@example.com',
        instagramLink: 'https://instagram.com/bikashdhakal',
        twitterLink: 'https://twitter.com/bikashdhakal',

        certificates: [
            { title: 'Full Stack Web Development', issuer: 'Udemy', year: '2024', image: '' },
            { title: 'JavaScript Algorithms', issuer: 'freeCodeCamp', year: '2023', image: '' },
            { title: 'Responsive Web Design', issuer: 'freeCodeCamp', year: '2023', image: '' },
            { title: 'Git & GitHub Mastery', issuer: 'Coursera', year: '2024', image: '' },
            { title: 'PHP Backend Development', issuer: 'Udemy', year: '2024', image: '' },
            { title: 'Linux Fundamentals', issuer: 'Cisco', year: '2023', image: '' },
        ],

        journey: [
            { icon: '🎯', title: 'Started Programming', desc: 'Wrote my first line of code in C.', date: '2021' },
            { icon: '🌐', title: 'Learning HTML/CSS', desc: 'Built static web pages, learned semantics.', date: '2021' },
            { icon: '⚡', title: 'JavaScript', desc: 'Brought interactivity, mastered DOM & ES6.', date: '2022' },
            { icon: '📁', title: 'Git & GitHub', desc: 'Version control and open-source collaboration.', date: '2022' },
            { icon: '🖥', title: 'Backend Development', desc: 'PHP, MySQL, REST APIs.', date: '2023' },
            { icon: '🚀', title: 'Full Stack Development', desc: 'End-to-end web applications.', date: '2024' },
            { icon: '🎓', title: 'Current Stage', desc: 'CS Degree, exploring React & Node.js.', date: '2025' },
            { icon: '⭐', title: 'Future Goal', desc: 'Senior engineer & impactful open-source.', date: 'Beyond' },
        ],

        skills: [
            { name: 'HTML', mastery: 95, experience: '4 years', projects: '20+', status: 'Proficient', related: 'CSS, JS' },
            { name: 'CSS', mastery: 90, experience: '4 years', projects: '20+', status: 'Proficient', related: 'Responsive' },
            { name: 'JavaScript', mastery: 82, experience: '3 years', projects: '15+', status: 'Proficient', related: 'Node, React' },
            { name: 'PHP', mastery: 75, experience: '2 years', projects: '8+', status: 'Proficient', related: 'MySQL' },
            { name: 'MySQL', mastery: 78, experience: '2 years', projects: '8+', status: 'Proficient', related: 'PHP' },
            { name: 'Git', mastery: 88, experience: '3 years', projects: 'All', status: 'Proficient', related: 'GitHub' },
            { name: 'GitHub', mastery: 85, experience: '3 years', projects: 'All', status: 'Proficient', related: 'Git' },
            { name: 'Linux', mastery: 70, experience: '2 years', projects: '5+', status: 'Comfortable', related: 'Shell' },
            { name: 'UI Design', mastery: 80, experience: '3 years', projects: '12+', status: 'Proficient', related: 'Figma' },
            { name: 'OpenGL', mastery: 55, experience: '1 year', projects: '3', status: 'Learning', related: 'C++' },
            { name: 'C', mastery: 72, experience: '3 years', projects: '10+', status: 'Proficient', related: 'C++' },
            { name: 'C++', mastery: 68, experience: '2 years', projects: '6+', status: 'Comfortable', related: 'OpenGL' },
            { name: 'Java', mastery: 65, experience: '2 years', projects: '5+', status: 'Comfortable', related: 'OOP' },
            { name: 'Problem Solving', mastery: 85, experience: 'Ongoing', projects: 'N/A', status: 'Strong', related: 'Algos' },
            { name: 'Responsive Design', mastery: 88, experience: '3 years', projects: '18+', status: 'Proficient', related: 'CSS' },
            { name: 'Node.js', mastery: 50, experience: '6 months', projects: '2', status: 'Currently Learning', related: 'JS' },
            { name: 'React', mastery: 40, experience: 'Learning', projects: '1', status: 'Currently Learning', related: 'JSX' },
            { name: 'Docker', mastery: 30, experience: 'Learning', projects: '0', status: 'Learning', related: 'DevOps' },
            { name: 'DevOps', mastery: 25, experience: 'Learning', projects: '0', status: 'Learning', related: 'CI/CD' },
        ],

        projects: [
            { title: 'E-Commerce Platform', desc: 'Full-stack online store with cart & admin.', tech: ['PHP','MySQL','JS','CSS'], image: '', github: '#', live: '#', role: 'Frontend + Backend', year: '2025', featured: true },
            { title: 'Portfolio Website', desc: 'Cinematic personal portfolio.', tech: ['HTML','CSS','JS'], image: '', github: '#', live: '#', role: 'Solo project', year: '2026', featured: false },
            { title: 'Task Manager', desc: 'Real-time collaborative task app.', tech: ['Node.js','React','MySQL'], image: '', github: '#', live: '#', role: 'Productivity tool', year: '2025', featured: false },
            { title: 'OpenGL Renderer', desc: '3D graphics with lighting & shadows.', tech: ['C++','OpenGL','GLSL'], image: '', github: '#', live: '#', role: 'Graphics experiment', year: '2024', featured: false },
        ],
    };

    // DOM references
    const loader = document.getElementById('loader');
    const loaderPercent = document.getElementById('loaderPercent');
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    const floatingNav = document.getElementById('floatingNav');
    const navItems = document.querySelectorAll('.nav-item');
    const navDot = document.getElementById('navDot');
    const particlesContainer = document.getElementById('particlesContainer');
    const certTrack = document.getElementById('certTrack');
    const certModal = document.getElementById('certModal');
    const certModalContent = document.getElementById('certModalContent');
    const journeyRoadmap = document.getElementById('journeyRoadmap');
    const skillsCloud = document.getElementById('skillsCloud');
    const skillPopup = document.getElementById('skillPopup');
    const skillPopupContent = document.getElementById('skillPopupContent');
    const skillBackdrop = document.getElementById('skillBackdrop');
    const skillPopupClose = document.getElementById('skillPopupClose');
    const projectsHorizontal = document.getElementById('projectsHorizontal');
    const contactForm = document.getElementById('contactForm');
    const downloadResume = document.getElementById('downloadResume');
    const aiOrb = document.getElementById('aiOrb');
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = document.getElementById('chatMessages');
    const chatTyping = document.getElementById('chatTyping');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatClose = document.getElementById('chatClose');
    const allSections = document.querySelectorAll('.section[id]');
    const homeSection = document.getElementById('home');
    const heroImage = document.getElementById('heroImage');
    const certCarousel = document.querySelector('.cert-carousel');
    const certScrollWrapper = document.querySelector('#certificates .cert-scroll-wrapper');
    const certPrev = document.getElementById('certPrev');
    const certNext = document.getElementById('certNext');
    const certPagination = document.getElementById('certPagination');
    const journeySection = document.getElementById('journey');
    const journeyRoute = document.getElementById('journeyRoute');
    const journeyRouteBase = document.getElementById('journeyRouteBase');
    const journeyRouteProgress = document.getElementById('journeyRouteProgress');
    const journeyRouteDash = document.getElementById('journeyRouteDash');
    const journeyProgressChip = document.getElementById('journeyProgressChip');
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const journeyRingColors = ['#66a6ff', '#f5d463', '#9ad15f', '#8bb6ff', '#6ad2c6', '#f3a86a', '#c59dff', '#e9c46a'];
    const interactiveCursorTargets = 'a, button, input, textarea, select, summary, [role="button"], .btn, .nav-item, .social-icon, .cert-nav-btn, .cert-dot, .cert-view-btn, .cert-card, .skill-bubble, .project-card, .journey-card, .chat-send, .chat-close, .skill-popup-close, .modal-close';
    let journeyRouteLength = 0;
    let journeyLayoutFrame = null;
    let certScrollFrame = null;
    let certAutoScrollFrame = null;
    let certLoopWidth = 0;
    let certLastTimestamp = null;
    let certAutoScrollRunning = false;
    let certLoopOffset = 0;
    let certPauseTimeout = null;
    let certHoverPause = false;
    let certInteractionPause = false;
    let certDragPause = false;

    const certificateStyleMap = [
        { match: /freeCodeCamp/i, platform: 'freeCodeCamp', accent: '#1d7f4f', accentSoft: 'rgba(29, 127, 79, 0.14)', iconBg: 'linear-gradient(145deg, rgba(29, 127, 79, 0.24), rgba(12, 12, 18, 0.88))' },
        { match: /Coursera/i, platform: 'Coursera', accent: '#0f6db5', accentSoft: 'rgba(15, 109, 181, 0.14)', iconBg: 'linear-gradient(145deg, rgba(15, 109, 181, 0.24), rgba(12, 12, 18, 0.88))' },
        { match: /Udemy/i, platform: 'Udemy', accent: '#a435f0', accentSoft: 'rgba(164, 53, 240, 0.14)', iconBg: 'linear-gradient(145deg, rgba(164, 53, 240, 0.24), rgba(12, 12, 18, 0.88))' },
        { match: /Cisco/i, platform: 'Cisco', accent: '#2c8dc9', accentSoft: 'rgba(44, 141, 201, 0.14)', iconBg: 'linear-gradient(145deg, rgba(44, 141, 201, 0.24), rgba(12, 12, 18, 0.88))' },
    ];

    const skillIconMap = {
        HTML: { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2h18l-1.72 18L12 22l-7.28-2L3 2zm5.4 4l.22 2.6h7.76l-.26 2.55H9l.23 2.67h5.8l-.34 3.16L12 18l-2.66-.72-.17-2H6.8l.44 5.08L12 21l4.72-1.34L17.9 6H8.4z"/></svg>', accent: '#ff9c5b', background: 'rgba(255,156,91,0.14)' },
        CSS: { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2h18l-1.72 18L12 22l-7.28-2L3 2zm5.45 4l.18 2.52h7.8l-.2 2.1H9.3l.2 2.46h5.93l-.22 2.5L12 17.1l-3.11-.84-.18-2.04H6.1l.44 5.08L12 21l4.72-1.34L17.94 6H8.45z"/></svg>', accent: '#5fb3ff', background: 'rgba(95,179,255,0.14)' },
        JavaScript: { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5z" opacity=".22"/><path d="M7 7h10v10H7z" opacity=".18"/><path d="M8 5l4 4 4-4M8 19l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 9l4 3-4 3M16 9l-4 3 4 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>', accent: '#f5d463', background: 'rgba(245,212,99,0.14)' },
        PHP: { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="6" opacity=".18"></rect><text x="12" y="15.2" text-anchor="middle" font-size="6.2" font-family="var(--font-mono)">PHP</text></svg>', accent: '#8c6bff', background: 'rgba(140,107,255,0.14)' },
        MySQL: { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="6" rx="7" ry="3.2"/><path d="M5 6v10c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2V6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M5 11c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2" fill="none" stroke="currentColor" stroke-width="1.3" opacity=".55"/></svg>', accent: '#7bd17a', background: 'rgba(123,209,122,0.14)' },
        Git: { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6a2 2 0 1 1 0 4h-.1L6 12.2V17a2 2 0 1 1-1.6 0v-4.1l2.4-2.4A2 2 0 0 1 8 6zm8 0a2 2 0 1 1-1.7 3l-4.4 4.4a2 2 0 0 1 0 1.6l1.1 1.1A2 2 0 1 1 10.6 18l-1.2-1.2a2 2 0 0 1 .3-2.6l4.4-4.4A2 2 0 0 1 16 6z"/></svg>', accent: '#f28f5e', background: 'rgba(242,143,94,0.14)' },
        GitHub: { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48v-1.7c-2.77.6-3.36-1.17-3.36-1.17-.45-1.14-1.1-1.45-1.1-1.45-.9-.62.07-.61.07-.61 1 .07 1.54 1.03 1.54 1.03.88 1.53 2.31 1.08 2.87.83.09-.64.35-1.08.63-1.33-2.21-.25-4.54-1.1-4.54-4.9 0-1.08.39-1.96 1.03-2.65-.1-.25-.45-1.26.1-2.62 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.3 2.75-1.02 2.75-1.02.55 1.36.2 2.37.1 2.62.64.69 1.03 1.57 1.03 2.65 0 3.82-2.34 4.65-4.56 4.89.36.32.68.95.68 1.92v2.85c0 .26.18.58.69.48A10 10 0 0 0 12 2z"/></svg>', accent: '#b8c0ff', background: 'rgba(184,192,255,0.14)' },
        Linux: { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9c0-2.2 1.8-4 4-4s4 1.8 4 4c0 1-.3 1.9-.9 2.7.7.6 1.2 1.8 1.2 3.3 0 2.8-1.6 5-4.3 5s-4.3-2.2-4.3-5c0-1.5.5-2.7 1.2-3.3-.6-.8-.9-1.7-.9-2.7z"/><path d="M10 17.5c.6.4 1.2.6 2 .6s1.4-.2 2-.6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>', accent: '#9ad15f', background: 'rgba(154,209,95,0.14)' },
        React: { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="1.8"/><ellipse cx="12" cy="12" rx="8" ry="3.3" fill="none" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="8" ry="3.3" fill="none" stroke="currentColor" stroke-width="1.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="8" ry="3.3" fill="none" stroke="currentColor" stroke-width="1.5" transform="rotate(120 12 12)"/></svg>', accent: '#70d7ff', background: 'rgba(112,215,255,0.14)' },
        'Node.js': { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 20 7v10l-8 4.5L4 17V7z"/><path d="M9 8h6v8H9z" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".4"/></svg>', accent: '#8ad45b', background: 'rgba(138,212,91,0.14)' },
        Docker: { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h3v3H4zm3 0h3v3H7zm3 0h3v3h-3zm3 0h3v3h-3zm-9 3h3v3H4zm3 0h3v3H7zM7 16c0 1.7 1.4 3 3 3h4c1.7 0 3-1.3 3-3v-1H7z"/></svg>', accent: '#4ec3ff', background: 'rgba(78,195,255,0.14)' },
        OpenGL: { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 4v10l-7 4-7-4V7z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 7v10" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".55"/><path d="M8 9l4-2 4 2-4 2z"/></svg>', accent: '#c59dff', background: 'rgba(197,157,255,0.14)' },
        Java: { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16h8v2H8z"/><path d="M9 14c0-2.2 2.2-2.5 2.2-4.1 0-.7-.4-1.3-.8-1.7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M14 14c0-2.2 2.2-2.5 2.2-4.1 0-.7-.4-1.3-.8-1.7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".7"/></svg>', accent: '#ff7b6b', background: 'rgba(255,123,107,0.14)' },
        C: { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 7.3A6 6 0 1 0 15.5 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>', accent: '#7fd3ff', background: 'rgba(127,211,255,0.14)' },
        'C++': { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 7.3A6 6 0 1 0 15.5 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 9v4M16 11h4M20 9v4M18 11h4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>', accent: '#9bc6ff', background: 'rgba(155,198,255,0.14)' },
        'UI Design': { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v10H5z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 12h8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 9h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>', accent: '#f0b36a', background: 'rgba(240,179,106,0.14)' },
        'Problem Solving': { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 10a4 4 0 1 1 8 0c0 1.3-.6 2.4-1.5 3.1-.6.5-1 .9-1 1.9H10.5c0-1-.4-1.4-1-1.9C8.6 12.4 8 11.3 8 10z"/></svg>', accent: '#f5d463', background: 'rgba(245,212,99,0.14)' },
        'Responsive Design': { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="10" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="15" y="8" width="5" height="8" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 18h4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>', accent: '#6fb7ff', background: 'rgba(111,183,255,0.14)' },
        DevOps: { svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5 9 7v10l3 2.5 3-2.5V7z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M4.5 12h3M16.5 12h3M12 4.5v3M12 16.5v3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>', accent: '#98a6c3', background: 'rgba(152,166,195,0.14)' },
    };

    const skillGroups = [
        { label: 'Languages', names: ['HTML', 'CSS', 'JavaScript', 'PHP', 'Java', 'C', 'C++'] },
        { label: 'Frameworks & Libraries', names: ['React', 'Node.js', 'OpenGL'] },
        { label: 'Tools & Platforms', names: ['Git', 'GitHub', 'Linux', 'Docker', 'MySQL'] },
        { label: 'Design & Thinking', names: ['UI Design', 'Responsive Design', 'Problem Solving', 'DevOps'] },
    ];

    function getSkillTheme(skill) {
        const iconTheme = skillIconMap[skill.name] || {};
        const featuredSkills = ['JavaScript', 'React', 'UI Design'];
        const mastery = Number(skill.mastery || 0);
        const normalized = Math.max(0, Math.min(1, mastery / 100));
        return {
            icon: iconTheme.svg || '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6"/></svg>',
            accent: iconTheme.accent || '#b8936e',
            accentSoft: iconTheme.background || 'rgba(184, 147, 110, 0.14)',
            featured: featuredSkills.includes(skill.name),
            scale: 0.92 + normalized * 0.22,
            weight: 500 + Math.round(normalized * 200),
            duration: (11 + (1 - normalized) * 6 + Math.random() * 2).toFixed(2),
            delay: (-Math.random() * 8).toFixed(2),
            floatDistance: (4 + normalized * 8).toFixed(1),
            floatRotate: ((Math.random() * 2 - 1) * (normalized * 2.5)).toFixed(2),
        };
    }

    function getCertificateTheme(cert) {
        const issuer = cert.issuer || '';
        const title = cert.title || '';
        const issuerTheme = certificateStyleMap.find(entry => entry.match.test(issuer)) || {};
        const titleTheme = {
            'Full Stack Web Development': { icon: '⟡', accent: '#f09c66', accentSoft: 'rgba(240, 156, 102, 0.14)', platform: 'Full Stack', iconBg: 'linear-gradient(145deg, rgba(240, 156, 102, 0.22), rgba(12, 12, 18, 0.88))' },
            'JavaScript Algorithms': { icon: '</>', accent: '#f5d463', accentSoft: 'rgba(245, 212, 99, 0.14)', platform: 'JavaScript', iconBg: 'linear-gradient(145deg, rgba(245, 212, 99, 0.22), rgba(12, 12, 18, 0.88))' },
            'Responsive Web Design': { icon: '⌗', accent: '#6fb7ff', accentSoft: 'rgba(111, 183, 255, 0.14)', platform: 'Responsive', iconBg: 'linear-gradient(145deg, rgba(111, 183, 255, 0.22), rgba(12, 12, 18, 0.88))' },
            'Git & GitHub Mastery': { icon: '⎇', accent: '#f28f5e', accentSoft: 'rgba(242, 143, 94, 0.14)', platform: 'Git', iconBg: 'linear-gradient(145deg, rgba(242, 143, 94, 0.22), rgba(12, 12, 18, 0.88))' },
            'PHP Backend Development': { icon: '<?>', accent: '#8c6bff', accentSoft: 'rgba(140, 107, 255, 0.14)', platform: 'Backend', iconBg: 'linear-gradient(145deg, rgba(140, 107, 255, 0.22), rgba(12, 12, 18, 0.88))' },
            'Linux Fundamentals': { icon: '⌘', accent: '#9ad15f', accentSoft: 'rgba(154, 209, 95, 0.14)', platform: 'Linux', iconBg: 'linear-gradient(145deg, rgba(154, 209, 95, 0.22), rgba(12, 12, 18, 0.88))' },
        }[title] || {};

        return {
            icon: titleTheme.icon || issuerTheme.icon || (issuer === 'Coursera' ? 'C' : issuer === 'Udemy' ? 'U' : issuer === 'freeCodeCamp' ? '</>' : '◆'),
            accent: titleTheme.accent || issuerTheme.accent || '#b8936e',
            accentSoft: titleTheme.accentSoft || issuerTheme.accentSoft || 'rgba(184, 147, 110, 0.14)',
            platform: titleTheme.platform || issuerTheme.platform || issuer || 'Certificate',
            iconBg: titleTheme.iconBg || issuerTheme.iconBg || 'linear-gradient(145deg, rgba(184, 147, 110, 0.22), rgba(12, 12, 18, 0.88))',
        };
    }

    // Loading screen
    let loadProgress = 0;
    const loadingInterval = setInterval(() => {
        loadProgress += Math.floor(Math.random() * 12) + 3;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadingInterval);
            loaderPercent.textContent = '100%';
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
            }, 500);
        }
        loaderPercent.textContent = loadProgress + '%';
    }, 100);
    document.body.style.overflow = 'hidden';

    // Particles
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = (60 + Math.random() * 40) + '%';
        p.style.setProperty('--particle-duration', (10 + Math.random() * 14) + 's');
        p.style.setProperty('--particle-delay', -(Math.random() * 12) + 's');
        p.style.setProperty('--drift-x', (Math.random() * 80 - 40) + 'px');
        p.style.setProperty('--drift-y', -(20 + Math.random() * 70) + 'px');
        p.style.width = p.style.height = (1 + Math.random() * 2.5) + 'px';
        p.style.opacity = (0.2 + Math.random() * 0.5);
        particlesContainer.appendChild(p);
    }

    // ============================================================
    // NAVIGATION: Active state & dot sliding
    // ============================================================
    function updateNavDot() {
        requestAnimationFrame(() => {
            const activeItem = document.querySelector('.nav-item.active');
            if (!activeItem || !navDot) return;
            const navInner = document.querySelector('.nav-inner');
            const itemRect = activeItem.getBoundingClientRect();
            const innerRect = navInner.getBoundingClientRect();
            const dotY = itemRect.top - innerRect.top + (itemRect.height - navDot.offsetHeight) / 2;
            navDot.style.transform = `translateY(${dotY}px)`;
    });
    }

    function updateActiveNav() {
        let current = 'home';
        allSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
                current = section.id;
            }
        });
        navItems.forEach(item => {
            const isActive = item.dataset.section === current;
            item.classList.toggle('active', isActive);
        });
        // Update dot position after class change
        requestAnimationFrame(updateNavDot);
    }

    // Initial dot position after DOM ready
    setTimeout(() => {
        updateNavDot();
    }, 100);

    // Scroll and resize listeners
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('resize', updateNavDot, { passive: true });

    // Click handling with smooth scroll
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.dataset.section;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Also update dot on any scroll after a short delay
    let navUpdateTimeout = null;
    window.addEventListener('scroll', () => {
        if (navUpdateTimeout) cancelAnimationFrame(navUpdateTimeout);
        navUpdateTimeout = requestAnimationFrame(() => {
            updateActiveNav();
        });
    }, { passive: true });

    // ============================================================
    // CERTIFICATES (unchanged)
    // ============================================================
    function buildCertificates() {
        const certs = CONFIG.certificates;
        const loopCerts = [...certs, ...certs];
        certTrack.innerHTML = loopCerts.map((cert, i) => {
            const theme = getCertificateTheme(cert);
            const iconMarkup = cert.image
                ? `<img src="${cert.image}" alt="${cert.title}" loading="lazy">`
                : `<div class="cert-image-icon" aria-hidden="true">${theme.icon}</div>`;
            return `
            <div class="cert-card" data-index="${i % certs.length}" data-loop-index="${i}" style="--cert-accent:${theme.accent};--cert-accent-soft:${theme.accentSoft};--cert-icon-bg:${theme.iconBg};">
                <div class="cert-accent-bar" aria-hidden="true"></div>
                <div class="cert-platform-badge">${theme.platform}</div>
                <div class="cert-image">${iconMarkup}</div>
                <div class="cert-copy">
                    <div class="cert-body">
                        <div class="cert-title">${cert.title}</div>
                        <div class="cert-issuer">${cert.issuer}</div>
                        <div class="cert-year">${cert.year}</div>
                    </div>
                    <button class="cert-view-btn" type="button" aria-label="View certificate for ${cert.title}">View Certificate ↗</button>
                </div>
            </div>`;
        }).join('');
        certPagination.innerHTML = certs.map((_, i) => `<button class="cert-dot${i === 0 ? ' active' : ''}" type="button" aria-label="Jump to certificate ${i + 1}" data-cert-dot="${i}"></button>`).join('');
        certTrack.querySelectorAll('.cert-card').forEach(card => {
            const cert = CONFIG.certificates[parseInt(card.dataset.index, 10)];
            const theme = getCertificateTheme(cert);
            const openCert = () => {
                pauseCertificateAutoScroll(true);
                certModalContent.innerHTML = `
                    <div style="width:100%;aspect-ratio:4/3;border-radius:12px;background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-size:4rem;margin-bottom:16px;overflow:hidden;">
                        ${cert.image ? `<img src="${cert.image}" alt="${cert.title}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">` : `<div style="width:96px;height:96px;border-radius:28px;display:flex;align-items:center;justify-content:center;background:${theme.accentSoft};color:${theme.accent};font-family:var(--font-mono);font-size:2rem;">${theme.icon}</div>`}
                    </div>
                    <h3 style="font-family:var(--font-display);font-size:1.6rem;">${cert.title}</h3>
                    <p style="color:var(--text-secondary);">${cert.issuer} • ${cert.year}</p>
                    <button class="modal-close" id="modalCloseBtn">Close</button>`;
                certModal.classList.add('active');
                document.getElementById('modalCloseBtn').addEventListener('click', closeCertModal);
            };
            card.addEventListener('click', openCert);
            card.querySelector('.cert-view-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                openCert();
            });
        });
        requestAnimationFrame(() => {
            updateCertificateLoopMetrics();
            certLoopOffset = 0;
            applyCertificateLoopTransform();
            updateCertificatePagination(0);
            startCertificateAutoScroll();
            requestCertificateScrollSync();
        });
    }
    function closeCertModal() {
        certModal.classList.remove('active');
        resumeCertificateAutoScroll(1200);
    }
    certModal.addEventListener('click', (e) => { if (e.target === certModal) closeCertModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && certModal.classList.contains('active')) closeCertModal(); });
    buildCertificates();

    function getCertificateCardCenter(card) {
        const wrapperRect = certScrollWrapper.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        return cardRect.left - wrapperRect.left + cardRect.width / 2;
    }

    function getActiveCertificateIndex() {
        const cards = [...certTrack.querySelectorAll('.cert-card')];
        if (!cards.length) return 0;
        const wrapperRect = certScrollWrapper.getBoundingClientRect();
        const center = wrapperRect.width / 2;
        let activeIndex = 0;
        let smallestDistance = Infinity;
        cards.forEach((card, index) => {
            const distance = Math.abs(getCertificateCardCenter(card) - center);
            if (distance < smallestDistance) {
                smallestDistance = distance;
                activeIndex = index;
            }
        });
        return activeIndex % CONFIG.certificates.length;
    }

    function updateCertificatePagination(activeIndex) {
        const dots = [...certPagination.querySelectorAll('.cert-dot')];
        dots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    }

    function scrollCertificateIntoView(index) {
        const cards = [...certTrack.querySelectorAll('.cert-card')];
        const targetCards = cards.filter(card => parseInt(card.dataset.index, 10) === index);
        const wrapperRect = certScrollWrapper.getBoundingClientRect();
        const viewportCenter = wrapperRect.width / 2;
        const currentBaseCenter = viewportCenter + certLoopOffset;
        const card = targetCards.reduce((closest, candidate) => {
            if (!closest) return candidate;
            const closestBase = getCertificateCardCenter(closest) + certLoopOffset;
            const candidateBase = getCertificateCardCenter(candidate) + certLoopOffset;
            return Math.abs(candidateBase - currentBaseCenter) < Math.abs(closestBase - currentBaseCenter) ? candidate : closest;
        }, null) || cards[index];
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const targetOffset = certLoopOffset + (cardRect.left - wrapperRect.left) - (wrapperRect.width - cardRect.width) / 2;
        certLoopOffset = normalizeCertificateOffset(targetOffset);
        applyCertificateLoopTransform();
        pauseCertificateAutoScroll(false, 1400);
    }

    function updateCertificateLoopMetrics() {
        certLoopWidth = Math.max(1, certTrack.scrollWidth / 2);
        certLoopOffset = normalizeCertificateOffset(certLoopOffset);
        applyCertificateLoopTransform();
    }

    function normalizeCertificateOffset(offset) {
        if (!certLoopWidth) return Math.max(0, offset);
        let nextOffset = offset % certLoopWidth;
        if (nextOffset < 0) nextOffset += certLoopWidth;
        return nextOffset;
    }

    function applyCertificateLoopTransform() {
        certTrack.style.transform = `translate3d(${-certLoopOffset}px, 0, 0)`;
    }

    function pauseCertificateAutoScroll(keepPaused = false, resumeDelay = 0) {
        certAutoScrollRunning = false;
        certInteractionPause = keepPaused;
        certCarousel?.classList.add('is-paused');
        if (certAutoScrollFrame) {
            cancelAnimationFrame(certAutoScrollFrame);
            certAutoScrollFrame = null;
        }
        if (certPauseTimeout) {
            clearTimeout(certPauseTimeout);
            certPauseTimeout = null;
        }
        if (!keepPaused && resumeDelay >= 0) {
            certPauseTimeout = setTimeout(() => {
                certInteractionPause = false;
                certCarousel?.classList.remove('is-paused');
                startCertificateAutoScroll();
            }, resumeDelay);
        }
    }

    function resumeCertificateAutoScroll(resumeDelay = 0) {
        if (certPauseTimeout) {
            clearTimeout(certPauseTimeout);
            certPauseTimeout = null;
        }
        certInteractionPause = false;
        certCarousel?.classList.remove('is-paused');
        if (resumeDelay > 0) {
            certPauseTimeout = setTimeout(() => startCertificateAutoScroll(), resumeDelay);
        } else {
            startCertificateAutoScroll();
        }
    }

    function startCertificateAutoScroll(timestamp = 0) {
        if (certInteractionPause || certHoverPause || certDragPause) {
            certAutoScrollFrame = requestAnimationFrame(startCertificateAutoScroll);
            return;
        }
        certAutoScrollRunning = true;
        certCarousel?.classList.remove('is-paused');
        if (!certLoopWidth) {
            certAutoScrollFrame = requestAnimationFrame(startCertificateAutoScroll);
            return;
        }
        if (certLastTimestamp === null) certLastTimestamp = timestamp;
        const delta = Math.min(32, timestamp - certLastTimestamp);
        certLastTimestamp = timestamp;
        certLoopOffset = normalizeCertificateOffset(certLoopOffset + delta * 0.045);
        applyCertificateLoopTransform();
        requestCertificateScrollSync();
        certAutoScrollFrame = requestAnimationFrame(startCertificateAutoScroll);
    }

    function requestCertificateScrollSync() {
        if (certScrollFrame) return;
        certScrollFrame = requestAnimationFrame(() => {
            certScrollFrame = null;
            updateCertificatePagination(getActiveCertificateIndex());
        });
    }

    certScrollWrapper.addEventListener('mouseenter', () => {
        certHoverPause = true;
        pauseCertificateAutoScroll(false, -1);
    });
    certScrollWrapper.addEventListener('mouseleave', () => {
        certHoverPause = false;
        resumeCertificateAutoScroll(1400);
    });
    certScrollWrapper.addEventListener('pointerdown', () => {
        certDragPause = true;
        pauseCertificateAutoScroll(true);
    });
    window.addEventListener('pointerup', () => {
        if (!certDragPause) return;
        certDragPause = false;
        resumeCertificateAutoScroll(1200);
    });
    certScrollWrapper.addEventListener('touchstart', () => {
        certDragPause = true;
        pauseCertificateAutoScroll(true);
    }, { passive: true });
    window.addEventListener('touchend', () => {
        if (!certDragPause) return;
        certDragPause = false;
        resumeCertificateAutoScroll(1200);
    }, { passive: true });
    certPagination.addEventListener('click', (e) => {
        const dot = e.target.closest('.cert-dot');
        if (!dot) return;
        scrollCertificateIntoView(parseInt(dot.dataset.certDot, 10));
    });
    certPrev.addEventListener('click', () => {
        pauseCertificateAutoScroll(false, 1200);
        scrollCertificateIntoView(Math.max(0, getActiveCertificateIndex() - 1));
    });
    certNext.addEventListener('click', () => {
        pauseCertificateAutoScroll(false, 1200);
        scrollCertificateIntoView(Math.min(CONFIG.certificates.length - 1, getActiveCertificateIndex() + 1));
    });
    window.addEventListener('resize', () => {
        updateCertificateLoopMetrics();
        requestCertificateScrollSync();
    }, { passive: true });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            certLastTimestamp = null;
            return;
        }
        certLastTimestamp = null;
        resumeCertificateAutoScroll(200);
    });

    // ============================================================
    // JOURNEY (unchanged)
    // ============================================================
    function buildJourney() {
        journeyRoadmap.innerHTML = CONFIG.journey.map((m, i) => {
            const side = i % 2 === 0 ? 'left' : 'right';
            const ring = m.ring || journeyRingColors[i % journeyRingColors.length];
            const isCurrent = i === CONFIG.journey.length - 1 ? ' journey-pin-current' : '';
            return `
                <div class="journey-milestone" data-side="${side}" style="--milestone-ring:${ring};">
                    <span class="journey-pin${isCurrent}">
                        <span class="journey-pin-shadow"></span>
                        <span class="journey-pin-body">
                            <span class="journey-pin-badge">${i + 1}</span>
                        </span>
                    </span>
                    <span class="journey-link" aria-hidden="true"></span>
                    <article class="journey-card">
                        <div class="journey-card-head">
                            <div class="journey-icon-badge" style="--milestone-ring:${ring};">${m.icon}</div>
                            <div class="journey-card-body">
                                <div class="journey-card-year">${m.date}</div>
                                <div class="journey-card-title">${m.title}</div>
                            </div>
                        </div>
                        <div class="journey-card-desc">${m.desc}</div>
                    </article>
                </div>`;
        }).join('');
        requestJourneyLayoutUpdate();
    }
    function buildJourneyPath(points) {
        if (!points.length) return '';
        let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];
            const deltaY = next.y - current.y;
            const control1X = current.x + (next.x - current.x) * 0.22;
            const control2X = current.x + (next.x - current.x) * 0.78;
            const control1Y = current.y + deltaY * 0.35;
            const control2Y = current.y + deltaY * 0.65;
            d += ` C ${control1X.toFixed(2)} ${control1Y.toFixed(2)}, ${control2X.toFixed(2)} ${control2Y.toFixed(2)}, ${next.x.toFixed(2)} ${next.y.toFixed(2)}`;
        }
        return d;
    }
    function updateJourneyPath() {
        const milestones = [...journeyRoadmap.querySelectorAll('.journey-milestone')];
        if (!milestones.length || !journeyRoute || !journeyRouteBase || !journeyRouteProgress || !journeyRouteDash) return;
        const roadmapRect = journeyRoadmap.getBoundingClientRect();
        if (!roadmapRect.width || !roadmapRect.height) return;
        const points = milestones.map(milestone => {
            const pin = milestone.querySelector('.journey-pin');
            const card = milestone.querySelector('.journey-card');
            const pinRect = pin.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const side = milestone.dataset.side;
            const gap = 22;
            const nodeX = side === 'left'
                ? cardRect.right - roadmapRect.left + gap
                : cardRect.left - roadmapRect.left - gap;
            const nodeY = pinRect.top - roadmapRect.top + pinRect.height * 0.22;
            milestone.style.setProperty('--pin-x', `${nodeX}px`);
            milestone.style.setProperty('--leader-length', `${Math.max(28, Math.abs(nodeX - (side === 'left' ? cardRect.right - roadmapRect.left : cardRect.left - roadmapRect.left)))}px`);
            return {
                x: nodeX,
                y: nodeY,
            };
        });
        const width = Math.max(roadmapRect.width, 1);
        const height = Math.max(journeyRoadmap.scrollHeight, roadmapRect.height, 1);
        journeyRoute.setAttribute('viewBox', `0 0 ${width} ${height}`);
        const path = buildJourneyPath(points);
        journeyRouteBase.setAttribute('d', path);
        journeyRouteProgress.setAttribute('d', path);
        journeyRouteDash.setAttribute('d', path);
        journeyRouteLength = journeyRouteProgress.getTotalLength();
        journeyRouteProgress.style.strokeDasharray = `${journeyRouteLength}`;
        journeyRouteProgress.style.strokeDashoffset = `${journeyRouteLength}`;
        journeyRouteDash.style.strokeDasharray = `${Math.max(20, journeyRouteLength * 0.025)} ${Math.max(30, journeyRouteLength * 0.045)}`;
        updateJourneyProgress();
    }
    function updateJourneyProgress() {
        if (!journeyRouteLength || !journeyProgressChip) return;
        const rect = journeySection.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height * 0.75)));
        const remaining = journeyRouteLength * (1 - progress);
        journeyRouteProgress.style.strokeDashoffset = `${remaining}`;
        journeyRouteDash.style.strokeDashoffset = `${remaining * 0.24}`;
        journeyProgressChip.textContent = `Route progress ${Math.round(progress * 100)}%`;
    }
    function requestJourneyLayoutUpdate() {
        if (journeyLayoutFrame) return;
        journeyLayoutFrame = requestAnimationFrame(() => {
            journeyLayoutFrame = null;
            updateJourneyPath();
        });
    }
    window.addEventListener('scroll', requestJourneyLayoutUpdate, { passive: true });
    window.addEventListener('resize', requestJourneyLayoutUpdate, { passive: true });
    if (window.ResizeObserver) {
        const journeyResizeObserver = new ResizeObserver(requestJourneyLayoutUpdate);
        journeyResizeObserver.observe(journeyRoadmap);
    }
    buildJourney();
    function updateJourneyVisibility() {
        requestJourneyLayoutUpdate();
    }
    window.addEventListener('scroll', updateJourneyVisibility, { passive: true });

    // ============================================================
    // SKILLS (unchanged)
    // ============================================================
    function buildSkills() {
        skillsCloud.innerHTML = skillGroups.map(group => {
            const bubbles = group.names.map(name => {
                const skill = CONFIG.skills.find(entry => entry.name === name);
                if (!skill) return '';
                const theme = getSkillTheme(skill);
                return `
                    <button class="skill-bubble${theme.featured ? ' is-featured' : ''}" type="button" data-skill-index="${CONFIG.skills.indexOf(skill)}" style="--skill-accent:${theme.accent};--skill-accent-soft:${theme.accentSoft};--bubble-scale:${theme.scale.toFixed(2)};--bubble-duration:${theme.duration}s;--bubble-delay:${theme.delay}s;--float-distance:${theme.floatDistance}px;--float-rotate:${theme.floatRotate}deg;--skill-weight:${theme.weight};">
                        <span class="skill-bubble-float" aria-hidden="true"></span>
                        <span class="skill-bubble-inner">
                            <span class="skill-icon" aria-hidden="true">${theme.icon}</span>
                            <span class="skill-text">
                                <span class="skill-name">${skill.name}</span>
                                <span class="skill-meta">${skill.status} • ${skill.mastery}%</span>
                            </span>
                        </span>
                        <span class="skill-bubble-ripple" aria-hidden="true"></span>
                    </button>`;
            }).join('');
            return `
                <section class="skill-group reveal stagger-children" data-group="${group.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">
                    <div class="skill-group-label">${group.label}</div>
                    <div class="skill-group-bubbles stagger-children">
                        ${bubbles}
                    </div>
                </section>`;
        }).join('');
        skillsCloud.querySelectorAll('.skill-bubble').forEach(b => {
            const triggerPopup = () => {
                const s = CONFIG.skills[parseInt(b.dataset.skillIndex, 10)];
                skillPopupContent.innerHTML = `
                    <div class="skill-popup-name">${s.name}</div>
                    <div class="skill-popup-detail"><strong>Mastery:</strong> ${s.mastery}%</div>
                    <div class="skill-popup-detail"><strong>Experience:</strong> ${s.experience}</div>
                    <div class="skill-popup-detail"><strong>Projects:</strong> ${s.projects}</div>
                    <div class="skill-popup-detail"><strong>Status:</strong> ${s.status}</div>
                    <div class="skill-popup-detail"><strong>Related:</strong> ${s.related}</div>`;
                skillPopup.classList.add('active');
                skillBackdrop.classList.add('active');
            };
            b.addEventListener('click', triggerPopup);
            b.addEventListener('pointerdown', () => {
                b.classList.remove('is-popped');
                void b.offsetWidth;
                b.classList.add('is-popped');
                setTimeout(() => b.classList.remove('is-popped'), 340);
            });
        });
    }
    function closeSkillPopup() { skillPopup.classList.remove('active'); skillBackdrop.classList.remove('active'); }
    skillPopupClose.addEventListener('click', closeSkillPopup);
    skillBackdrop.addEventListener('click', closeSkillPopup);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSkillPopup(); });
    buildSkills();

    // ============================================================
    // PROJECTS (unchanged)
    // ============================================================
    function getProjectTheme(project, index) {
        const themes = [
            { accent: '#f0b36a', soft: 'rgba(240,179,106,0.14)', mesh: 'radial-gradient(circle at 20% 18%, rgba(240,179,106,0.36), transparent 30%), radial-gradient(circle at 78% 24%, rgba(255,255,255,0.16), transparent 22%), linear-gradient(145deg, rgba(28, 25, 40, 0.96), rgba(14, 14, 20, 0.96))' },
            { accent: '#6fb7ff', soft: 'rgba(111,183,255,0.14)', mesh: 'radial-gradient(circle at 18% 24%, rgba(111,183,255,0.36), transparent 30%), radial-gradient(circle at 82% 30%, rgba(245,212,99,0.18), transparent 20%), linear-gradient(145deg, rgba(18, 22, 36, 0.96), rgba(14, 14, 20, 0.96))' },
            { accent: '#8ad45b', soft: 'rgba(138,212,91,0.14)', mesh: 'radial-gradient(circle at 26% 22%, rgba(138,212,91,0.34), transparent 30%), radial-gradient(circle at 68% 18%, rgba(95,179,255,0.16), transparent 18%), linear-gradient(145deg, rgba(18, 24, 20, 0.96), rgba(14, 14, 20, 0.96))' },
            { accent: '#c59dff', soft: 'rgba(197,157,255,0.14)', mesh: 'radial-gradient(circle at 22% 24%, rgba(197,157,255,0.34), transparent 30%), radial-gradient(circle at 76% 22%, rgba(240,179,106,0.14), transparent 18%), linear-gradient(145deg, rgba(23, 18, 34, 0.96), rgba(14, 14, 20, 0.96))' },
        ];
        return themes[index % themes.length];
    }

    function buildProjectPreview(project, theme) {
        if (project.image) {
            return `<img src="${project.image}" alt="${project.title}" loading="lazy">`;
        }
        return `
            <div class="project-mockup" aria-hidden="true" style="--project-mesh:${theme.mesh};--project-accent:${theme.accent};">
                <div class="mockup-browser">
                    <span class="mockup-dots"><i></i><i></i><i></i></span>
                    <span class="mockup-address">${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</span>
                </div>
                <div class="mockup-canvas">
                    <div class="mockup-hero"></div>
                    <div class="mockup-panel mockup-panel-a"></div>
                    <div class="mockup-panel mockup-panel-b"></div>
                    <div class="mockup-panel mockup-panel-c"></div>
                    <div class="mockup-code"></div>
                </div>
            </div>`;
    }

    function buildProjects() {
        projectsHorizontal.innerHTML = CONFIG.projects.map((project, index) => {
            const theme = getProjectTheme(project, index);
            const numberLabel = String(index + 1).padStart(2, '0');
            const sizeClass = project.featured ? ' project-card-featured' : index === 1 ? ' project-card-tall' : '';
            return `
            <article class="project-card${sizeClass} reveal" style="--project-accent:${theme.accent};--project-soft:${theme.soft};--project-mesh:${theme.mesh};" data-project-index="${index}">
                <div class="project-accent-glow" aria-hidden="true"></div>
                <div class="project-number">${numberLabel} — ${project.year}</div>
                ${project.featured ? '<div class="project-feature-tag">Featured</div>' : ''}
                <div class="project-preview">
                    ${buildProjectPreview(project, theme)}
                    <div class="project-preview-fade" aria-hidden="true"></div>
                </div>
                <div class="project-info">
                    <div class="project-title-row">
                        <div class="project-title">${project.title}</div>
                        <div class="project-status is-live"><span></span>Live</div>
                    </div>
                    <div class="project-role">${project.role}</div>
                    <div class="project-desc">${project.desc}</div>
                    <div class="project-tech stagger-children">${project.tech.map((t, techIndex) => `<span style="transition-delay:${techIndex * 0.06}s">${t}</span>`).join('')}</div>
                    <div class="project-links">
                        <a href="${project.github}" class="btn btn-outline project-btn" target="_blank" rel="noopener">GitHub ↗</a>
                        <a href="${project.live}" class="btn btn-primary project-btn project-live-btn" target="_blank" rel="noopener"><span class="live-dot" aria-hidden="true"></span>Live Demo</a>
                    </div>
                </div>
            </article>`;
        }).join('');
    }
    buildProjects();

    // ============================================================
    // CONTACT (unchanged)
    // ============================================================
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const orig = btn.textContent;
        btn.textContent = 'Message Sent! ✓';
        btn.style.background = '#4a9';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; contactForm.reset(); }, 2500);
    });

    // ============================================================
    // DOWNLOAD RESUME (unchanged)
    // ============================================================
    downloadResume.addEventListener('click', (e) => {
        e.preventDefault();
        if (CONFIG.resumePDF && CONFIG.resumePDF !== '#') window.open(CONFIG.resumePDF, '_blank');
        else alert('Resume PDF will be available soon!');
    });

    // ============================================================
    // AI CHATBOT (unchanged)
    // ============================================================
    const knowledgeBase = [
        { patterns: ['who are you','about bikash','tell me about','who is bikash'], response: 'I\'m Bikash Dhakal, CS student & full-stack dev.' },
        { patterns: ['skills','technologies','tech stack'], response: 'HTML, CSS, JS, PHP, MySQL, Git, Linux, C, C++, Java, OpenGL, React (learning), Docker (learning).' },
        { patterns: ['projects','portfolio','work'], response: 'E-Commerce Platform, Portfolio, Task Manager, OpenGL Renderer.' },
        { patterns: ['certificates','certifications'], response: 'Full Stack, JavaScript, Responsive Design, Git, PHP, Linux.' },
        { patterns: ['contact','email','hire','connect'], response: 'Email: bikash@example.com or use the contact form.' },
        { patterns: ['study','university','college'], response: 'Pursuing a Computer Science degree.' },
        { patterns: ['learning','currently learning'], response: 'React, Node.js, Docker, DevOps.' },
        { patterns: ['github','repository'], response: 'github.com/bikashdhakal' },
        { patterns: ['hire','job','freelance'], response: 'Open to opportunities! Contact me.' },
        { patterns: ['hello','hi','hey'], response: 'Hello! Ask me about Bikash.' },
    ];
    function findAnswer(q) {
        q = q.toLowerCase();
        for (let entry of knowledgeBase) {
            if (entry.patterns.some(p => q.includes(p))) return entry.response;
        }
        return 'I only answer questions about Bikash\'s portfolio.';
    }
    function addChatMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = 'chat-msg ' + sender;
        msg.textContent = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    function showTyping(ms = 1200) {
        chatTyping.classList.add('active');
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return new Promise(resolve => setTimeout(() => { chatTyping.classList.remove('active'); resolve(); }, ms));
    }
    async function handleChatSend() {
        const q = chatInput.value.trim();
        if (!q) return;
        chatInput.value = '';
        addChatMessage(q, 'user');
        await showTyping(800 + Math.random()*1000);
        addChatMessage(findAnswer(q), 'bot');
    }
    chatSend.addEventListener('click', handleChatSend);
    chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleChatSend(); });
    aiOrb.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) chatInput.focus();
    });
    chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && chatWindow.classList.contains('open')) chatWindow.classList.remove('open'); });

    // ============================================================
    // INTERSECTION OBSERVER (reveal)
    // ============================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (!entry.target.classList.contains('stagger-children')) revealObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.15 });
    document.querySelectorAll('.reveal, .reveal-left, .stagger-children').forEach(el => revealObserver.observe(el));
    // Journey milestones separately
    const journeyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                journeyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    setTimeout(() => {
        journeyRoadmap.querySelectorAll('.journey-milestone').forEach(m => journeyObserver.observe(m));
    }, 200);

    // ============================================================
    // PARALLAX ON HERO (unchanged)
    // ============================================================
    let heroParallaxFrame = null;
    function updateHeroParallax() {
        heroParallaxFrame = null;
        const scrollY = window.scrollY;
        const bgY = Math.min(72, scrollY * 0.08);
        const contentY = Math.min(96, scrollY * 0.14);
        homeSection.style.setProperty('--hero-image-shift-y', `${bgY}px`);
        homeSection.style.setProperty('--hero-content-shift-y', `${contentY}px`);
        homeSection.style.setProperty('--hero-image-shift-x', '0px');
        homeSection.style.setProperty('--hero-content-shift-x', '0px');
    }
    function requestHeroParallaxUpdate() {
        if (heroParallaxFrame) return;
        heroParallaxFrame = requestAnimationFrame(updateHeroParallax);
    }
    window.addEventListener('scroll', requestHeroParallaxUpdate, { passive: true });
    window.addEventListener('resize', requestHeroParallaxUpdate, { passive: true });
    updateHeroParallax();
    document.addEventListener('mousemove', (e) => {
        if (!isDesktop) return;
        const homeRect = homeSection.getBoundingClientRect();
        if (homeRect.bottom < 0 || homeRect.top > window.innerHeight) return;
        const x = (e.clientX - window.innerWidth/2) / window.innerWidth;
        const y = (e.clientY - window.innerHeight/2) / window.innerHeight;
        homeSection.style.setProperty('--hero-content-shift-x', `${x * 10}px`);
        homeSection.style.setProperty('--hero-content-shift-y', `${(window.scrollY * 0.14) + (y * 8)}px`);
        homeSection.style.setProperty('--hero-image-shift-x', `${x * -12}px`);
        homeSection.style.setProperty('--hero-image-shift-y', `${Math.min(72, window.scrollY * 0.08) + (y * -6)}px`);
    });

    // ============================================================
    // CUSTOM CURSOR (unchanged)
    // ============================================================
    if (isDesktop && cursorDot && cursorRing) {
        document.body.classList.add('cursor-ready');
        document.addEventListener('pointermove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorRing.style.left = `${e.clientX}px`;
            cursorRing.style.top = `${e.clientY}px`;
            document.body.classList.toggle('cursor-hover', Boolean(e.target.closest(interactiveCursorTargets)));
        }, { passive: true });
        document.addEventListener('pointerdown', () => document.body.classList.add('cursor-press'));
        document.addEventListener('pointerup', () => document.body.classList.remove('cursor-press'));
        document.addEventListener('pointerleave', () => {
            document.body.classList.remove('cursor-hover', 'cursor-press');
        });
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================
    updateNavVisibility();
    updateActiveNav();
    requestJourneyLayoutUpdate();
})();

lucide.createIcons();