import { createCareerGame } from './careerGame';
import { destinations, travelChapters } from '../data/careerWorld';

const root = document.querySelector<HTMLElement>('#career-world')!;
const el = <T extends Element = HTMLElement>(selector: string) =>
  root.querySelector<T>(selector)!;
const all = <T extends Element = HTMLElement>(selector: string) => [
  ...root.querySelectorAll<T>(selector),
];
const text = (selector: string, value: string) => {
  el(selector).textContent = value;
};
const dialog = el<HTMLDialogElement>('.career-dialog');
const media = matchMedia('(prefers-reduced-motion: reduce)');
const visited = new Set<string>();
let active = 0;
let userPaused = false;
let demoStep = 0;
const demoCopy = [
  [
    'A foundation in computer science.',
    'Michigan was home to my degree and the beginning of my engineering career.',
    'Celebrate graduation',
    'ANN ARBOR / CLASS OF 2024',
  ],
  [
    'Signals in. Information out.',
    'CAN data becomes a live vehicle dashboard. Another tool cut firmware flashing from 60 seconds to 5.',
    'Send a CAN signal',
    'VEHICLE LAB / LIVE DATA',
  ],
  [
    'Turn live data into a story.',
    'A small illustration of the trajectory graphics I built for an NBC Super Bowl broadcast.',
    'Replay the kick',
    'BROADCAST / ON AIR',
  ],
  [
    'Explore the home before the visit.',
    'Three.js showrooms, geographic maps, and property details, connected in one application.',
    'Switch the home view',
    'QUANTUM / HOME SHOWROOM',
  ],
];

function openDestination(id: string, stop?: number) {
  const index = destinations.findIndex((d) => d.id === id);
  if (index < 0) return;
  active = index;
  const d = destinations[index]!;
  game.locate(id);
  visited.add(id);
  demoStep = 0;
  root.dataset.current = id;
  dialog.dataset.destination = id;
  text(
    '[data-world-dialog-location]',
    `${d.short.toUpperCase()} / ${d.place.toUpperCase()}`,
  );
  text('[data-world-detail-label]', d.label);
  text(
    '#career-dialog-title',
    stop === 2 ? 'Back home. Ready for what’s next.' : d.headline,
  );
  text('[data-world-detail-role]', d.chapter.role);
  text(
    '[data-world-detail-intro]',
    id === 'quantum'
      ? d.projects[0]!.summary +
          ' I connect 3D homes and neighborhoods with geographic maps and property information.'
      : d.chapter.intro,
  );
  text('[data-world-scene-caption]', d.scene);
  text('[data-world-stat]', d.stat);
  text('[data-world-stat-label]', d.statLabel);
  text('[data-world-detail-note]', d.note);
  text(
    '[data-world-project-count]',
    `${String(d.projects.length).padStart(2, '0')} ${d.projects.length === 1 ? 'STORY' : 'PROJECTS'}`,
  );
  text('[data-world-visited]', `${visited.size} / 4 explored`);
  text(
    '[data-world-next]',
    `Explore ${destinations[(index + 1) % destinations.length]!.short} →`,
  );
  const art = el<HTMLElement>('[data-world-detail-art]');
  art.className = `detail-pixel-scene`;
  art.setAttribute(
    'aria-label',
    d.scene + ', illustrated in detailed pixel art',
  );
  el('[data-world-tags]').replaceChildren(
    ...d.chapter.tags.map((tag) => {
      const span = document.createElement('span');
      span.textContent = tag;
      return span;
    }),
  );
  el('[data-world-projects]').replaceChildren(
    ...d.projects.map((project, i) => {
      const article = document.createElement('article');
      const number = document.createElement('span');
      number.className = 'project-number';
      number.textContent = String(i + 1).padStart(2, '0');
      const copy = document.createElement('div');
      const heading = document.createElement('h3');
      heading.textContent = project.title;
      const summary = document.createElement('p');
      summary.className = 'project-summary';
      summary.textContent = project.summary;
      const detail = document.createElement('p');
      detail.textContent = project.details;
      copy.append(heading, summary, detail);
      article.append(number, copy);
      return article;
    }),
  );
  all<HTMLElement>('[data-world-stop]').forEach((button) => {
    const selected =
      stop === undefined
        ? Number(button.dataset.worldStop) ===
          travelChapters.findIndex((s) => s.destination === id)
        : Number(button.dataset.worldStop) === stop;
    if (selected) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  const copy = demoCopy[index]!;
  text('[data-work-demo-title]', copy[0]!);
  text('[data-work-demo-copy]', copy[1]!);
  text('[data-work-demo-action]', copy[2]! + ' ↻');
  text('[data-work-display-label]', copy[3]!);
  text('[data-home-mode]', 'HOME 01 / SPATIAL VIEW');
  el<HTMLElement>('.home-wireframe').style.transform = '';
  text('[data-demo-speed]', '64');
  text('[data-vehicle-status]', 'LIVE VEHICLE SIGNAL');
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('world-dialog-open');
  el('.career-dialog-scroll').scrollTop = 0;
  el<HTMLButtonElement>('[data-world-close]').focus({ preventScroll: true });
}

all<HTMLElement>('[data-world-stop]').forEach((button) =>
  button.addEventListener('click', () =>
    openDestination(
      button.dataset.stopDestination!,
      Number(button.dataset.worldStop),
    ),
  ),
);
el('[data-world-next]').addEventListener('click', () =>
  openDestination(destinations[(active + 1) % destinations.length]!.id),
);
el('[data-world-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener('close', () =>
  document.body.classList.remove('world-dialog-open'),
);

el('[data-work-demo-action]').addEventListener('click', () => {
  demoStep++;
  const display = el<HTMLElement>('[data-mini-display]');
  display.getAnimations({ subtree: true }).forEach((animation) => {
    animation.currentTime = 0;
  });
  if (active === 1) {
    text('[data-demo-speed]', String([64, 82, 47, 96][demoStep % 4]));
    text(
      '[data-vehicle-status]',
      `CAN FRAME ${String(demoStep).padStart(3, '0')} RECEIVED`,
    );
  }
  if (active === 3) {
    text(
      '[data-home-mode]',
      `HOME 0${(demoStep % 3) + 1} / ${demoStep % 2 ? 'ELEVATION VIEW' : 'SPATIAL VIEW'}`,
    );
    el<HTMLElement>('.home-wireframe').style.transform =
      `scaleX(${demoStep % 2 ? '-1' : '1'})`;
  }
  if (active === 0) {
    text('[data-work-demo-action]', 'Go Blue! ↻');
  }
});

function syncMotion() {
  const paused = userPaused || media.matches;
  root.classList.toggle('motion-paused', paused);
  const button = el<HTMLButtonElement>('[data-world-motion]');
  button.setAttribute('aria-pressed', String(paused));
  button.textContent = paused ? '▶ Resume motion' : 'Ⅱ Pause motion';
  button.disabled = media.matches;
}
el('[data-world-motion]').addEventListener('click', () => {
  userPaused = !userPaused;
  syncMotion();
});
media.addEventListener('change', syncMotion);
syncMotion();
const game = createCareerGame(root, openDestination);
document.title = 'Riccardo’s career world — Michigan, Germany & Durham';
document.querySelector<HTMLAnchorElement>('.explore-brand')!.href =
  '/explore/?variant=7';
