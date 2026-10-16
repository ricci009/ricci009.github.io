// Design-study itinerary; exact travel dates are intentionally not inferred.
import { chapters } from './journey';
export const stops = [
  {
    name: 'Michigan',
    short: 'UofM',
    location: 'Ann Arbor, Michigan',
    label: 'Where it begins',
    title: 'A little curiosity. A lot of possibility.',
    description:
      'Studying computer science at the University of Michigan, learning how things work, and finding things worth building.',
    scene: 'campus',
    tag: 'COMPUTER SCIENCE · GO BLUE',
    chapter: 'campus',
    coordinates: [256, 126],
  },
  {
    name: 'Germany',
    short: 'EDAG',
    location: 'Ingolstadt, Germany',
    label: 'Across the Atlantic',
    title: 'From a line of code to the open road.',
    description:
      'At EDAG, software became something you could drive. Vehicle displays, CAN signals, and tools connecting people to the hardware around them.',
    scene: 'garage',
    tag: 'C++ · QT / QML · CAN BUS',
    chapter: 'workshop',
    coordinates: [509, 109],
  },
  {
    name: 'Michigan',
    short: 'Back home',
    location: 'Ann Arbor, Michigan',
    label: 'Back to the mitten',
    title: 'Coming home with a wider perspective.',
    description:
      'Back in Michigan, connecting classroom ideas with hands-on engineering. B.S. in Computer Science, University of Michigan, December 2024.',
    scene: 'graduation',
    tag: 'UNIVERSITY OF MICHIGAN · B.S. 2024',
    chapter: 'campus',
    coordinates: [256, 126],
  },
  {
    name: 'Durham',
    short: 'SMT',
    location: 'Durham, North Carolina',
    label: 'Live from North Carolina',
    title: 'Making the game come alive.',
    description:
      'At SMT, I turn live sports data into graphics on your screen. Kick trajectories, on-field overlays, and the geometry behind the broadcast.',
    scene: 'broadcast',
    tag: 'C++ · OPENGL · LIVE GRAPHICS',
    chapter: 'stadium',
    coordinates: [270, 145],
  },
  {
    name: 'Durham',
    short: 'Quantum',
    location: 'Durham, North Carolina',
    label: 'Another world to build',
    title: 'A place you can explore before you arrive.',
    description:
      'For Quantum, I built an interactive real-estate experience: 3D neighborhoods, home showrooms, maps, and property dashboards.',
    scene: 'houses',
    tag: 'REACT · THREE.JS · MAPLIBRE',
    chapter: 'town',
    coordinates: [270, 145],
  },
].map((stop) => ({
  ...stop,
  projects: chapters.find((c) => c.id === stop.chapter)?.projects ?? [],
}));
export const variants = [
  { id: '1', name: 'The living atlas', kind: 'Full-screen exploration' },
  { id: '2', name: 'One long adventure', kind: 'Scroll-driven storytelling' },
  { id: '3', name: 'Player one', kind: 'Retro adventure game' },
  {
    id: '4',
    name: 'Postcards from here',
    kind: 'An illustrated travel journal',
  },
  { id: '5', name: 'After-hours flight', kind: 'Night-flight mission control' },
];
