// Real Three.js geometry -> low-resolution render target -> ASCII glyphs.
import * as THREE from 'three';
import { AsciiShapeRenderer } from './asciiShapeRenderer';
import { navigateScene, revealJourney, runMotion } from './deskJourney';

type Key = 'smt' | 'edag' | 'quantum' | 'michigan' | 'notes' | 'rust';
const root = document.querySelector<HTMLElement>('#workbench-prototype')!;
const stage = root.querySelector<HTMLElement>('.wb-scene')!;
const output = root.querySelector<HTMLCanvasElement>('.wb-canvas')!;
const dialog = root.querySelector<HTMLDialogElement>('.wb-dialog')!;
const visited = new Set<Key>();
const names: Record<Key, string> = {
  smt: 'SMT',
  edag: 'EDAG',
  quantum: 'Quantum',
  michigan: 'University of Michigan',
  notes: 'Field notes',
  rust: 'Open source',
};
const descriptions: Record<Key, string> = {
  smt: 'FULL-TIME / SPORTS GRAPHICS',
  edag: 'INTERNSHIPS & CO-OPS / AUTOMOTIVE & EMBEDDED',
  quantum: 'FREELANCE / INTERACTIVE 3D',
  michigan: 'EDUCATION / THE DIPLOMA',
  notes: 'WRITING & IDEAS / THE NOTEBOOK',
  rust: 'CONTRIBUTIONS / THE CARTRIDGE',
};
const objectCount = Object.keys(names).length;
const sceneCaption = 'Six stories. Work, experience, and ideas.';
root.querySelector('h1')!.innerHTML =
  'A desk full of <span>possibilities.</span>';
root.querySelector('.wb-intro .wb-eyebrow')!.textContent =
  'RICCARDO@WORKBENCH:~$ EXPLORE';
root.querySelector('.wb-scene-caption>span:first-child')!.textContent =
  '[ THE CODING DESK ]';
root.querySelector('.wb-scene-caption>span:nth-child(2)')!.textContent =
  sceneCaption;
root.querySelector('.wb-discovery')!.textContent =
  `0 / ${objectCount} explored`;
stage.setAttribute(
  'aria-label',
  'Interactive three-dimensional ASCII desk. Drag to look around. W and S or up and down arrows step forward and backward. Left and right arrows turn. Project buttons open stories.',
);
stage.tabIndex = 0;
let enterJournal = () => {
  window.location.assign('/journal/?open=1');
};
function openObject(key: Key) {
  if (key === 'notes') {
    enterJournal();
    return;
  }
  root
    .querySelectorAll<HTMLElement>('[data-panel]')
    .forEach((panel) => (panel.hidden = panel.dataset.panel !== key));
  dialog.style.setProperty(
    '--section-accent',
    root.querySelector<HTMLElement>(`[data-panel="${key}"]`)?.dataset.accent ??
      '#bba3d5',
  );
  root.querySelector('#wb-dialog-title')!.textContent = names[key];
  root.querySelector('[data-dialog-object]')!.textContent = descriptions[key];
  root.querySelector('.wb-dialog-channel')!.textContent =
    key === 'smt' ? 'SMT://PROJECTS' : 'DESK://' + key.toUpperCase();
  visited.add(key);
  root.querySelector<HTMLElement>(`[data-object="${key}"]`)!.dataset.visited =
    'true';
  root.querySelector('.wb-discovery')!.textContent =
    `${visited.size} / ${objectCount} explored`;
  dialog.showModal();
  dialog.scrollTop = 0;
  console.info('ASCII desk state', {
    activeObject: key,
    explored: [...visited],
  });
}
root
  .querySelectorAll<HTMLButtonElement>('[data-object],[data-open]')
  .forEach((button) =>
    button.addEventListener('click', () =>
      openObject((button.dataset.object ?? button.dataset.open) as Key),
    ),
  );
root
  .querySelector('.wb-close')!
  .addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () =>
  console.info('ASCII desk state', {
    activeObject: null,
    explored: [...visited],
  }),
);

function createDesk() {
  const mobileView = window.matchMedia('(max-width: 850px)');
  const renderer = new THREE.WebGLRenderer({
    canvas: output,
    antialias: false,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 70);
  const target = new THREE.Vector3(0.8, 2.7, 0);
  const sceneLight = new THREE.HemisphereLight(0xffffff, 0x222222, 1.2);
  scene.add(sceneLight);
  const light = new THREE.DirectionalLight(0xffffff, 2.8);
  light.position.set(-5, 12, 8);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.left = -9;
  light.shadow.camera.right = 9;
  light.shadow.camera.top = 9;
  light.shadow.camera.bottom = -9;
  light.shadow.normalBias = 0.04;
  scene.add(light);
  const rim = new THREE.DirectionalLight(0xffffff, 1.4);
  rim.position.set(7, 6, -5);
  scene.add(rim);
  const ascii = new AsciiShapeRenderer(renderer);
  const cube = new THREE.BoxGeometry(1, 1, 1);
  const clickable: THREE.Group[] = [];
  const groups = {} as Record<Key, THREE.Group>;
  const anchors = {} as Record<Key, THREE.Vector3>;
  const highlightColors: Record<Key, number> = {
    smt: 0x86d7ee,
    edag: 0x86c8a2,
    quantum: 0xdea28a,
    michigan: 0xffd36c,
    notes: 0xc2a6e6,
    rust: 0x8bb6ff,
  };
  type ColoredMaterial = THREE.MeshBasicMaterial | THREE.MeshStandardMaterial;
  const originalMaterials = new Map<
    ColoredMaterial,
    { color: THREE.Color; emissive?: THREE.Color }
  >();
  function material(color: number, roughness = 0.8) {
    return new THREE.MeshStandardMaterial({ color, roughness });
  }
  function flat(mesh: THREE.Mesh, tone: number) {
    (mesh.material as THREE.Material).dispose();
    mesh.material = new THREE.MeshBasicMaterial({ color: tone });
    return mesh;
  }
  function box(
    parent: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    color: number,
  ) {
    const mesh = new THREE.Mesh(cube, material(color));
    mesh.position.set(x, y, z);
    mesh.scale.set(w, h, d);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function cylinder(
    parent: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    top: number,
    bottom: number,
    h: number,
    color: number,
    segments = 20,
  ) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(top, bottom, h, segments),
      material(color),
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function sphere(
    parent: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    sx: number,
    sy: number,
    sz: number,
    color: number,
  ) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 12, 8),
      material(color),
    );
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function tube(
    parent: THREE.Object3D,
    points: THREE.Vector3[],
    radius: number,
    color: number,
  ) {
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        24,
        radius,
        8,
        false,
      ),
      material(color),
    );
    parent.add(mesh);
    mesh.castShadow = true;
    return mesh;
  }
  function group(key: Key, x: number, y: number, z: number) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.userData.key = key;
    scene.add(g);
    groups[key] = g;
    clickable.push(g);
    return g;
  }
  function register(key: Key, anchor: THREE.Vector3) {
    groups[key].traverse((o) => {
      o.userData.key = key;
      if (o instanceof THREE.Mesh)
        for (const mat of Array.isArray(o.material)
          ? o.material
          : [o.material]) {
          if (
            (mat instanceof THREE.MeshBasicMaterial ||
              mat instanceof THREE.MeshStandardMaterial) &&
            !originalMaterials.has(mat)
          ) {
            originalMaterials.set(mat, {
              color: mat.color.clone(),
              emissive:
                mat instanceof THREE.MeshStandardMaterial
                  ? mat.emissive.clone()
                  : undefined,
            });
          }
        }
    });
    anchors[key] = anchor;
  }
  // A real freestanding desk, with legs, drawers, edge trim, and a modest floor.
  const ground = box(scene, 0, -0.11, 0, 24, 0.16, 16, 0x020402);
  ground.receiveShadow = true;
  ground.visible = false;
  const desktop = flat(
    box(scene, 0, 2.35, 0, 11, 0.26, 4.6, 0xb57c52),
    0xb57c52,
  );
  flat(box(scene, 0, 2.2, 2.26, 11, 0.13, 0.12, 0xdfa46b), 0xdfa46b);
  // Sparse floor marks provide parallax and distance cues without a busy grid.
  for (const z of [-3.5, 3.5, 7])
    flat(box(scene, 0, 0.01, z, 17, 0.015, 0.06, 0x666666), 0x666666);
  for (const x of [-6.5, 6.5])
    flat(box(scene, x, 0.01, 1, 0.06, 0.015, 12, 0x666666), 0x666666);
  for (const x of [-4.7, 4.7])
    for (const z of [-1.6, 1.6])
      box(scene, x, 1.1, z, 0.22, 2.2, 0.22, 0x68788a);
  box(scene, 0, 0.45, -1.65, 9.5, 0.12, 0.15, 0x47513e);
  box(scene, 3.8, 1.9, 0.7, 1.5, 0.55, 2.25, 0x87573c);
  box(scene, 3.8, 1.95, 1.85, 0.45, 0.06, 0.08, 0xaeb291);
  const mat = flat(
    box(scene, -0.2, 2.495, 0.7, 4.6, 0.035, 2.45, 0x152431),
    0x152431,
  );
  mat.receiveShadow = true;
  // SMT monitor: modeled chassis, stand, inset display, vents, and power light.
  const smt = group('smt', 0, 2.5, -1.05);
  flat(box(smt, 0, 0.07, 0, 1.6, 0.13, 0.8, 0x7a9fb9), 0x7a9fb9);
  flat(box(smt, 0, 0.5, -0.1, 0.32, 0.9, 0.2, 0x7a9fb9), 0x7a9fb9);
  flat(box(smt, 0, 1.95, 0, 4.5, 2.65, 0.32, 0x7a9fb9), 0x7a9fb9);
  flat(box(smt, 0, 1.98, 0.174, 4.18, 2.31, 0.055, 0x000000), 0x000000);
  flat(box(smt, 1.9, 0.73, 0.21, 0.09, 0.04, 0.03, 0xffffff), 0xffffff);
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 640;
  screenCanvas.height = 360;
  const s = screenCanvas.getContext('2d')!;
  s.fillStyle = '#102e45';
  s.fillRect(0, 0, 640, 360);
  s.fillStyle = '#8de9ff';
  s.font = 'bold 172px monospace';
  s.textAlign = 'center';
  s.fillText('SMT', 320, 188);
  // One bold trajectory reads at a distance; tiny players and score bugs did not.
  s.strokeStyle = '#69c9eb';
  s.lineWidth = 9;
  s.beginPath();
  s.moveTo(65, 303);
  s.bezierCurveTo(200, 205, 385, 220, 555, 282);
  s.stroke();
  s.fillStyle = '#ffcb79';
  s.beginPath();
  s.arc(555, 282, 13, 0, Math.PI * 2);
  s.fill();
  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.05, 2.2),
    new THREE.MeshBasicMaterial({ map: screenTexture }),
  );
  screenMesh.position.set(0, 1.98, 0.207);
  smt.add(screenMesh);
  register('smt', new THREE.Vector3(0, 6.05, -1.05));
  // Chunky, separated keycaps and a clear spacebar survive the character grid.
  const keyboard = new THREE.Group();
  keyboard.position.set(-0.15, 2.65, 1.35);
  keyboard.rotation.x = 0.12;
  keyboard.scale.setScalar(0.8);
  scene.add(keyboard);
  flat(box(keyboard, 0, 0, 0, 3.85, 0.16, 1.65, 0x8a9daa), 0x8a9daa);
  flat(box(keyboard, 0, 0.09, 0, 3.65, 0.025, 1.46, 0x080d13), 0x080d13);
  // Wide dark gutters and a tilted case keep rows distinct at the default view.
  const keys = new THREE.InstancedMesh(
    cube,
    new THREE.MeshBasicMaterial({ color: 0xd5e7ef }),
    30,
  );
  let index = 0;
  const m = new THREE.Matrix4();
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 10; col++) {
      const x = -1.57 + col * 0.35 + (row === 1 ? 0.035 : 0);
      m.compose(
        new THREE.Vector3(x, 0.15, -0.57 + row * 0.36),
        new THREE.Quaternion(),
        new THREE.Vector3(0.25, 0.08, 0.24),
      );
      keys.setMatrixAt(index, m);
      keys.setColorAt(
        index++,
        new THREE.Color(
          row === 0 && col === 0 ? 0xe6a46d : col === 9 ? 0x79b9cb : 0xd5e7ef,
        ),
      );
    }
  keyboard.add(keys);
  flat(box(keyboard, 0, 0.15, 0.55, 1.55, 0.08, 0.22, 0x7abfd5), 0x7abfd5);
  for (const x of [-1.55, -1.2, 1.2, 1.55])
    flat(box(keyboard, x, 0.15, 0.55, 0.25, 0.08, 0.22, 0x97abb7), 0x97abb7);
  sphere(scene, 2.05, 2.65, 1.35, 0.26, 0.13, 0.4, 0xaab69b);
  box(scene, 2.05, 2.78, 1.25, 0.025, 0.02, 0.16, 0x4c6346);
  // Automotive circuit board, copper traces, connectors, and processor.
  const edag = group('edag', -3.9, 2.55, 0.15);
  edag.rotation.y = 0.08;
  box(edag, 0, 0, 0, 1.85, 0.09, 1.35, 0x238c64);
  box(edag, 0.1, 0.12, 0, 0.6, 0.18, 0.6, 0x182e31);
  for (let i = 0; i < 7; i++) {
    box(edag, -0.6 + i * 0.2, 0.055, 0.5, 0.07, 0.015, 0.4, 0xd2b66e);
    box(edag, -0.65 + i * 0.18, 0.06, -0.4, 0.07, 0.02, 0.2, 0xc0b575);
  }
  for (let i = 0; i < 4; i++) {
    box(edag, -0.7 + i * 0.1, 0.07, -0.15, 0.025, 0.015, 0.5, 0x8fbc75);
    box(edag, 0.5, 0.07, -0.3 + i * 0.16, 0.45, 0.015, 0.025, 0x8fbc75);
  }
  box(edag, -0.72, 0.16, -0.38, 0.28, 0.24, 0.22, 0xaab69b);
  cylinder(edag, 0.62, 0.16, -0.35, 0.1, 0.1, 0.22, 0x9caa84);
  register('edag', new THREE.Vector3(-5.3, 3.05, 0.15));
  // Architectural model with pitched roofs, paths, and tiny trees.
  const quantum = group('quantum', 3.35, 2.6, -0.65);
  quantum.rotation.y = -0.08;
  box(quantum, 0, 0, 0, 2.1, 0.2, 1.85, 0xaba183);
  box(quantum, 0, 0.12, 0, 2.03, 0.04, 1.78, 0x6b8957);
  box(quantum, 0, 0.15, 0, 1.95, 0.025, 0.16, 0xc9c3a0);
  box(quantum, 0.32, 0.15, 0, 0.14, 0.025, 1.7, 0xc9c3a0);
  for (const [x, z] of [[-0.18, -0.15]]) {
    flat(box(quantum, x!, 0.58, z!, 1.15, 0.88, 0.95, 0xe6c4a0), 0xe6c4a0);
    const roof = new THREE.Mesh(
      new THREE.CylinderGeometry(0, 0.94, 0.65, 4),
      new THREE.MeshBasicMaterial({ color: 0xb9654e }),
    );
    roof.position.set(x!, 1.3, z!);
    roof.rotation.y = Math.PI / 4;
    roof.scale.z = 0.95;
    roof.castShadow = true;
    quantum.add(roof);
    flat(
      box(quantum, x!, 0.43, z! + 0.48, 0.24, 0.48, 0.02, 0x000000),
      0x000000,
    );
    flat(
      box(quantum, x! + 0.36, 0.7, z! + 0.48, 0.19, 0.23, 0.02, 0x000000),
      0x000000,
    );
  }
  register('quantum', new THREE.Vector3(3.35, 4.5, -0.65));
  // A framed Michigan diploma, leaning on a small stand behind the board.
  const michigan = group('michigan', -4.05, 3.55, -1.6);
  michigan.rotation.x = -0.08;
  flat(box(michigan, 0, 0, 0, 2.45, 1.95, 0.15, 0xd7af62), 0xd7af62);
  flat(box(michigan, 0, 0, 0.085, 2.2, 1.7, 0.025, 0x14243d), 0x14243d);
  const doc = document.createElement('canvas');
  doc.width = 480;
  doc.height = 360;
  const dc = doc.getContext('2d')!;
  dc.fillStyle = '#f4e6c4';
  dc.fillRect(0, 0, 480, 360);
  dc.fillStyle = '#102849';
  dc.fillRect(18, 18, 444, 227);
  dc.fillStyle = '#ffcb05';
  dc.font = 'bold 224px Georgia,serif';
  dc.textAlign = 'center';
  dc.fillText('M', 240, 213);
  dc.fillStyle = '#13243c';
  dc.font = 'bold 42px monospace';
  dc.fillText('B.S. / CS', 240, 300);
  dc.fillStyle = '#c49735';
  dc.fillRect(110, 322, 260, 7);
  const dt = new THREE.CanvasTexture(doc);
  dt.colorSpace = THREE.SRGBColorSpace;
  const diploma = new THREE.Mesh(
    new THREE.PlaneGeometry(2.12, 1.62),
    new THREE.MeshBasicMaterial({ map: dt }),
  );
  diploma.position.z = 0.105;
  michigan.add(diploma);
  box(michigan, 0, -1.02, -0.12, 1.25, 0.1, 0.65, 0x967344);
  register('michigan', new THREE.Vector3(-4.05, 4.95, -1.6));
  // Notebook and pen.
  const notes = group('notes', 3.6, 2.6, 1.55);
  notes.rotation.y = -0.1;
  box(notes, 0, 0, 0, 1.1, 0.16, 0.7, 0x8263b5);
  box(notes, 0, 0.025, 0.02, 1.02, 0.08, 0.62, 0xe4d9c7);
  box(notes, 0, 0.09, 0, 1.1, 0.035, 0.7, 0x8263b5);
  box(notes, -0.42, 0.12, 0, 0.045, 0.02, 0.71, 0x3e315e);
  box(notes, 0.1, 0.115, 0, 0.57, 0.015, 0.38, 0xc4afde);
  tube(
    notes,
    [new THREE.Vector3(0.67, 0.1, -0.3), new THREE.Vector3(0.67, 0.1, 0.4)],
    0.033,
    0x7f9c75,
  );
  register('notes', new THREE.Vector3(3.6, 2.55, 2.38));
  const rust = group('rust', -4.6, 2.72, 1.75);
  rust.rotation.y = 0.15;
  flat(box(rust, 0, 0, 0, 0.55, 0.42, 0.17, 0x467ee8), 0x467ee8);
  flat(box(rust, 0, 0.02, 0.09, 0.38, 0.24, 0.015, 0xe1edff), 0xe1edff);
  flat(box(rust, 0, 0.02, 0.105, 0.11, 0.13, 0.015, 0x183365), 0x183365);
  for (let i = 0; i < 4; i++)
    flat(
      box(rust, -0.15 + i * 0.1, -0.17, 0.09, 0.04, 0.08, 0.02, 0xb7c9ed),
      0xb7c9ed,
    );
  register('rust', new THREE.Vector3(-4.65, 2.05, 2.5));
  // Airflow tower: one glass side, metal front/rear/top, front intake and top exhaust.
  // Layout reference: Corsair 5000D AIRFLOW; this is an original simplified model.
  // Decorative computer: visible in the scene, without a project hotspot.
  const computer = new THREE.Group();
  computer.position.set(7.25, 1.85, 0.25);
  scene.add(computer);
  computer.rotation.y = -0.85;
  flat(box(computer, 0, 0, -0.79, 2.25, 3.3, 0.12, 0x182430), 0x182430);
  for (const y of [-1.65, 1.65])
    flat(box(computer, 0, y, 0, 2.4, 0.14, 1.8, 0x596a79), 0x596a79);
  for (const x of [-1.13, 1.13])
    for (const z of [-0.8, 0.8])
      flat(box(computer, x, 0, z, 0.08, 3.25, 0.08, 0x9ba9b8), 0x9ba9b8);
  flat(box(computer, -1.16, 0, 0, 0.1, 3.2, 1.6, 0x354452), 0x354452);
  flat(box(computer, 1.18, 0, 0, 0.12, 3.25, 1.65, 0x1b2731), 0x1b2731);
  flat(box(computer, 0, -1.27, 0, 2.24, 0.56, 1.58, 0x415160), 0x415160);
  // Motherboard, CPU block, a broad graphics card, and four lit RAM bars.
  flat(box(computer, 0.22, 0.35, -0.62, 1.55, 2, 0.08, 0x233344), 0x233344);
  flat(box(computer, -0.12, 0.5, -0.48, 0.55, 0.55, 0.18, 0x708190), 0x708190);
  for (let i = 0; i < 4; i++) {
    flat(
      box(computer, 0.32 + i * 0.18, 0.62, -0.39, 0.11, 0.94, 0.12, 0x6e1624),
      0x6e1624,
    );
    flat(
      box(computer, 0.32 + i * 0.18, 0.62, -0.31, 0.07, 0.85, 0.04, 0xff2445),
      0xff2445,
    );
  }
  flat(box(computer, 0.1, -0.35, -0.12, 1.65, 0.3, 0.63, 0x51606e), 0x51606e);
  flat(box(computer, 0.1, -0.29, 0.21, 1.48, 0.045, 0.02, 0xb6c8d6), 0xb6c8d6);
  function pcFan(x: number, y: number, z: number, radius: number, top = false) {
    const mount = new THREE.Group();
    mount.position.set(x, y, z);
    if (top) mount.rotation.x = -Math.PI / 2;
    else mount.rotation.y = Math.PI / 2;
    computer.add(mount);
    flat(
      box(mount, 0, 0, -0.035, radius * 2.35, radius * 2.35, 0.06, 0x0b141d),
      0x0b141d,
    );
    const fan = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.055, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );
    mount.add(fan);
    for (let i = 0; i < 3; i++) {
      const blade = flat(
        box(mount, 0, 0, 0.012, 0.075, radius * 1.5, 0.025, 0x9daab5),
        0x9daab5,
      );
      blade.rotation.z = (i * Math.PI) / 3;
    }
    const hub = new THREE.Mesh(
      new THREE.CircleGeometry(0.08, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );
    hub.position.z = 0.04;
    mount.add(hub);
  }
  // Three fans share the front plane. Two exhaust fans sit in the roof plane.
  for (const y of [0.85, -0.12, -1.09]) pcFan(1.27, y, 0, 0.36);
  for (const x of [-0.55, 0.5]) pcFan(x, 1.74, 0, 0.36, true);
  // Front bezel and sparse grille rails keep the fan face visibly mechanical.
  for (const z of [-0.72, 0.72])
    flat(box(computer, 1.3, 0, z, 0.08, 3.24, 0.14, 0x71818e), 0x71818e);
  flat(box(computer, 1.3, 1.44, 0, 0.08, 0.35, 1.42, 0x82929e), 0x82929e);
  for (const z of [-0.46, 0.46])
    flat(box(computer, 1.34, -0.12, z, 0.035, 2.85, 0.025, 0x526473), 0x526473);
  // Power button, USB ports, and reset button on the solid I/O strip.
  const power = new THREE.Mesh(
    new THREE.CircleGeometry(0.095, 20),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
  );
  power.rotation.y = Math.PI / 2;
  power.position.set(1.35, 1.45, 0.46);
  computer.add(power);
  for (const z of [0.1, -0.22])
    flat(box(computer, 1.35, 1.45, z, 0.025, 0.1, 0.2, 0x071018), 0x071018);
  flat(
    box(computer, 1.35, 1.45, -0.5, 0.025, 0.075, 0.075, 0x182631),
    0x182631,
  );
  const glass = new THREE.MeshBasicMaterial({
    color: 0x88b3d1,
    transparent: true,
    opacity: 0.055,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const sideGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.48), glass);
  sideGlass.position.set(0, 0.27, 0.84);
  computer.add(sideGlass);
  // Hinges at the rear edge, a latch at the front, and a gasket around the window.
  for (const y of [-0.96, 1.51])
    flat(box(computer, 0, y, 0.865, 2.17, 0.055, 0.035, 0x9ba9b8), 0x9ba9b8);
  for (const y of [-0.65, 1.2])
    flat(box(computer, -1.1, y, 0.9, 0.16, 0.28, 0.12, 0xaab4bb), 0xaab4bb);
  flat(box(computer, 1.04, 0.23, 0.9, 0.075, 0.32, 0.09, 0xaab4bb), 0xaab4bb);
  for (const x of [-1, 1])
    for (const y of [-0.88, 1.43]) {
      const screw = new THREE.Mesh(
        new THREE.CircleGeometry(0.035, 8),
        new THREE.MeshBasicMaterial({ color: 0xd2d9dd }),
      );
      screw.position.set(x, y, 0.9);
      computer.add(screw);
    }
  for (const x of [-0.87, 0.87])
    box(computer, x, -1.77, 0, 0.24, 0.15, 1.4, 0x59616b);

  // Desk lamp, coffee, floor plant, and visible cables complete the coding workspace.
  cylinder(scene, 4.85, 2.55, -1.5, 0.29, 0.34, 0.14, 0xb3b496);
  tube(
    scene,
    [
      new THREE.Vector3(4.85, 2.6, -1.5),
      new THREE.Vector3(4.85, 4.15, -1.5),
      new THREE.Vector3(4.6, 5.1, -1.5),
    ],
    0.07,
    0xc2c5a3,
  );
  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.38, 0.5, 24, 1, true),
    material(0xbac5a0),
  );
  shade.position.set(4.6, 5, -1.5);
  shade.rotation.z = -0.25;
  scene.add(shade);
  const lamp = new THREE.PointLight(0xddd9a4, 7, 5, 2);
  lamp.position.set(4.6, 4.7, -1.5);
  scene.add(lamp);
  const mug = new THREE.Group();
  mug.position.set(-2.55, 2.5, 1.65);
  scene.add(mug);
  flat(cylinder(mug, 0, 0.025, 0, 0.38, 0.38, 0.05, 0x35434d), 0x35434d);
  flat(cylinder(mug, 0, 0.34, 0, 0.28, 0.24, 0.62, 0xe5dac4), 0xe5dac4);
  flat(cylinder(mug, 0, 0.655, 0, 0.22, 0.22, 0.012, 0x302015), 0x302015);
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.21, 0.065, 8, 24),
    material(0xe5dac4),
  );
  handle.position.set(-0.3, 0.36, 0);
  mug.add(handle);
  if (import.meta.env.DEV) {
    scene.updateMatrixWorld(true);
    const keyboardBounds = new THREE.Box3().setFromObject(keyboard);
    const mugBounds = new THREE.Box3().setFromObject(mug);
    const pcBounds = new THREE.Box3().setFromObject(computer);
    const deskBounds = new THREE.Box3().setFromObject(desktop);
    console.info(
      'ASCII desk layout review',
      JSON.stringify({
        cupIntersectsKeyboard: mugBounds.intersectsBox(keyboardBounds),
        pcIntersectsDesk: pcBounds.intersectsBox(deskBounds),
        cupKeyboardGap: Number(
          (keyboardBounds.min.x - mugBounds.max.x).toFixed(2),
        ),
        pcDeskGap: Number((pcBounds.min.x - deskBounds.max.x).toFixed(2)),
      }),
    );
  }
  cylinder(scene, -5.75, 0.34, -0.55, 0.4, 0.3, 0.7, 0x8c7854);
  for (let i = 0; i < 7; i++) {
    const a = i * 2.4;
    const x = -5.75 + Math.sin(a) * 0.35,
      z = -0.55 + Math.cos(a) * 0.3;
    const y = 1.2 + (i % 3) * 0.33;
    tube(
      scene,
      [new THREE.Vector3(-5.75, 0.5, -0.55), new THREE.Vector3(x, y, z)],
      0.025,
      0x6b7e4c,
    );
    const leaf = sphere(scene, x, y, z, 0.25, 0.5, 0.08, 0x7b995c);
    leaf.rotation.z = Math.sin(a) * 0.7;
    leaf.rotation.y = a;
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let width = 1,
    height = 1,
    large = false,
    theta = 0.12,
    elevation = 0.43,
    pending = false;
  let distance = 0,
    desiredDistance = 0,
    lastFrame = 0;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function walk(amount: number) {
    desiredDistance = THREE.MathUtils.clamp(
      desiredDistance + amount,
      -1.5,
      2.5,
    );
    if (reducedMotion.matches) distance = desiredDistance;
    requestPaint();
  }
  let hover: Key | null = null;
  let journey =
    new URLSearchParams(location.search).get('from') === 'journal' ? 1 : 0;
  let traveling = false;
  if (journey) {
    try {
      const pose = JSON.parse(
        sessionStorage.getItem('desk-return-pose') || 'null',
      );
      if (
        pose &&
        [pose.theta, pose.elevation, pose.distance].every(Number.isFinite)
      ) {
        theta = THREE.MathUtils.clamp(pose.theta, -0.9, 0.9);
        elevation = THREE.MathUtils.clamp(pose.elevation, 0.25, 1.1);
        distance = desiredDistance = THREE.MathUtils.clamp(
          pose.distance,
          -1.5,
          2.5,
        );
      }
    } catch {
      /* Use the normal desk view if storage is unavailable. */
    }
  }
  const journalEye = new THREE.Vector3(3.6, 5.7, 4.0);
  const journalFocus = new THREE.Vector3(3.6, 2.7, 1.55);
  const viewFocus = new THREE.Vector3();
  function cameraUpdate() {
    const aspect = width / height;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    // The compact desk needs a clearer view of the top and side surfaces.
    // Keep the stored orbit pose and all desktop camera values unchanged.
    const viewTheta = theta + (mobileView.matches ? 0.18 : 0);
    const viewElevation = elevation + (mobileView.matches ? 0.09 : 0);
    const radius = Math.max(16.1, (mobileView.matches ? 24.5 : (width < 800 ? 25 : 21)) / aspect);
    const horizontal = Math.cos(viewElevation) * radius - distance;
    camera.position.set(
      target.x + Math.sin(viewTheta) * horizontal,
      target.y + Math.sin(viewElevation) * radius,
      Math.cos(viewTheta) * horizontal,
    );
    camera.position.lerp(journalEye, journey);
    viewFocus
      .set(
        target.x - Math.sin(viewTheta) * distance,
        target.y,
        target.z - Math.cos(viewTheta) * distance,
      )
      .lerp(journalFocus, journey);
    camera.lookAt(viewFocus);
    camera.updateMatrixWorld();
  }
  function paint(now: number) {
    pending = false;
    if (document.hidden) return;
    const dt = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    distance = THREE.MathUtils.lerp(
      distance,
      desiredDistance,
      1 - Math.exp(-12 * dt),
    );
    if (Math.abs(distance - desiredDistance) < 0.002)
      distance = desiredDistance;
    cameraUpdate();
    ascii.render(scene, camera);
    const placed: { x: number; y: number; w: number; h: number }[] = [];
    for (const key of Object.keys(anchors) as Key[]) {
      const v = anchors[key].clone().project(camera);
      const button = root.querySelector<HTMLElement>(`[data-object="${key}"]`)!;
      const w = button.offsetWidth,
        h = button.offsetHeight;
      const x = Math.max(
        w / 2 + 5,
        Math.min(width - w / 2 - 5, (v.x * 0.5 + 0.5) * width),
      );
      let y = Math.max(80, Math.min(height - 25, (-v.y * 0.5 + 0.5) * height));
      for (let pass = 0; pass < 6; pass++)
        for (const p of placed)
          if (
            Math.abs(x - p.x) < (w + p.w) / 2 + 5 &&
            Math.abs(y - p.y) < (h + p.h) / 2 + 5
          )
            y = p.y + (p.h + h) / 2 + 7;
      button.style.left = `${x}px`;
      button.style.top = `${Math.min(height - 20, y)}px`;
      placed.push({ x, y, w, h });
    }
    root.querySelector<HTMLElement>('.ascii-loading')!.hidden = true;
    root.classList.add('ascii-ready');
    if (distance !== desiredDistance) requestPaint();
  }
  function requestPaint() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(paint);
    }
  }
  function resize() {
    dragging = false;
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    ascii.resize(width, height, large, mobileView.matches);
    requestPaint();
  }
  function hit(event: PointerEvent) {
    const rect = output.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      (-(event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(clickable, true)[0];
    return hit ? (hit.object.userData.key as Key) : null;
  }
  function highlight(key: Key | null) {
    if (key === hover) return;
    hover = key;
    // Restore from immutable base colors each time, including flat and textured
    // materials. The old emissive-only path skipped every MeshBasicMaterial.
    for (const id of Object.keys(groups) as Key[]) {
      const accent = new THREE.Color(highlightColors[id]);
      groups[id].traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        for (const mat of Array.isArray(object.material)
          ? object.material
          : [object.material]) {
          const base = originalMaterials.get(mat);
          if (!base) continue;
          mat.color.copy(base.color);
          if (id === key) mat.color.multiplyScalar(1.7).lerp(accent, 0.12);
          if (mat instanceof THREE.MeshStandardMaterial && base.emissive) {
            mat.emissive.copy(base.emissive);
            if (id === key)
              mat.emissive.add(accent.clone().multiplyScalar(0.06));
          }
        }
      });
    }
    root
      .querySelectorAll<HTMLElement>('[data-object],[data-open]')
      .forEach((button) => {
        button.dataset.highlighted = String(
          (button.dataset.object ?? button.dataset.open) === key,
        );
      });
    output.style.cursor = key ? 'pointer' : 'grab';
    root.querySelector('.wb-scene-caption>span:nth-child(2)')!.textContent = key
      ? `${names[key]} / select to explore`
      : sceneCaption;
    requestPaint();
  }
  let dragging = false,
    moved = false,
    downX = 0,
    downY = 0,
    startTheta = theta,
    startElevation = elevation;
  output.addEventListener('pointerdown', (e) => {
    stage.focus({ preventScroll: true });
    dragging = true;
    moved = false;
    downX = e.clientX;
    downY = e.clientY;
    startTheta = theta;
    startElevation = elevation;
    output.setPointerCapture(e.pointerId);
  });
  output.addEventListener('pointermove', (e) => {
    if (dragging && e.buttons === 0) dragging = false;
    if (dragging) {
      const dx = e.clientX - downX,
        dy = e.clientY - downY;
      if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
      if (moved) {
        theta = THREE.MathUtils.clamp(startTheta - dx * 0.004, -0.9, 0.9);
        elevation = THREE.MathUtils.clamp(
          startElevation + dy * 0.003,
          0.25,
          1.1,
        );
        highlight(null);
        requestPaint();
      }
    } else highlight(hit(e));
  });
  output.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    if (output.hasPointerCapture(e.pointerId))
      output.releasePointerCapture(e.pointerId);
    if (!moved) {
      const key = hit(e);
      if (key) openObject(key);
    }
    console.info('ASCII desk camera', { azimuth: theta, elevation });
  });
  output.addEventListener('pointercancel', () => {
    dragging = false;
  });
  output.addEventListener('pointerleave', () => {
    if (!dragging) highlight(null);
  });
  stage.addEventListener('keydown', (event) => {
    if (event.target !== stage || dialog.open) return;
    const key = event.key.toLowerCase();
    if (['w', 's', 'arrowup', 'arrowdown'].includes(key)) {
      event.preventDefault();
      walk(key === 'w' || key === 'arrowup' ? 0.5 : -0.5);
    } else if (key === 'arrowleft' || key === 'arrowright') {
      event.preventDefault();
      theta = THREE.MathUtils.clamp(
        theta + (key === 'arrowleft' ? -0.08 : 0.08),
        -0.9,
        0.9,
      );
      requestPaint();
    }
  });
  root.querySelector('[data-ascii-reset]')!.addEventListener('click', () => {
    dragging = false;
    theta = 0.12;
    elevation = 0.43;
    desiredDistance = 0;
    walk(0);
    requestPaint();
  });
  root
    .querySelector<HTMLButtonElement>('[data-ascii-density]')!
    .addEventListener('click', (event) => {
      large = !large;
      const button = event.currentTarget as HTMLButtonElement;
      button.setAttribute('aria-pressed', String(large));
      button.textContent = large ? 'Finer characters' : 'Larger characters';
      resize();
    });
  root
    .querySelectorAll<HTMLElement>('[data-object],[data-open]')
    .forEach((button) => {
      const key = (button.dataset.object ?? button.dataset.open) as Key;
      button.addEventListener('pointerenter', () => highlight(key));
      button.addEventListener('pointerleave', () => highlight(null));
      button.addEventListener('focus', () => highlight(key));
      button.addEventListener('blur', () => highlight(null));
    });
  new ResizeObserver(resize).observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) requestPaint();
  });
  enterJournal = async () => {
    if (traveling) return;
    traveling = true;
    root.inert = true;
    try {
      sessionStorage.setItem(
        'desk-return-pose',
        JSON.stringify({ theta, elevation, distance }),
      );
    } catch {}
    highlight(null);
    document.body.classList.add('journey-moving');
    const startScroll = window.scrollY;
    const sceneBounds = stage.getBoundingClientRect();
    const endScroll = Math.max(
      0,
      startScroll +
        sceneBounds.top +
        sceneBounds.height / 2 -
        window.innerHeight / 2,
    );
    await runMotion(1100, (t) => {
      window.scrollTo({
        top: THREE.MathUtils.lerp(startScroll, endScroll, t),
        behavior: 'instant',
      });
      journey = t;
      paint(performance.now());
    });
    navigateScene('/journal/?open=1&from=desk', output);
  };
  root
    .querySelectorAll<HTMLAnchorElement>('a[href="/journal/"]')
    .forEach((link) =>
      link.addEventListener('click', (event) => {
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        )
          return;
        event.preventDefault();
        enterJournal();
      }),
    );
  async function returnToDesk() {
    traveling = true;
    root.inert = true;
    document.body.classList.add('journey-moving');
    revealJourney();
    await runMotion(1100, (t) => {
      journey = 1 - t;
      paint(performance.now());
    });
    document.body.classList.remove('journey-moving');
    traveling = false;
    root.inert = false;
    root
      .querySelector<HTMLButtonElement>('[data-object="notes"]')
      ?.focus({ preventScroll: true });
  }
  resize();
  if (journey) requestAnimationFrame(returnToDesk);
  else requestAnimationFrame(revealJourney);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      journey = 1;
      returnToDesk();
    }
  });
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) return;
    ascii.dispose();
    renderer.dispose();
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => m.dispose());
      }
    });
    screenTexture.dispose();
    dt.dispose();
  });
}
try {
  createDesk();
} catch (error) {
  root.querySelector('.ascii-loading')!.textContent =
    '3D rendering is unavailable here. Explore the projects using the links below.';
  root.querySelector<HTMLElement>('.wb-object-layer')!.hidden = true;
  console.error('ASCII desk rendering unavailable', error);
}
