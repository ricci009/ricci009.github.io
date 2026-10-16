import {
  W,
  H,
  T,
  sites,
  airports,
  trees,
  terrain,
  colors,
  blocked,
  pathfind,
  drawTerrain,
  tree,
  building,
  person,
  plane,
  sign,
  text,
  rect,
  vignette,
  type Point,
} from './careerGameArt';

export function createCareerGame(
  root: HTMLElement,
  onEnter: (id: string) => void,
) {
  const canvas = root.querySelector<HTMLCanvasElement>('#career-game')!,
    c = canvas.getContext('2d')!;
  const terrainCanvas = document.createElement('canvas');
  terrainCanvas.width = W;
  terrainCanvas.height = H;
  drawTerrain(terrainCanvas.getContext('2d')!);
  const scene = root.querySelector<HTMLCanvasElement>(
    '[data-world-detail-art]',
  )!;
  let player: Point = { x: 20, y: 16 },
    route: Point[] = [],
    arrival: (() => void) | undefined,
    face = 'down',
    step = 0,
    time = 0,
    last = 0,
    lastStep = 0,
    selected = 0,
    zoom = matchMedia('(max-width: 650px)').matches ? 2 : 1;
  let flight: {
    from: Point;
    to: Point;
    elapsed: number;
    done: () => void;
  } | null = null;
  let view = { x: 0, y: 0 },
    held: string | null = null;
  const status = root.querySelector<HTMLElement>('[data-game-status]')!;
  const coordinates = root.querySelector<HTMLElement>('[data-game-region]')!;
  const isPaused = () => root.classList.contains('motion-paused');
  const isDialog = () =>
    root.querySelector<HTMLDialogElement>('.career-dialog')!.open;
  const tell = (s: string) => {
    status.textContent = s;
  };
  function locate(id: string) {
    const i = sites.findIndex((s) => s.id === id);
    if (i < 0) return;
    selected = i;
    player = { x: sites[i]!.x, y: sites[i]!.y + 1 };
    route = [];
    arrival = undefined;
    flight = null;
    canvas.dataset.playerX = String(player.x);
    canvas.dataset.playerY = String(player.y);
  }
  function fly(to: Point, done: () => void) {
    route = [];
    arrival = undefined;
    if (isPaused()) {
      player = { ...to };
      done();
      return;
    }
    flight = { from: { ...player }, to, elapsed: 0, done };
    tell('Boarding! Next stop: ' + (to.x > 35 ? 'Germany.' : 'Michigan.'));
  }
  function go(index: number) {
    const s = sites[index]!;
    selected = index;
    const target = { x: s.x, y: s.y + 1 };
    const done = () => {
      tell('Welcome to ' + s.label + '.');
      onEnter(s.id);
    };
    if (isPaused()) {
      player = target;
      done();
      return;
    }
    if (player.x < 35 !== s.x < 35) {
      fly(target, done);
      return;
    }
    route = pathfind(player, target);
    if (!route.length) {
      if (player.x === target.x && player.y === target.y) done();
      else
        tell(
          'That entrance is across the water. Use the airfield or the journey below.',
        );
      return;
    }
    arrival = done;
    tell('Walking to ' + s.label + '…');
    canvas.focus({ preventScroll: true });
  }
  function move(dx: number, dy: number) {
    if (flight || isDialog()) return;
    route = [];
    arrival = undefined;
    face = dx < 0 ? 'left' : dx > 0 ? 'right' : dy < 0 ? 'up' : 'down';
    const p = { x: player.x + dx, y: player.y + dy };
    if (!blocked(p)) {
      player = p;
      step++;
      tell('Find a doorway. Press E or A to enter.');
    } else tell('Water, trees, and walls block the way. Try a clear tile.');
  }
  function interact() {
    if (flight || isDialog()) return;
    const i = sites.findIndex(
      (s) => Math.abs(s.x - player.x) + Math.abs(s.y + 1 - player.y) <= 3,
    );
    if (i >= 0) {
      selected = i;
      onEnter(sites[i]!.id);
      return;
    }
    const a = airports.findIndex(
      (p) => Math.abs(p.x - player.x) + Math.abs(p.y - player.y) <= 3,
    );
    if (a >= 0) {
      fly(airports[1 - a]!, () =>
        tell('Landed. Walk to a doorway to discover the work.'),
      );
      return;
    }
    tell('Walk up to a doorway, or click a building to go there.');
  }
  canvas.addEventListener('click', (event) => {
    if (flight || isDialog()) return;
    const box = canvas.getBoundingClientRect();
    const x = (((event.clientX - box.left) / box.width) * W) / zoom + view.x,
      y = (((event.clientY - box.top) / box.height) * H) / zoom + view.y;
    const index = sites.findIndex(
      (s) => Math.abs(x - s.x * T) < 29 && y > s.y * T - 60 && y < s.y * T + 14,
    );
    if (index >= 0) {
      go(index);
      return;
    }
    const p = { x: Math.floor(x / T), y: Math.floor(y / T) };
    route = pathfind(player, p);
    arrival = undefined;
    tell(route.length ? 'On my way.' : 'Choose a clear patch of land.');
    canvas.focus({ preventScroll: true });
  });
  const dirs: Record<string, number[]> = {
    arrowup: [0, -1],
    w: [0, -1],
    arrowdown: [0, 1],
    s: [0, 1],
    arrowleft: [-1, 0],
    a: [-1, 0],
    arrowright: [1, 0],
    d: [1, 0],
  };
  canvas.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (dirs[key]) {
      e.preventDefault();
      if (!e.repeat) {
        held = key;
        move(dirs[key]![0]!, dirs[key]![1]!);
        lastStep = performance.now();
      }
    } else if (key === 'e' || key === 'enter' || key === ' ') {
      e.preventDefault();
      interact();
    }
  });
  window.addEventListener('keyup', () => (held = null));
  canvas.addEventListener('blur', () => (held = null));
  root.querySelectorAll<HTMLButtonElement>('[data-game-move]').forEach((b) =>
    b.addEventListener('click', () => {
      const d = dirs[b.dataset.gameMove!]!;
      move(d[0]!, d[1]!);
    }),
  );
  root.querySelector('[data-game-enter]')!.addEventListener('click', interact);
  root.querySelector('[data-game-home]')!.addEventListener('click', () => {
    zoom = 1;
    root.querySelector('[data-game-zoom]')!.textContent = 'Zoom in +';
    tell('World view. Click a building to travel there.');
  });
  root.querySelector('[data-game-zoom]')!.addEventListener('click', () => {
    zoom = zoom === 1 ? 2 : 1;
    root.querySelector('[data-game-zoom]')!.textContent =
      zoom === 1 ? 'Zoom in +' : 'World view −';
  });
  function draw(now: number) {
    requestAnimationFrame(draw);
    if (document.hidden) {
      last = now;
      return;
    }
    if (now - last < 50) return;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (!isPaused()) time += dt;
    if (held && now - lastStep > 100 && !isDialog()) {
      const d = dirs[held]!;
      move(d[0]!, d[1]!);
      lastStep = now;
    }
    if (route.length && now - lastStep > 65 && !isDialog()) {
      const next = route.shift()!;
      face =
        next.x < player.x
          ? 'left'
          : next.x > player.x
            ? 'right'
            : next.y < player.y
              ? 'up'
              : 'down';
      player = next;
      step++;
      lastStep = now;
      if (!route.length && arrival) {
        const done = arrival;
        arrival = undefined;
        done();
      }
    }
    if (flight && !isDialog()) {
      flight.elapsed += dt;
      const f = flight;
      if (f.elapsed > 1.7 || isPaused()) {
        player = { ...f.to };
        flight = null;
        f.done();
      }
    }
    canvas.dataset.playerX = String(player.x);
    canvas.dataset.playerY = String(player.y);
    canvas.dataset.travel = flight
      ? 'flying'
      : route.length
        ? 'walking'
        : 'idle';
    coordinates.textContent =
      player.x > 35
        ? 'GERMANY / INGOLSTADT'
        : player.y > 20
          ? 'NORTH CAROLINA / DURHAM'
          : 'MICHIGAN / ANN ARBOR';
    const scale = flight ? 1 : zoom;
    view = {
      x: Math.max(0, Math.min(W - W / scale, player.x * T - W / scale / 2)),
      y: Math.max(0, Math.min(H - H / scale, player.y * T - H / scale / 2)),
    };
    c.imageSmoothingEnabled = false;
    c.save();
    c.scale(scale, scale);
    c.translate(-Math.round(view.x), -Math.round(view.y));
    c.drawImage(terrainCanvas, 0, 0);
    if (!isPaused()) {
      for (let i = 0; i < 30; i++) {
        const x = (i * 97 + 13) % W,
          y = (i * 59 + 8) % H;
        if (terrain[Math.floor(y / T)]?.[Math.floor(x / T)] === 'w') {
          rect(
            c,
            x,
            y + (Math.floor(time) % 2),
            4,
            1,
            Math.floor(time * 2 + i) % 3 ? '#659fb2' : '#9fc8c0',
          );
        }
      }
    }
    const items: [number, () => void][] = trees.map((p) => [
      p.y * T,
      () => tree(c, p.x * T + 4, p.y * T + 5, p.x % 3 === 0 ? 1 : 0),
    ]);
    sites.forEach((s, i) =>
      items.push([s.y * T, () => building(c, i, s.x * T, s.y * T, time)]),
    );
    items.push([
      player.y * T + 4,
      () => {
        if (!flight) {
          rect(c, player.x * T, player.y * T + 4, 8, 2, '#759864');
          person(c, player.x * T + 4, player.y * T + 5, step, face);
        }
      },
    ]);
    items.push([
      143,
      () =>
        person(
          c,
          151 + Math.floor(Math.sin(time * 0.5) * 8),
          143,
          Math.floor(time * 2),
          'down',
          true,
        ),
    ]);
    items.sort((a, b) => a[0] - b[0]).forEach(([, fn]) => fn());
    sites.forEach((s, i) => {
      sign(c, s.label, s.x * T, s.y * T - 62, i === selected);
      if (Math.abs(s.x - player.x) + Math.abs(s.y + 1 - player.y) <= 3) {
        rect(c, s.x * T + 10, s.y * T - 8, 12, 10, colors.cream);
        text(c, 'E', s.x * T + 14, s.y * T - 5);
      }
    });
    airports.forEach((a) => sign(c, 'FLY', a.x * T, a.y * T + 10));
    if (flight) {
      const q = Math.min(1, flight.elapsed / 1.7),
        a = flight.from,
        b = flight.to;
      for (let i = 0; i < 20 * q; i++) {
        const r = i / 20;
        rect(
          c,
          (a.x + (b.x - a.x) * r) * T,
          (a.y + (b.y - a.y) * r) * T - Math.sin(r * Math.PI) * 45,
          2,
          2,
          colors.cream,
        );
      }
      plane(
        c,
        (a.x + (b.x - a.x) * q) * T,
        (a.y + (b.y - a.y) * q) * T - Math.sin(q * Math.PI) * 45,
      );
    }
    c.restore();
    if (isDialog()) {
      const i = sites.findIndex(
        (s) =>
          s.id ===
          root.querySelector<HTMLDialogElement>('.career-dialog')!.dataset
            .destination,
      );
      vignette(scene, Math.max(0, i), time);
    }
  }
  requestAnimationFrame(draw);
  root.querySelector('[data-game-zoom]')!.textContent =
    zoom === 1 ? 'Zoom in +' : 'World view −';
  tell('You’re in Michigan. Walk with WASD / arrows, or click a building.');
  return { locate, go };
}
