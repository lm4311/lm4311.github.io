// Edit this file to personalize the whole site.
export const site = {
  name: 'Your Name',
  role: 'XR Creative Technologist / Designer & Developer',
  // A short explanation of the experiences you build.
  intro:
    'I design and develop immersive experiences, from VR product showrooms and multiplayer tracking tools to cinematic visualization and motion capture, built in Unreal Engine and Unity.',
  location: 'New York, NY',
  description:
    'Portfolio of an XR creative technologist, designer and developer: VR showrooms, multiplayer VR tracking tools, product visualization, film and motion capture.',
  email: 'hello@example.com',
  url: 'https://lm4311.github.io',
  links: {
    linkedin: 'https://www.linkedin.com/in/your-handle',
  },
  // Replace public/resume.pdf with your résumé.
  resume: '/resume.pdf',
};

// Project groups, in the order they appear.
export const groups = [
  { key: 'xr', title: 'XR & Interactive Experiences' },
  { key: 'visualization', title: 'Product Visualization & Film' },
  { key: 'mocap', title: 'Motion Capture & Performance' },
] as const;

export const groupLabel: Record<string, string> = Object.fromEntries(groups.map((g) => [g.key, g.title]));

// Main capabilities, shown in the introduction at the end of the homepage and on the About page.
export const capabilities = [
  'XR experience design and development',
  'Engine plugin and tools development',
  'Multiplayer VR, optical tracking and physical–virtual alignment',
  'Spatial interaction and product configuration',
  'Real-time and cinematic visualization in Unreal Engine',
  'Motion capture, animation and performance',
];

// Grouped the way job descriptions list requirements, so recruiters can match keywords.
export const skills = [
  { group: 'XR and real-time', items: ['Unreal Engine 5', 'Unity', 'OpenXR', 'Meta XR SDK', 'Multiplayer networking'] },
  { group: 'Tracking and tools', items: ['OptiTrack Motive', 'NatNet SDK', 'Plugin development', 'Calibration', 'Git'] },
  { group: 'Programming', items: ['C++', 'Blueprints', 'C#', 'HLSL'] },
  { group: 'Design', items: ['Spatial UX', 'Rapid prototyping', 'User testing', 'Figma'] },
  { group: 'Visualization and film', items: ['Path Tracer', 'Movie Render Queue', 'Sequencer', 'DaVinci Resolve'] },
  { group: 'Motion capture', items: ['Optical capture', 'MotionBuilder', 'Retargeting', 'MetaHuman'] },
];

// Newest first. Replace with your real history.
export const experience = [
  { when: '2025 – Now', role: 'Role title', org: 'Company or studio', note: 'One line on scope and impact.' },
  { when: '2024 – 2025', role: 'Role title', org: 'Company or studio', note: 'One line on scope and impact.' },
];

export const education = [{ when: '2023 – 2025', degree: 'Degree, program', school: 'School' }];
