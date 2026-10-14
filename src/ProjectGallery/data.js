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
    accent: '#10b981'
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
    accent: '#6366f1'
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
    github: 'https://github.com/Dhakal009/Profolio/tree/master/Projects/ecommerce-app',
    status: 'Live',
    accent: '#f59e0b'
  }
];

// ===== TUNABLE CONFIGURATION =====
export const CONFIG = {
  // Layout & dimensions
  ROWS: 28,            // Total rows in one continuous cycle
  ROW_SPACING: 2.4,    // Distance along Z between consecutive rows
  CYCLE_LENGTH: 67.2,  // Total Z length of one cycle (28 * 2.4)
  COLS_DESKTOP: 4,     // Wall columns on desktop
  COLS_MOBILE: 2,      // Wall columns on mobile
  TILE_W: 1.7,         // Width of each card plane
  TILE_H: 1.08,        // Height of each card plane
  GAP: 0.22,           // Spacing between tiles
  TUNNEL_W: 7.5,       // Tunnel cross-section width
  TUNNEL_H: 5.0,       // Tunnel cross-section height

  // Randomization (seeded)
  TILT_RANGE: 3.0,     // Subtle tilt
  Z_JITTER: 0.08,      // Subtle depth jitter

  // Camera & flight speed (calibrated slower for comfortable viewing)
  FOV_DESKTOP: 75,
  FOV_MOBILE: 68,
  CAMERA_Z_START: 8,
  SCROLL_SPEED_FORWARD: 0.022, // Slower, calmer flight speed
  LERP_FACTOR: 0.065,          // Silky smooth inertia damping
  PARALLAX_X: 3.0,             // ± degrees yaw parallax
  PARALLAX_Y: 3.0,             // ± degrees pitch parallax

  // Animation timings
  FOCUS_DURATION: 0.85,
  HOVER_Z: 0.38,
  HOVER_SCALE: 1.08,
};