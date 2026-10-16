// Original, code-authored tile and sprite art. Every mark lands on the same pixel grid.
export const W = 640,
  H = 384,
  T = 8,
  COLS = W / T,
  ROWS = H / T;
export type Point = { x: number; y: number };
export const sites = [
  { id: 'uofm', label: 'UofM', x: 20, y: 14, region: 'MICHIGAN' },
  { id: 'edag', label: 'EDAG', x: 47, y: 12, region: 'INGOLSTADT' },
  { id: 'smt', label: 'SMT', x: 22, y: 25, region: 'DURHAM' },
  { id: 'quantum', label: 'QUANTUM', x: 30, y: 25, region: 'DURHAM' },
];
export const airports = [
  { x: 27, y: 18 },
  { x: 43, y: 16 },
];
type C = CanvasRenderingContext2D;
export const colors = {
  ink: '#263e42',
  sea: '#427f9c',
  water: '#539ab1',
  foam: '#a9d6c3',
  sand: '#e7d89c',
  grass: '#9abc70',
  light: '#bad686',
  dark: '#79a05e',
  pine: '#48775a',
  cream: '#faf0c5',
  roof: '#bb6456',
  shade: '#774e4a',
  blue: '#547c9c',
  gold: '#ebc463',
};
export function rect(
  c: C,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  c.fillStyle = color;
  c.fillRect(Math.round(x), Math.round(y), w, h);
}
const glyphs: Record<string, string> = {
  A: '010101111101101',
  B: '110101110101110',
  C: '011100100100011',
  D: '110101101101110',
  E: '111100110100111',
  F: '111100110100100',
  G: '011100101101011',
  H: '101101111101101',
  I: '111010010010111',
  J: '001001001101010',
  K: '101101110101101',
  L: '100100100100111',
  M: '101111111101101',
  N: '101111111111101',
  O: '010101101101010',
  P: '110101110100100',
  Q: '010101101111011',
  R: '110101110101101',
  S: '011100010001110',
  T: '111010010010010',
  U: '101101101101111',
  V: '101101101101010',
  W: '101101111111101',
  X: '101101010101101',
  Y: '101101010010010',
  Z: '111001010100111',
  '0': '111101101101111',
  '1': '010110010010111',
  '2': '110001010100111',
  '3': '110001010001110',
  '4': '101101111001001',
  '5': '111100110001110',
  '6': '011100111101111',
  '7': '111001010010010',
  '8': '111101111101111',
  '9': '111101111001110',
  '-': '000000111000000',
  '.': '000000000000010',
  '/': '001001010100100',
  ':': '000010000010000',
  '+': '000010111010000',
  '!': '010010010000010',
  '?': '110001010000010',
};
export function text(
  c: C,
  label: string,
  x: number,
  y: number,
  color = colors.ink,
  scale = 1,
) {
  for (const [i, ch] of [...label.toUpperCase()].entries()) {
    const glyph = glyphs[ch];
    if (!glyph) continue;
    for (let j = 0; j < 15; j++)
      if (glyph[j] === '1')
        rect(
          c,
          x + i * 4 * scale + (j % 3) * scale,
          y + Math.floor(j / 3) * scale,
          scale,
          scale,
          color,
        );
  }
}
function sprite(
  c: C,
  lines: string[],
  palette: Record<string, string>,
  x: number,
  y: number,
) {
  lines.forEach((line, j) =>
    [...line].forEach((p, i) => {
      if (palette[p]) rect(c, x + i, y + j, 1, 1, palette[p]!);
    }),
  );
}
export function tree(c: C, x: number, y: number, variant = 0) {
  const p = {
    o: colors.ink,
    d: '#3e6b52',
    m: variant ? '#7a9c57' : '#5b8d58',
    l: variant ? '#a4b962' : '#87b767',
    h: '#aec87d',
    t: '#8d7050',
    s: '#749763',
  };
  sprite(
    c,
    [
      '......oooo......',
      '....oodmmmdo....',
      '...odmllhlmdo...',
      '..odmllhhllmdo..',
      '.odmllhlmllmmdo.',
      '.odmllmlllhmmdo.',
      'odmlllmmlllmmmdo',
      'odmllmlllmmllmdo',
      'oddmlllmlllmmddo',
      '.oddmmmmmmmdddo.',
      '.odddmmmmmddddo.',
      '..ooddddddddoo..',
      '....oootttoo....',
      '......ttt.......',
      '.....sttts......',
    ],
    p,
    x - 8,
    y - 13,
  );
}
export function person(
  c: C,
  x: number,
  y: number,
  step = 0,
  face = 'down',
  npc = false,
) {
  const hat = npc ? '#bd7859' : '#d9b25e';
  sprite(
    c,
    [
      '...hhhh...',
      '..hHHHHh..',
      '..hhhhhh..',
      '..osssso..',
      '..sososs..',
      '...ssss...',
      '..bJJJJb..',
      '.sJJJJJJs.',
      '..JJJJJJ..',
      '..bbbbbb..',
      '...bb.bb..',
      '...oo.oo..',
    ],
    {
      h: colors.ink,
      H: hat,
      o: colors.ink,
      s: '#efc49a',
      J: npc ? '#ba6b64' : '#6380a0',
      b: '#3e5263',
    },
    x - 5,
    y - 13,
  );
  if (face === 'up') rect(c, x - 2, y - 9, 4, 3, hat);
  if (step % 2) {
    rect(c, x - 2, y - 1, 2, 2, colors.ink);
    rect(c, x + 1, y - 2, 2, 1, colors.ink);
  }
}
export function car(c: C, x: number, y: number, color = colors.roof) {
  rect(c, x - 8, y + 3, 18, 3, '#6f9465');
  rect(c, x - 9, y, 18, 5, colors.ink);
  rect(c, x - 7, y - 3, 13, 8, color);
  rect(c, x - 4, y - 5, 8, 7, color);
  rect(c, x - 3, y - 4, 5, 3, '#acc4be');
  rect(c, x - 7, y + 4, 3, 2, colors.ink);
  rect(c, x + 4, y + 4, 3, 2, colors.ink);
  rect(c, x - 9, y + 1, 2, 2, colors.cream);
  rect(c, x + 8, y + 1, 1, 2, colors.gold);
}
function windowTile(c: C, x: number, y: number) {
  rect(c, x, y, 7, 9, colors.ink);
  rect(c, x + 1, y + 1, 5, 6, '#84b6b4');
  rect(c, x + 1, y + 1, 2, 3, '#c2dfc9');
  rect(c, x + 3, y + 1, 1, 6, '#e7dcb8');
  rect(c, x - 1, y + 8, 9, 2, '#faf0c5');
}
export function building(c: C, kind: number, x: number, y: number, t = 0) {
  // y is the walkable doorstep; walls and roofs occupy the tiles immediately above it.
  rect(c, x - 24, y - 4, 51, 7, '#789469');
  rect(c, x - 22, y - 26, 44, 24, colors.ink);
  rect(c, x - 20, y - 24, 40, 22, '#e1d0a0');
  for (let j = y - 22; j < y - 3; j += 5) {
    rect(c, x - 19, j, 38, 1, '#c4b68c');
    for (let k = x - 18 + (j % 2) * 3; k < x + 17; k += 8)
      rect(c, k, j, 1, 4, '#c4b68c');
  }
  const roof =
    kind === 0
      ? colors.blue
      : kind === 1
        ? colors.roof
        : kind === 2
          ? '#617986'
          : '#b97c53';
  rect(c, x - 25, y - 32, 50, 7, colors.ink);
  rect(c, x - 23, y - 38, 46, 11, roof);
  rect(c, x - 20, y - 41, 40, 4, roof);
  rect(c, x - 25, y - 28, 50, 3, colors.cream);
  for (let j = 0; j < 4; j++) {
    rect(c, x - 21, y - 38 + j * 3, 43, 1, kind === 0 ? '#7599b0' : '#ce9571');
    for (let k = 0; k < 7; k++)
      rect(c, x - 21 + k * 6 + (j % 2) * 3, y - 37 + j * 3, 1, 2, colors.shade);
  }
  windowTile(c, x - 16, y - 20);
  windowTile(c, x + 9, y - 20);
  rect(c, x - 4, y - 13, 9, 13, colors.ink);
  rect(c, x - 3, y - 12, 7, 11, '#675e4d');
  rect(c, x + 2, y - 7, 1, 1, colors.gold);
  rect(c, x - 6, y - 1, 13, 3, '#ede0b0');
  if (kind === 0) {
    // Campus bell tower and maize flag.
    rect(c, x - 7, y - 49, 15, 32, colors.ink);
    rect(c, x - 5, y - 47, 11, 28, '#e9d9ad');
    rect(c, x - 8, y - 50, 17, 3, colors.blue);
    rect(c, x - 5, y - 52, 3, 3, colors.blue);
    rect(c, x + 3, y - 52, 3, 3, colors.blue);
    rect(c, x - 3, y - 42, 7, 7, colors.cream);
    rect(c, x, y - 41, 1, 3, colors.ink);
    rect(c, x, y - 39, 3, 1, colors.ink);
    rect(c, x - 2, y - 30, 5, 9, colors.ink);
    rect(c, x + 21, y - 51, 1, 20, colors.ink);
    rect(c, x + 22, y - 51, 12, 8, colors.gold);
    text(c, 'M', x + 26, y - 49, colors.ink);
    if (Math.floor(t * 2) % 2) rect(c, x + 32, y - 51, 2, 2, colors.grass);
  } else if (kind === 1) {
    // Open vehicle bay, workbench, and diagnostics.
    rect(c, x - 18, y - 20, 35, 18, colors.ink);
    rect(c, x - 16, y - 18, 31, 15, '#607078');
    for (let j = 0; j < 3; j++)
      rect(c, x - 16, y - 18 + j * 3, 31, 1, '#879391');
    rect(c, x + 8, y - 15, 7, 5, '#9cc9c4');
    rect(c, x + 9, y - 14, 4, 2, colors.gold);
    rect(c, x + 9, y - 14, 1 + (Math.floor(t * 2) % 4), 1, colors.cream);
    car(c, x - 4, y - 7);
    rect(c, x - 17, y - 22, 33, 2, colors.gold);
  } else if (kind === 2) {
    // Embedded animated sports screen; same pixel scale as the building.
    rect(c, x - 19, y - 23, 37, 19, colors.ink);
    rect(c, x - 17, y - 21, 33, 15, '#517e54');
    for (let j = 0; j < 5; j++)
      rect(c, x - 12 + j * 6, y - 20, 1, 13, '#a1bb7e');
    rect(c, x + 8, y - 18, 6, 1, colors.cream);
    rect(c, x + 10, y - 18, 1, 7, colors.cream);
    for (let j = 0; j < 22; j++) {
      const q = j / 21;
      rect(
        c,
        x - 14 + j,
        y - 10 - Math.round(Math.sin(q * Math.PI) * 8),
        1,
        1,
        colors.gold,
      );
    }
    const q = (t * 0.25) % 1;
    rect(
      c,
      x - 14 + q * 22,
      y - 10 - Math.sin(q * Math.PI) * 8,
      2,
      2,
      colors.cream,
    );
    rect(c, x + 14, y - 45, 2, 10, colors.ink);
    rect(c, x + 9, y - 46, 10, 2, '#c9d9c3');
    rect(c, x + 7, y - 50, 3, 5, '#c9d9c3');
    rect(c, x + 11, y - 44, 7, 2, '#8eaaa6');
  } else {
    // Two model homes and a blue wireframe display.
    rect(c, x + 18, y - 22, 14, 19, '#dbcba0');
    rect(c, x + 16, y - 25, 18, 4, colors.shade);
    rect(c, x + 19, y - 29, 12, 5, roof);
    windowTile(c, x + 21, y - 17);
    rect(c, x - 17, y - 21, 12, 10, colors.ink);
    rect(c, x - 15, y - 19, 8, 6, '#83b8bc');
    rect(c, x - 13, y - 17, 4, 4, '#d0e6c8');
    rect(c, x - 12, y - 19, 2, 2, '#d0e6c8');
    if (Math.floor(t / 2) % 2) rect(c, x + 22, y - 16, 2, 3, colors.gold);
  }
}
const polygons = [
  [
    [3, 9],
    [7, 5],
    [13, 3],
    [19, 4],
    [24, 6],
    [27, 7],
    [30, 12],
    [30, 17],
    [33, 20],
    [34, 26],
    [31, 28],
    [29, 27],
    [26, 30],
    [23, 27],
    [19, 28],
    [15, 25],
    [14, 22],
    [10, 21],
    [7, 18],
    [5, 15],
  ],
  [
    [23, 30],
    [28, 29],
    [32, 32],
    [34, 35],
    [32, 38],
    [29, 43],
    [26, 46],
    [24, 43],
    [23, 39],
    [21, 35],
  ],
  [
    [30, 2],
    [36, 1],
    [40, 3],
    [39, 7],
    [35, 10],
    [32, 7],
  ],
  [
    [42, 11],
    [45, 7],
    [48, 5],
    [51, 7],
    [54, 5],
    [60, 4],
    [69, 5],
    [74, 8],
    [78, 12],
    [76, 16],
    [72, 17],
    [72, 22],
    [68, 25],
    [65, 22],
    [63, 20],
    [60, 23],
    [57, 21],
    [55, 16],
    [52, 16],
    [51, 19],
    [48, 17],
    [44, 18],
    [42, 16],
  ],
  [
    [43, 20],
    [48, 18],
    [54, 20],
    [57, 24],
    [56, 29],
    [52, 34],
    [49, 36],
    [46, 33],
    [45, 28],
    [42, 25],
  ],
  [
    [65, 34],
    [69, 32],
    [74, 33],
    [77, 37],
    [76, 40],
    [71, 41],
    [66, 39],
  ],
  [
    [78, 42],
    [79, 43],
    [78, 46],
    [77, 45],
  ],
  [
    [0, 47],
    [13, 46],
    [25, 47],
    [38, 45],
    [50, 46],
    [64, 45],
    [79, 47],
    [79, 48],
    [0, 48],
  ],
];
function inside(x: number, y: number, points: number[][]) {
  let yes = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i]!,
      b = points[j]!;
    if (
      a[1]! > y !== b[1]! > y &&
      x < ((b[0]! - a[0]!) * (y - a[1]!)) / (b[1]! - a[1]!) + a[0]!
    )
      yes = !yes;
  }
  return yes;
}
export const terrain: string[][] = Array.from({ length: ROWS }, (_, y) =>
  Array.from({ length: COLS }, (_, x) =>
    polygons.some((p) => inside(x + 0.5, y + 0.5, p)) ? 'g' : 'w',
  ),
);
const paint = (x: number, y: number, w: number, h: number, type: string) => {
  for (let j = y; j < y + h; j++)
    for (let i = x; i < x + w; i++) if (terrain[j]?.[i]) terrain[j]![i] = type;
};
// The Great Lakes and a small British island establish the geographic cues.
paint(23, 9, 3, 1, 'w');
paint(25, 10, 2, 2, 'w');
paint(24, 12, 1, 2, 'w');
paint(41, 10, 1, 3, 'g');
paint(40, 11, 1, 1, 'g');
// Local plazas and trails only. There is no road connecting the continents.
sites.forEach((s) => {
  paint(s.x - 4, s.y - 6, 9, 8, 'g');
  paint(s.x - 4, s.y + 1, 9, 2, 'p');
  paint(s.x - 1, s.y, 3, 3, 'p');
});
paint(20, 17, 2, 10, 'p');
paint(21, 26, 11, 2, 'p');
paint(21, 18, 7, 2, 'p');
paint(42, 14, 7, 3, 'p');
paint(46, 12, 2, 4, 'p');
airports.forEach((a) => paint(a.x - 1, a.y - 1, 3, 3, 'p'));
const noise = (x: number, y: number) =>
  Math.abs((x * 374761393 + y * 668265263) ^ ((x + 7) * (y + 31) * 127)) % 100;
export const trees: Point[] = [];
const isSnow = (x: number, y: number) =>
  y < 5 || y > 44 || (x > 29 && x < 41 && y < 11);
const isDesert = (x: number, y: number) => x > 42 && x < 56 && y > 19 && y < 26;
for (let y = 3; y < ROWS - 3; y++)
  for (let x = 3; x < COLS - 2; x++)
    if (
      terrain[y]![x] === 'g' &&
      noise(x, y) < (x > 58 || (y > 31 && x < 35) ? 38 : 22) &&
      !isSnow(x, y) &&
      !isDesert(x, y) &&
      y % 2 === 0 &&
      !sites.some((s) => Math.abs(s.x - x) < 6 && Math.abs(s.y - y) < 8) &&
      !airports.some((s) => Math.abs(s.x - x) < 3 && Math.abs(s.y - y) < 3)
    )
      trees.push({ x, y });
const mountains = [
  [7, 10],
  [8, 12],
  [9, 14],
  [10, 16],
  [25, 34],
  [26, 37],
  [26, 40],
  [50, 7],
  [57, 14],
  [59, 15],
  [61, 15],
  [63, 15],
  [65, 14],
  [70, 8],
];
export function blocked(p: Point) {
  if (terrain[p.y]?.[p.x] === undefined || terrain[p.y]?.[p.x] === 'w')
    return true;
  if (trees.some((t) => t.x === p.x && t.y === p.y)) return true;
  if (
    mountains.some(
      ([x, y]) => p.x >= x! && p.x < x! + 2 && p.y >= y! && p.y < y! + 2,
    )
  )
    return true;
  return sites.some(
    (s) => p.x >= s.x - 3 && p.x <= s.x + 3 && p.y < s.y && p.y >= s.y - 5,
  );
}
export function pathfind(start: Point, end: Point): Point[] {
  if (blocked(end)) return [];
  const key = (p: Point) => p.y * COLS + p.x;
  const queue = [start],
    seen = new Map<number, Point | null>([[key(start), null]]);
  for (let i = 0; i < queue.length; i++) {
    const p = queue[i]!;
    if (key(p) === key(end)) {
      const path = [];
      let q: Point | null = p;
      while (q && key(q) !== key(start)) {
        path.unshift(q);
        q = seen.get(key(q))!;
      }
      return path;
    }
    for (const [dx, dy] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      const q = { x: p.x + dx!, y: p.y + dy! };
      if (!blocked(q) && !seen.has(key(q))) {
        seen.set(key(q), p);
        queue.push(q);
      }
    }
  }
  return [];
}
export function drawTerrain(c: C) {
  c.imageSmoothingEnabled = false;
  rect(c, 0, 0, W, H, colors.sea);
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++) {
      const v = terrain[y]![x],
        px = x * T,
        py = y * T,
        n = noise(x, y);
      if (v === 'w') {
        if (n < 14) {
          rect(c, px + 1, py + 4, 4, 1, '#568fa7');
          rect(c, px + 2, py + 5, 2, 1, '#38768f');
        }
        continue;
      }
      let base = isSnow(x, y)
        ? '#d8e5d2'
        : v === 'p'
          ? '#ddcea1'
          : colors.grass;
      if (v === 'g' && isDesert(x, y)) base = '#d8c88e';
      rect(c, px, py, T, T, base);
      if (v === 'g' && n < 42 && !isSnow(x, y) && !isDesert(x, y)) {
        rect(c, px + 2, py + 3, 1, 2, colors.dark);
        rect(c, px + 1, py + 3, 3, 1, colors.dark);
        rect(c, px + 5, py + 6, 2, 1, colors.light);
      }
      if (v === 'p' && n < 40) {
        rect(c, px + 3, py + 5, 2, 1, '#c2b787');
        rect(c, px + 6, py + 2, 1, 1, colors.cream);
      }
      for (const [dx, dy] of [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ])
        if (terrain[y + dy!]?.[x + dx!] === 'w') {
          if (dx) {
            const q = px + (dx > 0 ? 6 : 0);
            rect(c, q, py, 2, T, colors.sand);
            rect(c, q + (dx > 0 ? 2 : -2), py, 2, T, colors.foam);
            rect(c, q + (dx > 0 ? 4 : -4), py, 2, T, colors.water);
          } else {
            const q = py + (dy! > 0 ? 6 : 0);
            rect(c, px, q, T, 2, colors.sand);
            rect(c, px, q + (dy! > 0 ? 2 : -2), T, 2, colors.foam);
            rect(c, px, q + (dy! > 0 ? 4 : -4), T, 2, colors.water);
          }
        }
    }
  // Stone ridges are contiguous, with three-tone pixel faces.
  for (const [x, y] of mountains) {
    sprite(
      c,
      [
        '.......oo.......',
        '......ollo......',
        '.....olllso.....',
        '....ollllsso....',
        '....olllmsso....',
        '...olmlmmssso...',
        '...olmmmmsmso...',
        '..olmlmmmsssso..',
        '..olmmmmsmssso..',
        '.olmlmmmmmsssso.',
        '.olmmmmmmssssso.',
        'olmmmmmmmsssssso',
        'olmmmmmsssssssso',
        '.oooooooooooooo.',
      ],
      { o: '#687b69', l: '#c7c7a0', s: '#8e9b7d', m: '#adb694' },
      x! * T,
      y! * T,
    );
  }
  for (const s of sites) {
    for (const side of [-1, 1]) {
      rect(c, (s.x + side * 4) * T, s.y * T - 13, 5, 10, '#739261');
      for (let k = 0; k < 3; k++) {
        rect(
          c,
          (s.x + side * 4) * T + 1,
          s.y * T - 12 + k * 3,
          3,
          2,
          k % 2 ? colors.cream : '#df9d80',
        );
      }
    }
  }
  for (const a of airports) {
    rect(c, a.x * T - 10, a.y * T - 5, 20, 10, '#869b8b');
    rect(c, a.x * T - 9, a.y * T - 1, 18, 1, colors.cream);
    rect(c, a.x * T - 1, a.y * T - 11, 2, 4, colors.ink);
    rect(c, a.x * T, a.y * T - 11, 5, 3, colors.roof);
  }
  text(c, 'PACIFIC', 20, 245, '#a2c6bd');
  text(c, 'ATLANTIC', 287, 197, '#a2c6bd');
  text(c, 'OCEAN', 293, 206, '#a2c6bd');
  text(c, 'INDIAN OCEAN', 466, 266, '#a2c6bd');
}
export function sign(
  c: C,
  label: string,
  x: number,
  y: number,
  selected = false,
) {
  const w = label.length * 4 + 9;
  rect(c, x - w / 2 + 1, y + 1, w, 11, colors.ink);
  rect(c, x - w / 2, y, w, 10, selected ? colors.gold : colors.cream);
  text(c, label, x - w / 2 + 5, y + 3);
}
export function plane(c: C, x: number, y: number) {
  sprite(
    c,
    [
      '.......oo.......',
      '.......ww.......',
      '.......ww.......',
      '......owwo......',
      '......owwo......',
      '.....owwwwo.....',
      '..ooowwwwww ooo..',
      '.owwwwwwwwwwwwo.',
      '..ooooowwooooo..',
      '......owwo......',
      '......owwo......',
      '.....owwwwo.....',
      '.....oooooo.....',
    ],
    { o: colors.ink, w: colors.cream },
    x - 8,
    y - 7,
  );
}
export function vignette(canvas: HTMLCanvasElement, index: number, time = 0) {
  const c = canvas.getContext('2d')!;
  c.imageSmoothingEnabled = false;
  rect(c, 0, 0, 160, 104, colors.grass);
  for (let y = 0; y < 104; y += 8)
    for (let x = 0; x < 160; x += 8)
      if (noise(x, y) < 40) {
        rect(c, x + 2, y + 4, 3, 1, colors.dark);
        rect(c, x + 3, y + 3, 1, 3, colors.dark);
      }
  rect(c, 0, 78, 160, 12, '#dbcea3');
  for (let x = 8; x < 160; x += 18) {
    tree(c, x, 20);
    tree(c, x, 102);
  }
  building(c, index, 80, 77, time);
  person(c, 81, 87, Math.floor(time * 2));
  if (index === 1) car(c, 124, 83);
  sign(c, sites[index]!.label, 80, 11);
}
