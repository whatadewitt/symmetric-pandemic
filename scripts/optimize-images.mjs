import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '../images');
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');

// Target dimensions for card display (2x for retina)
const WIDTH = 576;
const HEIGHT = 384;

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...');
  
  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  // Get all PNG files
  const files = await fs.readdir(INPUT_DIR);
  const pngFiles = files.filter(file => file.endsWith('.png'));
  
  let originalSize = 0;
  let optimizedSize = 0;
  
  for (const file of pngFiles) {
    const inputPath = path.join(INPUT_DIR, file);
    const basename = path.basename(file, '.png');
    
    // Get original file size
    const stats = await fs.stat(inputPath);
    originalSize += stats.size;
    
    console.log(`Processing ${basename}...`);
    
    // Create optimized WebP (best compression)
    const webpPath = path.join(OUTPUT_DIR, `${basename}.webp`);
    await sharp(inputPath)
      .resize(WIDTH, HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toFile(webpPath);
    
    // Create optimized JPEG (fallback)
    const jpegPath = path.join(OUTPUT_DIR, `${basename}.jpg`);
    await sharp(inputPath)
      .resize(WIDTH, HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90, progressive: true })
      .toFile(jpegPath);
    
    // Get optimized sizes
    const webpStats = await fs.stat(webpPath);
    const jpegStats = await fs.stat(jpegPath);
    optimizedSize += webpStats.size; // Count WebP as primary format
    
    const reduction = Math.round((1 - webpStats.size / stats.size) * 100);
    console.log(`  ✅ ${basename}: ${(stats.size / 1024 / 1024).toFixed(1)}MB → ${(webpStats.size / 1024).toFixed(0)}KB (-${reduction}%)`);
  }
  
  console.log('\n✅ Optimization complete!');
  console.log('📊 Total size comparison:');
  console.log(`Original: ${(originalSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Optimized (WebP): ${(optimizedSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Size reduction: ${Math.round((1 - optimizedSize / originalSize) * 100)}%`);
}

optimizeImages().catch(console.error);