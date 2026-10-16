export interface WorkProject {
  id: string;
  title: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  tags: string[];
  contributionLabel?: string;
  quantumVisual?: 'journey' | 'pipeline' | 'performance' | 'display';
  media?: { src: string; poster: string; title: string; description: string }[];
  context?: {
    title: string;
    body: string;
    scope: string;
    source: { label: string; href: string };
  };
  visual?:
    | 'kick'
    | 'camera'
    | 'sync'
    | 'telemetry'
    | 'lines'
    | 'golf'
    | 'sketch'
    | 'sports'
    | 'soccer';
  details?: { title: string; body: string }[];
  link?: { label: string; href: string };
}
export interface WorkSection {
  id: string;
  name: string;
  organization: string;
  category: string;
  role: string;
  dates: string;
  location: string;
  accent: string;
  heading: string;
  intro: string;
  skills: string[];
  highlights: { value: string; label: string }[];
  projects: WorkProject[];
  experiences?: {
    id: string;
    title: string;
    dates: string;
    location: string;
    summary: string;
    highlights: string[];
    projectIds: string[];
  }[];
}
export const profile = {
  name: 'Riccardo Salzmann',
  email: 'salzmanr@umich.edu',
  linkedin: 'https://www.linkedin.com/in/riccardo-salzmann/',
  github: 'https://github.com/ricci009',
  resume: '/Riccardo_Salzmann_Resume.pdf',
};
export const work: WorkSection[] = [
  {
    id: 'smt',
    name: 'SMT',
    organization: 'SportsMEDIA Technology',
    category: 'Full-time',
    role: 'Software Engineer I',
    dates: 'March 2025 — Present',
    location: 'Durham, North Carolina',
    accent: '#86d7ee',
    heading: 'Code that makes it to air.',
    intro:
      'I build the real-time systems behind live sports graphics: the geometry on the field, the data feeding a broadcast, and the tools operators use when the game is already underway.',
    skills: [
      'C++',
      'OpenGL',
      'CUDA',
      'Multithreading',
      'Ceres',
      'Computational geometry',
    ],
    highlights: [
      { value: 'Super Bowl LX', label: 'Kick trajectories on NBC' },
      { value: '6M+', label: 'Telemetry records analyzed' },
      { value: '6+', label: 'Applications sharing a rendering library' },
    ],
    projects: [
      {
        id: 'kick-trajectories',
        visual: 'kick',
        title: 'Kick trajectories, live at the Super Bowl',
        summary:
          'A multithreaded application from external data to on-air graphics.',
        challenge:
          'Turn incoming kick data into broadcast graphics while handling independent data packages and live rendering.',
        approach:
          'Owned the application architecture and delivery in C++. Queried external APIs, parsed the incoming data, and managed multiple threads and API handlers to render kick trails and results.',
        outcome:
          'The graphics were used live during NBC’s Super Bowl LX broadcast.',
        tags: ['C++', 'API integration', 'Multithreading', 'Live graphics'],
        details: [
          {
            title: 'Independent data packages, one live graphic',
            body: 'Built the application from API queries through parsing and rendering. Multiple threads receive independent packages concurrently, while separate API handlers distribute the incoming work. The application renders both the flight trail and the kick result.',
          },
        ],
      },
      {
        id: 'camera-fingerprints',
        visual: 'camera',
        title: 'Knowing which camera is on air',
        summary:
          'Video fingerprints that connect the program feed to the right graphics.',
        challenge:
          'Identify the on-air camera despite asynchronous buffers and frames arriving out of order.',
        approach:
          'Developed DCT-based and pixel-sampling fingerprints, accelerated DCT hashing with CUDA, and handled buffer synchronization and frame ordering. Worked within a fingerprinting budget of less than 16 ms per frame and a maximum permitted delay of four frames.',
        outcome:
          'The system identifies on-air cameras across NBA television broadcasts to support reliable graphics selection. The timing figures are design constraints, rather than claimed benchmark results.',
        tags: ['CUDA', 'C++', 'Signal processing', 'Concurrency'],
        details: [
          {
            title: 'Two ways to describe a frame',
            body: 'DCT fingerprints compare low-frequency image information; pixel sampling offers a compact, low-bandwidth alternative. Both compare candidate camera feeds with the program feed to identify which camera is on air.',
          },
          {
            title: 'Matching inside a moving pipeline',
            body: 'Handled nondeterministic frame arrival, buffer synchronization, and hysteresis so camera selection could work with asynchronous inputs. The fingerprinting pipeline had a design budget below 16 ms per frame and at most four frames of video delay.',
          },
        ],
      },
      {
        id: 'player-synchronization',
        visual: 'sync',
        title: 'Putting player data in the right frame',
        summary: 'Automatic alignment of positional data and video.',
        challenge:
          'Player data and video need a shared timing reference before graphics can align with the action.',
        approach:
          'Owned synchronization work using Ceres optimization and Hungarian matching, combining player positions with detections in video. Authored documentation and worked directly with operators to troubleshoot calibration.',
        outcome:
          'Delivered automated player-data/video synchronization across hockey, football, and basketball.',
        tags: ['Ceres', 'Optimization', 'Hungarian matching', 'Calibration'],
        details: [
          {
            title: 'Replacing manual delay adjustment',
            body: 'Operators previously configured the delay between player data and video by hand. I matched positional data from a memory-mapped file to player bounding boxes detected in video, using Ceres residuals and Hungarian assignment to automate the alignment.',
          },
          {
            title: 'From detection to calibration',
            body: 'Combined computer vision, signal processing, and combinatorial optimization. Implemented the functors and residual derivatives needed by Ceres, researched video detection for player bounding boxes, and documented calibration for the operators using the system.',
          },
        ],
      },
      {
        id: 'nascar-telemetry',
        visual: 'telemetry',
        contributionLabel: 'My application',
        title: 'From six million records to a useful report',
        summary:
          'A post-race telemetry application for investigating vehicle tracking hardware, built from stakeholder interviews through installer delivery.',
        challenge:
          'Make large raw telemetry datasets useful for investigating vehicle hardware after a race.',
        approach:
          'Built an application for exploring NASCAR vehicle telemetry in 2D and 3D. Engineers could inspect a route over a geographic map overlay, compare different metrics in a 3D graph, and investigate abnormal speed spikes, elevation jumps, and the overall quality of the GPS data.',
        outcome:
          'Analyzed more than 6 million records and produced post-race reports that uncovered issues in Vector hardware devices.',
        tags: ['C++', 'Data visualization', 'Geospatial analysis', 'Tooling'],
        context: {
          title: 'Tracking, telemetry, and race coverage',
          body: 'SMT’s RACEf/x combines GPS, ECU, timing, and scoring data for race tracking. Its Team Analytics tools bring telemetry and timing together for live and post-race analysis.',
          scope:
            'My contribution focused on the hardware-analysis workflow: inspecting large datasets, comparing hardware versions, finding GPS anomalies, and exporting reports on Vector devices. The case study describes SMT’s broader NASCAR work.',
          source: {
            label: 'Read SMT’s NASCAR case study',
            href: 'https://smt.com/case-study/nascar/',
          },
        },
        details: [
          {
            title: 'A tool shaped by the people using it',
            body: 'Interviewed project and NASCAR operations leads to define the problem, then led implementation through a standalone installer. The tool loads large raw CSV datasets, supports port-data analysis, and compares variations in hardware version data.',
          },
          {
            title: 'Coordinates, anomalies, and post-race reports',
            body: 'Used a local Transverse Mercator projection to convert latitude and longitude into local plotting coordinates, with a map API providing geographic context for the 2D view. The 3D graph supported different metrics so engineers could examine speed, elevation, and GPS quality alongside the route. Filtering, interpolation, and report exports supported investigations of abnormal spikes, GPS inconsistencies, g-force, and acceleration across hardware versions.',
          },
        ],
      },
      {
        id: 'line-library',
        visual: 'lines',
        title: 'One library. Many ways to draw a line.',
        summary: 'Reusable thick-line geometry for real-time sports graphics.',
        challenge:
          'Different applications needed consistent, configurable 2D and 3D line rendering without duplicating geometry code.',
        approach:
          'Built a shared C++/OpenGL library that converts X/Y/Z points into connected triangles and texture coordinates. Added configurable tessellation, textures, and miter, bevel, and round joins.',
        outcome:
          'Used by 6+ applications across NBA, NFL, and NHL broadcasts, and reused in terrain-following golf graphics.',
        tags: ['OpenGL', 'Geometry', 'Tessellation', 'Library design'],
        details: [
          {
            title: 'A small interface for different renderers',
            body: 'Applications supply X/Y/Z points and a texture; the library generates thick-line triangles and texture coordinates. Configurable triangle counts let each application control tessellation, while shared miter, bevel, and round joins replace repeated geometry code.',
          },
        ],
      },
      {
        id: 'masters-golf',
        visual: 'golf',
        title: 'Graphics that follow the putting green',
        summary:
          'Putting rings and distance overlays on a calibrated 3D course.',
        challenge:
          'A distance ring has to follow the green’s surface and line up with the broadcast camera.',
        approach:
          'Created a CAD course model, used fiducials to calibrate the mesh, and projected operator selections onto terrain through ray intersections. Built an interface for selecting positions from video or a 2D field view.',
        outcome:
          'Delivered putting rings and distance overlays aired during the Golf Channel broadcast of the Masters Tournament, with operational support around live events.',
        tags: ['3D calibration', 'Ray casting', 'OpenGL', 'Operator tools'],
        details: [
          {
            title: 'One selection, two ways to place it',
            body: 'Operators can select a point in the broadcast video or on a 2D field view. Ray intersections map those selections into the 3D course, where the putting rings follow the terrain rather than sitting on a flat plane.',
          },
          {
            title: 'Reusing geometry on a real course',
            body: 'Prepared the Masters field using CAD and .xtf source files. Reused my line library with OpenGL triangle strips and mesh intersections, and managed separate GUI and rendering threads. Supported the delivered application around live events.',
          },
        ],
      },
      {
        id: 'sketch-recognition',
        visual: 'sketch',
        title: 'From a freehand mark to a clean shape',
        summary: 'Finding edges, corners, and curves in a freehand stroke.',
        challenge:
          'Recognize an operator’s drawing and transition it into a useful broadcast shape.',
        approach:
          'Built stroke beautification for lines, polylines, complex curves, circles, ellipses, and rectangles. Edge splitting and curvature analysis identify the structure of a drawing; confidence scoring helps recognize its intended geometry. An animated transition then turns the freehand stroke into a clean broadcast graphic while preserving its shape.',
        outcome:
          'Used live for telestration during NBC broadcasts of Sunday Night Football.',
        tags: ['Shape recognition', 'Geometry', 'Animation', 'C++'],
        details: [
          {
            title: 'Recognizing intent in an imperfect stroke',
            body: 'Read and implemented mathematical approaches from white papers, splitting strokes into edges and examining changes in curvature. Corners distinguish connected line segments from smooth bends, allowing the recognition process to handle polylines and complex curves alongside circles, ellipses, squares, and rectangles. Candidate shapes receive confidence scores before the transition to cleaned-up geometry.',
          },
        ],
      },
      {
        id: 'broadcast-features',
        title: 'NFL Prime Vision: graphics that follow the play',
        summary:
          'Contributed on-field graphics to Amazon’s Thursday Night Football coverage.',
        contributionLabel: 'My contribution',
        media: [
          {
            src: '/media/smt/nfl-prime-vision.mp4',
            poster: '/media/smt/nfl-prime-vision.webp',
            title: 'NFL Prime Vision',
            description:
              'Player markers and field graphics in Amazon’s NFL Prime Vision coverage.',
          },
          {
            src: '/media/smt/pocket-health.mp4',
            poster: '/media/smt/pocket-health.webp',
            title: 'Pocket Health',
            description:
              'Pocket Health responds to the quarterback’s position and the developing play.',
          },
        ],
        challenge:
          'Translate client requests into camera-aware graphics while the broadcast schedule keeps moving.',
        approach:
          'Helped develop NFL Prime Vision through fourth-down field graphics, Pocket Health, KickerID, and QB Vision. The work combines client design feedback with live data, camera orientation, and world-space geometry.',
        outcome:
          'Fourth-down graphics and Pocket Health aired during Amazon Thursday Night Football. Modular rendering also made related features easier to add.',
        tags: ['OpenGL', 'Broadcast systems', 'Client delivery', 'Debugging'],
        details: [
          {
            title: 'Pocket Health: from concept to Thursday Night Football',
            body: 'Iterated on visual designs with the customer, translating feedback into an on-field graphic. The feature combines the line of scrimmage, quarterback orientation, and incoming data to control its orbs. It aired during Amazon Thursday Night Football.',
          },
          {
            title: 'NFL: graphics that follow the field',
            body: 'For Amazon Thursday Night Football, the fourth-down feature accounts for direction of play and sky-camera orientation. XML-configured textures and tessellation let the line follow the field’s crown and made related features such as KickerID easier to add. QB Vision converts two screen coordinates into a world-space cone through ray casting at quarterback height.',
          },
        ],
      },
      {
        id: 'nba-prime-vision',
        title: 'NBA Prime Vision: bringing data onto the court',
        summary:
          'Client art, camera-facing graphics, and the pipeline that keeps them connected.',
        contributionLabel: 'My contribution',
        media: [
          {
            src: '/media/smt/nba-prime-vision.mp4',
            poster: '/media/smt/nba-prime-vision.webp',
            title: 'NBA Prime Vision',
            description:
              'The Prime Vision basketball presentation, with player and court graphics.',
          },
        ],
        challenge:
          'Keep court graphics readable and correctly oriented as the camera and game state change.',
        approach:
          'Built the Prime Vision client art set, composite textures for camera-facing 3D nameplates, and on-court shot clocks driven by scoreboard data. Helped develop the broadcast presentation and configure the pipeline for animated features.',
        outcome:
          'The art set was used in Amazon Prime Vision basketball broadcasts. Related client-profile work also supported NBC NBA.',
        tags: [
          'OpenGL',
          '3D nameplates',
          'Scoreboard data',
          'Broadcast pipeline',
        ],
        details: [
          {
            title: 'Art that knows where the camera is',
            body: 'Turned textures into composites that could be positioned and oriented in 3D. Nameplates face the camera, while on-court graphics receive live scoreboard state. Also fixed whole-integer comparisons in the shot-clock logic.',
          },
          {
            title: 'Carrying camera identity through the picture',
            body: 'Configured animated-feature pipelines and used midstream encoding to carry camera identity and timecode in the least significant bits of video pixels when VANC metadata was unavailable.',
          },
        ],
      },
      {
        id: 'soccer-heatmaps',
        visual: 'soccer',
        title: 'Soccer: showing where the game happens',
        summary:
          'Assisted with player heatmap development for World Cup coverage.',
        contributionLabel: 'My contribution',
        challenge:
          'Make a player’s activity across the pitch readable at a glance in a broadcast presentation.',
        approach:
          'Assisted with the development of soccer heatmaps, helping supplement the broadcast with a spatial view of player activity.',
        outcome:
          'The supplied World Cup broadcast reference shows player heatmaps alongside the Korea–Czechia matchup in Telemundo’s coverage.',
        tags: ['Soccer', 'Heatmaps', 'World Cup', 'Broadcast visualization'],
        details: [
          {
            title: 'How to read the visualization',
            body: 'Cooler areas indicate less activity and warmer areas show a higher concentration of positions. The interactive pitch on this page is a portfolio demonstration computed from synthetic positions; it does not reproduce either player’s match data or the production heatmap implementation.',
          },
        ],
      },
      {
        id: 'nhl-spotlight',
        title: 'NHL: shot paths, player tags, and spotlights',
        summary:
          'Graphics that help viewers follow the puck and identify the players.',
        contributionLabel: 'My contribution',
        media: [
          {
            src: '/media/smt/nhl-shot-path.mp4',
            poster: '/media/smt/nhl-shot-path.webp',
            title: 'NHL shot paths & player tags',
            description:
              'Player identification and shot-path graphics in the supplied NHL broadcast excerpt.',
          },
        ],
        challenge:
          'Make fast-moving hockey action easier to follow with shot paths, player identification, and focused highlights.',
        approach:
          'Developed shot-path graphics and player tags for NHL coverage, alongside a spotlight feature that draws attention to the action. Also handled the distinction between graphics in preview and the main broadcast.',
        outcome:
          'Delivered player identification, shot visualization, and focused highlights for the broadcast, with support around live events.',
        tags: ['OpenGL', 'Trigonometry', 'Compositing', 'Live graphics'],
        details: [
          {
            title: 'A spotlight that preserves the picture',
            body: 'Used trigonometry to align the spotlight boundary with its cone and gradient texture. An OpenGL difference mask darkens the surrounding image while keeping the spotlight at full brightness.',
          },
        ],
      },
      {
        id: 'broadcast-reliability',
        title: 'Tracing a fault through the broadcast pipeline',
        summary: 'Frame buffers, metadata, and support while an event is live.',
        challenge:
          'Graphics depend on the right frame and metadata arriving together, even when buffers are asynchronous and an event leaves little time for a fix.',
        approach:
          'Investigated a multithreaded rendering bug that sometimes read a stale cache, debugged VANC decoding and packet loss, and worked on buffer synchronization and hysteresis in camera fingerprinting. Provided on-call troubleshooting and delivered last-minute client changes, including golf headshots the day before an event.',
        outcome:
          'Supported live-event operations across application code, video buffers, and broadcast metadata. Also modularized shared property sheets used by more than 60 applications so third-party library updates could be made centrally.',
        tags: ['Concurrency', 'Video buffers', 'VANC', 'Live support'],
        details: [
          {
            title: 'From the operator UI to the renderer',
            body: 'Wrote Google Protocol Buffer definitions for VCP commands in the VirtualFx framework. Operator controls send commands over TCP; my work receives those commands and renders the requested 2D/3D OpenGL graphics. The broader rendering pipeline had a video-delay requirement below seven frames, distinct from the tighter fingerprinting budget.',
          },
          {
            title: 'When metadata has to travel inside the picture',
            body: 'Used midstream encoding to carry camera identity and timecode in the least significant bits of video pixels when VANC metadata was unavailable. Also developed filters that manipulate video buffers and their associated metadata, and investigated VANC decoding and packet-loss issues.',
          },
          {
            title: 'Faults across frames and threads',
            body: 'Traced a rendering race to a stale cache being read in place of the live cache. Investigated B-frame and keyframe decoding dependencies, and addressed buffering and hysteresis in frame matching.',
          },
          {
            title: 'Supporting the team and the broadcast',
            body: 'Centralized third-party library configuration through property sheets shared by 60+ applications. Introduced Claude Code to the team with CLI demonstrations and use cases. On event support, implemented requested golf headshots the day before a broadcast.',
          },
        ],
      },
    ],
  },
  {
    id: 'quantum',
    name: 'Quantum',
    organization: 'Quantum America',
    category: 'Freelance',
    role: 'Freelance Software Engineer',
    dates: 'March 2026 — Present',
    location: 'Remote · Austin, Texas',
    accent: '#dea28a',
    heading: 'Ideas made interactive.',
    intro:
      'I architected and built an interactive 3D web application from scratch with TypeScript and React, owning client requirements, application design, and implementation. My freelance work also includes graphics tooling, automation, and Linux-based display integration.',
    skills: ['TypeScript', 'React', 'Three.js', 'Python', 'Blender', 'Linux'],
    highlights: [],
    projects: [
      {
        id: 'interactive-experiences',
        quantumVisual: 'journey',
        title: 'Spaces you can explore',
        summary: 'Browser-based 3D rendering, maps, and navigation.',
        challenge: 'Make complex spaces easier to understand.',
        approach:
          'Built a TypeScript and React application with Three.js and React Three Fiber for interactive 3D scenes. Implemented camera controls, object selection, and navigation between views, keeping application state consistent as users explore.',
        outcome:
          'Integrated 3D geometry with MapLibre maps, handling coordinate conversion, model scale, and orientation. Connected visual interactions to interface panels and navigable application routes.',
        tags: ['TypeScript / React', 'Three.js', 'MapLibre'],
      },
      {
        id: 'custom-tools',
        quantumVisual: 'pipeline',
        title: 'Tools that make work easier',
        summary: '3D asset preparation and interactive data tools.',
        challenge: 'Make everyday workflows more approachable.',
        approach:
          'Automated Blender processing with Python and Node.js to prepare 3D models and preview images for the web. Added asset validation and compression to make exports more consistent and reduce repetitive preparation work.',
        outcome:
          'Built custom SVG charts with pointer and keyboard interaction, and integrated streaming AI responses with validated application actions. These tools combine data processing with interfaces people can inspect and control.',
        tags: ['Python / Node.js', 'Blender', 'SVG', 'API integration'],
      },
      {
        id: 'performance-quality',
        quantumVisual: 'performance',
        title: 'Care in the details',
        summary: 'Rendering performance and automated testing.',
        challenge: 'Keep interactive software responsive and dependable.',
        approach:
          'Used code splitting and lazy loading to defer expensive views, moved CPU-heavy scene preparation into Web Workers, and reduced repeated rendering work through instancing and shared graphics resources.',
        outcome:
          'Added Vitest and React Testing Library coverage for navigation, loading states, resource cleanup, and interactive data. Tested return paths and asynchronous behavior so changes to one view would not break another.',
        tags: ['Web Workers', 'WebGL', 'Vitest', 'React Testing Library'],
      },
      {
        id: 'e-ink',
        quantumVisual: 'display',
        title: 'Software beyond the screen',
        summary: 'Python and JavaScript control for Linux display hardware.',
        challenge: 'Make physical display hardware easier to use.',
        approach:
          'Built a browser interface with Python and JavaScript to manage images and playback on a Linux-based e-ink display. Implemented image conversion, orientation handling, and upload validation to prepare content for the hardware.',
        outcome:
          'Integrated device communication and scheduled playback, allowing saved sequences to run independently of the browser. The work combined web development, image processing, and Linux integration.',
        tags: ['Python', 'JavaScript', 'Linux', 'Image processing'],
      },
    ],
  },
  {
    id: 'edag',
    name: 'EDAG',
    organization: 'EDAG Group',
    category: 'Internships & co-ops',
    role: 'Internships & co-op',
    dates: '2022 · 2024–2025',
    location: 'Troy, Michigan · Ingolstadt, Germany',
    accent: '#86c8a2',
    heading: 'Software with a connection to the physical world.',
    intro:
      'Three experiences at EDAG, from battery analysis and delivery-vehicle wiring to a co-op in Germany and full-stack vehicle applications in Troy. Each term brought a different mix of software, hardware, and engineering collaboration.',
    skills: ['C++', 'Qt / QML', 'CAN bus', 'CMake', 'Embedded Linux', 'Python'],
    highlights: [
      { value: '3 experiences', label: 'Two internships and a Germany co-op' },
      {
        value: 'Software + hardware',
        label: 'From vehicle data to CAN integration',
      },
      {
        value: 'US + Germany',
        label: 'Collaboration across engineering teams',
      },
    ],
    experiences: [
      {
        id: 'troy-2024-2025',
        title: 'EDAG Troy internship',
        dates: '2024–2025',
        location: 'Troy, Michigan',
        summary:
          'Full-stack predictive maintenance for delivery fleets and hands-on integration of a startup’s software into a Q8 e-tron.',
        highlights: [
          'Built a full-stack application using MongoDB to process delivery-vehicle data for route optimization and maintenance scheduling.',
          'Integrated startup software with a Q8 e-tron instrument cluster through CAN wiring, firmware flashing, and in-vehicle testing.',
        ],
        projectIds: ['vehicle-platforms', 'q8-etron'],
      },
      {
        id: 'germany-2024',
        title: 'EDAG Germany co-op',
        dates: 'May–December 2024',
        location: 'Ingolstadt, Germany',
        summary:
          'Vehicle interfaces, CAN tools, embedded Linux, and research into how engineering teams could use generative AI.',
        highlights: [
          'Built a Qt/C++ and QML dashboard for live and replayed CAN data, plus automated S19 firmware flashing for CAN I/O modules.',
          'Configured Raspberry Pi services and embedded Linux applications; supported engineering automation, cybersecurity framework maintenance, and generative AI research.',
        ],
        projectIds: [
          'can-dashboard',
          'firmware-updates',
          'embedded-linux',
          'generative-ai-research',
          'engineering-tools',
          'cybersecurity-framework',
        ],
      },
      {
        id: 'internship-2022',
        title: 'EDAG internship',
        dates: 'May–August 2022',
        location: '',
        summary:
          'Battery charge and discharge studies, C++ analysis tools, and research-based wiring specifications for delivery vehicles.',
        highlights: [
          'Ran battery charge/discharge case studies and wrote C++ tools to sift through CSV data for vehicle battery warning signs.',
          'Researched and created wiring specifications for delivery vehicles.',
        ],
        projectIds: ['battery-analysis', 'vehicle-wiring'],
      },
    ],
    projects: [
      {
        id: 'can-dashboard',
        title: 'A dashboard for the signals inside a car',
        summary: 'Live CAN decoding and recorded-data replay.',
        challenge:
          'Give engineers a configurable way to inspect vehicle signals in a familiar dashboard.',
        approach:
          'Built a C++/Qt backend and QML interface, with JavaScript and Figma supporting the UI work. Parsed and wrote CAN databases, configured DBC files, CAN devices, and networks, and connected live vehicle signals or simulated input from tools such as BUSMASTER. Supported CAN readers such as Vector devices and replay of recorded drives.',
        outcome:
          'Enabled validation through displays for speed, RPM, gear, blinkers, mileage, and other vehicle state.',
        tags: ['C++', 'Qt', 'QML', 'CAN / DBC'],
      },
      {
        id: 'firmware-updates',
        title: 'Firmware updates a mechanic can use',
        summary:
          'A faster and simpler update workflow for a commercial RV manufacturer.',
        challenge:
          'Make module updates straightforward for people unfamiliar with the underlying flashing process.',
        approach:
          'Created a Qt application that matched CAN I/O modules to available S19 firmware files and automated flashing for compressor control boards. Prepared S19 files and startup batch scripts so the application could launch at PC boot and update modules when new files were available, with an interface designed for mechanics unfamiliar with the process.',
        outcome: 'Reduced firmware update time from 60 seconds to 5 seconds.',
        tags: ['Qt', 'C++', 'Firmware', 'CMake'],
      },
      {
        id: 'vehicle-platforms',
        title: 'Predictive maintenance for a delivery fleet',
        summary:
          'A full-stack application connecting vehicle data, route planning, and maintenance.',
        challenge:
          'Address delivery vehicles losing battery charge or failing while out on their routes by making vehicle condition and driving patterns available for planning.',
        approach:
          'Built a full-stack predictive-maintenance application that pooled large volumes of delivery-vehicle data into MongoDB. Queried and processed the data to support route optimization and maintenance scheduling based on driving habits and battery charging and discharging conditions.',
        outcome:
          'Connected battery-condition analysis with route and maintenance decisions, with the goal of reducing avoidable interruptions during deliveries.',
        tags: [
          'Full-stack development',
          'MongoDB',
          'Vehicle data',
          'Predictive maintenance',
        ],
      },
      {
        id: 'q8-etron',
        title: 'Integrating software into a Q8 e-tron',
        summary:
          'Instrument-cluster integration with EDAG Germany and a startup.',
        challenge:
          'Bring a startup’s software into a physical vehicle and identify integration issues through in-car testing.',
        approach:
          'Worked with EDAG Germany to update the Q8 e-tron instrument cluster to display the integrated software. Soldered connections into the vehicle’s CAN bus according to specifications and flashed firmware onto an MCP control unit.',
        outcome:
          'Supported the hardware and software integration, then helped debug the system and gather bugs and issues during testing in the Q8.',
        tags: ['CAN bus', 'Instrument cluster', 'Firmware', 'Vehicle testing'],
      },
      {
        id: 'embedded-linux',
        title: 'Preparing a system to run on its own',
        summary:
          'Raspberry Pi services, Qt applications, and practical Linux configuration.',
        challenge:
          'Make embedded applications and services start reliably with the device and communicate over the intended network.',
        approach:
          'Configured local web servers, GET/POST handling, startup scripts, network settings, and Qt application deployment. Assisted with GPS integration for V2X and worked with Buildroot, Docker, and CMake workflows.',
        outcome:
          'Connected device startup, application launch, network access, and location data into usable embedded setups.',
        tags: ['Linux', 'Raspberry Pi', 'Qt', 'Networking'],
        details: [
          {
            title: 'Services and application startup',
            body: 'Configured a Raspberry Pi web server to handle GET and POST requests and start automatically at boot, with access over Wi-Fi or Ethernet. For a V2X project, helped integrate GPS coordinates into a Qt application and configured its startup and local IP network.',
          },
          {
            title: 'Preparing the embedded environment',
            body: 'Worked on Dockerfile setup, Buildroot configuration, package selection, and CMake builds for Raspberry Pi deployment. The interface work used Qt Widgets, QML, and C++ on embedded Linux.',
          },
        ],
      },
      {
        id: 'generative-ai-research',
        title: 'Finding useful places for generative AI',
        summary:
          'Department interviews, technical research, and prompt-engineering education.',
        challenge:
          'Identify practical AI use cases across electrical and electronics teams, then give stakeholders enough technical and market context to evaluate them.',
        approach:
          'Interviewed teams spanning embedded software, hardware, mobility IT, high-performance computing, and development tools. Led the prompt-engineering and market-analysis portions of the initiative, researched commercial and locally hosted models with the software team, and worked on prompt-engineering course material.',
        outcome:
          'Identified candidate use cases and test-automation opportunities, presented tools and integration options, and supported discussions with department leaders about project funding. The work focused on research, education, and proposed applications.',
        tags: [
          'Technical research',
          'Stakeholder interviews',
          'AI tooling',
          'Knowledge sharing',
        ],
        details: [
          {
            title: 'Research across the E/E organization',
            body: 'Interviewed mobility IT, embedded software, software development, high-performance computing, adaptive tools, advanced development, concept development, and hardware teams. Coordinated project work with Nick Westphal and compared licensed commercial models with locally hosted open-source models.',
          },
          {
            title: 'Education and practical adoption',
            body: 'Helped develop prompt-engineering education, attended a prompt-engineering conference, and exchanged adoption experiences with project managers from Bosch, Sennheiser, and Mercedes. Created a test-case automation pipeline, identified further automation opportunities, and supported stakeholder discussions about funding and implementation.',
          },
        ],
      },
      {
        id: 'engineering-tools',
        title: 'Tools for the everyday engineering work',
        summary:
          'Signal testing, data investigation, and spreadsheet automation.',
        challenge:
          'Support engineering teams with practical ways to inspect data, test hardware placement, and reduce repetitive administrative input.',
        approach:
          'Wrote Raspberry Pi and Python scripts for Bluetooth connection testing inside a vehicle, investigated and cleaned problematic database records during Azure application testing, and used VBA to automate inputs in an Excel-based SAP time-management workflow.',
        outcome:
          'Delivered targeted scripts and workflow tools alongside the larger vehicle projects, covering signal collection, data cleanup, and repeatable spreadsheet tasks.',
        tags: ['Python', 'Raspberry Pi', 'Data investigation', 'VBA'],
        details: [
          {
            title: 'Analysis and team workflow',
            body: 'Used Jupyter notebooks and pandas for data work, Bitbucket/Git for source collaboration, and VBA for Excel data management. Bluetooth testing investigated where in the vehicle to collect the strongest signal; Azure application testing included finding and cleaning problematic records.',
          },
        ],
      },
      {
        id: 'cybersecurity-framework',
        title: 'Supporting cybersecurity framework adoption',
        summary:
          'Framework maintenance and identifying applicable project code.',
        challenge:
          'Help teams determine where an existing cybersecurity framework could support client-project requirements.',
        approach:
          'Maintained the framework and reviewed project source code to identify where it could be applied, supporting work toward relevant ISO requirements.',
        outcome:
          'Contributed framework maintenance and applicability research for client projects.',
        tags: ['Cybersecurity', 'Code review', 'Framework maintenance'],
      },
      {
        id: 'battery-analysis',
        title: 'Finding battery warning signs in vehicle data',
        summary:
          'Charge/discharge case studies and C++ tools for CSV analysis.',
        challenge:
          'Investigate battery behavior in delivery vehicles and identify warning signs in recorded data.',
        approach:
          'Ran case studies on battery charging and discharging, and wrote C++ programs to sift through CSV files for indicators of battery issues.',
        outcome:
          'Created analysis tools to support the battery case studies and surface warning signs for further engineering investigation.',
        tags: ['C++', 'CSV analysis', 'Battery systems', 'Case studies'],
      },
      {
        id: 'vehicle-wiring',
        title: 'Researching delivery-vehicle wiring',
        summary: 'Wiring specifications grounded in vehicle research.',
        challenge:
          'Translate research into specifications for delivery-vehicle electrical wiring.',
        approach:
          'Researched delivery-vehicle wiring needs and created wiring specifications based on the findings.',
        outcome:
          'Produced specifications to support the vehicle engineering work.',
        tags: ['Electrical systems', 'Technical research', 'Specifications'],
      },
    ],
  },
  {
    id: 'michigan',
    name: 'University of Michigan',
    organization: 'University of Michigan',
    category: 'University',
    role: 'B.S. in Computer Science',
    dates: 'Degree awarded December 2024',
    location: 'Ann Arbor, Michigan',
    accent: '#ffd36c',
    heading: 'The foundation beneath the work.',
    intro:
      'I graduated from the University of Michigan with a Bachelor of Science in Computer Science in December 2024. My time at university overlapped with internships and co-op work at EDAG, connecting a computer science education with practical engineering.',
    skills: ['Computer science', 'Software engineering', 'Problem solving'],
    highlights: [
      { value: 'B.S.', label: 'Computer Science' },
      { value: 'December 2024', label: 'Degree awarded' },
      { value: 'Ann Arbor', label: 'University of Michigan' },
    ],
    projects: [],
  },
  {
    id: 'rust',
    name: 'Open source',
    organization: 'Rust standard library & compiler tests',
    category: 'Contributions',
    role: 'Contributor',
    dates: 'November 2024 — March 2025',
    location: 'rust-lang/rust',
    accent: '#8bb6ff',
    heading: 'Small changes in a shared codebase.',
    intro:
      'My Rust contributions focused on C-compatible primitive types and compiler test infrastructure. One refactor was merged; a related cross-target test proposal was closed without merging. The original discussions document both.',
    skills: ['Rust', 'C FFI', 'Clang', 'Compiler tests'],
    highlights: [
      { value: '#136334', label: 'Merged refactor' },
      { value: '#133944', label: 'Unmerged test proposal' },
    ],
    projects: [
      {
        id: 'ffi-primitives',
        title: 'Extracting the C-compatible primitives',
        summary: 'Merged · rust-lang/rust #136334',
        challenge:
          'Separate the primitive definitions used by Rust’s C FFI types into a dedicated internal module.',
        approach:
          'Contributed the modularization of the core::ffi primitives, creating a cleaner boundary around the type definitions.',
        outcome: 'The pull request was merged into the Rust repository.',
        tags: ['Rust', 'FFI', 'Refactoring'],
        link: {
          label: 'Read the merged pull request',
          href: 'https://github.com/rust-lang/rust/pull/136334',
        },
      },
      {
        id: 'cross-target-tests',
        title: 'Checking Rust’s C types against Clang',
        summary: 'Closed, unmerged · rust-lang/rust #133944',
        challenge:
          'Explore checking the sizes and signedness of Rust’s C-compatible types against Clang across targets.',
        approach:
          'Prototyped a run-make test for core::ffi::c_* types and participated in the upstream review discussion.',
        outcome:
          'The proposal was closed without merging. It remains an example of test exploration, not shipped Rust functionality.',
        tags: ['Rust', 'Clang', 'Cross-target tests'],
        link: {
          label: 'Read the proposal and discussion',
          href: 'https://github.com/rust-lang/rust/pull/133944',
        },
      },
    ],
  },
];
export const deskOrder = [
  'smt',
  'edag',
  'quantum',
  'michigan',
  'notes',
  'rust',
];
export const skills = [
  {
    name: 'Languages',
    items: [
      'C++',
      'C',
      'Rust',
      'Python',
      'TypeScript',
      'JavaScript',
      'SQL',
      'QML',
    ],
  },
  {
    name: 'Graphics & applications',
    items: ['OpenGL', 'CUDA', 'Qt', 'React', 'Three.js', 'MapLibre', 'Blender'],
  },
  {
    name: 'Systems & workflow',
    items: [
      'Multithreading',
      'Computational geometry',
      'CAN bus',
      'Embedded Linux',
      'CMake',
      'Git',
      'SVN',
      'Codex',
      'Claude Code',
    ],
  },
];
