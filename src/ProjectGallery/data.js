export const PROJECTS = [
  {
    id: 'ems',
    index: '01',
    title: 'Employee Management System',
    shortTitle: 'EMS',
    subtitle: 'Role-Based Task & Workforce Portal',
    category: 'Enterprise Dashboard',
    year: '2026',
    description:
      'A role-based workforce and task management platform featuring dedicated Admin and Employee dashboards, task creation and assignment workflows, real-time status tracking (New, Active, Completed, Failed), and persistent local state.',
    tech: ['React 19', 'Tailwind CSS', 'Context API', 'LocalStorage'],
    techString: 'React 19 · Tailwind CSS · Context API',
    stat: 'Admin & Employee Portals',
    link: '/demo/ems',
    github: 'https://github.com/Dhakal009/Profolio/tree/master/Projects/EMS',
    status: 'Live',
    accent: '#10b981',
    // Leave empty to show default placeholders. Later: ['/shots/ems-1.png', '/shots/ems-2.png', '/shots/ems-3.png']
    screenshots: [],
    // TODO: replace with the real demo logins
    credentials: [
      { role: 'Admin', email: 'admin@example.com', password: 'Admin@1234' },
      { role: 'Employee', email: 'employee@example.com', password: 'Employee@1234' }
    ]
  },
  {
    id: 'live-chat',
    index: '02',
    title: 'Live Chat Application',
    shortTitle: 'Live Chat',
    subtitle: 'Real-Time Messaging Platform',
    category: 'Full Stack & WebSockets',
    year: '2026',
    description:
      'A full-stack real-time messaging platform built with React, Node.js, Express, MongoDB, and Socket.io. Features JWT authentication, instant bidirectional messaging, live online presence indicators, typing notifications, and unread message badges.',
    tech: ['React 19', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Tailwind CSS'],
    techString: 'React · Socket.io · Node.js · MongoDB',
    stat: 'Real-Time WebSockets',
    link: '/demo/live-chat',
    github: 'https://github.com/Dhakal009/Profolio/tree/master/Projects/live-chat',
    status: 'Live',
    accent: '#6366f1',
    // Later: ['/shots/chat-1.png', '/shots/chat-2.png', '/shots/chat-3.png']
    screenshots: [],
    // TODO: replace with the real demo logins (two users so chat can be tested)
    credentials: [
      { role: 'User 1', email: 'demo@example.com', password: 'Demo@1234' },
      { role: 'User 2', email: 'demo2@example.com', password: 'Demo@1234' }
    ]
  },
  {
    id: 'ecommerce-app',
    index: '03',
    title: 'E-Commerce App',
    shortTitle: 'E-Commerce',
    subtitle: 'Full-Stack Online Storefront',
    category: 'MERN E-Commerce',
    year: '2026',
    description:
      'A full-stack MERN e-commerce storefront featuring product catalog browsing, category filtering, search, interactive cart management, and checkout workflow backed by Express and MongoDB.',
    tech: ['React 19', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    techString: 'React · Express · MongoDB',
    stat: 'Full-Stack Storefront',
    link: '/demo/ecommerce-app',
    github: 'https://github.com/Dhakal009/Profolio/tree/master/Projects/POSHAK',
    status: 'Live',
    accent: '#f59e0b',
    // Later: ['/shots/shop-1.png', '/shots/shop-2.png', '/shots/shop-3.png']
    screenshots: [],
    // TODO: replace with the real demo login
    credentials: [
      { role: 'Customer', email: 'demo@example.com', password: 'Demo@1234' }
    ]
  }
];

// Unique curated home wall for each project: glides to center on approach, returns to home wall on pass
export const PROJECT_SLOTS = [
  { row: 1.5, wall: 'left' },
  { row: 4.5, wall: 'right' },
  { row: 7.5, wall: 'top' },
];

// ===== TUNABLE CONFIGURATION =====
export const CONFIG = {
  // Layout & dimensions
  ROWS: 11,            // Compact, purposeful finite tunnel
  ROW_SPACING: 3.2,    // Generous Z spacing for larger hero tiles
  CYCLE_LENGTH: 35.2,
  MAX_SCROLL: 30.5,    // Finite scroll boundary
  COLS_DESKTOP: 2,     // Larger architectural grid panels, far fewer draw calls
  COLS_MOBILE: 1,
  TILE_W: 2.55,        // Bigger architectural panel width
  TILE_H: 1.6,         // Bigger architectural panel height
  HERO_TILE_W: 3.15,   // Oversized hero project tile width
  HERO_TILE_H: 1.98,   // Oversized hero project tile height
  GAP: 0.32,           // Clean breathing room between panels
  TUNNEL_W: 7.6,       // Tunnel cross-section width
  TUNNEL_H: 5.2,       // Tunnel cross-section height

  // Randomization (seeded, subtle)
  TILT_RANGE: 1.6,
  Z_JITTER: 0.05,

  // Camera & flight speed
  FOV_DESKTOP: 70,
  FOV_MOBILE: 66,
  CAMERA_Z_START: 6.5,
  SCROLL_SPEED_FORWARD: 0.02,
  LERP_FACTOR: 0.085,
  PARALLAX_X: 2.8,
  PARALLAX_Y: 2.2,

  // Animation timings
  FOCUS_DURATION: 0.8,
  HOVER_Z: 0.52,
  HOVER_SCALE: 1.07,
};