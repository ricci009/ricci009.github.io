import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import * as Three from 'three';

// Drive the real scene with a deterministic clock. Only rendering and DOM are
// replaced; all book geometry, transforms, and animation callbacks are real.
function harness(t, { mobile = false, reduced = false } = {}) {
  class Element {
    children = [];
    style = {};
    dataset = {};
    clientWidth = 1200;
    clientHeight = 650;
    classList = { add() {}, remove() {} };
    append(...nodes) {
      this.children.push(...nodes);
    }
    prepend(...nodes) {
      this.children.unshift(...nodes);
    }
    replaceChildren(...nodes) {
      this.children = nodes;
    }
    setAttribute() {}
    addEventListener() {}
    remove() {}
    querySelector() {
      return new Element();
    }
    cloneNode() {
      return new Element();
    }
    contains() {
      return false;
    }
    focus() {}
  }
  let now = 0,
    scene,
    labels;
  const queued = new Map();
  let nextId = 0;
  const originals = new Map();
  function global(name, value) {
    originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, value });
  }
  global('document', { createElement: () => new Element() });
  global('matchMedia', (query) => ({
    matches: query.includes('max-width') ? mobile : reduced,
  }));
  global(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
  global('requestAnimationFrame', (cb) => {
    queued.set(++nextId, cb);
    return nextId;
  });
  global('cancelAnimationFrame', (id) => queued.delete(id));
  t.mock.method(performance, 'now', () => now);
  t.after(() => {
    for (const [name, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  });
  class CSSObject extends Three.Object3D {
    constructor(element) {
      super();
      this.element = element;
    }
  }
  class CSSRenderer {
    domElement = new Element();
    setSize() {}
    render(value) {
      labels = value;
      labels.updateMatrixWorld(true);
    }
  }
  class AsciiRenderer {
    resize() {}
    dispose() {}
    render(value) {
      scene = value;
      scene.updateMatrixWorld(true);
    }
  }
  const THREE = {
    ...Three,
    WebGLRenderer: class {
      shadowMap = {};
      setClearColor() {}
      dispose() {}
    },
  };
  let source = readFileSync(
    new URL('../src/scripts/asciiJournalScene.ts', import.meta.url),
    'utf8',
  );
  source = source
    .replace(/import[\s\S]*?from ['"][^'"]+['"];\s*/g, '')
    .replace('export function', 'function');
  const js = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const create = new Function(
    'THREE',
    'CSS3DObject',
    'CSS3DRenderer',
    'AsciiShapeRenderer',
    'revealJourney',
    'runMotion',
    js + '\nreturn createAsciiJournal;',
  )(
    THREE,
    CSSObject,
    CSSRenderer,
    AsciiRenderer,
    () => {},
    async (_, frame) => frame(1),
  );
  const book = create(new Element(), () => {});
  const frame = (time) => {
    now = time;
    const callbacks = [...queued.values()];
    queued.clear();
    callbacks.forEach((cb) => cb(now));
  };
  frame(0);
  return {
    book,
    frame,
    Element,
    get scene() {
      return scene;
    },
    get labels() {
      return labels;
    },
  };
}

test('opening and closing never materialize a full paper block midway through the hinge rotation', (t) => {
  const h = harness(t);
  const paperArea = () => {
    let total = 0;
    h.scene.traverseVisible((o) => {
      if (o.isMesh && o.material.color.getHex() === 0xe4d9c7)
        total += o.scale.x * o.scale.z;
    });
    return total;
  };
  h.book.open();
  let last = paperArea();
  for (let time = 16; time <= 1504; time += 16) {
    h.frame(time);
    const area = paperArea();
    assert.ok(
      Math.abs(area - last) < 1,
      `Paper popped into view at ${time}ms: ${last} → ${area}`,
    );
    last = area;
  }
  h.book.close();
  for (let time = 1520; time <= 2752; time += 16) {
    h.frame(time);
    const area = paperArea();
    assert.ok(Math.abs(area - last) < 1, `Paper vanished at ${time}ms`);
    last = area;
  }
  h.book.dispose();
});

test('page contents commit after the turning sheet lands, not halfway across the spine', (t) => {
  const h = harness(t);
  h.book.open();
  h.frame(1500);
  let changes = 0,
    finished = 0;
  h.book.turn(
    1,
    new h.Element(),
    () => changes++,
    () => finished++,
    [new h.Element(), new h.Element()],
  );
  h.frame(2200);
  assert.equal(
    changes,
    0,
    'The spread changed while the page was still in flight',
  );
  h.frame(2800);
  assert.equal(changes, 1);
  assert.equal(finished, 1);
  h.book.dispose();
});

test('reverse faces stay hidden when closed, and both directions retain a stationary page', (t) => {
  const h = harness(t);
  const mounts = [];
  h.labels.traverse((o) => {
    if (o.element?.className === 'journal-page-mount') mounts.push(o);
  });
  assert.equal(
    mounts.find((o) => o.parent !== h.labels).element.style.opacity,
    '0',
  );
  h.book.open();
  h.frame(1500);
  for (const [direction, start] of [
    [1, 1500],
    [-1, 3000],
  ]) {
    let changes = 0;
    h.book.turn(
      direction,
      new h.Element(),
      () => changes++,
      () => {},
      [new h.Element(), new h.Element()],
    );
    h.frame(start + 600);
    assert.equal(changes, 0);
    assert.ok(
      mounts.every((o) => o.visible),
      'The entire spread disappeared during the turn',
    );
    h.frame(start + 1300);
    assert.equal(changes, 1);
  }
  h.book.dispose();
});

test('mobile and reduced-motion journeys settle without timers or duplicate commits', (t) => {
  const h = harness(t, { mobile: true, reduced: true });
  h.book.open();
  h.frame(0);
  assert.equal(h.book.opened, true);
  assert.equal(h.book.busy, false);
  let changes = 0;
  h.book.turn(
    1,
    new h.Element(),
    () => changes++,
    () => {},
    [new h.Element()],
  );
  assert.equal(changes, 1);
  assert.equal(h.book.busy, false);
  h.book.close();
  assert.equal(h.book.opened, false);
  h.book.dispose();
});
