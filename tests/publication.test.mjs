import test from 'node:test';
import assert from 'node:assert/strict';
import {
  readFileSync,
  writeFileSync,
  unlinkSync,
  existsSync,
  readdirSync,
} from 'node:fs';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const astroPackage = JSON.parse(
  readFileSync(join(root, 'node_modules/astro/package.json'), 'utf8'),
);
const cli = join(root, 'node_modules/astro', astroPackage.bin.astro);
const build = (site) =>
  execFileSync(process.execPath, [cli, 'build'], {
    cwd: root,
    stdio: 'pipe',
    env: site ? { ...process.env, SITE_URL: site } : process.env,
  });
const output = (path) => readFileSync(join(root, 'dist', path), 'utf8');

test('Markdown publishing renders articles and excludes drafts and future posts from every public surface', () => {
  const cases = [
    ['qa-published-entry', 'Publication pipeline fixture', '2020-01-01', false],
    ['qa-private-entry', 'PRIVATE_DRAFT_SENTINEL', '2020-01-01', true],
    ['qa-future-entry', 'FUTURE_POST_SENTINEL', '2999-01-01', false],
  ];
  const created = [];
  try {
    for (const [slug, title, date, draft] of cases) {
      const file = join(root, 'src/content/journal', `${slug}.md`);
      assert.ok(!existsSync(file), 'Never overwrite an existing content file');
      writeFileSync(
        file,
        `---\ntitle: "${title}"\ndescription: "A test of the article publishing pipeline."\ndate: ${date}\ntags: ["C++", "Graphics"]\ndraft: ${draft}\n---\n\n## A useful heading\n\nA paragraph with **bold text** and a [link](https://example.com).\n\n\`\`\`cpp\nint answer = 42;\n\`\`\`\n`,
      );
      created.push(file);
    }
    build('https://portfolio.example');
    const home = output('index.html');
    const listing = output('journal/index.html');
    const article = output('journal/qa-published-entry/index.html');
    assert.match(home, /property="og:image" content="https:\/\/portfolio\.example\/social-card\.png"/);
    assert.match(article, /rel="canonical" href="https:\/\/portfolio\.example\/journal\/qa-published-entry\/"/);
    assert.match(article, /property="og:url" content="https:\/\/portfolio\.example\/journal\/qa-published-entry\/"/);
    const sitemap = output('sitemap-0.xml');
    assert.match(sitemap, /https:\/\/portfolio\.example\/journal\/qa-published-entry\//);
    assert.doesNotMatch(sitemap, /qa-private-entry|qa-future-entry|\/classic\/|\/explore\/|\/tinkering\//);
    assert.match(output('robots.txt'), /Sitemap: https:\/\/portfolio\.example\/sitemap-index.xml/);
    for (const html of [home, listing]) {
      assert.match(html, /Publication pipeline fixture/);
      assert.doesNotMatch(
        html,
        /PRIVATE_DRAFT_SENTINEL|FUTURE_POST_SENTINEL|Your first field note/,
      );
    }
    assert.doesNotMatch(
      output('index.html'),
      /PRIVATE_DRAFT_SENTINEL|FUTURE_POST_SENTINEL|Your first field note/,
    );
    assert.match(article, /<h2 id="a-useful-heading">/);
    assert.match(article, /<strong>bold text<\/strong>/);
    assert.match(article, /<pre[^>]*class="astro-code/);
    assert.match(article, /IN THIS FIELD NOTE/);
    assert.match(listing, /id="post-search"/);
    assert.match(listing, /data-filter="Graphics"/);
    assert.ok(!existsSync(join(root, 'dist/journal/qa-private-entry')));
    assert.ok(!existsSync(join(root, 'dist/journal/qa-future-entry')));
    assert.ok(!existsSync(join(root, 'dist/journal/first-field-note')));
  } finally {
    for (const file of created) unlinkSync(file);
    build();
  }
  // Final deliverable must not retain any fixture page or title.
  assert.doesNotMatch(output('index.html'), /Publication pipeline fixture/);
  assert.ok(
    !readdirSync(join(root, 'dist/journal')).some((name) =>
      name.startsWith('qa-'),
    ),
  );
  assert.match(output('journal/index.html'), /A fresh notebook/);
  assert.doesNotMatch(
    output('journal/index.html'),
    /Anatomy of a field note|SAMPLE ENTRY|Design preview/,
  );
  const pdf = readFileSync(join(root, 'dist/Riccardo_Salzmann_Resume.pdf'));
  assert.equal(pdf.subarray(0, 4).toString(), '%PDF');
  assert.match(output('index.html'), /data-concept="ascii"/);
  assert.doesNotMatch(
    output('index.html'),
    /Five design explorations|Design variations/,
  );
  for (const route of [
    'work',
    'work/smt',
    'work/quantum',
    'work/edag',
    'work/michigan',
    'work/rust',
    'about',
    'resume',
  ]) {
    const html = output(`${route}/index.html`);
    assert.match(html, /Main navigation/);
    assert.match(html, /Riccardo Salzmann/);
  }
  assert.match(output('work/smt/index.html'), /Super Bowl LX|CUDA/);
  assert.ok(!existsSync(join(root, 'dist/work/tinkering')));
  assert.match(output('work/quantum/index.html'), /E-ink|e-ink/);
  assert.match(output('work/rust/index.html'), /closed without merging/i);
  // Check all generated internal destinations, including fragment identifiers.
  for (const file of readdirSync(join(root, 'dist'), {
    recursive: true,
  }).filter((file) => file.endsWith('.html'))) {
    const html = output(file);
    for (const [, rawHref] of html.matchAll(/href="([^"]+)"/g)) {
      const href = rawHref.replaceAll('&amp;', '&');
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      const target = new URL(href, 'https://portfolio.example');
      let path = decodeURIComponent(target.pathname).slice(1);
      if (!path || path.endsWith('/')) path += 'index.html';
      assert.ok(
        existsSync(join(root, 'dist', path)),
        `${file}: missing internal destination ${href}`,
      );
      if (target.hash && path.endsWith('.html')) {
        assert.ok(
          output(path).includes(
            `id="${decodeURIComponent(target.hash.slice(1))}"`,
          ),
          `${file}: missing fragment ${href}`,
        );
      }
    }
  }
});
