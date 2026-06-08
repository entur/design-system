import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = join(ROOT, 'dist');

const BUCKET_NAME = process.env.GCS_BUCKET;
if (!BUCKET_NAME) {
  console.error('GCS_BUCKET environment variable is required');
  process.exit(1);
}

const CDN_BASE = `https://storage.googleapis.com/${BUCKET_NAME}/v1`;

async function main(): Promise<void> {
  const hashMap: Record<string, Record<string, string>> = JSON.parse(
    readFileSync(join(DIST, 'hashmap.json'), 'utf-8'),
  );

  const urls: { url: string; key: string }[] = [];

  for (const [type, entries] of Object.entries(hashMap)) {
    for (const [fileKey, hashedFilename] of Object.entries(entries)) {
      urls.push({
        url: `${CDN_BASE}/${type}/${hashedFilename}`,
        key: `${type}/${fileKey}`,
      });
    }
  }

  if (urls.length === 0) {
    console.log('No assets to verify.');
    return;
  }

  console.log(`Verifying ${urls.length} asset URLs...`);

  const BATCH_SIZE = 20;
  let failed = 0;

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async ({ url, key }) => {
        try {
          const res = await fetch(url, { method: 'HEAD' });
          if (!res.ok) {
            console.error(`FAIL ${res.status}: ${key} → ${url}`);
            return false;
          }
          return true;
        } catch (err) {
          console.error(`FAIL (network): ${key} → ${url}`);
          return false;
        }
      }),
    );
    failed += results.filter(ok => !ok).length;
  }

  if (failed > 0) {
    console.error(`\n${failed} asset(s) not found on CDN.`);
    process.exit(1);
  }

  console.log(`All ${urls.length} assets verified.`);
}

main().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
