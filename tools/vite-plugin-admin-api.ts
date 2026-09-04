import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Plugin } from 'vite';

/**
 * Dev-only API used by the admin page (`yarn admin`).
 *
 * GET  /__admin/sets  -> current contents of public/data/sets.json
 * PUT  /__admin/sets  -> overwrite it, after snapshotting the previous version
 *                        to .admin-backups/ so a bad save is recoverable.
 *
 * Never registered by the normal dev server or the production build: it is only
 * present in vite.admin.config.ts.
 */
export function adminApi(dataFile = 'public/data/sets.json'): Plugin {
  const filePath = resolve(process.cwd(), dataFile);
  const backupDir = resolve(process.cwd(), '.admin-backups');

  return {
    name: 'xivbis-admin-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__admin/sets', (req, res) => {
        const send = (code: number, body: unknown) => {
          res.statusCode = code;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify(body));
        };

        if (req.method === 'GET') {
          readFile(filePath, 'utf8')
            .then((raw) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Cache-Control', 'no-store');
              res.end(raw);
            })
            .catch((err: Error) => send(500, { error: `Could not read ${dataFile}: ${err.message}` }));
          return;
        }

        if (req.method === 'PUT') {
          const chunks: Buffer[] = [];
          req.on('data', (c: Buffer) => chunks.push(c));
          req.on('end', () => {
            void (async () => {
              try {
                const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                validate(parsed);

                if (existsSync(filePath)) {
                  await mkdir(backupDir, { recursive: true });
                  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
                  await copyFile(filePath, resolve(backupDir, `sets.${stamp}.json`));
                }

                await mkdir(dirname(filePath), { recursive: true });
                await writeFile(filePath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
                send(200, { ok: true, savedAt: new Date().toISOString() });
              } catch (err) {
                send(400, { error: (err as Error).message });
              }
            })();
          });
          return;
        }

        send(405, { error: `Unsupported method ${req.method}` });
      });
    },
  };
}

/** Guards against writing a payload the live site could not render. */
function validate(data: unknown): void {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Payload must be an object');
  const root = data as Record<string, unknown>;

  if (!Array.isArray(root.categories) || root.categories.some((c) => typeof c !== 'string')) {
    throw new Error('`categories` must be an array of strings');
  }

  for (const [key, value] of Object.entries(root)) {
    if (key === 'categories') continue;
    const job = value as Record<string, unknown>;
    if (!job || typeof job !== 'object' || Array.isArray(job)) throw new Error(`Job "${key}" must be an object`);
    if (typeof job.name !== 'string' || !job.name) throw new Error(`Job "${key}" needs a name`);
    if (typeof job.Role !== 'string' || !job.Role) throw new Error(`Job "${key}" needs a Role`);
    if (!job.Sets || typeof job.Sets !== 'object' || Array.isArray(job.Sets)) {
      throw new Error(`Job "${key}" needs a Sets object`);
    }
    for (const [cat, items] of Object.entries(job.Sets as Record<string, unknown>)) {
      if (!Array.isArray(items)) throw new Error(`"${key}" / "${cat}" must be an array`);
      for (const item of items as Record<string, unknown>[]) {
        if (typeof item?.name !== 'string' || typeof item?.link !== 'string') {
          throw new Error(`"${key}" / "${cat}" has an entry missing name or link`);
        }
      }
    }
  }
}
