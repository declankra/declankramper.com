#!/usr/bin/env python3
"""Build the rapid-fire OG montage (1200x630, 30 fps) from project media.

Every shot is cropped to fill the frame (no letterbox or pillarbox).
Crop boxes are in source pixels; h is derived from w for the 1200:630 aspect.
The Coffer (Summit Waterworks) shot is cut from the previous montage, builds-v4.mp4.

Usage: python3 scripts/build-og-montage.py public/og/builds-v5.mp4
"""
import subprocess, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = f'{ROOT}/public/finished'
M = f'{F}/now-product-montage-expanded.mp4'
V4 = f'{ROOT}/public/og/builds-v4.mp4'
W, H, FPS = 1200, 630, 30
PW = W // 3  # triptych panel width

def h_for(w, ow=W, oh=H):
    return round(w * oh / ow)

# kind, src, start, frames, x, y, w   (still: start ignored)
SHOTS = [
    ('vid', f'{F}/led-race-display-2x.mp4', 0.2, 15, 0, 24, 1280),
    ('vid', f'{F}/chicago-coffee/chicago-coffee-demo.mp4', 1.9, 15, 140, 435, 1000),
    ('tri', [
        ('img', f'{F}/garpple/homeview1.webp', 0, 0, 60, 1242),
        ('vid', f'{F}/chitrack/improved_search_results_view.mp4', 3.0, 0, 120, 588),
        ('vid', f'{F}/your-own-font/your-own-font-demo.mp4', 12.6, 40, 110, 640),
    ], 18),
    ('vid', V4, 5.8, 15, 88, 0, 1020),
    ('vid', M, 9.6, 15, 40, 120, 1200),
    ('vid', f'{F}/ontology-xtract/ontology-xtract-preview.web-hq.mp4', 0.6, 12, 256, 150, 1300),
    ('vid', f'{F}/japan-voice/japan-voice-demo.mp4', 10.0, 15, 0, 200, 1620),
    ('vid', f'{F}/sunlit-sips/sunlit-sips-chicago-demo.mp4', 5.5, 12, 20, 148, 1240),
    ('vid', f'{F}/rc-tank.mp4', 2.5, 15, 0, 48, 1280),
    ('vid', f'{F}/interactive-letter-demo.mp4', 17.4, 15, 330, 160, 620),
    ('img', f'{F}/strava-personality-test/personality_result.png', 0, 12, 0, 0, 1796),
    ('vid', f'{F}/website-blocker/website-blocker-demo.mp4', 8.0, 12, 320, 40, 940),
    ('vid', f'{F}/ontology-xtract/ontology-xtract-sanitized-demo.web-hq.mp4', 12.0, 12, 0, 0, 1520),
    ('vid', f'{F}/grade-final-boss/grade-final-boss.gif', 1.0, 12, 0, 40, 800),
    ('vid', f'{F}/screencam-recorder-demo.mp4', 4.0, 12, 172, 80, 976),
    ('vid', f'{F}/remote-windshield-defroster.mp4', 2.0, 12, 320, 160, 1600),
    ('tri', [
        ('img', f'{F}/race-time-calculator/Results.png', 0, 0, 280, 1170),
        ('vid', f'{F}/chitrack/ability_to_view_all_upcoming_arrivals.mp4', 1.0, 0, 150, 588),
        ('img', f'{F}/garpple/homeview2.webp', 0, 0, 60, 1242),
    ], 15),
    ('img', f'{F}/meet-or-not/results.webp', 0, 12, 0, 0, 2392),
    ('img', f'{F}/garpple/surgent-landing.webp', 0, 12, 289, 200, 2400),
]

inputs, chains, labels = [], [], []

def add_input(kind, src, start, frames):
    idx = inputs.count('-i')
    if kind == 'img':
        inputs.extend(['-loop', '1', '-framerate', str(FPS), '-t', f'{frames / FPS + 0.5:.3f}', '-i', src])
    else:
        inputs.extend(['-ss', f'{start}', '-t', f'{frames / FPS + 1:.3f}', '-i', src])
    return idx

def chain(idx, x, y, w, ow, oh, frames, label):
    h = h_for(w, ow, oh)
    chains.append(
        f'[{idx}:v]fps={FPS},crop={w}:{h}:{x}:{y},scale={ow}:{oh}:flags=lanczos,'
        f'setsar=1,format=yuv420p,trim=end_frame={frames},setpts=PTS-STARTPTS[{label}]')

for n, shot in enumerate(SHOTS):
    if shot[0] == 'tri':
        _, panels, frames = shot
        plabels = []
        for p, (kind, src, start, x, y, w) in enumerate(panels):
            idx = add_input(kind, src, start, frames)
            lab = f's{n}p{p}'
            chain(idx, x, y, w, PW, H, frames, lab)
            plabels.append(f'[{lab}]')
        chains.append(
            f'{"".join(plabels)}hstack=inputs=3,'
            f'drawbox=x={PW - 2}:y=0:w=4:h={H}:color=0x111111:t=fill,'
            f'drawbox=x={2 * PW - 2}:y=0:w=4:h={H}:color=0x111111:t=fill[s{n}]')
    else:
        kind, src, start, frames, x, y, w = shot
        idx = add_input(kind, src, start, frames)
        chain(idx, x, y, w, W, H, frames, f's{n}')
    labels.append(f'[s{n}]')

chains.append(f'{"".join(labels)}concat=n={len(labels)}:v=1:a=0[out]')
out = sys.argv[1] if len(sys.argv) > 1 else 'out.mp4'
cmd = ['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(chains), '-map', '[out]',
       '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
       '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
       '-g', '30', '-movflags', '+faststart', '-an', out]
subprocess.run(cmd, check=True)
total = sum(s[2] if s[0] == 'tri' else s[3] for s in SHOTS)
print(f'{len(SHOTS)} shots, {total} frames, {total / FPS:.2f}s -> {out}')
