/**
 * sync-project-galleries.mjs
 *
 * Build-time script that:
 * 1. Copies owner images from D:\MOSTAFA.P\<folder> into public/assets/work/projects/<slug>/
 * 2. Reads real image dimensions via sharp
 * 3. Generates a typed manifest at content/generated-project-galleries.ts
 *
 * If the owner root folders (D:\MOSTAFA.P) are not available (e.g. production CI),
 * the script falls back to reading from the already-synced public copies.
 *
 * Usage:
 *   npm run sync:project-images
 *   (also runs automatically via predev / prebuild)
 */

import { readdir, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const PUBLIC_PROJECTS_DIR = join(ROOT, 'public', 'assets', 'work', 'projects');
const OUTPUT_FILE = join(ROOT, 'content', 'generated-project-galleries.ts');

const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

// ---------------------------------------------------------------------------
// Explicit 5-folder mapping — single source of truth
// ---------------------------------------------------------------------------

const FOLDER_MAPPING = [
  {
    ownerFolder: 'Airport and Inaugural Flight Activations',
    slug: 'airport-inaugural-flight-activations',
    title: 'Airport and Inaugural Flight Activations',
  },
  {
    ownerFolder: 'Exhibition Booths and Branded Environments',
    slug: 'exhibition-booths-branded-environments',
    title: 'Exhibition Booths and Branded Environments',
  },
  {
    ownerFolder: 'NDC-X and B2B Travel Systems',
    slug: 'ndc-x-b2b-travel-systems',
    title: 'NDC-X and B2B Travel Systems',
  },
  {
    ownerFolder: 'Seminars and Travel Trade Events',
    slug: 'seminars-travel-trade-events',
    title: 'Seminars and Travel Trade Events',
  },
  {
    ownerFolder: 'Social',
    slug: 'airline-destination-campaigns',
    title: 'Airline and Destination Campaigns',
  },
];

// Owner root — only available on the development machine
const OWNER_ROOT = 'D:\\MOSTAFA.P';

// ---------------------------------------------------------------------------
// Natural sort comparator (so 2.jpg < 10.jpg, page-0013 < page-0021)
// ---------------------------------------------------------------------------

function naturalCompare(a, b) {
  const ax = [];
  const bx = [];

  a.replace(/(\d+)|(\D+)/g, (_, $1, $2) => {
    ax.push([$1 || Infinity, $2 || '']);
  });
  b.replace(/(\d+)|(\D+)/g, (_, $1, $2) => {
    bx.push([$1 || Infinity, $2 || '']);
  });

  while (ax.length && bx.length) {
    const an = ax.shift();
    const bn = bx.shift();
    const nn = (an[0] === Infinity ? 0 : Number(an[0])) - (bn[0] === Infinity ? 0 : Number(bn[0]));
    if (nn) return nn;
    const ss = an[1].localeCompare(bn[1]);
    if (ss) return ss;
  }

  return ax.length - bx.length;
}

// ---------------------------------------------------------------------------
// Get supported image files from a directory, naturally sorted
// ---------------------------------------------------------------------------

function isSupportedImage(filename) {
  if (filename.startsWith('.')) return false;
  if (filename === 'Thumbs.db' || filename === 'desktop.ini') return false;
  const ext = extname(filename).toLowerCase();
  return SUPPORTED_EXTENSIONS.has(ext);
}

async function getSortedImages(dirPath) {
  if (!existsSync(dirPath)) return [];
  const entries = await readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && isSupportedImage(e.name))
    .map((e) => e.name)
    .sort(naturalCompare);
}

// ---------------------------------------------------------------------------
// Copy images from owner folder to public target
// ---------------------------------------------------------------------------

async function syncFolder(ownerDir, targetDir) {
  // Ensure target directory exists
  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true });
  }

  const sourceFiles = await getSortedImages(ownerDir);

  if (sourceFiles.length === 0) {
    console.error(`✗ Owner folder "${ownerDir}" contains no supported images.`);
    process.exit(1);
  }

  // Copy each file
  for (const filename of sourceFiles) {
    const src = join(ownerDir, filename);
    const dest = join(targetDir, filename);
    await copyFile(src, dest);
  }

  console.log(`  ✓ Copied ${sourceFiles.length} image(s) from "${basename(ownerDir)}"`);
  return sourceFiles;
}

// ---------------------------------------------------------------------------
// Read image metadata and build manifest entry
// ---------------------------------------------------------------------------

async function buildManifestEntry(slug, title, targetDir) {
  const files = await getSortedImages(targetDir);

  if (files.length === 0) {
    console.error(
      `✗ No images found for "${slug}" in "${targetDir}". ` +
      `Ensure images have been synced from the owner folder.`
    );
    process.exit(1);
  }

  const images = [];

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const filePath = join(targetDir, filename);

    try {
      const metadata = await sharp(filePath).metadata();
      const { width, height } = metadata;

      if (!width || !height) {
        console.warn(`  ⚠ Could not read dimensions for "${slug}/${filename}". Skipping.`);
        continue;
      }

      images.push({
        src: `/assets/work/projects/${slug}/${filename}`,
        alt: `${title} – image ${i + 1} of ${files.length}`,
        width,
        height,
      });
    } catch (err) {
      console.warn(`  ⚠ Failed to process "${slug}/${filename}": ${err.message}. Skipping.`);
    }
  }

  if (images.length === 0) {
    console.error(`✗ All images failed metadata reading for "${slug}".`);
    process.exit(1);
  }

  return images;
}

// ---------------------------------------------------------------------------
// Write manifest
// ---------------------------------------------------------------------------

async function writeManifest(manifest) {
  const entries = Object.entries(manifest);

  let content = `/**
 * AUTO-GENERATED — Do not edit manually.
 * Generated by scripts/sync-project-galleries.mjs
 * Re-run with: npm run sync:project-images
 */

import type { ProjectImage } from '@/types';

export const projectGalleries: Record<string, ProjectImage[]> = {\n`;

  for (const [slug, images] of entries) {
    content += `  '${slug}': [\n`;
    for (const img of images) {
      content += `    { src: '${img.src}', alt: '${img.alt.replace(/'/g, "\\'")}', width: ${img.width}, height: ${img.height} },\n`;
    }
    content += `  ],\n`;
  }

  content += `};\n`;

  await mkdir(dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, content, 'utf-8');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('🔄 Syncing project gallery images...\n');

  const ownerRootExists = existsSync(OWNER_ROOT);
  const manifest = {};

  if (ownerRootExists) {
    console.log(`📂 Owner root found at ${OWNER_ROOT}`);
    console.log('   Copying images to public project folders...\n');

    // Step 1: Copy from owner folders
    for (const mapping of FOLDER_MAPPING) {
      const ownerDir = join(OWNER_ROOT, mapping.ownerFolder);

      if (!existsSync(ownerDir)) {
        console.error(
          `\n✗ Required owner folder missing: "${ownerDir}"\n` +
          `  Expected mapping: "${mapping.ownerFolder}" → "${mapping.slug}"\n` +
          `  Create this folder with supported images and re-run.`
        );
        process.exit(1);
      }

      const targetDir = join(PUBLIC_PROJECTS_DIR, mapping.slug);
      await syncFolder(ownerDir, targetDir);
    }

    console.log('');
  } else {
    console.log(`📂 Owner root not found at ${OWNER_ROOT} (production/CI environment)`);
    console.log('   Using already-synced public copies...\n');
  }

  // Step 2: Build manifest from public copies
  for (const mapping of FOLDER_MAPPING) {
    const targetDir = join(PUBLIC_PROJECTS_DIR, mapping.slug);

    if (!existsSync(targetDir)) {
      console.error(
        `\n✗ No synced images for "${mapping.slug}" at "${targetDir}".\n` +
        `  Run sync from a machine with the owner folders first.`
      );
      process.exit(1);
    }

    const images = await buildManifestEntry(mapping.slug, mapping.title, targetDir);
    manifest[mapping.slug] = images;
    console.log(`  ✓ ${mapping.slug}: ${images.length} image(s) manifested`);
  }

  // Step 3: Write manifest
  await writeManifest(manifest);

  const totalImages = Object.values(manifest).reduce((sum, imgs) => sum + imgs.length, 0);
  console.log(
    `\n✅ Done: ${Object.keys(manifest).length} projects, ${totalImages} images total.`
  );
  console.log(`   Manifest: content/generated-project-galleries.ts`);
}

main().catch((err) => {
  console.error('✗ Gallery sync failed:', err);
  process.exit(1);
});
