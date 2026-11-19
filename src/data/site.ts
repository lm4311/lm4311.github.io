// Edit this file to personalize the whole site.
// The About text, capabilities, skills and project experience below are written from the project pages in
// src/content/work/. When a project page changes (a new role, a new result), update the matching lines here.
export const site = {
  name: 'Luke Mu',
  role: 'XR Creative Technologist / Designer & Developer',
  // A short explanation of the experiences you build (the homepage opening).
  intro:
    'I design and build real-time experiences in Unreal Engine: co-located multiplayer VR, product visualization and film, motion capture and games. I work on both the engineering and the image, from C++ plugins and gameplay systems to lighting and final renders.',
  location: 'New York, NY',
  description:
    'Portfolio of Luke Mu, an XR creative technologist, designer and developer working in Unreal Engine: co-located multiplayer VR, product visualization and film, motion capture and games.',
  // Leave any of the next four empty ('') to hide its button and link across the site.
  email: 'mulejia@gmail.com',
  url: 'https://lukemucg.com',
  links: {
    // Add the full profile address, e.g. 'https://www.linkedin.com/in/...'. Empty hides the LinkedIn buttons.
    linkedin: 'https://www.linkedin.com/in/lejia-mu',
  },
  // The résumé is public/resume.pdf (currently the October 2025 version). Replace that file to update it.
  resume: '/resume.pdf',
  // A portrait for the About page: put the image in public/ and give its path, e.g. '/portrait.webp'.
  portrait: '/portrait.webp',
  // The same portrait as two layers, for the 3D picture on the About page (made by scripts/portrait-layers.cjs).
  // Leave both empty to show the plain portrait instead.
  portraitSubject: '/portrait-subject.webp',
  portraitBackdrop: '/portrait-backdrop.webp',
};

// Project groups, in the order they appear.
export const groups = [
  { key: 'xr', title: 'XR & Interactive Experiences' },
  { key: 'visualization', title: 'Product Visualization & Film' },
  { key: 'mocap', title: 'Motion Capture & Performance' },
  { key: 'games', title: 'Games' },
] as const;

export const groupLabel: Record<string, string> = Object.fromEntries(groups.map((g) => [g.key, g.title]));

// The short introduction at the end of the homepage.
export const homeAbout =
  "I'm Luke Mu, an XR creative technologist in New York. I work in Unreal Engine on both sides of a project. On the engineering side, I wrote a C++ plugin that keeps several VR headsets registered to one physical room with OptiTrack. On the visual side, I light and render product work, from a private jet cabin to a path-traced Ferrari film. I've also led two motion capture projects from the capture stage to the final render, and I was gameplay programmer and technical director on iWasThere, a Games for Change 2026 award winner.";

// The About page text, one paragraph per entry. Links are added in about.astro by project title.
export const about = [
  "I'm Luke Mu, an XR creative technologist based in New York. I design and build real-time experiences in Unreal Engine, and I work on both halves of a project: the code that makes it run and the image people see.",
  'My most technical project is the OptiTrack VR Multiplayer Plugin, a C++ framework for Unreal Engine 5.8 that lets several people share one physical room in VR. It anchors each headset’s position to OptiTrack while the headset keeps its own orientation and motion prediction. In development tests at one venue, that cut tracking error during fast head turns from 3–8 cm to under 1 cm. I also built what surrounds the tracking: a calibration an operator can run on site, the multiplayer session, hand tracking, per-player passthrough, and a 16-page technical manual.',
  'On the visual side, I light, shade and render in Unreal Engine. Private Jet Visualization presents an aircraft cabin in real time, with Lumen hardware ray tracing and layered Substrate materials. For the Ferrari SF90 Stradale Film, a two-minute remake of Ferrari’s launch film rendered with the Path Tracer, I directed a team of three and did the 3D animation and modeling, the VFX and the studio lighting.',
  'I also work with performance. I took two motion capture projects from the OptiTrack stage to the final render: Oath and Shadow, a sword fight made in four weeks, and Off Track Ronins, a short film that adds an LED volume and volumetric capture. On both I handled the retargeting, the Control Rig cleanup and the Sequencer work. In games, I was gameplay programmer and technical director on iWasThere, a narrative game about coral bleaching and a Games for Change 2026 award winner, and I’m developing Last Sonata, a zombie survival shooter, on my own.',
  'Right now I’m building a VR showroom for the Bugatti Tourbillon, where visitors explore and configure the car at full scale. I’m looking for a role in XR or real-time 3D where I can both design and build.',
];

// The ASUS interview on the About page (#interview). The video is in public/media/asus-interview/.
export const interview = {
  title: 'When Details Matter',
  source: 'ASUS USA',
  date: 'September 2026',
  url: 'https://www.instagram.com/asususa/reel/DdCKIrxj9jv/',
  text: 'ASUS USA interviewed me about my real-time visualization work on the Bugatti Tourbillon in Unreal Engine 5, for a ProArt by ASUS and NYU Tandon feature.',
};

// Main capabilities, shown in the introduction at the end of the homepage and on the About page.
export const capabilities = [
  'XR development in Unreal Engine with C++, Blueprints and OpenXR',
  'Co-located multiplayer VR: optical tracking, calibration and networking',
  'Hand tracking, passthrough and spatial interface design',
  'Lighting, materials and rendering for product visualization and film',
  'Motion capture: OptiTrack, retargeting, Control Rig cleanup and Sequencer',
  'Gameplay programming and systems design',
];

// Grouped the way job descriptions list requirements, so recruiters can match keywords.
// Every item is a tool or technique used in a project on this site.
export const skills = [
  {
    group: 'XR and real-time',
    items: ['Unreal Engine 5', 'OpenXR', 'Hand tracking', 'Passthrough mixed reality', 'Multiplayer networking'],
  },
  {
    group: 'Tracking and tools',
    items: ['OptiTrack Motive', 'Live Link', 'Tracking fusion and calibration', 'Plugin development', 'Technical documentation'],
  },
  { group: 'Programming', items: ['C++', 'Blueprints', 'UMG', 'Enhanced Input', 'Niagara'] },
  {
    group: 'Visualization and film',
    items: ['Path Tracer', 'Lumen hardware ray tracing', 'Substrate materials', 'Sequencer', 'Movie Render Queue'],
  },
  {
    group: 'Motion capture and virtual production',
    items: ['MotionBuilder', 'IK Retargeter and MetaHuman', 'Control Rig', 'LED volume (ICVFX)', 'Volumetric capture'],
  },
  {
    group: 'Game development',
    items: ['Gameplay systems', 'Enemy AI and boss fights', 'Level design', 'UI and HUD', 'Optimization (LODs, object pooling)'],
  },
];

// Project experience, newest first. `href` links the project name to its page.
export const experience = [
  {
    when: '2026',
    role: 'Solo developer',
    org: 'OptiTrack VR Multiplayer Plugin',
    href: '/work/optitrack-vr-multiplayer-plugin/',
    note: 'A C++ plugin for Unreal Engine 5.8: tracking fusion, OpenXR integration, calibration, the multiplayer session framework and hand tracking.',
  },
  {
    when: '2025 – 2026',
    role: 'Gameplay programmer and technical director',
    org: 'iWasThere',
    href: '/work/iwasthere/',
    note: 'Team of five. Built the diver controller, camera mode, observation log and clownfish chase, then integrated the final build. Games for Change 2026 award winner.',
  },
  {
    when: '2026',
    role: 'Director',
    org: 'Ferrari SF90 Stradale Film',
    href: '/work/ferrari-sf90-film/',
    note: 'Team of three. Directed the film and did the 3D animation and modeling, the VFX and the studio lighting. Rendered with the Path Tracer in Unreal Engine 5.7.',
  },
  {
    when: '2025',
    role: 'Director, lead animator and mocap technical director',
    org: 'Off Track Ronins',
    href: '/work/off-track-ronins/',
    note: 'A six-week short film: performance capture, a retargeting pipeline for three skeletons, Control Rig cleanup, an LED volume shoot and volumetric capture.',
  },
  {
    when: '2025',
    role: 'Cinematic lead and technical artist',
    org: 'Oath and Shadow',
    href: '/work/oath-and-shadow/',
    note: 'A four-week motion capture cinematic: cleanup in MotionBuilder, MetaHuman retargeting, Control Rig and Sequencer.',
  },
  {
    when: '2024 – Now',
    role: 'Solo developer',
    org: 'Last Sonata',
    href: '/work/last-sonata/',
    note: 'A zombie survival shooter in Unreal Engine 5: weapons, horde AI, multi-phase bosses, traversal and UI.',
  },
];

// Leave empty to hide the Education column on the About page.
export const education: { when: string; degree: string; school: string }[] = [
  { when: 'Expected May 2027', degree: 'Master of Science, Integrated Design & Media', school: 'New York University' },
  {
    when: 'May 2025',
    degree: 'Honours Bachelor of Arts, New Media Studies and Economics for Management Studies',
    school: 'University of Toronto',
  },
];
