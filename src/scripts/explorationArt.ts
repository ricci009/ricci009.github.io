import { areas, type Exhibit, type Place } from '../data/explorationPrototype';
export const TILE = 16,
  COLS = 48,
  ROWS = 30;
export type Point = { x: number; y: number };
export type Level = 'world' | 'area' | 'interior';
export interface MapNode extends Point {
  label: string;
  kind: Place['kind'] | 'station' | 'exit';
  index: number;
  w: number;
  h: number;
}
export interface GameMap {
  tiles: string[][];
  nodes: MapNode[];
  spawn: Point;
  level: Level;
  area: number;
  design: number;
  building: number;
}
type C = CanvasRenderingContext2D;
const r = (c: C, x: number, y: number, w: number, h: number, color: string) => {
  c.fillStyle = color;
  c.fillRect(Math.round(x), Math.round(y), w, h);
};
const txt = (
  c: C,
  s: string,
  x: number,
  y: number,
  size = 10,
  color = '#294838',
) => {
  c.fillStyle = color;
  c.font = `${size}px "Pixelify Sans",monospace`;
  c.fillText(s, x, y);
};
const path = (c: C, points: number[][], color: string) => {
  c.fillStyle = color;
  c.beginPath();
  points.forEach((p, i) =>
    i ? c.lineTo(p[0]!, p[1]!) : c.moveTo(p[0]!, p[1]!),
  );
  c.closePath();
  c.fill();
};
function fill(
  m: GameMap,
  x: number,
  y: number,
  w: number,
  h: number,
  type: string,
) {
  for (let j = y; j < y + h; j++)
    for (let i = x; i < x + w; i++)
      if (m.tiles[j]?.[i] !== undefined) m.tiles[j]![i] = type;
}
function ellipse(
  m: GameMap,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  type: string,
) {
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++)
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1)
        m.tiles[y]![x] = type;
}
function road(m: GameMap, from: Point, to: Point, width = 2) {
  let x = from.x,
    y = from.y;
  const set = () =>
    fill(m, x, y, width, width, m.tiles[y]?.[x] === 'w' ? 'b' : 'p');
  while (x !== to.x) {
    set();
    x += Math.sign(to.x - x);
  }
  while (y !== to.y) {
    set();
    y += Math.sign(to.y - y);
  }
  set();
}
function add(m: GameMap, node: MapNode) {
  m.nodes.push(node);
  fill(m, node.x - 1, node.y, 3, 3, 'p');
  for (let y = node.y - node.h; y < node.y; y++)
    for (
      let x = node.x - Math.floor(node.w / 2);
      x < node.x + Math.ceil(node.w / 2);
      x++
    )
      if (m.tiles[y]?.[x] !== undefined) m.tiles[y]![x] = 'o';
}
export function makeWorld(design: number): GameMap {
  const m: GameMap = {
    tiles: Array.from({ length: ROWS }, () =>
      Array(COLS).fill(design === 9 ? 'w' : 'g'),
    ),
    nodes: [],
    spawn: { x: 8, y: 21 },
    level: 'world',
    area: 0,
    design,
    building: 0,
  };
  let pts: number[][] = [];
  if (design === 6) {
    for (let y = 0; y < ROWS; y++) {
      const x = 21 + Math.floor(Math.sin(y * 0.25) * 2);
      fill(m, x, y, 4, 1, 'w');
    }
    ellipse(m, 46, 28, 8, 6, 'w');
    ellipse(m, 2, 0, 10, 5, 'w');
    pts = [
      [8, 20],
      [33, 9],
      [13, 10],
      [37, 20],
      [26, 25],
    ];
    road(m, { x: 8, y: 20 }, { x: 13, y: 12 });
    road(m, { x: 13, y: 12 }, { x: 33, y: 11 });
    road(m, { x: 33, y: 11 }, { x: 37, y: 22 });
    road(m, { x: 37, y: 22 }, { x: 26, y: 26 });
  } else if (design === 7) {
    fill(m, 18, 0, 3, 30, 'w');
    fill(m, 36, 0, 3, 30, 'w');
    pts = [
      [5, 21],
      [14, 12],
      [25, 20],
      [32, 11],
      [43, 21],
    ];
    for (let i = 0; i < 4; i++)
      road(
        m,
        { x: pts[i]![0]!, y: pts[i]![1]! + 1 },
        { x: pts[i + 1]![0]!, y: pts[i + 1]![1]! + 1 },
        2,
      );
  } else if (design === 8) {
    fill(m, 1, 1, 46, 28, 'g');
    fill(m, 0, 0, 48, 3, 't');
    fill(m, 0, 27, 48, 3, 't');
    road(m, { x: 7, y: 15 }, { x: 43, y: 15 }, 3);
    road(m, { x: 22, y: 5 }, { x: 22, y: 27 }, 3);
    road(m, { x: 8, y: 9 }, { x: 8, y: 25 });
    road(m, { x: 34, y: 7 }, { x: 34, y: 25 });
    ellipse(m, 42, 5, 5, 3, 'w');
    pts = [
      [9, 10],
      [32, 10],
      [9, 24],
      [30, 24],
      [41, 20],
    ];
  } else if (design === 9) {
    pts = [
      [8, 12],
      [35, 10],
      [9, 25],
      [28, 24],
      [41, 22],
    ];
    pts.forEach((p, i) => {
      ellipse(m, p[0]!, p[1]! - 2, i === 1 ? 9 : 7, i === 1 ? 7 : 5, 's');
      ellipse(m, p[0]!, p[1]! - 2, i === 1 ? 8 : 6, i === 1 ? 6 : 4, 'g');
      road(m, { x: p[0]! - 3, y: p[1]! + 1 }, { x: p[0]! + 3, y: p[1]! + 1 });
    });
  } else {
    pts = [
      [8, 12],
      [25, 8],
      [39, 13],
      [33, 25],
      [13, 25],
    ];
    for (let y = 14; y < 18; y++) fill(m, 0, y, 48, 1, 'w');
    road(m, { x: 8, y: 13 }, { x: 25, y: 10 });
    road(m, { x: 25, y: 10 }, { x: 39, y: 14 });
    road(m, { x: 39, y: 14 }, { x: 33, y: 27 });
    road(m, { x: 33, y: 27 }, { x: 13, y: 27 });
    road(m, { x: 13, y: 27 }, { x: 8, y: 13 });
  }
  pts.forEach((p, i) => {
    const kind = areas[i]!.buildings[0]!.kind;
    fill(m, p[0]! - 4, p[1]! - 6, 9, 9, 'g');
    road(m, { x: p[0]!, y: p[1]! }, { x: p[0]!, y: p[1]! + 2 });
    add(m, {
      x: p[0]!,
      y: p[1]!,
      w: 6,
      h: 4,
      index: i,
      kind,
      label: [
        '01 · UofM / MICHIGAN',
        '02 · EDAG / GERMANY',
        '03 · BACK TO MICHIGAN',
        '04 · SMT / DURHAM',
        '05 · QUANTUM / DURHAM',
      ][i]!,
    });
  });
  // Dense, deliberately arranged forests, leaving every entry clear.
  for (let y = 1; y < ROWS - 1; y++)
    for (let x = 1; x < COLS - 1; x++) {
      if (m.tiles[y]![x] !== 'g') continue;
      const near = m.nodes.some(
        (n) => Math.abs(n.x - x) < 5 && Math.abs(n.y - y) < 7,
      );
      const bordering = x < 3 || x > 44 || y < 3 || y > 27;
      const cluster =
        Math.sin(x * 0.43) + Math.cos(y * 0.57) > 0.9 && (x + y) % 2 === 0;
      if (!near && (bordering || cluster)) m.tiles[y]![x] = 't';
    }
  m.spawn = { x: pts[0]![0]!, y: Math.min(28, pts[0]![1]! + 2) };
  return m;
}
export function makeArea(design: number, area: number): GameMap {
  const m: GameMap = {
    tiles: Array.from({ length: ROWS }, () => Array(COLS).fill('g')),
    nodes: [],
    spawn: { x: 23, y: 26 },
    level: 'area',
    area,
    design,
    building: 0,
  };
  fill(m, 0, 0, 48, 3, 't');
  fill(m, 0, 0, 3, 30, 't');
  fill(m, 45, 0, 3, 30, 't');
  fill(m, 0, 28, 48, 2, 't');
  for (let y = 3; y < 28; y++)
    fill(m, 5 + Math.floor(Math.sin(y * 0.4)), y, 3, 1, 'w');
  road(m, { x: 10, y: 17 }, { x: 42, y: 17 }, 3);
  road(m, { x: 23, y: 9 }, { x: 23, y: 27 }, 3);
  road(m, { x: 13, y: 26 }, { x: 40, y: 26 });
  const pts = [
    [15, 14],
    [35, 14],
    [35, 25],
  ];
  areas[area]!.buildings.forEach((b, i) => {
    const p = pts[i]!;
    road(m, { x: p[0]!, y: p[1]! }, { x: p[0]!, y: i < 2 ? 18 : 26 });
    add(m, {
      x: p[0]!,
      y: p[1]!,
      w: 8,
      h: 5,
      index: i,
      kind: b.kind,
      label: b.name,
    });
  });
  // Rows of street trees, flower beds and a clear courtyard.
  for (const y of [5, 22, 27])
    for (const x of [10, 12, 18, 20, 28, 30, 40, 42])
      if (m.tiles[y]?.[x] === 'g') m.tiles[y]![x] = 't';
  for (let y = 6; y < 12; y++) for (let x = 3; x < 5; x++) m.tiles[y]![x] = 'f';
  for (let x = 27; x < 42; x++)
    if (m.tiles[21]![x] === 'g') m.tiles[21]![x] = 'f';
  fill(m, 20, 20, 7, 4, 'p');
  add(m, {
    x: 23,
    y: 28,
    w: 4,
    h: 0,
    index: -1,
    kind: 'exit',
    label: 'REGION MAP',
  });
  m.tiles[28]![23] = 'p';
  m.tiles[27]![23] = 'p';
  return m;
}
export function makeInterior(
  design: number,
  area: number,
  building: number,
): GameMap {
  const m: GameMap = {
    tiles: Array.from({ length: ROWS }, () => Array(COLS).fill('v')),
    nodes: [],
    spawn: { x: 24, y: 25 },
    level: 'interior',
    area,
    design,
    building,
  };
  fill(m, 5, 4, 38, 24, 'floor');
  fill(m, 5, 4, 38, 3, 'wall');
  fill(m, 5, 4, 1, 24, 'wall');
  fill(m, 42, 4, 1, 24, 'wall');
  fill(m, 5, 27, 38, 1, 'wall');
  fill(m, 23, 26, 3, 2, 'p');
  fill(m, 21, 20, 7, 6, 'rug');
  const exhibits = areas[area]!.buildings[building]!.exhibits;
  const xs =
    exhibits.length === 1
      ? [24]
      : exhibits.length === 2
        ? [15, 33]
        : [12, 24, 36];
  exhibits.forEach((e, i) =>
    add(m, {
      x: xs[i]!,
      y: 15,
      w: 7,
      h: 5,
      kind: 'station',
      index: i,
      label: e.metric,
    }),
  );
  for (const x of [8, 39]) for (const y of [9, 21]) m.tiles[y]![x] = 'pot';
  add(m, {
    x: 24,
    y: 27,
    w: 4,
    h: 0,
    kind: 'exit',
    index: -1,
    label: 'EXIT TO TOWN',
  });
  return m;
}
export const walkable = (m: GameMap, p: Point) =>
  ['g', 's', 'p', 'b', 'f', 'floor', 'rug'].includes(m.tiles[p.y]?.[p.x] ?? '');
export function findPath(m: GameMap, start: Point, end: Point): Point[] {
  if (!walkable(m, end)) return [];
  const key = (p: Point) => p.x + ',' + p.y;
  const visited = new Map<string, Point | null>([[key(start), null]]),
    queue = [start];
  let i = 0;
  while (i < queue.length) {
    const p = queue[i++]!;
    if (p.x === end.x && p.y === end.y) {
      const result: Point[] = [];
      let current: Point | null = p;
      while (current && key(current) !== key(start)) {
        result.unshift(current);
        current = visited.get(key(current)) ?? null;
      }
      return result;
    }
    for (const [dx, dy] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]) {
      const next = { x: p.x + dx!, y: p.y + dy! };
      if (walkable(m, next) && !visited.has(key(next))) {
        visited.set(key(next), p);
        queue.push(next);
      }
    }
  }
  return [];
}
export function nodeAt(m: GameMap, p: Point) {
  return m.nodes.find(
    (n) =>
      p.x >= n.x - n.w / 2 &&
      p.x <= n.x + n.w / 2 &&
      p.y >= n.y - n.h - 1 &&
      p.y <= n.y + 1,
  );
}
function tree(c: C, x: number, y: number, autumn = false) {
  r(c, x + 3, y + 13, 17, 6, '#487647');
  r(c, x + 8, y + 12, 5, 9, '#786047');
  r(c, x + 3, y - 6, 15, 21, autumn ? '#816b42' : '#315e42');
  r(c, x - 1, y - 1, 23, 13, autumn ? '#ad8548' : '#40794c');
  r(c, x + 4, y - 10, 12, 25, autumn ? '#ba9352' : '#4c8b4e');
  r(c, x + 3, y - 4, 10, 6, autumn ? '#dec070' : '#7eb35f');
  r(c, x + 1, y + 4, 7, 5, autumn ? '#d3ad5b' : '#78ab56');
  r(c, x + 11, y + 9, 8, 4, autumn ? '#8b753e' : '#326446');
  r(c, x + 8, y - 9, 5, 3, autumn ? '#dec070' : '#9ac776');
}
export function sprite(
  c: C,
  x: number,
  y: number,
  t: number,
  moving = false,
  dir = 'down',
  color = '#bd5d45',
) {
  const step = moving ? Math.floor(t * 9) % 2 : 0;
  x = Math.round(x);
  y = Math.round(y);
  r(c, x - 6, y + 3, 14, 4, '#355a453f');
  r(c, x - 4, y - 4, 4, 9 - step, '#3b5055');
  r(c, x + 2, y - 4, 4, 8 + step, '#3b5055');
  r(c, x - 5, y + 3 - step, 5, 3, '#2c4143');
  r(c, x + 2, y + 3 + step, 5, 3, '#2c4143');
  r(c, x - 6, y - 12, 13, 10, color);
  r(c, x - 8, y - 10 + step, 3, 8, '#e1b282');
  r(c, x + 7, y - 10 - step, 3, 8, '#e1b282');
  r(c, x - 5, y - 22, 11, 11, '#f0c896');
  r(c, x - 6, y - 24, 13, 5, '#474b3c');
  r(c, x - 6, y - 21, 3, 6, '#474b3c');
  r(c, x - 6, y - 26, 12, 4, '#bf654b');
  r(c, x - 8, y - 23, 17, 3, '#e18b5c');
  if (dir !== 'up') {
    r(c, x + (dir === 'left' ? -4 : 3), y - 17, 2, 2, '#30473c');
  } else {
    r(c, x - 5, y - 19, 11, 7, '#584d3c');
    r(c, x - 3, y - 11, 7, 7, '#d7a26a');
  }
}
function building(
  c: C,
  n: MapNode,
  t: number,
  selected: boolean,
  area: number,
) {
  const x = (n.x - n.w / 2) * 16,
    y = (n.y - n.h) * 16,
    w = n.w * 16,
    h = n.h * 16;
  if (n.kind === 'exit') {
    r(c, n.x * 16 - 19, n.y * 16 - 7, 54, 14, '#426a48');
    txt(c, 'EXIT ↓', n.x * 16 - 12, n.y * 16 + 3, 9, '#f5ecc0');
    return;
  }
  if (n.kind === 'field') {
    r(c, x, y, w, h, '#39754c');
    for (let i = 0; i < w; i += 24) r(c, x + i, y, 12, h, '#448654');
    c.strokeStyle = '#dce9b7';
    c.lineWidth = 2;
    c.strokeRect(x + 7, y + 7, w - 14, h - 14);
    c.beginPath();
    c.moveTo(x + w / 2, y + 7);
    c.lineTo(x + w / 2, y + h - 7);
    c.stroke();
    c.beginPath();
    c.arc(x + w / 2, y + h / 2, 12, 0, Math.PI * 2);
    c.stroke();
    r(c, x - 3, y + h / 2 - 11, 8, 23, '#f6efd1');
    r(c, x + w - 5, y + h / 2 - 11, 8, 23, '#f6efd1');
    r(c, x + w / 2 + Math.sin(t) * 25, y + h / 2 + 5, 4, 4, '#f9efd1');
  } else {
    r(c, x - 3, y + h - 2, w + 12, 8, '#47774a55');
    r(c, x, y + 18, w, h - 18, '#e3d7aa');
    r(c, x + w - 10, y + 18, 10, h - 18, '#b7b18b');
    const roof =
      n.kind === 'college'
        ? '#557c91'
        : n.kind === 'studio'
          ? '#4a7e74'
          : n.kind === 'garage'
            ? '#af6250'
            : n.kind === 'house'
              ? '#b5824a'
              : '#728298';
    r(c, x - 5, y + 6, w + 10, 22, '#405948');
    r(c, x - 3, y + 4, w + 6, 19, roof);
    r(c, x + 4, y - 3, w - 8, 11, roof);
    r(c, x + 10, y - 8, w - 20, 9, roof);
    for (let yy = y; yy < y + 21; yy += 6) {
      r(c, x + 4, yy, w - 8, 1, '#eef0ba42');
      for (let xx = x + 8 + (yy % 12); xx < x + w - 5; xx += 13)
        r(c, xx, yy, 1, 5, '#324b4540');
    }
    for (let xx = x + 10; xx < x + w - 10; xx += 22) {
      r(c, xx, y + 33, 12, 16, '#395954');
      r(c, xx + 2, y + 35, 8, 8, '#99c5bc');
      r(c, xx + 2, y + 35, 3, 5, '#d3e6c3');
      r(c, xx - 1, y + 49, 14, 3, '#b49e76');
    }
    if (n.kind === 'college') {
      r(c, x + w / 2 - 13, y - 21, 27, h + 20, '#cebb8c');
      r(c, x + w / 2 - 16, y - 24, 33, 5, '#37594d');
      r(c, x + w / 2 - 8, y - 33, 17, 9, '#567c73');
      r(c, x + w / 2 - 7, y - 14, 15, 15, '#f5e3b2');
      r(c, x + w / 2, y - 12, 2, 8, '#4a5e4c');
      r(c, x + w / 2, y - 5, 5, 2, '#4a5e4c');
      r(c, x + w - 14, y - 21, 2, 25, '#6d744f');
      r(c, x + w - 12, y - 21, 23, 13, '#234e73');
      txt(c, 'M', x + w - 8, y - 10, 13, '#f4cb55');
    }
    if (n.kind === 'garage') {
      r(c, x + 8, y + 28, w - 16, h - 28, '#4a5d55');
      for (let yy = y + 32; yy < y + h - 5; yy += 7)
        r(c, x + 9, yy, w - 18, 2, '#708576');
      car(c, x + 21, y + h - 22, t, '#dcb458');
      txt(c, 'EDAG', x + w / 2 - 14, y + 20, 10, '#f5dfb7');
    }
    if (n.kind === 'studio') {
      r(c, x + w / 2 - 29, y + 6, 59, 14, '#284944');
      txt(c, 'SMT / LIVE', x + w / 2 - 25, y + 16, 10, '#dce9ba');
      r(c, x + w - 6, y - 23, 3, 25, '#526e5e');
      r(c, x + w - 14, y - 24, 19, 3, '#526e5e');
      r(c, x + w - 12, y - 29, 3, 6, '#526e5e');
      r(c, x + w + 1, y - 29, 3, 6, '#526e5e');
    }
    if (n.kind === 'house') txt(c, 'QUANTUM', x + 11, y + 20, 10, '#fff0bd');
    const doorx = n.x * 16;
    r(c, doorx - 6, y + h - 23, 22, 23, '#3c5746');
    r(c, doorx - 3, y + h - 20, 16, 20, '#7d7251');
    r(c, doorx + 8, y + h - 12, 2, 2, '#f4d585');
    r(c, doorx - 8, y + h, 26, 4, '#e9dfaf');
  }
  const labelWidth = Math.min(210, n.label.length * 5.4 + 14);
  r(
    c,
    n.x * 16 - labelWidth / 2 + 8,
    y - 48,
    labelWidth,
    17,
    selected ? '#f8ecc0' : '#f7f5dde8',
  );
  r(
    c,
    n.x * 16 - labelWidth / 2 + 8,
    y - 31,
    labelWidth,
    2,
    selected ? '#a76543' : '#58744a',
  );
  txt(c, n.label, n.x * 16 - labelWidth / 2 + 15, y - 36, 9, '#36573f');
  if (selected) {
    const bob = Math.floor(t * 3) % 2;
    r(c, n.x * 16 + 3, n.y * 16 + 8 + bob, 9, 3, '#fff1a4');
    r(c, n.x * 16 + 5, n.y * 16 + 11 + bob, 5, 3, '#fff1a4');
    r(c, n.x * 16 + 7, n.y * 16 + 14 + bob, 1, 2, '#fff1a4');
  }
  if (area === 2 && n.kind === 'college')
    for (let i = 0; i < 10; i++)
      r(
        c,
        x + 10 + ((i * 17) % w),
        y - 22 + ((i * 7 + t * 8) % 36),
        2,
        2,
        i % 2 ? '#ecca57' : '#527a93',
      );
}
function car(c: C, x: number, y: number, t: number, color = '#b9664c') {
  r(c, x + 2, y + 5, 36, 12, color);
  r(c, x + 8, y, 24, 10, color);
  r(c, x + 11, y + 2, 8, 6, '#b8dace');
  r(c, x + 21, y + 2, 8, 6, '#b8dace');
  r(c, x + 6, y + 15, 7, 5, '#334c49');
  r(c, x + 28, y + 15, 7, 5, '#334c49');
  r(c, x + 8, y + 16, 3, 2, Math.floor(t * 5) % 2 ? '#aec0a0' : '#72918a');
  r(c, x + 30, y + 16, 3, 2, '#aec0a0');
  r(c, x + 1, y + 9, 4, 3, '#f8d888');
}
function tile(c: C, m: GameMap, x: number, y: number, t: number) {
  const type = m.tiles[y]![x]!,
    px = x * 16,
    py = y * 16,
    hash = (x * 13 + y * 23) % 17;
  if (type === 'v') {
    r(c, px, py, 16, 16, '#263d36');
    if (hash < 3) r(c, px + 4, py + 5, 2, 2, '#375247');
    return;
  }
  if (type === 'w') {
    r(c, px, py, 16, 16, '#679f9f');
    r(c, px, py, 16, 2, '#71abab');
    const dx = Math.floor(t * 2) % 3;
    r(c, px + 2 + dx, py + 5, 7, 1, '#b5d5ba');
    r(c, px + 8 - dx, py + 12, 5, 1, '#93c4b3');
    return;
  }
  if (type === 'b') {
    r(c, px, py, 16, 16, '#a88657');
    for (let i = 0; i < 16; i += 4) r(c, px, py + i, 16, 1, '#d6b77c');
    r(c, px, py, 2, 16, '#726c48');
    r(c, px + 14, py, 2, 16, '#726c48');
    return;
  }
  if (type === 'floor' || type === 'pot' || type === 'rug') {
    r(
      c,
      px,
      py,
      16,
      16,
      type === 'rug' ? '#789784' : (x + y) % 2 ? '#dedac0' : '#e8e2c8',
    );
    r(c, px, py + 15, 16, 1, '#c0bea366');
    r(c, px + 15, py, 1, 16, '#c0bea344');
    if (type === 'pot') {
      r(c, px + 4, py + 8, 9, 8, '#b97d55');
      r(c, px + 1, py + 1, 15, 9, '#4f7951');
      r(c, px + 5, py - 3, 7, 11, '#86a45f');
    }
    return;
  }
  if (type === 'wall') {
    r(c, px, py, 16, 16, '#6e8e78');
    r(c, px, py + 13, 16, 3, '#365845');
    r(c, px + 1, py + 2, 14, 8, '#93aa8b');
    return;
  }
  if (type === 'p' || type === 's') {
    r(c, px, py, 16, 16, type === 'p' ? '#e1cc97' : '#dfd7a7');
    if (hash % 3 === 0) r(c, px + 3, py + 6, 3, 1, '#b5a875');
    if (hash % 2 === 0) r(c, px + 10, py + 12, 2, 1, '#f3dfa7');
    return;
  }
  const autumn = m.area === 2 && m.level !== 'world';
  r(c, px, py, 16, 16, autumn ? '#b4c380' : '#9fc87c');
  if (hash % 3 === 0) {
    r(c, px + 3, py + 7, 1, 3, '#70a567');
    r(c, px + 2, py + 6, 1, 2, '#70a567');
    r(c, px + 4, py + 6, 1, 2, '#70a567');
  }
  if (hash % 2 === 0) r(c, px + 11, py + 12, 2, 1, '#bfdb93');
  if (type === 'f' || hash === 1) {
    r(c, px + 7, py + 9, 1, 3, '#558850');
    r(c, px + 5, py + 6, 5, 3, hash % 2 ? '#f4df9c' : '#e9a68d');
    r(c, px + 6, py + 5, 3, 5, hash % 2 ? '#f4df9c' : '#e9a68d');
    r(c, px + 7, py + 7, 1, 1, '#aa7950');
  }
  // Crisp sand edges around water.
  if (m.tiles[y]?.[x - 1] === 'w') r(c, px, py, 3, 16, '#e6d7a0');
  if (m.tiles[y]?.[x + 1] === 'w') r(c, px + 13, py, 3, 16, '#e6d7a0');
  if (m.tiles[y - 1]?.[x] === 'w') r(c, px, py, 16, 3, '#e6d7a0');
  if (m.tiles[y + 1]?.[x] === 'w') r(c, px, py + 13, 16, 3, '#e6d7a0');
}
export function drawGame(
  c: C,
  m: GameMap,
  player: Point,
  t: number,
  selected: number,
  moving = false,
  dir = 'down',
  visited = new Set<string>(),
) {
  c.imageSmoothingEnabled = false;
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++) tile(c, m, x, y, t);
  if (m.level === 'world') {
    // Ordered flight arcs are the geographic story; the map is playful story geography.
    for (let i = 0; i < m.nodes.length - 1; i++) {
      const a = m.nodes[i]!,
        b = m.nodes[i + 1]!;
      for (let j = 0; j < 38; j++) {
        if (j % 3 !== 0) continue;
        const p = j / 38,
          x = (a.x + (b.x - a.x) * p) * 16 + 8,
          y = (a.y + (b.y - a.y) * p) * 16 + 15 - Math.sin(p * Math.PI) * 25;
        r(c, x, y, 3, 3, '#f8eed1');
        r(c, x, y + 3, 3, 1, '#8e9e61');
      }
    }
    if (m.design === 7) {
      txt(c, 'MI → DE → MI → NC', 20, 455, 12, '#31563c');
    }
    if (m.design === 8) {
      r(c, 22 * 16, 14 * 16, 46, 38, '#c3b68c');
      r(c, 22 * 16 + 5, 14 * 16 + 4, 36, 29, '#729f98');
      r(c, 22 * 16 + 17, 14 * 16 + 1, 10, 24, '#d6ddbe');
      r(c, 22 * 16 + 13, 14 * 16 - 4, 18, 7, '#b5d1c0');
    }
  } else if (m.level === 'area') {
    r(c, 21 * 16, 21 * 16, 80, 36, '#b1af82');
    r(c, 21 * 16 + 5, 21 * 16 + 4, 70, 28, '#6daba1');
    r(c, 23 * 16, 21 * 16 - 9, 14, 33, '#d3dfb8');
    r(c, 23 * 16 - 7, 21 * 16 - 14, 28, 8, '#accfc0');
    for (let i = 0; i < 4; i++)
      r(
        c,
        21 * 16 + 12 + i * 14,
        21 * 16 + 10 + Math.sin(t * 3 + i) * 3,
        6,
        1,
        '#c7e3c5',
      );
    for (const [x, y] of [
      [10, 20],
      [29, 19],
      [40, 19],
    ]) {
      r(c, x! * 16, y! * 16, 28, 6, '#9f8154');
      r(c, x! * 16 + 2, y! * 16 + 7, 3, 8, '#6a6445');
      r(c, x! * 16 + 23, y! * 16 + 7, 3, 8, '#6a6445');
    }
    sprite(c, 27 * 16, 18 * 16, t, false, 'left', '#557c9c');
    sprite(c, 18 * 16, 24 * 16, t, false, 'down', '#c2a45c');
    if (m.area === 1) {
      // A German test lane and parking bays outside the vehicle lab.
      r(c, 160, 278, 520, 28, '#7d8b79');
      for (let i = 0; i < 14; i++) r(c, 166 + i * 38, 290, 20, 2, '#e6dbaa');
      r(c, 178, 327, 113, 55, '#869080');
      for (let i = 0; i < 4; i++) r(c, 183 + i * 27, 331, 2, 45, '#d8d5b1');
      car(c, 184, 346, t, '#a9bbb4');
      car(c, 237, 346, t, '#b87855');
      car(c, ((t * 18) % 450) + 162, 280, t);
    }
    if (m.area === 3) {
      // A production truck and broadcast mast make Durham a live graphics campus.
      r(c, 166, 326, 112, 37, '#456e66');
      r(c, 171, 330, 75, 24, '#d5dcc0');
      txt(c, 'SMT / LIVE', 180, 346, 11, '#3e6555');
      r(c, 249, 332, 22, 25, '#e0cf9b');
      r(c, 251, 334, 16, 10, '#92bfb4');
      r(c, 180, 359, 13, 8, '#344e45');
      r(c, 252, 359, 13, 8, '#344e45');
      r(c, 212, 300, 3, 29, '#5d7867');
      r(c, 197, 302, 32, 3, '#5d7867');
      r(c, 197, 293, 3, 12, '#5d7867');
      r(c, 226, 293, 3, 12, '#5d7867');
    }
    if (m.area === 4) {
      r(c, 12 * 16, 22 * 16, 46, 18, '#f4e6b4');
      txt(c, 'OPEN HOME', 12 * 16 + 3, 22 * 16 + 12, 8, '#52724e');
    }
  }
  const objects: Array<{ y: number; draw: () => void }> = [];
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++)
      if (m.tiles[y]![x] === 't')
        objects.push({
          y: y * 16 + 15,
          draw: () =>
            tree(c, x * 16, y * 16, m.area === 2 && m.level === 'area'),
        });
  for (const n of m.nodes)
    objects.push({
      y: n.y * 16,
      draw: () => {
        if (n.kind === 'station') {
          const x = n.x * 16 - 48,
            y = n.y * 16 - 80;
          const e = areas[m.area]!.buildings[m.building]!.exhibits[n.index]!;
          r(c, x - 5, y - 5, 112, 79, '#344f42');
          c.save();
          c.translate(x, y);
          c.scale(100 / 480, 65 / 240);
          drawDemo(c, e.demo, t, 0, 0);
          c.restore();
          r(c, x - 7, y + 76, 114, 9, '#9c865b');
          r(c, x + 2, y + 84, 6, 10, '#6b684b');
          r(c, x + 87, y + 84, 6, 10, '#6b684b');
          r(
            c,
            x - 4,
            y - 26,
            109,
            17,
            selected === n.index ? '#eeda9d' : '#f6edcc',
          );
          txt(c, `${n.index + 1}. ${e.metric}`, x + 1, y - 14, 8, '#36583f');
          if (selected === n.index) {
            txt(c, '↓ INSPECT', x + 27, y + 108, 9, '#3f6443');
          }
        } else
          building(
            c,
            n,
            t,
            n.index === selected,
            m.level === 'world' ? n.index : m.area,
          );
        if (m.level === 'world' && visited.has(areas[n.index]?.id ?? '')) {
          r(c, n.x * 16 + 35, (n.y - 4) * 16 - 27, 17, 17, '#315a42');
          txt(c, '✓', n.x * 16 + 39, (n.y - 4) * 16 - 14, 12, '#f8e5a2');
        }
      },
    });
  objects.push({
    y: player.y * 16 + 12,
    draw: () => sprite(c, player.x * 16 + 8, player.y * 16 + 9, t, moving, dir),
  });
  objects.sort((a, b) => a.y - b.y).forEach((o) => o.draw());
  if (m.level === 'interior') {
    txt(
      c,
      areas[m.area]!.buildings[m.building]!.name.toUpperCase(),
      112,
      83,
      12,
      '#edf0cc',
    );
    // Shelving, plants, equipment and the exit carpet make this a room, not a popup.
    for (const x of [8, 36]) {
      r(c, x * 16, 23 * 16, 58, 18, '#938568');
      for (let i = 0; i < 7; i++)
        r(
          c,
          x * 16 + 3 + i * 7,
          23 * 16 + 2,
          5,
          11,
          ['#b07555', '#9cac7b', '#5c827d'][i % 3]!,
        );
      r(c, x * 16 - 2, 23 * 16 + 16, 62, 4, '#6e7352');
    }
    sprite(c, 29 * 16, 22 * 16, t, false, 'left', '#73938a');
    const kind = areas[m.area]!.buildings[m.building]!.kind;
    if (kind === 'garage') {
      r(c, 147, 301, 113, 47, '#8f9d8a');
      r(c, 153, 306, 4, 34, '#e0ce85');
      r(c, 251, 306, 4, 34, '#e0ce85');
      c.save();
      c.translate(167, 312);
      c.scale(2, 2);
      car(c, 0, 0, t);
      c.restore();
      txt(c, 'VEHICLE TEST BAY', 149, 292, 10, '#4b6c50');
    }
    if (kind === 'studio') {
      r(c, 161, 306, 32, 22, '#3b5950');
      r(c, 193, 310, 12, 13, '#486654');
      r(c, 176, 328, 3, 24, '#4e6350');
      r(c, 162, 349, 33, 3, '#4e6350');
      r(c, 315, 81, 110, 17, '#9c614d');
      txt(c, '● ON AIR', 338, 94, 12, '#f6e3b6');
    }
    if (kind === 'house') {
      r(c, 150, 307, 78, 37, '#739e83');
      r(c, 147, 300, 84, 13, '#91b293');
      r(c, 146, 308, 12, 38, '#597e65');
      r(c, 220, 308, 12, 38, '#597e65');
      r(c, 164, 363, 55, 22, '#b69763');
      r(c, 177, 365, 19, 11, '#f0dfac');
      txt(c, 'THE SHOWROOM', 150, 293, 10, '#54734e');
    }
  }
}
export function drawPreview(c: C, area: number, t: number) {
  r(c, 0, 0, 320, 150, '#a3c87c');
  for (let x = 0; x < 320; x += 16) r(c, x, 116, 16, 22, '#dfcf9b');
  for (const x of [7, 34, 275, 301]) tree(c, x, 75 + (x % 2) * 18, area === 2);
  const n: MapNode = {
    x: 10,
    y: 7,
    w: 8,
    h: 4,
    kind: areas[area]!.buildings[0]!.kind,
    index: 0,
    label: areas[area]!.region.toUpperCase(),
  };
  building(c, n, t, false, area);
  sprite(c, 163, 135, t, false);
  txt(c, areas[area]!.badge, 12, 144, 8, '#446843');
}
export function drawDemo(
  c: C,
  kind: Exhibit['demo'],
  t: number,
  action: number,
  elapsed: number,
) {
  c.imageSmoothingEnabled = false;
  r(c, 0, 0, 480, 240, '#dce5c5');
  if (kind === 'kick' || kind === 'coach') {
    r(c, 18, 20, 444, 195, '#487e4f');
    for (let x = 23; x < 460; x += 44) r(c, x, 25, 22, 185, '#528e54');
    c.strokeStyle = '#dae3b5';
    c.lineWidth = 2;
    c.strokeRect(30, 31, 420, 170);
    for (let x = 50; x < 449; x += 40) r(c, x, 36, 1, 160, '#bfd198');
    const p = action ? Math.min(1, elapsed / 2.5) : (t * 0.18) % 1;
    for (let i = 0; i < p * 65; i++) {
      const q = i / 65;
      r(
        c,
        81 + q * 312,
        180 - Math.sin(q * Math.PI * 0.8) * 122,
        4,
        4,
        '#f5da7f',
      );
    }
    r(
      c,
      81 + p * 312,
      180 - Math.sin(p * Math.PI * 0.8) * 122,
      7,
      5,
      '#fff1c7',
    );
    r(c, 397, 58, 3, 80, '#f2d179');
    r(c, 373, 58, 51, 4, '#f2d179');
    r(c, 373, 37, 4, 24, '#f2d179');
    r(c, 420, 37, 4, 24, '#f2d179');
    for (let i = 0; i < 7; i++)
      sprite(
        c,
        60 + ((i * 53) % 270),
        150 + ((i * 17) % 36),
        t,
        kind === 'coach',
        'right',
        i % 2 ? '#e1bd77' : '#557d9b',
      );
    r(c, 28, 25, 143, 18, '#284e3e');
    txt(
      c,
      kind === 'coach' ? 'TEAMWORK / PASSING DRILL' : 'SMT / LIVE TRAJECTORY',
      34,
      38,
      10,
      '#f2e9bd',
    );
    txt(
      c,
      action && p === 1 ? 'REPLAY COMPLETE' : 'ILLUSTRATIVE LIVE GRAPHICS',
      28,
      231,
      10,
      '#426448',
    );
  } else if (kind === 'can' || kind === 'flash') {
    r(c, 22, 26, 436, 177, '#426354');
    r(c, 33, 39, 206, 147, '#213d38');
    txt(
      c,
      kind === 'can' ? 'VEHICLE / CAN BUS' : 'FIRMWARE UPDATE',
      45,
      59,
      13,
      '#e5db9b',
    );
    const value = action
      ? Math.min(100, Math.floor(elapsed * 20))
      : Math.floor(50 + Math.sin(t) * 24);
    if (kind === 'can') {
      txt(c, String(value).padStart(2, '0'), 50, 127, 56, '#d3e8b5');
      txt(c, 'km/h', 130, 121, 15, '#8db496');
      for (let i = 0; i < 20; i++)
        r(c, 45 + i * 9, 151, 6, 15, i < value / 5 ? '#bfcd7e' : '#365749');
      txt(c, '0x104  →  SPEED', 45, 175, 11, '#a9c39a');
    } else {
      r(c, 45, 98, 174, 20, '#375d4a');
      r(c, 45, 98, (174 * value) / 100, 20, '#c2d08a');
      txt(c, `${value}%`, 46, 142, 22, '#e4e4b0');
      txt(
        c,
        value === 100 ? 'MODULE READY' : 'WRITING FIRMWARE...',
        46,
        168,
        10,
        '#bed298',
      );
    }
    c.save();
    c.translate(290, 91);
    c.scale(3, 3);
    car(c, 0, 0, t, '#d3b563');
    c.restore();
    for (let i = 0; i < 9; i++)
      r(
        c,
        250 + i * 9,
        68 + ((i + Math.floor(t * 4)) % 3) * 4,
        5,
        3,
        '#d4d59a',
      );
    txt(c, 'SIGNAL → SOFTWARE → DISPLAY', 30, 227, 12, '#426448');
  } else if (kind === 'telemetry') {
    r(c, 24, 26, 432, 183, '#294b40');
    txt(c, 'TELEMETRY / PATTERNS IN THE DATA', 39, 47, 12, '#e7e3b2');
    for (let x = 40; x < 450; x += 36) r(c, x, 61, 1, 125, '#3c6451');
    for (let y = 64; y < 196; y += 27) r(c, 40, y, 393, 1, '#3c6451');
    for (let i = 0; i < 95; i++) {
      const x = 43 + i * 4,
        y =
          118 +
          Math.sin(i * 0.13 + (action ? 0 : t)) * 29 +
          Math.cos(i * 0.3) * 8;
      r(c, x, y, 4, 3, '#d8d68a');
      if (action && elapsed > 1)
        r(c, x, 115 + Math.sin(i * 0.13) * 27, 3, 2, '#7bc5a3');
    }
    txt(
      c,
      action
        ? 'ANALYSIS COMPLETE / SIGNAL FOUND'
        : 'RAW STREAM / AWAITING ANALYSIS',
      35,
      229,
      11,
      '#416147',
    );
  } else if (kind === 'house' || kind === 'map') {
    r(c, 22, 17, 436, 204, '#fcf3d8');
    r(c, 22, 17, 436, 20, '#b6c8a1');
    txt(c, 'QUANTUM / EXPLORE A NEIGHBORHOOD', 35, 31, 11, '#37593f');
    r(
      c,
      31,
      45,
      313,
      168,
      action % 2 && kind === 'map' ? '#729893' : '#a1bf82',
    );
    path(
      c,
      [
        [50, 157],
        [180, 65],
        [330, 137],
        [197, 202],
      ],
      '#86aa76',
    );
    path(
      c,
      [
        [63, 162],
        [187, 80],
        [321, 144],
        [193, 208],
      ],
      '#dfd3a5',
    );
    for (const [i, x, y] of [
      [0, 135, 113],
      [1, 223, 149],
      [2, 195, 78],
    ]) {
      c.save();
      c.translate(x!, y!);
      c.scale(0.64, 0.64);
      building(
        c,
        { x: 0, y: 0, w: 6, h: 4, kind: 'house', index: 0, label: '' },
        t,
        false,
        4,
      );
      c.restore();
      if (action % 3 === i && kind === 'house') {
        c.strokeStyle = '#fff1a9';
        c.lineWidth = 2;
        c.strokeRect(x! - 34, y! - 53, 70, 62);
      }
    }
    txt(c, `HOME 0${(action % 3) + 1}`, 357, 69, 12, '#3e6247');
    txt(c, '3D VIEW', 357, 89, 10, '#6b825f');
    r(c, 355, 105, 91, 47, '#d9dfbd');
    txt(c, '3 beds', 363, 124, 11, '#4a6e4d');
    txt(c, '2 baths', 363, 140, 11, '#4a6e4d');
    r(c, 355, 170, 90, 25, '#487352');
    txt(c, 'EXPLORE >', 365, 187, 12, '#f6edc4');
  } else if (kind === 'geometry') {
    r(c, 25, 24, 430, 191, '#274b42');
    for (let x = 40; x < 450; x += 20) r(c, x, 35, 1, 165, '#345b4b');
    for (let y = 40; y < 211; y += 20) r(c, 35, y, 409, 1, '#345b4b');
    c.strokeStyle = '#dacf81';
    c.lineWidth = 13;
    c.lineJoin = (['miter', 'bevel', 'round'] as CanvasLineJoin[])[action % 3]!;
    c.beginPath();
    c.moveTo(60, 158);
    c.lineTo(144, 87);
    c.lineTo(237, 170);
    c.lineTo(328, 61);
    c.lineTo(410, 124);
    c.stroke();
    for (const [x, y] of [
      [60, 158],
      [144, 87],
      [237, 170],
      [328, 61],
      [410, 124],
    ])
      r(c, x! - 3, y! - 3, 6, 6, '#f9f0cd');
    txt(
      c,
      `LINE JOIN / ${['MITER', 'BEVEL', 'ROUND'][action % 3]}`,
      41,
      45,
      12,
      '#dfe6bd',
    );
    txt(c, 'POINTS → TRIANGLES → GRAPHICS', 39, 234, 11, '#426448');
  } else {
    r(c, 105, 29, 273, 176, '#b3a278');
    r(c, 111, 22, 261, 176, '#f9edc9');
    r(c, 120, 31, 243, 158, '#e3d9aa');
    r(c, 125, 36, 233, 148, '#f9edc9');
    txt(c, 'UNIVERSITY OF MICHIGAN', 147, 62, 14, '#2b506d');
    txt(c, 'BACHELOR OF SCIENCE', 153, 93, 14, '#3e614e');
    txt(c, 'Computer Science', 175, 117, 12, '#657652');
    txt(c, 'DECEMBER 2024', 185, 152, 11, '#657652');
    txt(c, 'M', 228, 179, 24, '#c4a145');
    if (action)
      for (let i = 0; i < 42; i++)
        r(
          c,
          20 + ((i * 73) % 450),
          ((i * 17 + elapsed * 35) % 200) + 15,
          3,
          4,
          i % 2 ? '#e4bd4f' : '#3b6687',
        );
    txt(c, 'A FOUNDATION FOR EVERYTHING THAT FOLLOWED', 83, 230, 11, '#426448');
  }
}
