import {
  areas,
  explorations,
  type Exhibit,
} from '../data/explorationPrototype';
import {
  makeWorld,
  makeArea,
  makeInterior,
  drawGame,
  drawPreview,
  drawDemo,
  findPath,
  nodeAt,
  walkable,
  type GameMap,
  type Point,
  type MapNode,
} from './explorationArt';

// Review prototype state is intentionally in memory. No saved games or external services.
const root = document.documentElement;
let design = Number(root.dataset.exploration) || 6;
let area = 0,
  building = 0,
  selected = 0;
let map: GameMap = makeWorld(design);
let player: Point = { ...map.spawn };
let direction = 'down',
  route: Point[] = [],
  afterWalk: (() => void) | null = null;
let time = 0,
  lastFrame = 0,
  lastStep = 0,
  dirty = true;
let project: Exhibit | null = null,
  demoAction = 0,
  demoStart = 0;
let flight: { from: string; to: string; elapsed: number } | null = null;
let userPaused = false;
const media = matchMedia('(prefers-reduced-motion: reduce)');
let paused = media.matches;
const visited = new Set<string>(),
  visitedBuildings = new Set<string>();
const canvas = document.querySelector<HTMLCanvasElement>('#adventure-map')!;
const c = canvas.getContext('2d')!;
const preview = document
  .querySelector<HTMLCanvasElement>('#field-preview')!
  .getContext('2d')!;
const demo = document
  .querySelector<HTMLCanvasElement>('#project-demo')!
  .getContext('2d')!;
const help = document.querySelector<HTMLDialogElement>('.help-dialog')!;
const $ = <T extends HTMLElement = HTMLElement>(s: string) =>
  document.querySelector<T>(s)!;
const all = <T extends HTMLElement = HTMLElement>(s: string) => [
  ...document.querySelectorAll<T>(s),
];
const text = (s: string, v: string) =>
  all(s).forEach((el) => (el.textContent = v));
const names = ['Michigan', 'Germany', 'Michigan', 'Durham', 'Quantum'];
const flightRegions = ['Michigan', 'Germany', 'Michigan', 'Durham', 'Durham'];
function message(s: string) {
  text('[data-message]', s);
}
function hideProject() {
  project = null;
  $('.project-discovery').hidden = true;
}
function renderList() {
  const list = $('.destination-list');
  list.replaceChildren();
  const items =
    map.level === 'world'
      ? areas.map((a, i) => ({
          label: `${a.number} · ${names[i]} / ${i === 0 ? 'UofM' : i === 1 ? 'EDAG' : i === 2 ? 'Graduation' : i === 3 ? 'SMT' : 'Homes'}`,
          index: i,
        }))
      : map.nodes
          .filter((n) => n.index >= 0)
          .map((n) => ({
            label:
              map.level === 'interior'
                ? areas[area]!.buildings[building]!.exhibits[n.index]!.title
                : n.label,
            index: n.index,
          }));
  items.forEach((item) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.destination = String(item.index);
    button.textContent = item.label;
    button.setAttribute('aria-label', `Select ${item.label}`);
    const arrow = document.createElement('span');
    arrow.textContent = '↗';
    button.append(arrow);
    if (item.index === selected) button.setAttribute('aria-current', 'true');
    button.addEventListener('click', () => select(item.index));
    list.append(button);
  });
}
function sync() {
  root.dataset.level = map.level;
  root.dataset.exploration = String(design);
  canvas.dataset.level = map.level;
  canvas.dataset.area = areas[area]!.id;
  canvas.dataset.building = String(building);
  canvas.dataset.playerX = String(player.x);
  canvas.dataset.playerY = String(player.y);
  text('[data-design-number]', `${String(design).padStart(2, '0')} / 10`);
  text('[data-design-name]', explorations[design - 6]!.name);
  text('[data-design-type]', explorations[design - 6]!.type);
  text('[data-design-subtitle]', explorations[design - 6]!.subtitle);
  all('[data-design]').forEach((b) =>
    Number(b.dataset.design) === design
      ? b.setAttribute('aria-current', 'true')
      : b.removeAttribute('aria-current'),
  );
  all('button[data-area]').forEach((b) =>
    Number(b.dataset.area) === area
      ? b.setAttribute('aria-current', 'step')
      : b.removeAttribute('aria-current'),
  );
  all('[data-stamp]').forEach((s) =>
    s.classList.toggle('collected', visited.has(s.dataset.stamp!)),
  );
  all('button[data-area]').forEach((b) => {
    const done = visited.has(areas[Number(b.dataset.area)]!.id);
    const icon = b.querySelector('.stop-check')!;
    icon.textContent = done ? '✓' : '○';
    icon.setAttribute('aria-label', done ? 'Visited' : 'Unvisited');
  });
  text('[data-discovered]', String(visitedBuildings.size));
  text(
    '[data-place-count-label]',
    visitedBuildings.size === 1 ? 'place discovered' : 'places discovered',
  );
  const a = areas[area]!;
  text('[data-area-date]', a.date);
  text('[data-area-title]', a.name);
  text('[data-area-role]', a.role);
  text('[data-area-summary]', a.summary);
  const levelNames = {
    world: '01 / WORLD',
    area: '02 / TOWN',
    interior: '03 / INSIDE',
  };
  text('[data-depth-label]', levelNames[map.level]);
  text(
    '[data-map-mode]',
    map.level === 'world'
      ? 'OVERWORLD'
      : map.level === 'area'
        ? 'EXPLORE THE AREA'
        : 'INSIDE THE WORK',
  );
  text(
    '[data-location-kicker]',
    map.level === 'world'
      ? 'A CAREER TO EXPLORE'
      : map.level === 'area'
        ? a.region.toUpperCase()
        : 'YOU ENTERED',
  );
  text(
    '[data-location-title]',
    map.level === 'world'
      ? design === 8
        ? 'The career village'
        : design === 9
          ? 'The career archipelago'
          : 'Riccardo’s career region'
      : map.level === 'area'
        ? a.name
        : a.buildings[building]!.name,
  );
  text(
    '[data-location-note]',
    map.level === 'world'
      ? 'Select a destination. The stories are inside.'
      : map.level === 'area'
        ? 'Walk the paths. Choose a door. Come inside.'
        : 'Inspect a workstation to discover the project.',
  );
  text(
    '[data-breadcrumb]',
    map.level === 'world'
      ? 'WORLD / CAREER REGION'
      : map.level === 'area'
        ? `WORLD / ${names[area]!.toUpperCase()}`
        : `${names[area]!.toUpperCase()} / ${a.buildings[building]!.name.toUpperCase()}`,
  );
  $('[data-back]').hidden = map.level === 'world';
  const action =
    map.level === 'world'
      ? `Enter ${names[area]}`
      : map.level === 'area'
        ? `Enter ${a.buildings[selected]?.name.split(' · ').pop() ?? 'building'}`
        : 'Inspect workstation';
  text('[data-enter]', action + ' ↗');
  text(
    '[data-next-step]',
    map.level === 'world'
      ? `Enter ${names[area]} to walk through this chapter.`
      : map.level === 'area'
        ? 'Choose a building, then enter. You can also walk to its door and press E.'
        : 'Choose a workstation, then inspect it. The demos respond to your input.',
  );
  text(
    '[data-position]',
    `${a.region.toUpperCase()} · ${map.level === 'world' ? 'REGION' : map.level === 'area' ? 'TOWN' : 'ROOM'}`,
  );
  renderList();
  dirty = true;
}
function select(index: number) {
  if (flight) return;
  if (index < 0) {
    back();
    return;
  }
  selected = index;
  if (map.level === 'world') area = index;
  if (map.level === 'world')
    message(
      `${areas[area]!.number} / ${areas[area]!.region}. ${areas[area]!.summary}`,
    );
  else if (map.level === 'area')
    message(
      `${areas[area]!.buildings[index]!.name}. Come inside—there ${areas[area]!.buildings[index]!.exhibits.length === 1 ? 'is a project' : 'are projects'} to discover here.`,
    );
  else {
    const e = areas[area]!.buildings[building]!.exhibits[index]!;
    message(`${e.title}. ${e.summary}`);
  }
  sync();
}
function changeMap(next: GameMap) {
  map = next;
  player = { ...map.spawn };
  route = [];
  afterWalk = null;
  selected = 0;
  direction = 'up';
  hideProject();
  sync();
}
function enterArea() {
  changeMap(makeArea(design, area));
  message(
    `Welcome to ${areas[area]!.region}. I’m right here with you. Pick a building, walk around, and go through a door.`,
  );
}
function enterBuilding(index: number) {
  building = index;
  visited.add(areas[area]!.id);
  visitedBuildings.add(`${area}-${building}`);
  changeMap(makeInterior(design, area, building));
  message(
    `You’re inside ${areas[area]!.buildings[building]!.name}. Each workstation holds a real part of my work. Choose one to try it.`,
  );
}
function inspect(index: number) {
  selected = index;
  project = areas[area]!.buildings[building]!.exhibits[index]!;
  demoAction = 0;
  demoStart = time;
  text('[data-project-metric]', project.metric);
  text(
    '[data-project-place]',
    `${areas[area]!.region} / ${areas[area]!.buildings[building]!.name}`,
  );
  text('[data-project-title]', project.title);
  text('[data-project-description]', project.detail);
  text('[data-demo-action]', project.action + ' ↻');
  text('[data-demo-status]', 'Illustrative demo · click to try');
  $('.project-discovery').hidden = false;
  message(
    `Found it: ${project.title.replace(/[.!?]+$/, '')}. The project is open below—try its miniature demo, then keep exploring.`,
  );
  dirty = true;
  $('.project-discovery').scrollIntoView({
    behavior: paused ? 'instant' : 'smooth',
    block: 'nearest',
  });
}
function walkTo(n: MapNode, done: () => void) {
  const end = { x: n.x, y: Math.min(ROWS_LIMIT, n.y + 1) };
  const nextRoute = findPath(map, player, end);
  if (paused || !nextRoute.length) {
    done();
    return;
  }
  route = nextRoute;
  afterWalk = done;
  message('On my way. Walking to the door…');
  canvas.focus({ preventScroll: true });
}
const ROWS_LIMIT = 28;
function enter() {
  if (flight) return;
  if (map.level === 'world') {
    const from = flightRegions[map.area] ?? 'Michigan',
      to = flightRegions[area]!;
    if (!paused && from !== to) {
      flight = { from, to, elapsed: 0 };
      text('[data-flight-label]', `${from} → ${to}`);
      $('.travel-overlay').hidden = false;
      message(`Taking a plane from ${from} to ${to}.`);
      dirty = true;
    } else enterArea();
  } else if (map.level === 'area') {
    const n = map.nodes.find((n) => n.index === selected)!;
    const index = selected;
    walkTo(n, () => enterBuilding(index));
  } else {
    const n = map.nodes.find((n) => n.index === selected)!;
    const index = selected;
    walkTo(n, () => inspect(index));
  }
}
function back() {
  if (flight) {
    flight = null;
    $('.travel-overlay').hidden = true;
    return;
  }
  if (map.level === 'interior') {
    const targetBuilding = building;
    changeMap(makeArea(design, area));
    selected = targetBuilding;
    const n = map.nodes.find((n) => n.index === selected)!;
    player = { x: n.x, y: n.y + 1 };
    message('Back outside. There’s more to discover in this town.');
    sync();
  } else if (map.level === 'area') {
    changeMap(makeWorld(design));
    map.area = area;
    selected = area;
    const n = map.nodes.find((n) => n.index === area)!;
    player = { x: n.x, y: n.y + 2 };
    message('Back on the region map. Pick the next chapter when you’re ready.');
    sync();
  }
  canvas.focus({ preventScroll: true });
}
function move(dx: number, dy: number) {
  if (flight || help.open) return;
  const next = { x: player.x + dx, y: player.y + dy };
  route = [];
  afterWalk = null;
  direction = dx < 0 ? 'left' : dx > 0 ? 'right' : dy < 0 ? 'up' : 'down';
  if (walkable(map, next)) {
    player = next;
    canvas.dataset.playerX = String(player.x);
    canvas.dataset.playerY = String(player.y);
    dirty = true;
  } else {
    message(
      'That way is blocked. Follow the paths, or choose a building from the field guide.',
    );
  }
}
function interact() {
  if (flight) return;
  const nearest = map.nodes
    .filter((n) => Math.abs(n.x - player.x) + Math.abs(n.y - player.y) < 4)
    .sort(
      (a, b) =>
        Math.abs(a.x - player.x) +
        Math.abs(a.y - player.y) -
        (Math.abs(b.x - player.x) + Math.abs(b.y - player.y)),
    )[0];
  if (nearest) {
    if (nearest.index < 0) {
      back();
      return;
    }
    select(nearest.index);
  }
  enter();
}
function setDesign(next: number, push = true) {
  if (6 + ((next - 6 + 5) % 5) === 7) {
    const url = new URL(location.href);
    url.searchParams.set('variant', '7');
    location.assign(url);
    return;
  }
  design = 6 + ((next - 6 + 5) % 5);
  area = 0;
  building = 0;
  flight = null;
  $('.travel-overlay').hidden = true;
  changeMap(makeWorld(design));
  if (push) {
    const u = new URL(location.href);
    u.searchParams.set('variant', String(design));
    history.pushState({}, '', u);
  }
  document.title = `${explorations[design - 6]!.name} — Riccardo’s career world`;
  message(
    'Hey, I’m Riccardo. Pick a town, then come on in. The interesting stuff is inside.',
  );
  window.scrollTo({ top: 0, behavior: 'instant' });
}
all('[data-design]').forEach((b) =>
  b.addEventListener('click', () => setDesign(Number(b.dataset.design))),
);
$('[data-design-prev]').addEventListener('click', () => setDesign(design - 1));
$('[data-design-next]').addEventListener('click', () => setDesign(design + 1));
all('button[data-area]').forEach((b) =>
  b.addEventListener('click', () => {
    if (map.level !== 'world') {
      changeMap(makeWorld(design));
      map.area = area;
    }
    select(Number(b.dataset.area));
  }),
);
$('[data-enter]').addEventListener('click', enter);
$('[data-interact]').addEventListener('click', interact);
$('[data-back]').addEventListener('click', back);
all('[data-move]').forEach((b) =>
  b.addEventListener('click', () => {
    const d = b.dataset.move!;
    move(
      d === 'left' ? -1 : d === 'right' ? 1 : 0,
      d === 'up' ? -1 : d === 'down' ? 1 : 0,
    );
  }),
);
canvas.addEventListener('click', (event) => {
  if (flight) return;
  const box = canvas.getBoundingClientRect();
  const p = {
    x: Math.floor(((event.clientX - box.left) / box.width) * 48),
    y: Math.floor(((event.clientY - box.top) / box.height) * 30),
  };
  const n = nodeAt(map, p);
  if (n) {
    select(n.index);
    return;
  }
  route = findPath(map, player, p);
  afterWalk = null;
  if (!route.length)
    message('Try a path, or select a labeled building to enter it.');
  canvas.focus({ preventScroll: true });
  dirty = true;
});
window.addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement;
  if (
    help.open ||
    target.closest('input,textarea,select,[contenteditable="true"]') ||
    event.ctrlKey ||
    event.altKey ||
    event.metaKey
  )
    return;
  const k = event.key.toLowerCase();
  if (k === 'escape') {
    event.preventDefault();
    back();
    return;
  }
  // Arrow keys move the character. Design switching stays on the review bar so it never steals movement.
  const movement: Record<string, number[]> = {
    arrowup: [0, -1],
    w: [0, -1],
    arrowdown: [0, 1],
    s: [0, 1],
    arrowleft: [-1, 0],
    a: [-1, 0],
    arrowright: [1, 0],
    d: [1, 0],
  };
  if (movement[k]) {
    event.preventDefault();
    move(movement[k]![0]!, movement[k]![1]!);
    return;
  }
  if (k === 'e' || (k === 'enter' && target === canvas)) {
    event.preventDefault();
    interact();
  }
});
$('[data-demo-action]').addEventListener('click', () => {
  demoAction++;
  demoStart = paused ? time - 6 : time;
  text(
    '[data-demo-status]',
    project?.demo === 'geometry'
      ? `Join: ${['miter', 'bevel', 'round'][demoAction % 3]}`
      : project?.demo === 'house'
        ? `Viewing home 0${(demoAction % 3) + 1}`
        : project?.demo === 'map'
          ? `Layer: ${demoAction % 2 ? 'spatial view' : 'neighborhood view'}`
          : 'Demo running · illustrative project behavior',
  );
  dirty = true;
});
function motion() {
  paused = userPaused || media.matches;
  const b = $<HTMLButtonElement>('[data-motion]');
  b.textContent = paused ? '▶ Resume motion' : 'Ⅱ Pause motion';
  b.setAttribute('aria-pressed', String(paused));
  b.disabled = media.matches;
  if (paused && flight) {
    flight = null;
    $('.travel-overlay').hidden = true;
    enterArea();
  }
  dirty = true;
}
$('[data-motion]').addEventListener('click', () => {
  userPaused = !userPaused;
  motion();
});
media.addEventListener('change', motion);
$('[data-help]').addEventListener('click', () => help.showModal());
all('[data-close-help]').forEach((b) =>
  b.addEventListener('click', () => help.close()),
);
window.addEventListener('popstate', () => {
  const v = Number(new URLSearchParams(location.search).get('variant'));
  setDesign(v >= 6 && v <= 10 ? v : 6, false);
});
document.fonts.ready.then(() => (dirty = true));
document.addEventListener('visibilitychange', () => {
  lastFrame = 0;
  dirty = true;
});
function frame(now: number) {
  requestAnimationFrame(frame);
  if (document.hidden) return;
  if (now - lastFrame < 70 && !dirty) return;
  const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.2) : 0;
  lastFrame = now;
  if (!paused && !help.open) time += dt;
  if (flight) {
    flight.elapsed += dt;
    if (flight.elapsed > 1.7) {
      flight = null;
      $('.travel-overlay').hidden = true;
      enterArea();
    }
  }
  if (route.length && !help.open && now - lastStep > 95) {
    const next = route.shift()!;
    direction =
      next.x < player.x
        ? 'left'
        : next.x > player.x
          ? 'right'
          : next.y < player.y
            ? 'up'
            : 'down';
    player = next;
    lastStep = now;
    canvas.dataset.playerX = String(player.x);
    canvas.dataset.playerY = String(player.y);
    dirty = true;
    if (!route.length && afterWalk) {
      const done = afterWalk;
      afterWalk = null;
      done();
    }
  }
  if (paused && !dirty) return;
  drawGame(
    c,
    map,
    player,
    time,
    selected,
    route.length > 0,
    direction,
    visited,
  );
  drawPreview(preview, area, time);
  if (project) drawDemo(demo, project.demo, time, demoAction, time - demoStart);
  dirty = false;
}
setDesign(design, false);
motion();
requestAnimationFrame(frame);
