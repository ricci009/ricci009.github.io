import * as THREE from 'three';
import {
  CSS3DObject,
  CSS3DRenderer,
} from 'three/addons/renderers/CSS3DRenderer.js';
import { AsciiShapeRenderer } from './asciiShapeRenderer';
import { revealJourney, runMotion } from './deskJourney';

/** The book is real geometry. Readable HTML sits on its pages in the same camera space. */
export function createAsciiJournal(
  stage: HTMLElement,
  onState: (open: boolean, busy: boolean) => void,
) {
  const canvas = document.createElement('canvas');
  canvas.className = 'journal-ascii-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  const ascii = new AsciiShapeRenderer(renderer);
  const scene = new THREE.Scene();
  const labels = new THREE.Scene();
  const css = new CSS3DRenderer();
  css.domElement.className = 'journal-page-overlay';
  stage.prepend(canvas, css.domElement);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 80);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x4a354d, 2));
  const light = new THREE.DirectionalLight(0xffefd9, 3);
  light.position.set(-5, 13, 5);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  Object.assign(light.shadow.camera, {
    left: -13,
    right: 13,
    top: 10,
    bottom: -10,
  });
  light.shadow.normalBias = 0.03;
  scene.add(light);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const materials: THREE.Material[] = [];
  function box(
    parent: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    color: number,
    flat = false,
  ) {
    const material = flat
      ? new THREE.MeshBasicMaterial({ color })
      : new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
    materials.push(material);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(w, h, d);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  // The same wood and purple notebook as the coding desk, viewed close up.
  box(scene, 0, -0.42, 0, 16, 0.42, 9, 0xb57c52, true);
  box(scene, 0, -0.64, 4.45, 16, 0.14, 0.13, 0xdfa46b, true);
  for (const z of [-3.8, -1.9, 1.9, 3.8])
    box(scene, 0, -0.205, z, 15.8, 0.008, 0.012, 0x97623f, true);
  const notebook = new THREE.Group();
  scene.add(notebook);
  box(notebook, 2.2, -0.08, 0, 4.6, 0.16, 6.2, 0x8263b5);
  box(notebook, 0, 0.02, 0, 0.22, 0.33, 6.2, 0x3e315e);
  box(notebook, 2.2, 0.09, 0, 4.35, 0.23, 5.94, 0xe4d9c7);
  const leftBlock = box(notebook, -2.2, 0.09, 0, 4.35, 0.23, 5.94, 0xe4d9c7);
  for (const y of [0.03, 0.09, 0.15]) {
    box(notebook, 2.2, y, 2.98, 4.32, 0.012, 0.018, 0x978877);
    const line = box(
      leftBlock,
      0,
      (y - 0.09) / 0.23,
      0.5,
      0.99,
      0.035,
      0.008,
      0x978877,
    );
    line.castShadow = false;
  }
  const coverHinge = new THREE.Group();
  coverHinge.position.y = 0.27;
  notebook.add(coverHinge);
  // The inside paper travels with the cover, rather than appearing on the
  // opposite side once the hinge passes a threshold.
  coverHinge.add(leftBlock);
  leftBlock.position.set(2.2, -0.22, 0);
  const coverMesh = box(coverHinge, 2.2, 0.04, 0, 4.6, 0.14, 6.2, 0x8263b5);
  box(coverHinge, 0.23, 0.12, 0, 0.08, 0.018, 6.1, 0x3e315e);
  box(coverHinge, 2.2, 0.12, -0.15, 2.7, 0.014, 2.3, 0xc4afde, true);
  box(coverHinge, 3.8, 0.13, 0, 0.12, 0.025, 6.2, 0x473454);
  const ribbon = box(notebook, 3.55, 0.19, 3.2, 0.16, 0.02, 0.7, 0x76619c);
  ribbon.visible = false;
  // Pen and a cropped keyboard establish that this is still the workbench.
  const pen = new THREE.Group();
  pen.position.set(5.4, -0.1, 0.3);
  pen.rotation.y = -0.12;
  scene.add(pen);
  box(pen, 0, 0.05, 0, 0.12, 0.11, 3.8, 0x7f9c75);
  box(pen, 0, 0.05, -1.65, 0.14, 0.13, 0.5, 0xb8c3ba);
  box(pen, 0, 0.05, 1.94, 0.06, 0.07, 0.2, 0xe2dfc9);
  const keyboard = new THREE.Group();
  keyboard.position.set(-4.4, -0.1, -3.8);
  keyboard.rotation.y = 0.07;
  scene.add(keyboard);
  box(keyboard, 0, 0, 0, 4.6, 0.15, 1.4, 0x27323c);
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 12; col++)
      box(
        keyboard,
        -2.02 + col * 0.365,
        0.12,
        -0.46 + row * 0.39,
        0.29,
        0.09,
        0.3,
        col < 2 ? 0x64788a : 0xabb4ba,
      );
  box(keyboard, 0.1, 0.12, 0.56, 2.1, 0.09, 0.22, 0xc2c6c4);

  const scale = 4.1 / 450;
  function panel(className: string, x: number) {
    const element = document.createElement('div');
    element.className = className;
    const object = new CSS3DObject(element);
    object.scale.setScalar(scale);
    object.rotation.x = -Math.PI / 2;
    object.position.set(x, 0.225, 0);
    labels.add(object);
    return object;
  }
  const left = panel('journal-page-mount', -2.2);
  const right = panel('journal-page-mount', 2.2);
  const coverLabel = panel('journal-cover-label', 2.2);
  coverLabel.element.innerHTML =
    '<span>RICCARDO SALZMANN</span><strong>FIELD<br>JOURNAL</strong><span>[ NOTES / IDEAS / EXPERIMENTS ]</span><button type="button">Open the journal ↗</button>';
  const coverLabels = new THREE.Group();
  labels.add(coverLabels);
  coverLabels.add(left, coverLabel);
  coverLabel.position.y = 0.135;
  left.position.set(2.2, -0.355, 0);
  left.quaternion
    .setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI)
    .multiply(
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        -Math.PI / 2,
      ),
    );
  const leafHinge = new THREE.Group();
  leafHinge.position.y = 0.25;
  notebook.add(leafHinge);
  const sheet = box(leafHinge, 2.2, 0, 0, 4.34, 0.035, 5.93, 0xeee2cc);
  leafHinge.visible = false;
  const movingLabels = new THREE.Group();
  labels.add(movingLabels);
  const movingPage = panel('journal-page-mount moving-page', 2.2);
  const movingBack = panel('journal-page-mount moving-page', 2.2);
  movingLabels.add(movingPage);
  movingLabels.add(movingBack);
  movingPage.position.y = 0.035;
  movingBack.position.y = -0.035;
  movingBack.quaternion.copy(left.quaternion);
  movingLabels.position.y = 0.25;
  movingLabels.visible = false;
  let opened = false,
    busy = false,
    mobile = false,
    disposed = false;
  let animation: {
    started: number;
    duration: number;
    frame: (t: number) => void;
    end: () => void;
  } | null = null;
  let frameId = 0;
  let pending = false;
  let departure = 0;
  const idleWaiters: (() => void)[] = [];
  let width = 1,
    height = 1,
    opening = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const faceRotation = new THREE.Quaternion();
  const facePosition = new THREE.Vector3();
  const faceNormal = new THREE.Vector3();
  const eyeDirection = new THREE.Vector3();
  function cameraUpdate() {
    const focusX = mobile ? 2.2 : 2.2 * (1 - opening);
    const distance = mobile ? 10.3 : Math.max(9.6, 14.5 / camera.aspect);
    camera.position.set(
      focusX + 0.12,
      distance * (1 + departure * 0.18),
      distance * (0.63 + departure * 0.12),
    );
    camera.lookAt(focusX, 0, 0.35);
    camera.updateMatrixWorld();
  }
  function paint(now: number) {
    pending = false;
    if (disposed) return;
    if (animation) {
      const t = Math.min(1, (now - animation.started) / animation.duration);
      animation.frame(t * t * (3 - 2 * t));
      if (t >= 1) {
        const done = animation.end;
        animation = null;
        done();
      }
    }
    cameraUpdate();
    coverLabels.position.copy(coverHinge.position);
    coverLabels.rotation.copy(coverHinge.rotation);
    labels.updateMatrixWorld(true);
    // CSS3D lives above WebGL, so explicitly cull its reverse faces. Browser
    // flattening of nested HTML must never expose mirrored page text.
    for (const face of [left, coverLabel, movingPage, movingBack]) {
      face.getWorldQuaternion(faceRotation);
      face.getWorldPosition(facePosition);
      faceNormal.set(0, 0, 1).applyQuaternion(faceRotation);
      eyeDirection.copy(camera.position).sub(facePosition).normalize();
      face.element.style.opacity = String(
        THREE.MathUtils.clamp(faceNormal.dot(eyeDirection) * 12, 0, 1),
      );
    }
    // Uncover the right page continuously; the inside cover's text uses its
    // real reverse face and remains attached throughout the hinge rotation.
    right.element.style.clipPath = `inset(0 0 0 ${Math.max(0, Math.cos(Math.PI * opening)) * 100}%)`;
    ascii.render(scene, camera);
    css.render(labels, camera);
    if (animation) requestPaint();
  }
  function requestPaint() {
    if (!pending && !disposed) {
      pending = true;
      frameId = requestAnimationFrame(paint);
    }
  }
  function animate(
    duration: number,
    frame: (t: number) => void,
    end: () => void,
  ) {
    if (reduced.matches) {
      frame(1);
      end();
      requestPaint();
      return;
    }
    animation = { started: performance.now(), duration, frame, end };
    requestPaint();
  }
  function notify() {
    left.element.inert = right.element.inert = busy || !opened;
    coverLabel.element.inert = busy || opened;
    onState(opened, busy);
    stage.dataset.bookState = busy ? 'animating' : opened ? 'open' : 'closed';
    if (!busy) idleWaiters.splice(0).forEach((resolve) => resolve());
  }
  function open() {
    if (opened || busy) return;
    busy = true;
    notify();
    animate(
      1450,
      (t) => {
        coverHinge.rotation.z = Math.PI * t;
        coverHinge.position.y = 0.27 - 0.4 * t;
        opening = t;
      },
      () => {
        opened = true;
        busy = false;
        left.visible = !mobile;
        right.visible = true;
        ribbon.visible = true;
        notify();
      },
    );
  }
  function close() {
    if (!opened || busy) return;
    busy = true;
    notify();
    ribbon.visible = false;
    animate(
      1200,
      (t) => {
        coverHinge.rotation.z = Math.PI * (1 - t);
        coverHinge.position.y = 0.27 - 0.4 * (1 - t);
        opening = 1 - t;
      },
      () => {
        opened = false;
        busy = false;
        notify();
      },
    );
  }
  coverLabel.element.querySelector('button')!.addEventListener('click', open);
  const raycaster = new THREE.Raycaster();
  canvas.addEventListener('click', (event) => {
    if (opened || busy) return;
    const rect = canvas.getBoundingClientRect();
    raycaster.setFromCamera(
      new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      ),
      camera,
    );
    if (raycaster.intersectObject(coverMesh).length) open();
  });
  function resize() {
    width = stage.clientWidth;
    height = stage.clientHeight;
    mobile = matchMedia('(max-width: 700px)').matches;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    css.setSize(width, height);
    ascii.resize(width, height, false);
    left.visible = !mobile;
    requestPaint();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  stage.classList.add('has-3d');
  resize();
  notify();
  requestAnimationFrame(() => requestAnimationFrame(revealJourney));
  return {
    open,
    close,
    settle() {
      return busy
        ? new Promise<void>((resolve) => idleWaiters.push(resolve))
        : Promise.resolve();
    },
    async depart() {
      await runMotion(500, (t) => {
        departure = t;
        cameraUpdate();
        ascii.render(scene, camera);
        css.render(labels, camera);
      });
      return canvas;
    },
    get busy() {
      return busy;
    },
    get opened() {
      return opened;
    },
    setPages(pages: HTMLElement[]) {
      left.element.replaceChildren();
      right.element.replaceChildren();
      if (mobile) {
        if (pages[0]) right.element.append(pages[0]);
      } else {
        if (pages[0]) left.element.append(pages[0]);
        if (pages[1]) right.element.append(pages[1]);
      }
      requestPaint();
    },
    turn(
      direction: number,
      source: HTMLElement,
      change: () => void,
      done: () => void,
      destination: HTMLElement[] = [],
    ) {
      if (!opened || busy) return;
      busy = true;
      notify();
      leafHinge.visible = movingLabels.visible = true;
      function copyTo(object: CSS3DObject, page?: HTMLElement) {
        const clone = page?.cloneNode(true) as HTMLElement | undefined;
        if (clone) {
          clone.hidden = false;
          clone.inert = true;
        }
        object.element.replaceChildren(...(clone ? [clone] : []));
      }
      if (mobile) {
        copyTo(movingPage, direction > 0 ? source : destination[0]);
        copyTo(movingBack);
        if (direction > 0) copyTo(right, destination[0]);
      } else if (direction > 0) {
        copyTo(movingPage, source);
        copyTo(movingBack, destination[0]);
        copyTo(right, destination[1]);
      } else {
        copyTo(movingPage, destination[1]);
        copyTo(movingBack, source);
        copyTo(left, destination[0]);
      }
      movingPage.element.setAttribute('aria-hidden', 'true');
      movingBack.element.setAttribute('aria-hidden', 'true');
      const restoreFocus = stage.contains(document.activeElement);
      stage.inert = true;
      animate(
        1250,
        (t) => {
          const progress = direction > 0 ? t : 1 - t;
          leafHinge.rotation.z = movingLabels.rotation.z = Math.PI * progress;
          sheet.scale.y = 0.035;
        },
        () => {
          change();
          leafHinge.visible = movingLabels.visible = false;
          movingPage.element.replaceChildren();
          movingBack.element.replaceChildren();
          stage.inert = false;
          busy = false;
          left.visible = !mobile;
          right.visible = true;
          notify();
          done();
          if (restoreFocus) stage.focus({ preventScroll: true });
        },
      );
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      ascii.dispose();
      renderer.dispose();
      geometry.dispose();
      materials.forEach((material) => material.dispose());
      canvas.remove();
      css.domElement.remove();
    },
  };
}
