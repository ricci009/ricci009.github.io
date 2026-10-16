import { chapters } from './journey';

const chapter = (id: string) => chapters.find((entry) => entry.id === id)!;
export const destinations = [
  {
    id: 'uofm',
    name: 'University of Michigan',
    short: 'UofM',
    place: 'Ann Arbor, Michigan',
    label: 'THE FOUNDATION',
    chapter: chapter('campus'),
    headline: 'Where it all started.',
    stat: 'B.S.',
    statLabel: 'Computer Science · December 2024',
    note: 'My university studies overlapped with internships and co-op terms at EDAG.',
    projects: [
      {
        title: 'Learning, then putting it to work',
        summary: 'Computer science, connected to real systems.',
        details:
          'I graduated from the University of Michigan in December 2024 with a B.S. in Computer Science. While studying, I worked across EDAG teams in Michigan and Germany, connecting my education with automotive software and embedded systems.',
      },
    ],
    scene: 'A campus in maize & blue',
  },
  {
    id: 'edag',
    name: 'EDAG',
    short: 'EDAG',
    place: 'Ingolstadt, Germany',
    label: 'CODE MEETS CARS',
    chapter: chapter('workshop'),
    headline: 'From a signal to something real.',
    stat: '60s → 5s',
    statLabel: 'Firmware update time',
    note: 'Multiple internships and co-op terms, 2022–March 2025, across Troy, Michigan and Ingolstadt, Germany. The projects below span those terms.',
    projects: chapter('workshop').projects,
    scene: 'Inside the vehicle lab',
  },
  {
    id: 'smt',
    name: 'SportsMEDIA Technology',
    short: 'SMT',
    place: 'Durham, North Carolina',
    label: 'BUILT FOR LIVE',
    chapter: chapter('stadium'),
    headline: 'Software with a front-row seat.',
    stat: '6M+',
    statLabel: 'Telemetry records analyzed',
    note: 'Software Engineer · March 2025–present',
    projects: chapter('stadium').projects,
    scene: 'Live from the graphics studio',
  },
  {
    id: 'quantum',
    name: 'Quantum',
    short: 'Quantum',
    place: 'Durham, North Carolina',
    label: 'NEW WORLDS TO BUILD',
    chapter: chapter('town'),
    headline: 'A home before you step inside.',
    stat: '3D',
    statLabel: 'Homes, neighborhoods & geographic maps',
    note: 'Freelance project · March 2026–present, alongside my work at SMT.',
    projects: [chapter('town').projects[0]!],
    scene: 'The interactive home showroom',
  },
];

export const travelChapters = [
  {
    destination: 'uofm',
    name: 'Michigan',
    label: 'University of Michigan',
    sub: 'Study & first internships',
  },
  {
    destination: 'edag',
    name: 'Germany',
    label: 'EDAG · Ingolstadt',
    sub: 'Automotive software',
  },
  {
    destination: 'uofm',
    name: 'Back to Michigan',
    label: 'UofM · Graduation',
    sub: 'B.S. Computer Science · Dec 2024',
  },
  {
    destination: 'smt',
    name: 'Durham',
    label: 'SMT',
    sub: 'Live sports graphics · 2025–now',
  },
  {
    destination: 'quantum',
    name: 'Still building',
    label: 'Quantum · Freelance',
    sub: 'Interactive homes · 2026–now',
  },
];
