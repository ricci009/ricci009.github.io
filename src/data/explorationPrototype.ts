// Round two: original tile-world prototypes, not a literal geographic map.
import { chapters } from './journey';
export interface Exhibit {
  title: string;
  summary: string;
  detail: string;
  demo:
    | 'degree'
    | 'can'
    | 'flash'
    | 'telemetry'
    | 'kick'
    | 'geometry'
    | 'house'
    | 'map'
    | 'coach';
  metric: string;
  action: string;
}
export interface Place {
  name: string;
  kind: 'college' | 'garage' | 'studio' | 'house' | 'lab' | 'field';
  exhibits: Exhibit[];
}
export interface Area {
  id: string;
  number: string;
  name: string;
  region: string;
  role: string;
  date: string;
  summary: string;
  badge: string;
  buildings: Place[];
}
const project = (chapter: string, index: number) =>
  chapters.find((c) => c.id === chapter)!.projects[index]!;
const exhibit = (
  chapter: string,
  index: number,
  demo: Exhibit['demo'],
  metric: string,
  action: string,
): Exhibit => ({
  ...project(chapter, index),
  detail: project(chapter, index).details,
  demo,
  metric,
  action,
});
const degree: Exhibit = {
  title: 'The foundation',
  summary: 'B.S. in Computer Science, University of Michigan.',
  detail:
    'Graduated in December 2024. My studies ran alongside multiple internships and co-op terms at EDAG, connecting classroom ideas with real automotive systems.',
  demo: 'degree',
  metric: 'B.S. · DEC 2024',
  action: 'Celebrate graduation',
};
export const areas: Area[] = [
  {
    id: 'michigan',
    number: '01',
    name: 'The starting town',
    region: 'Ann Arbor, Michigan',
    role: 'Computer science student',
    date: 'UNIVERSITY OF MICHIGAN',
    summary:
      'Start where curiosity became a career. Enter the university or visit the Michigan engineering workshop.',
    badge: 'FOUNDATIONS',
    buildings: [
      { name: 'UofM · Computer science', kind: 'college', exhibits: [degree] },
      {
        name: 'EDAG · Michigan workshop',
        kind: 'garage',
        exhibits: [
          exhibit('workshop', 1, 'flash', '60s → 5s', 'Flash the module'),
          exhibit(
            'workshop',
            3,
            'can',
            'HARDWARE + SOFTWARE',
            'Send a CAN signal',
          ),
        ],
      },
    ],
  },
  {
    id: 'germany',
    number: '02',
    name: 'The engineering town',
    region: 'Ingolstadt, Germany',
    role: 'Software Engineer Intern · EDAG',
    date: 'EDAG TERMS · 2022–MAR 2025',
    summary:
      'Across the Atlantic, code meets cars. Enter the vehicle lab and explore the systems I worked on at EDAG.',
    badge: 'ENGINEERING',
    buildings: [
      {
        name: 'EDAG · Vehicle lab',
        kind: 'garage',
        exhibits: [
          exhibit('workshop', 0, 'can', 'C++ / QT / CAN', 'Send a CAN signal'),
          exhibit('workshop', 3, 'can', 'EMBEDDED LINUX', 'Start the display'),
        ],
      },
      {
        name: 'EDAG · Data workshop',
        kind: 'lab',
        exhibits: [
          exhibit(
            'workshop',
            2,
            'telemetry',
            '50,000+ RECORDS',
            'Run the analysis',
          ),
          exhibit(
            'workshop',
            4,
            'geometry',
            'AI RESEARCH',
            'Explore the workflow',
          ),
        ],
      },
    ],
  },
  {
    id: 'home',
    number: '03',
    name: 'Back to the maize & blue',
    region: 'Ann Arbor, Michigan',
    role: 'B.S. in Computer Science',
    date: 'GRADUATED · DECEMBER 2024',
    summary:
      'Back in Michigan with a wider perspective. Visit the graduation hall and the software workshop.',
    badge: 'GRADUATION',
    buildings: [
      { name: 'UofM · Graduation hall', kind: 'college', exhibits: [degree] },
      {
        name: 'EDAG · Software workshop',
        kind: 'lab',
        exhibits: [
          exhibit('workshop', 1, 'flash', '60s → 5s', 'Flash the module'),
        ],
      },
    ],
  },
  {
    id: 'durham',
    number: '04',
    name: 'The live city',
    region: 'Durham, North Carolina',
    role: 'Software Engineer · SMT',
    date: 'MARCH 2025–PRESENT',
    summary:
      'The next stop is live. Enter the broadcast studio, visit the graphics lab, or take a detour to the soccer pitch.',
    badge: 'LIVE GRAPHICS',
    buildings: [
      {
        name: 'SMT · Broadcast studio',
        kind: 'studio',
        exhibits: [
          exhibit(
            'stadium',
            0,
            'kick',
            'SUPER BOWL BROADCAST',
            'Replay the kick',
          ),
          exhibit('stadium', 1, 'telemetry', '6M+ RECORDS', 'Run the analysis'),
        ],
      },
      {
        name: 'SMT · Graphics lab',
        kind: 'lab',
        exhibits: [
          exhibit(
            'stadium',
            2,
            'geometry',
            '6+ APPLICATIONS',
            'Change the line join',
          ),
          exhibit(
            'stadium',
            4,
            'kick',
            'REAL-TIME OVERLAYS',
            'Render the overlay',
          ),
          exhibit(
            'stadium',
            5,
            'geometry',
            'LIVE TELESTRATION',
            'Recognize the shape',
          ),
        ],
      },
      {
        name: 'Side quest · Soccer pitch',
        kind: 'field',
        exhibits: [
          {
            title: 'A different kind of team',
            summary: 'Head JV Soccer Coach · East Chapel Hill High School.',
            detail:
              'August–October 2025, Chapel Hill, North Carolina. Led a 23-player junior varsity soccer team through a 24-game season, planning and running training sessions.',
            demo: 'coach',
            metric: '23 PLAYERS · 24 GAMES',
            action: 'Start a passing drill',
          },
        ],
      },
    ],
  },
  {
    id: 'quantum',
    number: '05',
    name: 'The neighborhood builder',
    region: 'Durham, North Carolina',
    role: 'Freelance Software Engineer · Quantum project',
    date: 'FREELANCE · MARCH 2026–PRESENT',
    summary:
      'Alongside SMT, another world to build. Walk into the showroom to explore a home, then visit the mapping studio.',
    badge: 'NEW WORLDS',
    buildings: [
      {
        name: 'Quantum · Home showroom',
        kind: 'house',
        exhibits: [
          exhibit('town', 0, 'house', 'REACT / THREE.JS', 'Switch the home'),
        ],
      },
      {
        name: 'Quantum · Mapping studio',
        kind: 'lab',
        exhibits: [
          exhibit(
            'town',
            0,
            'map',
            'MAPLIBRE / TYPESCRIPT',
            'Change the map layer',
          ),
        ],
      },
    ],
  },
];
export const explorations = [
  {
    id: 6,
    name: 'The region map',
    subtitle: 'A classic RPG region. Your career, one town at a time.',
    type: 'REGION EXPLORER',
  },
  {
    id: 7,
    name: 'The playable world',
    subtitle: 'Four destinations. A world of work.',
    type: 'PLAYABLE CAREER WORLD',
  },
  {
    id: 8,
    name: 'The career village',
    subtitle: 'An open town where every building holds a story.',
    type: 'WALKABLE CAREER TOWN',
  },
  {
    id: 9,
    name: 'The island passport',
    subtitle: 'Board a plane. Find a new island. Go inside.',
    type: 'ISLAND EXPLORATION',
  },
  {
    id: 10,
    name: 'The field companion',
    subtitle: 'Explore the map with a field guide by your side.',
    type: 'DUAL-SCREEN ADVENTURE',
  },
];
