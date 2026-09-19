# Design System Specification: AgentSDLC Factory Design System

> **Visual Style:** `standard`  
> **Density:** `comfortable`  
> **Platforms:** Mobile  
> **Accessibility Standard:** WCAG 2.1 AA (4.5:1 contrast)

## Design Assumptions
- **[D-ASSUMP-001] (COLOR_SYSTEM)**: Adopt tailored slate-cyan HSL palette with WCAG AAA contrast — _User did not specify a brand color hex; standardizing on accessible slate-cyan theme._
- **[D-ASSUMP-002] (TYPOGRAPHY)**: Use modern sans-serif typography (Inter) with monospace code accents — _Optimizes readability across desktop and mobile screens._
- **[D-ASSUMP-003] (MOTION)**: Micro-animations capped at 250ms with accessible motion suppression — _Ensures snappy interaction without triggering motion sensitivity._

## 1. Color Palette (HSL Tokens)
| Role | HSL Value | Purpose |
|---|---|---|
| Primary | `hsl(215, 80%, 48%)` | Brand interactive elements & primary CTAs |
| Secondary | `hsl(215, 20%, 94%)` | Subtle backgrounds and secondary actions |
| Accent | `hsl(190, 90%, 42%)` | Highlights and active focus rings |
| Background | `hsl(220, 25%, 98%)` | Main application background |
| Surface | `hsl(0, 0%, 100%)` | Card and modal surface container |
| Success | `hsl(145, 65%, 40%)` | Verified gates and passing tests |
| Warning | `hsl(38, 92%, 50%)` | Potential drift and pending reviews |
| Error | `hsl(0, 75%, 55%)` | Gate failures and RFC 7807 problem details |

## 2. Typography Scale
- **UI Sans Font:** `Inter, system-ui, -apple-system, sans-serif`
- **Monospace Font:** `JetBrains Mono, ui-monospace, monospace`

| Size Token | REM Value |
|---|---|
| `xs` | `0.75rem` |
| `sm` | `0.875rem` |
| `md` | `1rem` |
| `lg` | `1.125rem` |
| `xl` | `1.25rem` |
| `2xl` | `1.5rem` |
| `3xl` | `1.875rem` |

## 3. Spacing Grid & Radius
- **Base Grid Unit:** `8px`
- **Radius Scale:** sm=`4px`, md=`8px`, lg=`12px`, full=`9999px`

