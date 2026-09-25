import { copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const OWNER_ROOT = 'D:\\MOSTAFA.P';
const WEBSITE_ROOT = 'D:\\MOSTAFA.P\\website';
const PUBLIC_ASSETS = join(WEBSITE_ROOT, 'public', 'assets');
const FFMPEG_PATH = join(WEBSITE_ROOT, 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function main() {
  console.log('🚀 Restoring all original asset binaries...');

  const brandDir = join(PUBLIC_ASSETS, 'brand');
  const workDir = join(PUBLIC_ASSETS, 'work');
  const projectsDir = join(PUBLIC_ASSETS, 'projects');
  const videoDir = join(PUBLIC_ASSETS, 'video');

  await ensureDir(brandDir);
  await ensureDir(workDir);
  await ensureDir(projectsDir);
  await ensureDir(videoDir);

  // 1. Brand images mapping
  const brandMap = [
    { src: '1 copy.jpg.jpeg', dest: 'aviation-campaign-01.jpg' },
    { src: '2 copy.jpg.jpeg', dest: 'aviation-campaign-02.jpg' },
    { src: '3 copy.jpg.jpeg', dest: 'aviation-campaign-03.jpg' },
    { src: 'Artboard 12.png', dest: 'meet-panel.png' },
    { src: 'Artboard 13.png', dest: 'the-panel.png' },
    { src: 'Artboard 14.png', dest: 'branding-panel.png' },
    { src: 'company profile MOSTAFA AHMED_page-0010.jpg.jpeg', dest: 'experience-matrix.jpg' },
    { src: 'C 1.jpg.jpeg', dest: 'founder-story-01.jpg' },
    { src: 'C 2.jpg.jpeg', dest: 'founder-story-02.jpg' },
    { src: 'c 3.jpg.jpeg', dest: 'founder-story-03.jpg' },
    { src: 'CARO. copy.jpg.jpeg', dest: 'founder-story-wide.jpg' },
    { src: 'announcment copy.jpg.jpeg', dest: 'mostafa-founder-wide.jpg' },
    { src: 'announcment copy C.jpg.jpeg', dest: 'mostafa-launch-statement.jpg' },
    { src: 'announcment copy B.jpg.jpeg', dest: 'mostafa-portrait.jpg' },
    { src: 'announcment copy A.jpg.jpeg', dest: 'mostafa-wordmark-dark.jpg' },
    { src: 'Untitled design.png', dest: 'mostafa-logo-dark.png' },
    { src: 'logo.png', dest: 'mostafa-logo-light.png' },
    { src: 'logo.png', dest: 'mostafa-logo-nav.png' },
  ];

  for (const item of brandMap) {
    const srcPath = join(OWNER_ROOT, item.src);
    const destPath = join(brandDir, item.dest);
    if (existsSync(srcPath)) {
      await copyFile(srcPath, destPath);
      console.log(`  ✓ Brand: ${item.dest}`);
    } else {
      console.warn(`  ⚠ Missing: ${srcPath}`);
    }
  }

  // 2. Identity artboards
  const identityMap = [
    { src: 'Artboard 2.png', dest: 'identity-aircraft-screen.png' },
    { src: 'Artboard 3.png', dest: 'identity-airport-billboard.png' },
    { src: 'Artboard 4.png', dest: 'identity-airport-kiosk.png' },
    { src: 'Artboard 5.png', dest: 'identity-laptop.png' },
    { src: 'Artboard 6.png', dest: 'identity-luggage.png' },
    { src: 'Artboard 7.png', dest: 'identity-services.png' },
    { src: 'Artboard 8.png', dest: 'identity-signage.png' },
    { src: 'Artboard 9.png', dest: 'identity-mission.png' },
    { src: 'Artboard 10.png', dest: 'identity-values.png' },
    { src: 'Artboard 11.png', dest: 'identity-mobile.png' },
  ];

  for (const item of identityMap) {
    const srcPath = join(OWNER_ROOT, item.src);
    const destPath = join(workDir, item.dest);
    if (existsSync(srcPath)) {
      await copyFile(srcPath, destPath);
      console.log(`  ✓ Work identity: ${item.dest}`);
    }
  }

  // 3. Project covers
  const coverMap = [
    { src: join(OWNER_ROOT, 'cover Exhibition Booths and Branded Environments', 'IMG_0577.JPG.jpeg'), dest: join(projectsDir, 'exhibition-booths-cover.jpg') },
    { src: join(OWNER_ROOT, 'cove of Airport and Inaugural Flight Activations', 'IMG_1890.JPG.jpeg'), dest: join(projectsDir, 'airport-activations-cover.jpg') },
  ];

  for (const item of coverMap) {
    if (existsSync(item.src)) {
      await copyFile(item.src, item.dest);
      console.log(`  ✓ Cover: ${item.dest}`);
    }
  }

  // 4. Video compression & poster
  const srcVideo = join(OWNER_ROOT, 'Travel.mp4');
  const destVideo = join(videoDir, 'travel-marketing.mp4');
  const destPoster = join(videoDir, 'travel-marketing-poster.jpg');

  if (existsSync(srcVideo)) {
    console.log('  🎬 Compressing video (720p H.264 web-optimized)...');
    try {
      // Compress to 720p, CRF 26, faststart for instant web streaming
      await execFileAsync(FFMPEG_PATH, [
        '-y',
        '-i', srcVideo,
        '-vf', 'scale=-2:720',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '26',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        destVideo
      ]);
      console.log('  ✓ Video compressed successfully!');

      // Extract poster from 1st second
      await execFileAsync(FFMPEG_PATH, [
        '-y',
        '-ss', '00:00:01',
        '-i', srcVideo,
        '-vframes', '1',
        '-q:v', '2',
        destPoster
      ]);
      console.log('  ✓ Video poster extracted successfully!');
    } catch (err) {
      console.error('  ⚠ FFmpeg encoding error:', err.message);
    }
  }

  console.log('✅ Asset restoration complete!');
}

main().catch(console.error);
