#!/bin/bash

# Image optimization script for Pandemic city maps
# Requires: brew install imagemagick webp

echo "🖼️  Starting image optimization..."

# Create optimized directory
mkdir -p public/images/optimized

# Target dimensions (card display is roughly 288x192px, so 2x for retina)
WIDTH=576
HEIGHT=384

# Process each PNG
for img in images/*.png; do
    filename=$(basename "$img" .png)
    
    echo "Processing $filename..."
    
    # Option 1: Create optimized WebP (best compression, ~80-90% smaller)
    convert "$img" \
        -resize ${WIDTH}x${HEIGHT}^ \
        -gravity center \
        -crop ${WIDTH}x${HEIGHT}+0+0 \
        -quality 85 \
        "public/images/optimized/${filename}.webp"
    
    # Option 2: Create fallback optimized JPEG (for older browsers)
    convert "$img" \
        -resize ${WIDTH}x${HEIGHT}^ \
        -gravity center \
        -crop ${WIDTH}x${HEIGHT}+0+0 \
        -quality 90 \
        "public/images/optimized/${filename}.jpg"
    
    # Option 3: Create smaller PNG (still larger but lossless)
    convert "$img" \
        -resize ${WIDTH}x${HEIGHT}^ \
        -gravity center \
        -crop ${WIDTH}x${HEIGHT}+0+0 \
        -strip \
        -define png:compression-level=9 \
        "public/images/optimized/${filename}.png"
done

echo "✅ Optimization complete!"
echo "📊 Size comparison:"
echo "Original: $(du -sh images/ | cut -f1)"
echo "Optimized: $(du -sh public/images/optimized/ | cut -f1)"
echo ""
echo "File type breakdown:"
echo "WebP: $(du -sh public/images/optimized/*.webp 2>/dev/null | tail -1 | cut -f1) total"
echo "JPEG: $(du -sh public/images/optimized/*.jpg 2>/dev/null | tail -1 | cut -f1) total"
echo "PNG:  $(du -sh public/images/optimized/*.png 2>/dev/null | tail -1 | cut -f1) total"