import { stops, variants } from '../data/prototypeJourney';
import { drawMap, drawScene, resetMapArt } from './prototypeArt';

let design = Number(document.documentElement.dataset.variant || 1);
let active = 0;
let animationTime = 0;
let lastFrame = 0;
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let paused = preference.matches;
let userPaused = false;
let flight: {
  from: number[];
  to: number[];
  elapsed: number;
  returning: boolean;
} | null = null;
let tour = false;
let tourElapsed = 0;
let needsDraw = true;
const canvases = [...document.querySelectorAll<HTMLCanvasElement>('canvas')];
const contexts = new Map(
  canvases.map((canvas) => [canvas, canvas.getContext('2d')!]),
);
const visible = new Set<HTMLCanvasElement>();
const visibility = new IntersectionObserver((entries) => {
  entries.forEach((entry) =>
    entry.isIntersecting
      ? visible.add(entry.target as HTMLCanvasElement)
      : visible.delete(entry.target as HTMLCanvasElement),
  );
  needsDraw = true;
});
canvases.forEach((canvas) => visibility.observe(canvas));
const all = <T extends HTMLElement = HTMLElement>(selector: string) => [
  ...document.querySelectorAll<T>(selector),
];
function setText(selector: string, value: string) {
  all(selector).forEach((node) => (node.textContent = value));
}
function status(value: string) {
  setText('[data-flight-status]', value);
}
function updateTour() {
  all('[data-tour]').forEach((button) => {
    button.setAttribute('aria-pressed', String(tour));
    button.textContent = tour
      ? 'Stop the journey  Ⅱ'
      : design === 3
        ? 'START JOURNEY'
        : design === 5
          ? 'REPLAY ROUTE ↗'
          : 'Follow my journey ↗';
  });
}
function stopTour() {
  tour = false;
  tourElapsed = 0;
  updateTour();
}
function selectStop(index: number, manual = true) {
  if (manual) stopTour();
  const previous = stops[active]!;
  const next = stops[index]!;
  if (active !== index && previous.name !== next.name) {
    flight = {
      from: previous.coordinates,
      to: next.coordinates,
      elapsed: 0,
      returning: index === 2,
    };
    status(`In flight: ${previous.name} → ${next.name}`);
  } else {
    flight = null;
    status(`${next.location} / ${next.short}`);
  }
  active = index;
  setText('[data-location]', next.location);
  setText('[data-count]', `0${index + 1} / 05`);
  setText('[data-title]', next.title);
  setText('[data-description]', next.description);
  setText('[data-tag]', next.tag);
  setText('[data-label]', next.label);
  all<HTMLCanvasElement>('[data-active-scene]').forEach((canvas) => {
    canvas.dataset.scene = next.scene;
    canvas.setAttribute('aria-label', `${next.short}: ${next.description}`);
  });
  all('[data-go]').forEach((button) => {
    if (Number(button.dataset.go) === active)
      button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  needsDraw = true;
}
function setDesign(value: number, updateURL = true) {
  design = ((value - 1 + 5) % 5) + 1;
  document.documentElement.dataset.variant = String(design);
  if (updateURL) {
    const url = new URL(location.href);
    url.searchParams.set('variant', String(design));
    history.pushState({}, '', url);
  }
  setText('[data-variant-name]', variants[design - 1]!.name);
  setText('[data-variant-count]', `${design} / 5`);
  all('[data-variant]')
    .filter((node) => node.tagName === 'BUTTON')
    .forEach((button) => {
      if (Number(button.dataset.variant) === design)
        button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  document.title = `${variants[design - 1]!.name} — Riccardo’s world`;
  stopTour();
  selectStop(0, false);
  window.scrollTo({ top: 0, behavior: 'instant' });
  needsDraw = true;
}
all('[data-go]').forEach((button) =>
  button.addEventListener('click', () => selectStop(Number(button.dataset.go))),
);
all('[data-next]').forEach((button) =>
  button.addEventListener('click', () => selectStop((active + 1) % 5)),
);
all('[data-prev]').forEach((button) =>
  button.addEventListener('click', () => selectStop((active + 4) % 5)),
);
all('[data-variant]')
  .filter((node) => node.tagName === 'BUTTON')
  .forEach((button) =>
    button.addEventListener('click', () =>
      setDesign(Number(button.dataset.variant)),
    ),
  );
document
  .querySelector('[data-variant-prev]')
  ?.addEventListener('click', () => setDesign(design - 1));
document
  .querySelector('[data-variant-next]')
  ?.addEventListener('click', () => setDesign(design + 1));
window.addEventListener('popstate', () => {
  const v = Number(new URLSearchParams(location.search).get('variant'));
  setDesign(v >= 1 && v <= 5 ? v : 1, false);
});
window.addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement;
  if (
    target.closest('input,textarea,select,[contenteditable="true"],dialog') ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  )
    return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    setDesign(design + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
all('[data-tour]').forEach((button) =>
  button.addEventListener('click', () => {
    if (tour) {
      stopTour();
      return;
    }
    selectStop(0, false);
    tour = true;
    tourElapsed = 0;
    updateTour();
    if (paused)
      status('Motion is paused. Choose a chapter to travel at your own pace.');
  }),
);
function updateMotion() {
  paused = userPaused || preference.matches;
  all<HTMLButtonElement>('[data-motion]').forEach((button) => {
    button.setAttribute('aria-pressed', String(paused));
    button.innerHTML = paused
      ? '▶ <span>Resume motion</span>'
      : 'Ⅱ <span>Pause motion</span>';
    button.disabled = preference.matches;
    button.title = preference.matches
      ? 'Motion is off to match your device preference.'
      : '';
  });
  if (paused) {
    stopTour();
    flight = null;
    status(`${stops[active]!.location} / motion paused`);
  }
  needsDraw = true;
}
all('[data-motion]').forEach((button) =>
  button.addEventListener('click', () => {
    userPaused = !userPaused;
    updateMotion();
  }),
);
preference.addEventListener('change', updateMotion);
const dialog = document.querySelector<HTMLDialogElement>('.work-dialog')!;
all('[data-details]').forEach((button) =>
  button.addEventListener('click', () => {
    const index = button.dataset.details
      ? Number(button.dataset.details)
      : active;
    const stop = stops[index]!;
    stopTour();
    setText('[data-dialog-location]', `${stop.location} / ${stop.short}`);
    setText('[data-dialog-title]', stop.title);
    setText('[data-dialog-description]', stop.description);
    const list = document.querySelector('[data-dialog-projects]')!;
    list.replaceChildren();
    const projects =
      stop.scene === 'houses'
        ? stop.projects.filter(
            (project) => project.title === 'A neighborhood you can explore',
          )
        : stop.projects;
    projects.forEach((project) => {
      const article = document.createElement('article'),
        heading = document.createElement('h3'),
        body = document.createElement('p');
      heading.textContent = project.title;
      body.textContent = project.details;
      article.append(heading, body);
      list.append(article);
    });
    dialog.showModal();
  }),
);
document
  .querySelector('.dialog-close')
  ?.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const box = dialog.getBoundingClientRect();
  if (
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom
  )
    dialog.close();
});
let scrollQueued = false;
window.addEventListener(
  'scroll',
  () => {
    if (design !== 2 || scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      scrollQueued = false;
      const threshold =
        innerWidth <= 760 ? innerHeight * 0.7 : innerHeight * 0.55;
      let index = 0;
      all('[data-scroll-stop]').forEach((article) => {
        if (article.getBoundingClientRect().top < threshold)
          index = Number(article.dataset.scrollStop);
      });
      if (index !== active) selectStop(index);
    });
  },
  { passive: true },
);
document.fonts.ready.then(() => {
  resetMapArt();
  needsDraw = true;
});
document.addEventListener('visibilitychange', () => {
  lastFrame = 0;
  needsDraw = true;
});
function frame(now: number) {
  requestAnimationFrame(frame);
  if (document.hidden) return;
  if (now - lastFrame < 80 && !needsDraw) return;
  const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.15) : 0;
  lastFrame = now;
  if (!paused && !dialog.open) {
    animationTime += delta;
    if (flight) {
      flight.elapsed += delta;
      if (flight.elapsed >= 3) {
        flight = null;
        status(
          `Landed in ${stops[active]!.location}. Welcome to ${stops[active]!.short}.`,
        );
      }
    }
    if (tour) {
      tourElapsed += delta;
      if (tourElapsed > 6.5) {
        tourElapsed = 0;
        if (active === 4) stopTour();
        else selectStop(active + 1, false);
      }
    }
  }
  if (paused && !needsDraw) return;
  for (const canvas of visible) {
    if (!canvas.offsetWidth || !canvas.closest(`[data-design="${design}"]`))
      continue;
    const c = contexts.get(canvas)!;
    if (canvas.classList.contains('map-canvas'))
      drawMap(
        c,
        design === 5,
        animationTime,
        active,
        flight
          ? { ...flight, progress: paused ? 1 : flight.elapsed / 3 }
          : null,
      );
    else if (flight && (design === 2 || design === 3) && !paused) {
      c.save();
      c.scale(0.5, 260 / 480);
      drawMap(c, false, animationTime, active, {
        ...flight,
        progress: flight.elapsed / 3,
      });
      c.restore();
    } else drawScene(c, canvas.dataset.scene || 'campus', animationTime);
  }
  needsDraw = false;
}
setDesign(design, false);
updateMotion();
requestAnimationFrame(frame);
