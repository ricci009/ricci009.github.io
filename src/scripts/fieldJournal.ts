import { createAsciiJournal } from './asciiJournalScene';
import { navigateScene, revealJourney } from './deskJourney';
const book = document.querySelector<HTMLElement>('[data-notebook]');
if (book) {
  const pagesRoot = book.querySelector<HTMLElement>('[data-pages]')!;
  const intro = pagesRoot.querySelector<HTMLElement>('[data-intro]')!;
  const entries = [...pagesRoot.querySelectorAll<HTMLElement>('[data-post]')];
  const pageTemplate = pagesRoot
    .querySelector<HTMLElement>('.entries-page')!
    .cloneNode(true) as HTMLElement;
  pageTemplate.querySelector('.entry-stack')!.replaceChildren();
  const initialEmpty = pagesRoot.querySelector('.blank-note')?.cloneNode(true);
  const previous = document.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = document.querySelector<HTMLButtonElement>('[data-next]')!;
  const status = document.querySelector<HTMLElement>('[data-page-status]')!;
  const search = document.querySelector<HTMLInputElement>('#post-search');
  const filters = [
    ...document.querySelectorAll<HTMLButtonElement>('[data-filter]'),
  ];
  const mobile = matchMedia('(max-width: 700px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const leaf = book.querySelector<HTMLElement>('.turning-leaf')!;
  const dialog = document.querySelector<HTMLDialogElement>('.note-dialog');
  let pages: HTMLElement[] = [];
  let current = 0;
  let topic = 'all';
  let turning = false;
  let turnTimer: ReturnType<typeof setTimeout> | undefined;
  let scene: ReturnType<typeof createAsciiJournal> | null = null;
  const cover = document.querySelector<HTMLButtonElement>('[data-cover]')!;
  const step = () => (mobile.matches ? 1 : 2);
  const number = (value: number) => String(value).padStart(2, '0');

  function display() {
    pages.forEach((page, index) => {
      page.hidden = index < current || index >= current + step();
      page.classList.toggle('left-page', !mobile.matches && index === current);
      page.classList.toggle(
        'right-page',
        mobile.matches || index === current + 1,
      );
      if (page.hidden && page.contains(document.activeElement))
        book!.focus({ preventScroll: true });
    });
    previous.disabled = current === 0;
    next.disabled = current + step() >= pages.length;
    scene?.setPages(pages.slice(current, current + step()));
    if (scene && (!scene.opened || scene.busy))
      previous.disabled = next.disabled = true;
    status.textContent =
      step() === 2
        ? `Pages ${number(current + 1)}–${number(Math.min(current + 2, pages.length))} / ${number(pages.length)}`
        : `Page ${number(current + 1)} / ${number(pages.length)}`;
  }

  function finishTurn() {
    clearTimeout(turnTimer);
    book!.removeAttribute('data-turn');
    leaf.replaceChildren();
    turning = false;
  }

  function paginate() {
    if (scene?.busy) return;
    finishTurn();
    const query = search?.value.toLowerCase().trim() ?? '';
    const matched = entries.filter(
      (entry) =>
        (entry.dataset.title ?? '').includes(query) &&
        (topic === 'all' ||
          (JSON.parse(entry.dataset.tags ?? '[]') as string[]).includes(topic)),
    );
    // Move existing entry nodes so native links and event handlers stay intact.
    pages = [intro];
    for (let i = 0; i < Math.max(1, matched.length); i += 3) {
      const page = pageTemplate.cloneNode(true) as HTMLElement;
      page.querySelector('.page-running span')!.textContent =
        i === 0 ? 'CONTENTS / LATEST NOTES' : 'CONTENTS / CONTINUED';
      const stack = page.querySelector('.entry-stack')!;
      stack.append(...matched.slice(i, i + 3));
      if (!matched.length) {
        if (!entries.length && initialEmpty)
          stack.append(initialEmpty.cloneNode(true));
        else {
          const empty = document.createElement('div');
          empty.className = 'blank-note';
          empty.innerHTML =
            '<h2>No notes found.</h2><p>Try another phrase or choose “All entries.”</p>';
          stack.append(empty);
        }
      }
      pages.push(page);
    }
    if (!mobile.matches && pages.length % 2) {
      const end = pageTemplate.cloneNode(true) as HTMLElement;
      end.querySelector('.page-running span')!.textContent =
        'ROOM FOR WHAT COMES NEXT';
      end.querySelector('.entry-stack')!.innerHTML =
        '<div class="blank-note"><span aria-hidden="true">✳</span><h2>More to come.</h2><p>A little room for the next idea.</p></div>';
      pages.push(end);
    }
    pages.forEach((page, i) => {
      page.querySelector('[data-page-number]')!.textContent = number(i + 1);
    });
    pagesRoot.replaceChildren(...pages);
    current = query || topic !== 'all' ? (mobile.matches ? 1 : 0) : 0;
    display();
    document.querySelector('[data-search-status]')!.textContent =
      `${matched.length} ${matched.length === 1 ? 'entry' : 'entries'} found`;
  }

  function turn(direction: number) {
    if (
      turning ||
      (direction < 0 && previous.disabled) ||
      (direction > 0 && next.disabled)
    )
      return;
    const source = pages[current + (direction > 0 ? step() - 1 : 0)]!;
    if (scene) {
      turning = true;
      scene.turn(
        direction,
        source,
        () => {
          current += direction * step();
          display();
        },
        () => {
          turning = false;
          display();
        },
        pages.slice(
          current + direction * step(),
          current + direction * step() + step(),
        ),
      );
      return;
    }
    if (!reducedMotion.matches) {
      const copy = source.cloneNode(true) as HTMLElement;
      copy.hidden = false;
      copy.inert = true;
      leaf.replaceChildren(copy);
      book!.dataset.turn = direction > 0 ? 'forward' : 'back';
      turning = true;
      turnTimer = setTimeout(finishTurn, 560);
    }
    current += direction * step();
    display();
  }

  previous.addEventListener('click', () => turn(-1));
  next.addEventListener('click', () => turn(1));
  book.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      turn(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  let touchStart: { x: number; y: number } | null = null;
  book.addEventListener(
    'touchstart',
    (event) => {
      const touch = event.touches[0];
      touchStart =
        touch && event.touches.length === 1
          ? { x: touch.clientX, y: touch.clientY }
          : null;
    },
    { passive: true },
  );
  book.addEventListener(
    'touchend',
    (event) => {
      if (!touchStart) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5)
        turn(dx < 0 ? 1 : -1);
      touchStart = null;
    },
    { passive: true },
  );
  search?.addEventListener('input', paginate);
  filters.forEach((button) =>
    button.addEventListener('click', () => {
      topic = button.dataset.filter ?? 'all';
      filters.forEach((filter) =>
        filter.setAttribute('aria-pressed', String(filter === button)),
      );
      paginate();
    }),
  );
  mobile.addEventListener('change', paginate);
  entries.forEach((entry) =>
    entry.addEventListener('click', () => {
      if (!entry.dataset.sample || !dialog) return;
      const template = document.getElementById(
        entry.dataset.sample,
      ) as HTMLTemplateElement;
      dialog
        .querySelector('[data-reader-content]')!
        .replaceChildren(template.content.cloneNode(true));
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('reading-note');
      dialog
        .querySelector<HTMLElement>('#sample-title')
        ?.focus({ preventScroll: true });
    }),
  );
  dialog
    ?.querySelector('[data-close]')
    ?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('close', () =>
    document.body.classList.remove('reading-note'),
  );
  dialog?.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog.close();
  });
  document.querySelector<HTMLElement>('[data-book-controls]')!.hidden = false;
  book.classList.add('enhanced');
  try {
    scene = createAsciiJournal(book, (open, busy) => {
      cover.hidden = false;
      cover.disabled = busy;
      cover.textContent = busy
        ? 'Journal in motion…'
        : open
          ? 'Close journal ↓'
          : 'Open journal ↗';
      document.querySelector('[data-scene-status]')!.textContent = busy
        ? 'NOTEBOOK / IN MOTION'
        : open
          ? 'JOURNAL OPEN / SELECT AN ENTRY'
          : 'THE NOTEBOOK / SELECT TO OPEN';
      filters.forEach((filter) => {
        filter.disabled = busy || !open;
      });
      if (search) search.disabled = busy || !open;
      if (busy || !open) previous.disabled = next.disabled = true;
      else display();
    });
    cover.addEventListener('click', () =>
      scene?.opened ? scene.close() : scene?.open(),
    );
    window.addEventListener('pagehide', (event) => {
      if (!event.persisted) scene?.dispose();
    });
  } catch (error) {
    console.error('Journal 3D unavailable; showing readable notebook.', error);
    revealJourney();
  }
  let leaving = false;
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      leaving = false;
      document.body.classList.remove('journey-moving');
      revealJourney();
    }
  });
  document.addEventListener('click', async (event) => {
    const link =
      event.target instanceof Element
        ? event.target.closest(
            'a[href="/"], a[href="/?concept=ascii"], [data-return-desk]',
          )
        : null;
    if (!link) return;
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0 ||
      !scene
    )
      return;
    event.preventDefault();
    if (leaving) return;
    leaving = true;
    await scene.settle();
    scene.close();
    await scene.settle();
    document.body.classList.add('journey-moving');
    const canvas = await scene.depart();
    navigateScene('/?from=journal', canvas);
  });
  paginate();
  if (scene && new URLSearchParams(location.search).get('open') === '1')
    scene.open();
}
