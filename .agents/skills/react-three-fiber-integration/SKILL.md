---
name: react-three-fiber-integration
description: Guidelines and architectural patterns for integrating React Three Fiber (R3F) and Three.js 3D micro-artifacts into Creda while strictly honoring the Oberon/AgentLab design mandates, performance budgets, and memory disposal practices.
---

# React Three Fiber Integration in Creda

## Core Architectural Mandate
Creda employs an editorial, high-contrast, architectural design aesthetic (Oberon × AgentLab). 3D artifacts must feel like **machined physical proof tokens, cryptographic seals, and abstract syntax graphs**, NOT generic colorful gaming orbs or distracting toy animations.

### 1. Palette & Surface Materiality
- **Surfaces**: Brushed titanium (`#1E293B`, `#0F172A`), obsidian slate, and architectural paper white (`#FAFAF8`).
- **Accent Lighting**: Creda Cobalt/Indigo (`#4F46E5`) rim lighting and subtle ambient reflection.
- **Metalness / Roughness**: High roughness (`0.4 - 0.7`) and moderate metalness (`0.3 - 0.8`) to achieve a matte, architectural finish rather than high-gloss chrome.
- **Zero Rainbow/Neon Orbs**: Never introduce purple/pink neon gradient lights, floating pastel blobs, or particle confetti.

### 2. Next.js & SSR Safety
- Always wrap 3D R3F components in dynamic imports with `ssr: false` when used on Next.js pages:
  ```tsx
  import dynamic from "next/dynamic";

  const CryptographicSeal3D = dynamic(
    () => import("@/components/3d/CryptographicSeal3D"),
    { ssr: false, loading: () => <SealFallbackSkeleton /> }
  );
  ```

### 3. Performance & Energy Efficiency
- **Frameloop on Demand**: Never run continuous 60fps loops when the scene is static. Use `frameloop="demand"` and invalidate when cursor moves or state updates:
  ```tsx
  <Canvas frameloop="demand" dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
  ```
- **Disposal**: Always clean up geometries and materials on unmount.
- **DPR Clamping**: Restrict Device Pixel Ratio to `[1, 1.5]` to prevent GPU thermal throttling on 4K / Retina displays.

### 4. Interactive Micro-Interactions
- Smooth cursor tilt / mouse parallax (quaternion lerp or damp).
- State-driven rotation on SHA-256 verification (e.g. slight spin and lock into place when hash audit passes).
