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
            { title: 'E-Commerce Platform', desc: 'Full-stack online store with cart & admin.', tech: ['PHP','MySQL','JS','CSS'], image: '', github: '#', live: '#' },
            { title: 'Portfolio Website', desc: 'Cinematic personal portfolio.', tech: ['HTML','CSS','JS'], image: '', github: '#', live: '#' },
            { title: 'Task Manager', desc: 'Real-time collaborative task app.', tech: ['Node.js','React','MySQL'], image: '', github: '#', live: '#' },
            { title: 'OpenGL Renderer', desc: '3D graphics with lighting & shadows.', tech: ['C++','OpenGL','GLSL'], image: '', github: '#', live: '#' },
        ],
    };

    // DOM references
    const loader = document.getElementById('loader');
    const loaderPercent = document.getElementById('loaderPercent');
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    const floatingNav = document.getElementById('floatingNav');
    const navItems = document.querySelectorAll('.nav-item');
    const particlesContainer = document.getElementById('particlesContainer');
    const certTrack = document.getElementById('certTrack');
    const certModal = document.getElementById('certModal');
    const certModalContent = document.getElementById('certModalContent');
    const journeyRoadmap = document.getElementById('journeyRoadmap');
    const journeyLine = document.getElementById('journeyLine');
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
        p.style.animationDuration = (6 + Math.random() * 14) + 's';
        p.style.animationDelay = Math.random() * 8 + 's';
        p.style.width = p.style.height = (1 + Math.random() * 2.5) + 'px';
        p.style.opacity = (0.2 + Math.random() * 0.5);
        particlesContainer.appendChild(p);
    }

    // Nav visibility
    let lastScrollY = window.scrollY;
    let navVisible = true;
    function updateNavVisibility() {
        const homeBottom = homeSection.getBoundingClientRect().bottom;
        const currentScrollY = window.scrollY;
        if (homeBottom > 100) {
            if (!navVisible) { floatingNav.classList.remove('hidden'); navVisible = true; }
        } else {
            if (currentScrollY > lastScrollY && navVisible) {
                floatingNav.classList.add('hidden'); navVisible = false;
            } else if (currentScrollY < lastScrollY && !navVisible) {
                floatingNav.classList.remove('hidden'); navVisible = true;
            }
        }
        lastScrollY = currentScrollY;
    }
    window.addEventListener('scroll', updateNavVisibility, { passive: true });

    // Active nav section
    function updateActiveNav() {
        let current = 'home';
        allSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
                current = section.id;
            }
        });
        navItems.forEach(item => item.classList.toggle('active', item.dataset.section === current));
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(item.dataset.section)?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Certificates
    function buildCertificates() {
        const certs = CONFIG.certificates;
        const allCerts = [...certs, ...certs];
        certTrack.innerHTML = allCerts.map((cert, i) => `
            <div class="cert-card" data-index="${i % certs.length}">
                <div class="cert-image">${cert.image ? `<img src="${cert.image}" alt="${cert.title}" loading="lazy">` : '🏆'}</div>
                <div class="cert-title">${cert.title}</div>
                <div class="cert-issuer">${cert.issuer}</div>
                <div class="cert-year">${cert.year}</div>
            </div>`).join('');
        certTrack.querySelectorAll('.cert-card').forEach(card => {
            card.addEventListener('click', () => {
                const cert = CONFIG.certificates[parseInt(card.dataset.index)];
                certModalContent.innerHTML = `
                    <div style="width:100%;aspect-ratio:4/3;border-radius:12px;background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-size:4rem;margin-bottom:16px;">
                        ${cert.image ? `<img src="${cert.image}" alt="${cert.title}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">` : '🏆'}
                    </div>
                    <h3 style="font-family:var(--font-display);font-size:1.6rem;">${cert.title}</h3>
                    <p style="color:var(--text-secondary);">${cert.issuer} • ${cert.year}</p>
                    <button class="modal-close" id="modalCloseBtn">Close</button>`;
                certModal.classList.add('active');
                document.getElementById('modalCloseBtn').addEventListener('click', closeCertModal);
            });
        });
    }
    function closeCertModal() { certModal.classList.remove('active'); }
    certModal.addEventListener('click', (e) => { if (e.target === certModal) closeCertModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && certModal.classList.contains('active')) closeCertModal(); });
    buildCertificates();

    // Journey
    function buildJourney() {
        journeyRoadmap.querySelectorAll('.journey-milestone').forEach(el => el.remove());
        CONFIG.journey.forEach((m, i) => {
            const div = document.createElement('div');
            div.className = 'journey-milestone';
            div.style.transitionDelay = i * 0.08 + 's';
            div.innerHTML = `<div class="milestone-dot"></div><div class="milestone-icon">${m.icon}</div><div class="milestone-title">${m.title}</div><div class="milestone-desc">${m.desc}</div><div class="milestone-date">${m.date}</div>`;
            journeyRoadmap.appendChild(div);
        });
    }
    buildJourney();
    function updateJourneyLine() {
        const milestones = journeyRoadmap.querySelectorAll('.journey-milestone');
        if (!milestones.length) return;
        const lastRect = milestones[milestones.length-1].getBoundingClientRect();
        const roadmapRect = journeyRoadmap.getBoundingClientRect();
        const total = lastRect.bottom - roadmapRect.top;
        const scrolled = window.innerHeight - roadmapRect.top;
        journeyLine.style.setProperty('--line-progress', Math.min(100, Math.max(0, (scrolled/total)*100)) + '%');
    }
    window.addEventListener('scroll', updateJourneyLine, { passive: true });

    // Skills
    function buildSkills() {
        skillsCloud.innerHTML = CONFIG.skills.map((s, i) => `
            <div class="skill-bubble" data-skill-index="${i}" style="font-size:${0.78+Math.random()*0.25}rem; padding:${10+Math.random()*16}px ${16+Math.random()*20}px;">
                <span class="bubble-glow"></span>${s.name}
            </div>`).join('');
        skillsCloud.querySelectorAll('.skill-bubble').forEach(b => {
            b.addEventListener('click', () => {
                const s = CONFIG.skills[parseInt(b.dataset.skillIndex)];
                skillPopupContent.innerHTML = `
                    <div class="skill-popup-name">${s.name}</div>
                    <div class="skill-popup-detail"><strong>Mastery:</strong> ${s.mastery}%</div>
                    <div class="skill-popup-detail"><strong>Experience:</strong> ${s.experience}</div>
                    <div class="skill-popup-detail"><strong>Projects:</strong> ${s.projects}</div>
                    <div class="skill-popup-detail"><strong>Status:</strong> ${s.status}</div>
                    <div class="skill-popup-detail"><strong>Related:</strong> ${s.related}</div>`;
                skillPopup.classList.add('active');
                skillBackdrop.classList.add('active');
            });
        });
    }
    function closeSkillPopup() { skillPopup.classList.remove('active'); skillBackdrop.classList.remove('active'); }
    skillPopupClose.addEventListener('click', closeSkillPopup);
    skillBackdrop.addEventListener('click', closeSkillPopup);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSkillPopup(); });
    buildSkills();

    // Projects
    function buildProjects() {
        projectsHorizontal.innerHTML = CONFIG.projects.map(p => `
            <div class="project-card">
                <div class="project-image">${p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy">` : '💻'}</div>
                <div class="project-info">
                    <div class="project-title">${p.title}</div>
                    <div class="project-desc">${p.desc}</div>
                    <div class="project-tech">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
                    <div class="project-links">
                        <a href="${p.github}" class="btn btn-outline" target="_blank" rel="noopener">GitHub ↗</a>
                        <a href="${p.live}" class="btn btn-primary" target="_blank" rel="noopener">Live Demo ↗</a>
                    </div>
                </div>
            </div>`).join('');
    }
    buildProjects();

    // Contact form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const orig = btn.textContent;
        btn.textContent = 'Message Sent! ✓';
        btn.style.background = '#4a9';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; contactForm.reset(); }, 2500);
    });

    // Download resume
    downloadResume.addEventListener('click', (e) => {
        e.preventDefault();
        if (CONFIG.resumePDF && CONFIG.resumePDF !== '#') window.open(CONFIG.resumePDF, '_blank');
        else alert('Resume PDF will be available soon!');
    });

    // AI Chatbot
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

    // Intersection Observer for reveals
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

    // Parallax on hero
    document.addEventListener('mousemove', (e) => {
        if (!isDesktop) return;
        const homeRect = homeSection.getBoundingClientRect();
        if (homeRect.bottom < 0 || homeRect.top > window.innerHeight) return;
        const x = (e.clientX - window.innerWidth/2) / window.innerWidth;
        const y = (e.clientY - window.innerHeight/2) / window.innerHeight;
        document.querySelector('.hero-content') && (document.querySelector('.hero-content').style.transform = `translate(${x*12}px, ${y*12}px)`);
        const img = document.querySelector('.hero-image-placeholder');
        if (img && img.style.display !== 'none') img.style.transform = `translate(${x*-8}px, ${y*-8}px) scale(1.03)`;
    });

    updateNavVisibility();
    updateActiveNav();
    updateJourneyLine();
})();