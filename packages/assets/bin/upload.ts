import { Storage } from '@google-cloud/storage';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const BUCKET_NAME = process.env.GCS_BUCKET;
if (!BUCKET_NAME) {
  console.error('GCS_BUCKET environment variable is required');
  process.exit(1);
}

const CONTENT_TYPES: Record<string, string> = {
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.json': 'application/json',
};

const CDN_PREFIX = 'v1';

async function main(): Promise<void> {
  const storage = new Storage();
  const bucket = storage.bucket(BUCKET_NAME!);

  const hashMap: Record<string, Record<string, string>> = JSON.parse(
    readFileSync(join(DIST, 'hashmap.json'), 'utf-8'),
  );

  let uploaded = 0;
  let skipped = 0;

  for (const [type, entries] of Object.entries(hashMap)) {
    for (const [fileKey, hashedFilename] of Object.entries(entries)) {
      const gcsPath = `${CDN_PREFIX}/${type}/${hashedFilename}`;
      const file = bucket.file(gcsPath);

      const [exists] = await file.exists();
      if (exists) {
        skipped++;
        continue;
      }

      const ext = extname(hashedFilename);
      const originalFilename = `${fileKey}${ext}`;
      // Source files live in src/, generated raster formats in dist/
      const srcPath = join(SRC, type, originalFilename);
      const distPath = join(DIST, type, originalFilename);
      const sourcePath = existsSync(srcPath) ? srcPath : distPath;
      const content = readFileSync(sourcePath);

      await file.save(content, {
        metadata: {
          contentType: CONTENT_TYPES[ext] ?? 'application/octet-stream',
          cacheControl: 'public, max-age=31536000, immutable',
        },
      });

      uploaded++;
      console.log(`Uploaded: ${gcsPath}`);
    }
  }

  console.log(`\nDone. ${uploaded} uploaded, ${skipped} already existed.`);
}

main().catch(err => {
  console.error('Upload failed:', err);
  process.exit(1);
});
