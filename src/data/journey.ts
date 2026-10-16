export interface Project {
  title: string;
  summary: string;
  details: string;
  tags?: string[];
}
export interface Chapter {
  id: string;
  number: string;
  place: string;
  date: string;
  title: string;
  role: string;
  location: string;
  intro: string;
  note?: string;
  tags: string[];
  projects: Project[];
}

export const chapters: Chapter[] = [
  {
    id: 'workshop',
    number: '01',
    place: 'The workshop',
    date: '2022 — MARCH 2025',
    title: 'Where code meets the real world.',
    role: 'Software Engineer Intern · EDAG Group',
    location: 'Troy, Michigan & Ingolstadt, Germany',
    intro:
      'Cars, control boards, and code. Across multiple internships and co-op terms, I worked on the software connecting physical hardware to the people using it.',
    tags: ['C++', 'Qt / QML', 'CAN bus', 'Embedded Linux'],
    projects: [
      {
        title: 'A window into the vehicle',
        summary:
          'Real-time automotive displays, powered by the signals moving through a car.',
        details:
          'Built C++/Qt systems to decode CAN bus signals from DBC files, validate communication through VectorCAN and PCAN interfaces, and drive QML displays. The dashboard simulator could replay recorded CAN data or show live speed, RPM, gear, blinkers, mileage, and more.',
      },
      {
        title: 'Firmware updates without the friction',
        summary:
          'A simpler flashing workflow. Update time went from 60 seconds to 5.',
        details:
          'Delivered a Qt/C++ firmware update application with a QML interface and CMake build system for a commercial RV manufacturer. My EDAG work also included matching hardware to available S19 files and automating startup and flashing steps so mechanics could update modules through a straightforward interface.',
      },
      {
        title: 'Making vehicle data useful',
        summary:
          'Battery-health dashboards and predictive maintenance for delivery vehicles.',
        details:
          'Connected a predictive-maintenance frontend to the backend developed by EDAG Germany and built the database for US delivery vehicles. Migrated 50,000+ records into MongoDB and improved React dashboard load time by 40% through lazy loading. I also worked on battery charge/discharge analysis and electrical wiring units.',
      },
      {
        title: 'From the bench to the road',
        summary:
          'CAN-connected displays, Raspberry Pi systems, and practical automation.',
        details:
          'Worked with EDAG Germany on a custom display for bike warnings and radar, including MCU configuration and CAN integration in a Q8. Other projects included Raspberry Pi web servers, embedded Linux startup and networking, GPS integration for V2X, Qt application deployment, and VBA automation.',
      },
      {
        title: 'Exploring where AI actually helps',
        summary:
          'Research, department interviews, and prompt-engineering education.',
        details:
          'Helped kick off generative-AI integration at EDAG through market and technical research, interviews across E/E departments, and identification of useful applications. Led prompt-engineering and market-analysis work, explored test-case automation, and compared licensed closed-source models with locally run open-source alternatives.',
      },
    ],
  },
  {
    id: 'campus',
    number: '02',
    place: 'The campus',
    date: 'DECEMBER 2024',
    title: 'A foundation. And more questions.',
    role: 'B.S. in Computer Science · University of Michigan',
    location: 'Ann Arbor, Michigan',
    intro:
      'I graduated from the University of Michigan with a Bachelor of Science in Computer Science. Alongside my time in industry, it became the foundation for the systems, graphics, and software work that followed.',
    tags: ['Computer science', 'Go Blue!'],
    projects: [],
  },
  {
    id: 'stadium',
    number: '03',
    place: 'The broadcast booth',
    date: 'MARCH 2025 — PRESENT',
    title: 'Code with a front-row seat.',
    role: 'Software Engineer · SMT',
    location: 'North Carolina',
    intro:
      'At SportsMEDIA Technology, I build the systems behind live sports graphics. That means turning real-time data into something a viewer can see—and getting the details right when the cameras are rolling.',
    tags: ['C++', 'OpenGL', 'Multithreading', 'Computational geometry'],
    projects: [
      {
        title: 'Following the kick. All the way to the Super Bowl.',
        summary:
          'An independent, multithreaded application for live kick trajectories and results.',
        details:
          'Owned the architecture, data processing, and graphics implementation of a C++ application that queried an external API, parsed incoming data, and rendered kick trails and results for an NBC Super Bowl broadcast. Multiple threads and API handlers managed incoming data and load.',
      },
      {
        title: 'Six million records. A clearer picture.',
        summary:
          'A standalone NASCAR telemetry tool, from first interview to finished installer.',
        details:
          'Interviewed project and operations leads, scoped the problem, and built an application to analyze 6M+ telemetry records. It combined 2D/3D visualization, filtering, interpolation, GPS anomaly detection, and exportable reports. Used local transverse Mercator coordinate conversion to map latitude/longitude data. The reports supported analysis of vector hardware after races.',
      },
      {
        title: 'A line is more than two points',
        summary:
          'A reusable geometry library powering 2D and 3D graphics in 6+ applications.',
        details:
          'Built a C++/OpenGL library that accepts X/Y/Z points and produces connected triangle geometry and texture coordinates for thick lines, with miter, bevel, and round joins. Reused it in golf graphics, combining mesh rendering and ray intersections to draw circles that follow the terrain.',
      },
      {
        title: 'Finding the right frame',
        summary:
          'Data-to-video alignment, camera matching, and the tricky parts of concurrency.',
        details:
          'Developed alignment using Ceres optimization and Hungarian matching, integrating player positions from memory-mapped data. Worked on DCT and pixel-sampling fingerprints to compare camera frames with the program feed. Also diagnosed a rendering race condition where a frame was read from stale cache instead of the live cache.',
      },
      {
        title: 'Making the invisible visible',
        summary:
          '3D nameplates, on-court shot clocks, and a quarterback’s view of the field.',
        details:
          'Delivered client graphics and profiles for NBC and Amazon. Built custom basketball nameplates and shot-clock overlays, and worked on Amazon TNF QB Vision: ray-casting supplied screen coordinates onto the field at quarterback height to generate world-space coordinates for a 3D cone.',
      },
      {
        title: 'From a sketch to the screen',
        summary: 'Mathematical shape recognition for live telestration.',
        details:
          'Implemented shape-recognition algorithms and confidence scores for lines, polylines, circles, ellipses, and rectangles, using edge splitting and curvature analysis. Animated the transition from a drawn stroke to a recognized shape. The work was used on Sunday Night Football. Other engineering work included VANC debugging and shared property sheets supporting 60+ applications.',
      },
    ],
  },
  {
    id: 'pitch',
    number: '04',
    place: 'The touchline',
    date: 'AUGUST — OCTOBER 2025',
    title: 'A different kind of team.',
    role: 'Head JV Soccer Coach · East Chapel Hill High School',
    location: 'Chapel Hill, North Carolina',
    intro:
      'Some of my work happens away from a keyboard. I led a 23-player junior varsity soccer team through a 24-game season, planning and running training sessions.',
    tags: ['23 players', '24 games', 'One team'],
    projects: [],
  },
  {
    id: 'town',
    number: '05',
    place: 'The next neighborhood',
    date: 'MARCH 2026 — PRESENT',
    title: 'New places to build.',
    role: 'Freelance Software Engineer',
    location: 'Alongside my work at SMT',
    intro:
      'Freelance projects give me another space to connect software to the world around us—from exploring a neighborhood in 3D to putting an image on an e-ink display.',
    tags: ['TypeScript', 'React', 'Three.js', 'MapLibre'],
    projects: [
      {
        title: 'A neighborhood you can explore',
        summary: 'Interactive real-estate visualization for Quantum.',
        details:
          'Built a TypeScript and React application combining Three.js neighborhoods and home showrooms with MapLibre geographic maps and property dashboards. The project connects spatial visualization with the details people need to explore a property.',
      },
      {
        title: 'A small screen with a life of its own',
        summary:
          'Firmware for image uploads and playlists on an e-ink display.',
        details:
          'Developed e-ink display firmware that lets users upload and change images, then organize them into playlists.',
      },
    ],
  },
];
