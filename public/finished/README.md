# Finished Projects Assets

## Optimal File Formats for Fast Loading

### Images
- **Format**: WebP (primary), PNG (fallback for transparency), JPEG (fallback for photos)
- **Dimensions**: 512x320px (16:10 aspect ratio) for consistency
- **Optimization**: Compressed to <50KB per image
- **Naming**: Use descriptive kebab-case names (e.g., `project-name-screenshot.webp`)

### Videos
- **Format**: MP4 (H.264 codec)
- **Dimensions**: 512x320px (16:10 aspect ratio) to match images
- **Duration**: Keep under 10 seconds for quick demos
- **Size**: Compressed to <2MB per video
- **Settings**: 
  - Bitrate: ~500kbps
  - Frame rate: 24fps
  - Audio: Remove if not essential
- **Naming**: Use descriptive kebab-case names (e.g., `project-name-demo.mp4`)

### GIFs
- **Recommendation**: Use MP4 instead of GIF for better compression
- **If GIF required**: 
  - Max dimensions: 512x320px
  - Optimize with tools like Gifsicle
  - Keep file size <1MB
  - Limit colors to reduce file size

## Performance Best Practices

1. **Lazy Loading**: All media uses Next.js Image component with lazy loading
2. **Preload**: Critical images can use `priority` prop
3. **Responsive**: Images should have srcset for different screen sizes
4. **Placeholder**: Use blur placeholders for smooth loading experience
5. **CDN**: Files served through Next.js optimization automatically

## Folder Structure
```
/public/
├── images/finished/           # Static images (WebP, PNG, JPEG)
└── videos/finished/           # Video files (MP4)
```