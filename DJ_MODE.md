# DJ Mode Remix System — Council Spec (Sound Engineer × Senior SWE × Product Designer × DJ)

This document describes a premium “DJ mode” that lets people remix the visuals and sound of the site’s ambient music feature. It includes creative remix directions, system architecture, UI transitions, and a sharing model that lets others “load your settings into a CD player.”

---

## 1) Vision (Council Statement)

**Sound Engineer**: “We’re not just adding effects; we’re exposing the musical DNA — tempo, energy, dynamics, and timbre — as controllable signals.”

**Senior SWE**: “We’ll build a stable engine where sound, visuals, and interaction share a single timing clock. Presets are data-first and shareable.”

**Product Designer**: “The interface is premium, tactile, and intuitive. We’ll make complex remixing feel like play.”

**DJ**: “Let them ride the energy. The visuals should feel like they’re *playing* the room.”

**Goal**: Transform the site’s ambient audio into an interactive, remixable experience with a “DJ mode” UI that feels like chrome hardware — fast, musical, and sharable.

---

## 2) DJ Mode Experience — User Flow

1. **Enter DJ Mode** from the home page (button in footer or header). Screen transitions into a premium, chrome console UI.
2. **Auto‑mix starts** (a tasteful default preset). Visuals and audio are already in sync.
3. **User tweaks** with a small set of “musical” controls: energy, color, pulse, density, movement.
4. **Advanced layer** reveals deeper controls: beat mapping, spectral routing, motion systems.
5. **Share the mix** as a compact preset code (“CD”) others can load in DJ mode.
6. **Load a shared mix** via URL or code input: the system snaps to the new preset instantly.

---

## 3) Remix Controls — What Users Can Change

The controls are grouped by **Audio**, **Visual**, and **Synchronicity**. Each control can be automatic or user‑driven.

### 3.1 Audio Remix Controls

**Automatic (Default)**
- Auto‑gain and auto‑limiting for consistent loudness
- Auto‑beat detection and tempo estimation
- Auto‑EQ for device tuning (mobile vs desktop)

**Configurable**
- **Energy** (overall loudness envelope)
- **Bass punch** (40–140 Hz boost)
- **Mid presence** (400–2k Hz clarity)
- **Air/shine** (6–10 kHz shimmer)
- **Dynamics** (compress/expand)
- **Stereo width** (narrow → wide)
- **Transient emphasis** (kick/snare emphasis)

### 3.2 Visual Remix Controls

**Automatic (Default)**
- Color palette driven by music energy (warm on bass, cool on flux)
- Density driven by beat strength
- Glow intensity driven by overall mix energy

**Configurable**
- **Color palette** (warm, cool, neon, monochrome, chrome)
- **Hue shift speed** (static → evolving)
- **Saturation** (soft → vivid)
- **Glow** (none → luminous)
- **Spark size** (subtle → explosive)
- **Spark density** (sparse → storm)
- **Motion style** (drift, burst, swirl, gravity)
- **Decay** (fast snap → long tail)
- **Background haze** (smoke/fog intensity)

### 3.3 Sync & Rhythm Controls

**Automatic (Default)**
- Beat snapping
- Temporal smoothing

**Configurable**
- **Beat source** (auto only)
- **Beat multiplier** (1x / 2x / 4x / off‑beats)
- **Offset** (fine timing shift ±100 ms)
- **Pulse shape** (sharp / smooth / gated)
- **Latency compensation** (device timing correction)

---

## 4) Visual Systems (Creative Directions)

We’ll offer multiple visual “engines” that remix the same audio signals differently. Users can switch between or combine them.

1. **Spark Field (current)**
   - Sparks hitting the background on beat
   - Flash halos and streaks

2. **Light Haze (DJ Fog)**
   - Semi‑transparent gradients that swell on bass
   - Brightness modulated by spectral flux

3. **Laser Lines**
   - Thin neon beams sweeping across the canvas
   - Angle and speed mapped to tempo

4. **Chrome Pulse**
   - Metallic rings expanding from beat hits
   - Feels like a premium hardware faceplate

5. **Swarm Constellation**
   - Particles flock, then explode outward on beat

6. **Bass Dome**
   - Subtle dome‑like light, pulsing with low‑end

7. **Spectral Equalizer Bars**
   - Minimal, aesthetic bar movement (DJ booth vibe)

Each engine is a preset with exposed parameters — users can mix and match.

---

## 5) DJ Mode UI (Premium Chrome Aesthetic)

The attached reference shows a chrome, hardware‑like control strip. We’ll adopt:

- **Chrome pill buttons** with inner glow + dark glass
- **Knurled knobs** (drag to adjust)
- **Ring‑lit play button**
- **Minimal iconography** and large tactile hit targets
- **High‑contrast type** with tight letter spacing
- **Subtle reflective gradients + micro‑animations**

### UI Regions
- **Top Bar**: Play / Pause, Track display, Shuffle
- **Center Console**: Main Remix Controls (4–6 large knobs)
- **Bottom Dock**: Presets, Save, Share, Load (“CD Player”)
- **Right Side**: Advanced panel (optional)

---

## 6) Architecture Changes

### 6.1 Core Modules

- **Audio Engine**
  - Web Audio context, analysis nodes, and FX chain
  - Exposes signal data (`bassEnergy`, `flux`, `score`, `tempo`)

- **Visual Engine**
  - Canvas renderer with multiple “engines”
  - Consumes signal data and user parameters

- **Preset Manager**
  - Saves JSON presets to localStorage
  - Generates shareable encoded presets for URL + “CD”

- **DJ Mode State Machine**
  - `idle` → `entering` → `live` → `exiting`
  - Smooth transitions and audio fade

### 6.2 Suggested File Structure

- `src/components/dj/DJMode.tsx`
- `src/components/dj/DJConsole.tsx`
- `src/components/dj/DJKnob.tsx`
- `src/components/dj/DJStore.ts`
- `src/components/dj/presets.ts`
- `src/components/audio/AudioEngine.ts`
- `src/components/visual/VisualEngine.ts`

---

## 7) “CD Player” Sharing Model

**Concept**: A remix preset is a “CD.” Users can save one, share it, and others can “load it into the CD player.”

### Share Format
- **Preset JSON**: all settings
- **Encoded string**: base64 or url‑safe compressed JSON
- **Share URL**: `?mix=encoded`

### Flow
1. User clicks **Share** → copy a short code + URL
2. Recipient pastes code into **Load CD**
3. DJ Mode loads the preset and replays the “mix”

### Optional Enhancements
- Allow “fork remix” so users can tweak and re‑share
- Include metadata: author name, title, tags, created date

---

## 8) Metrics & Product Goals

- **Engagement**: time in DJ mode
- **Remix rate**: % who adjust settings
- **Share rate**: % who create/share presets
- **Load rate**: % who load a shared mix

---

## 9) Risks & Mitigations

- **CPU load** on weaker devices → Offer “Lite mode” visuals
- **Audio latency** on mobile → Add optional offset slider
- **Complexity** → Keep defaults gorgeous and easy

---

## 10) Roadmap

**Phase 1 — Core DJ Mode**
- Audio engine + visual engine + basic console UI
- Preset save + share code

**Phase 2 — Remix Systems**
- Multiple visual engines
- Beat source stays automatic (no bpm/beatmap modes)

**Phase 3 — Premium Experience**
- Chrome UI polish + haptics (where possible)
- Animated transitions and micro‑interaction details

---

## 11) Example Preset Schema (Shareable)

```json
{
  "name": "Night Drive",
  "author": "Declan",
  "visual": {
    "engine": "spark",
    "hue": 28,
    "saturation": 0.85,
    "glow": 0.7,
    "density": 0.9,
    "size": 1.2,
    "decay": 0.6
  },
  "audio": {
    "energy": 0.8,
    "bass": 0.9,
    "presence": 0.6,
    "air": 0.3,
    "width": 0.7
  },
  "sync": {
    "mode": "auto",
    "beatMultiplier": 1,
    "offsetMs": -12
  }
}
```

---

## Final Note (from the council)

We are not just building a visualizer. We’re creating a remix instrument. It should feel like a luxurious piece of gear — both powerful and playful — where anyone can create a unique audio‑visual mix and share it as if they handed a CD to a friend.
