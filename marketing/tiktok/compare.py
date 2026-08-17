import subprocess, sys, numpy as np
from PIL import Image
from io import BytesIO

PAL = np.array([[0xf1,0xf2,0xee],[0xe6,0xe8,0xe2],[0xcd,0xd0,0xc8],
                [0x1e,0x40,0x34],[0x2c,0x5f,0x4d],[0x15,0x17,0x1b]], float)

def frames(path, n=60):
    w, h = 240, 428
    raw = subprocess.run(
        ['ffmpeg','-v','error','-i',path,'-vf',f'fps=8,scale={w}:{h}','-f','rawvideo',
         '-pix_fmt','rgb24','-'], capture_output=True).stdout
    if not raw:
        sys.exit('not a video: ' + path)
    a = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3).astype(float)
    return a[:n]

def report(name, path):
    f = frames(path)
    flat = f.reshape(len(f), -1, 3)
    d = np.linalg.norm(flat[:, :, None, :] - PAL[None, None, :, :], axis=3).min(2)
    on_pal = (d < 16).mean() * 100
    drift = d.mean()
    q = (f[0] // 24).astype(int)
    uniq = len(np.unique(q.reshape(-1, 3), axis=0))
    loop = np.abs(f[0] - f[-1]).mean()
    flick = np.abs(np.diff(f, axis=0)).mean()
    still = np.abs(f - f.mean(0)).mean()
    print(f'{name:10} on-palette {on_pal:5.1f}%  drift {drift:5.2f}  '
          f'colours {uniq:3d}  loop-gap {loop:5.2f}  flicker {flick:5.2f}  motion {still:5.2f}')

print('on-palette: % of pixels within 16 of a brand hex (higher better)')
print('drift: mean distance from nearest brand hex (lower better)')
print('colours: distinct quantised colours in frame 1 (lower = flatter)')
print('loop-gap: first vs last frame difference (lower better)')
print('flicker: mean frame-to-frame change (lower = less boil)')
print('motion: mean deviation from the average frame (higher = more happens)\n')
for name, path in [a.split('=') for a in sys.argv[1:]]:
    report(name, path)
