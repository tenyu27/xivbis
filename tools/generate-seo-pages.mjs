import { mkdir, readFile, writeFile } from 'node:fs/promises';

const siteUrl = 'https://xivbis.com';
const distDir = new URL('../dist/', import.meta.url);
const data = JSON.parse(await readFile(new URL('../public/data/sets.json', import.meta.url), 'utf8'));
const template = await readFile(new URL('index.html', distDir), 'utf8');
const jobs = Object.entries(data)
  .filter(([key, value]) => key !== 'categories' && !Array.isArray(value))
  .map(([code, job]) => ({ code, ...job, slug: `${job.name.toLowerCase().replaceAll(' ', '-')}-bis` }));

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const gearLinks = (job) => Object.entries(job.Sets)
  .map(([tier, sets]) => `
    <section>
      <h2>${escapeHtml(job.name)} BiS for ${escapeHtml(tier)}</h2>
      <ul>${sets.map((set) => `<li><a href="${escapeHtml(set.link)}">${escapeHtml(job.name)} ${escapeHtml(set.name)} gear set</a></li>`).join('')}</ul>
    </section>`).join('');

const jobDirectory = (job) => `
  <section aria-labelledby="jobs-heading">
    <h2 id="jobs-heading">FFXIV BiS by job</h2>
    <ul>${jobs.map(({ name, code, slug }) => `<li><a href="/${slug}/">${escapeHtml(name)} BiS (${escapeHtml(code)} BiS)</a></li>`).join('')}</ul>
  </section>`;

const replaceMetadata = (html, { title, description, url, keywords }) => html
  .replace('<head>', '<head>\n  <base href="../" />')
  .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
  .replace(/<meta name="description"\s+content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
  .replace(/<meta name="keywords"\s+content="[^"]*" \/>/, `<meta name="keywords" content="${escapeHtml(keywords)}" />`)
  .replace('<link rel="canonical" href="https://xivbis.com/" />', `<link rel="canonical" href="${url}" />`)
  .replace('<meta property="og:url" content="https://xivbis.com/" />', `<meta property="og:url" content="${url}" />`)
  .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
  .replace(/<meta property="og:description"\s+content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
  .replace(/<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${url}" />`)
  .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
  .replace(/<meta name="twitter:description"\s+content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
  .replace(/\s*<noscript>[\s\S]*?<\/noscript>/, '');

const pageStructuredData = (job, url, description) => JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${url}#page`,
      url,
      name: `${job.name} BiS gear sets`,
      description,
      inLanguage: 'en',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: [
        { '@type': 'VideoGame', name: 'Final Fantasy XIV' },
        { '@type': 'Thing', name: job.name },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FFXIV BiS', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: `${job.name} BiS`, item: url },
      ],
    },
  ],
});

const rootContent = `
  <main>
    <h1>FFXIV best-in-slot gear sets</h1>
    <p>Current Final Fantasy XIV BiS gear sets for all 21 combat jobs, including Savage, Futures Rewritten Ultimate (FRU), The Omega Protocol (TOP), and Dragonsong's Reprise (DSR).</p>
    ${jobDirectory()}
  </main>`;

await writeFile(
  new URL('index.html', distDir),
  template
    .replace('<div id="root"></div>', `<div id="root">${rootContent}</div>`)
    .replace(/\s*<noscript>[\s\S]*?<\/noscript>/, '')
);

for (const job of jobs) {
  const url = `${siteUrl}/${job.slug}/`;
  const title = `${job.name} BiS (FFXIV ${job.code} Best-in-Slot) | XIVBiS`;
  const description = `Current FFXIV ${job.name} BiS gear sets for Savage, FRU, TOP and DSR. Find ${job.code} best-in-slot builds sourced from The Balance.`;
  const content = `
    <main>
      <nav><a href="/">All FFXIV BiS gear sets</a></nav>
      <h1>FFXIV ${escapeHtml(job.name)} BiS gear sets</h1>
      <p>Current ${escapeHtml(job.name)} (${escapeHtml(job.code)}) best-in-slot gear sets for Final Fantasy XIV. Choose a raid tier and open the full build to see its equipment, materia and stats.</p>
      ${gearLinks(job)}
      ${jobDirectory(job)}
    </main>`;
  const html = replaceMetadata(template, {
    title,
    description,
    url,
    keywords: `FFXIV ${job.name} BiS, ${job.name} BiS, ${job.code} BiS, FFXIV ${job.code} BiS, ${job.name} best in slot, FFXIV BiS`,
  })
    .replace('</head>', `  <script type="application/ld+json">${pageStructuredData(job, url, description)}</script>\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
  const directory = new URL(`${job.slug}/`, distDir);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), html);
}

const today = new Date().toISOString().slice(0, 10);
const sitemapUrls = ['', ...jobs.map(({ slug }) => `${slug}/`)]
  .map((path, index) => `  <url>\n    <loc>${siteUrl}/${path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${index === 0 ? '1.0' : '0.8'}</priority>\n  </url>`)
  .join('\n');
await writeFile(new URL('sitemap.xml', distDir), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`);
