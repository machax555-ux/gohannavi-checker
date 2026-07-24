# Hallmark Rule-Set (Anti-AI-Slop Design Skill)

> Source: Nutlope/hallmark (v1.1.0)
> Purpose: Anti-AI-slop design skill for greenfield pages, audits, redesigns, and design extraction.

---
name: hallmark
description: "Anti-AI-slop design skill for greenfield pages, audits, redesigns, and design extraction from URLs or screenshots."
version: 1.1.0
---

# Hallmark

A design skill for AI coding assistants. Makes the UIs they generate look made, not generated.

Hallmark is opinionated, short, and boring on purpose. It encodes a tight set of rules — drawn from the consensus of the anti-AI-slop design field (Anthropic's frontend-design skill, the Claude cookbook on frontend aesthetics, and the 2026 "tactile rebellion" movement) — and refuses to let the model fall back to the defaults every LLM was trained on.

The differentiator: Hallmark insists on **structural variety**, not just visual variety. Two pages by Hallmark for two different briefs should not share the same hero → 3-feature → CTA → footer rhythm. They should feel like different sites, not different colour-swaps of the same template.

---

## Disciplines that hold across every verb

These six disciplines apply to default Design, `audit`, `redesign`, `study`, and component-scope alike.

1. **Pre-emit self-critique.** Before handing back any output, score it 1–5 on six axes — Philosophy, Hierarchy, Execution, Specificity, Restraint, Variety. Anything **< 3** triggers a revision pass. Stamp the six scores at the top of the artifact (`/* Hallmark · pre-emit critique: P5 H4 E5 S4 R5 V5 */`).

2. **Honest copy — no fabricated content.** If the user did not supply a metric, do not invent one. Stat-led layouts, comparison rows, and proof bars must use real numbers, a placeholder (`—` plus a labelled grey block, "metric to confirm"), or a different macrostructure.

3. **Locked tokens — no mid-render improvisation.** Once a theme is selected, every colour and every `font-family` declaration in the artifact must reference a named token (`var(--color-accent)`, `font-family: var(--font-display)`). Inline OKLCH / hex / `rgb()` values, or a `font-family: "Some Font"` declaration that bypasses the token block, are not allowed.

4. **Re-drawn chrome forbidden.** Hallmark must not hand-build fake browser bars (URL pill + traffic-light dots), fake phone frames, fake code-block windows (mock title bar + dots wrapping a `<pre>`), or fake IDE chrome.

5. **Mobile responsiveness — every emit verified at 320 / 375 / 414 / 768 px.** Hallmark's output must render flawlessly at all four widths: no horizontal scroll, root `overflow-x: clip`, long word text-wrapping, display header wrapping, and single column collapse on mobile.

6. **Typography purity — no italic headers.** Headings and display type are always roman (`font-style: normal`). An italicised emphasis word inside an otherwise-upright heading is one of the most reliable AI tells. Carry emphasis with weight, accent colour, or a drawn underline.

---

## Anti-AI-Slop Design Principles for Food & Health Apps

1. **Clean, Honest & Organic Aesthetics**:
   - Avoid generic AI-generated aesthetic tropes (over-saturated purple/pink gradients, glossy neon badges, centered 3-card features with identical icons).
   - Use warm, grounding earthy tones (deep sage green `#2D6A4F`, soft oat background `#F8F9FA` or warm cream `#FAF9F6`, natural olive accent, subtle amber warning `#D97706`, soft muted red alert `#DC2626`).
2. **Visual Hierarchy & Intentional Asymmetry**:
   - Asymmetrical layout balance to feel crafted rather than auto-generated.
   - High-contrast typography hierarchy (Noto Sans JP / bold headings with generous whitespace, clear labels, distinct metadata badges).
3. **Tactile Interaction**:
   - Micro-feedback (subtle press effects, smooth state transitions, clear loading states).
   - Clean scanning and results flow with direct, intuitive eye movement (Camera Action -> Real-time feedback -> Categorized safety card -> Actionable alternatives).
