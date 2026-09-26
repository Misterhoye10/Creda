---
name: architectural-ui-design
description: >-
  Use this skill whenever designing, building, or styling UI components, layouts,
  marketing sections, cards, or hero elements for Creda following the Oberon, AgentLab,
  and Parley architectural aesthetic.
---

# Architectural UI Design Skill

## Design Principles

### 1. Color Discipline
- **Single Brand Accent**: Creda's signature cobalt/indigo (`#4F46E5` / `rgb(79, 70, 229)`).
- **Strict Neutral Dominance**:
  - Backgrounds: Crisp paper white (`#FFFFFF`), light canvas (`#FAFAFA` / `#F8FAFC`), or dark slate (`#0B0F19`, `#111827`).
  - Borders: Subtle hairline borders (`#E5E7EB` or `rgba(255, 255, 255, 0.08)`).
  - Text: High-contrast ink black (`#0F172A`) or pure white (`#FFFFFF`) with secondary slate (`#64748B`, `#94A3B8`).
- **Prohibited**:
  - Multi-colored badge bars (green, red, yellow, purple together).
  - Rainbow gradients across typography.
  - Fuzzy neon blur circles floating behind text.

### 2. Typography Hierarchy
- **Editorial Headings**: High-contrast editorial display serif (e.g. `Instrument Serif`) paired with crisp geometric grotesque sans (`Inter` or `Plus Jakarta Sans`).
- **Technical Monospace**: `JetBrains Mono` for system metadata, ledger numbers, verification timestamps, and tags.
- **Rhythm**: Generous line-height (`1.2` for titles, `1.6` for body copy), balanced font size using `clamp()`.

### 3. Architectural Structure
- **Hairline Grids & Structural Crosshairs**: Fine borders with `+` glyphs at layout intersections.
- **Card Framing**: Clean container cards (`rounded-2xl` or `rounded-3xl` like Parley) with hairline borders, subtle inner shadows, and zero tacky colored outlines.
- **Node Diagrams & Connectors** (Oberon style): Technical evidence nodes linked by fine lines showing the verification pipeline.

### 4. Zero-Clipping Layout Rules
- **No `justify-center` on full-viewport flex containers** containing scrollable content.
- Generous top padding (`pt-28` to `pt-36`) to account for fixed navigation bars.
- Ample bottom padding (`pb-24` to `pb-32`) between sections.
- Test across viewport heights (650px laptop to 1440px desktop).
