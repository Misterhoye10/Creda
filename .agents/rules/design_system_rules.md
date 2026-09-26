# Creda — Architectural & Marketing Design Guidelines

These guidelines are always active for Creda's frontend and marketing web experience.

## 1. Core Marketing Philosophy: The Trust Engine
Every marketing section must answer four questions with extreme clarity:
1. **Who We Are**: Authoritative, confident identity — Creda: The AI-powered proof-of-work skill passport for African tech talent.
2. **What We Do**: Plain-English technical mechanism — Ingest GitHub commits, PRs, and CVs; analyze syntax trees & commit velocity; issue cryptographically verified Skill Passports.
3. **How to Experience It**: Direct interactive demonstration on the page — visitors must touch, inspect, and test verified credentials before signing up.
4. **How to Get Started**: Zero-friction, immediate next step — "Claim Your Free Passport in 60s" with no credit card or complex setup.

## 2. Color Discipline: Single Brand Color + Neutrals Only
- **Brand Color**: Primary brand cobalt/indigo (`#4F46E5` / `#4338CA` or CSS variable `--color-brand`) used exclusively for:
  - Primary call-to-action buttons
  - Active selection states
  - Central verification seal / focal node
- **Neutrals Only**:
  - Pure whites (`#FFFFFF`) and architectural paper canvas (`#FAFAFA` / `#F8FAFC`)
  - Deep ink blacks and charcoals (`#0F172A`, `#111827`, `#0A0A0C`)
  - Architectural borders (`#E5E7EB`, `rgba(255,255,255,0.08)`)
  - Subdued slate text (`#64748B`, `#94A3B8`)
- **Strict Prohibition**:
  - NO multi-colored rainbow badge pills (green, yellow, red, purple fighting for attention).
  - NO neon text gradients (e.g. purple-to-green text fills).
  - NO fuzzy floating blur orbs behind text.
  - NO cliché red "X" vs green checkmark comparison tables.

## 3. Typography & Art Direction (Oberon × AgentLab × Parley)
- **Display Headings**: High-contrast, mature editorial typography (e.g. `Instrument Serif` / editorial serif paired with crisp modern grotesk `Inter` / `Plus Jakarta Sans`).
- **Technical Metadata**: Monospaced tags (`JetBrains Mono`) for IDs, hashes, timestamps, and protocol versions.
- **Hairline Grids & Crosshairs**: Clean borders with subtle structural crosshair markers (`+`) at layout junctions.

## 4. Layout & Spacing Rules: Zero Clipping Guarantee
- NEVER use `justify-content: center` on full-viewport flex containers containing long-form content.
- Generous top and bottom section padding (`pt-32` to `pt-36`, `pb-24` to `pb-32`) to accommodate fixed headers.
- Always use natural vertical document flow with max-widths (`max-w-6xl`, `max-w-7xl`) and responsive gutters (`px-6 sm:px-8`).
- Mobile-first responsiveness: Ensure every card, ledger, and table stacks gracefully on mobile screens.
