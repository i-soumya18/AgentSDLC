# Design System & Token Specifications

## 1. Color Palette (HSL Engineered)
- **Primary / Brand**: `hsl(215, 90%, 52%)` (#1e6cfb)
- **Primary Hover**: `hsl(215, 90%, 44%)`
- **Surface Dark**: `hsl(222, 47%, 11%)` (#0f172a)
- **Surface Card**: `hsl(217, 33%, 17%)` (#1e293b)
- **Border / Divider**: `hsl(217, 24%, 25%)` (#334155)
- **Success**: `hsl(142, 71%, 45%)` (#22c55e)
- **Warning**: `hsl(38, 92%, 50%)` (#f59e0b)
- **Destructive / Error**: `hsl(0, 84%, 60%)` (#ef4444)

## 2. Typography
- **Primary Font**: `Inter, system-ui, -apple-system, sans-serif`
- **Monospace Font**: `JetBrains Mono, Fira Code, monospace`
- **Scale**:
  - Display: 32px / line-height 40px / font-weight 700
  - Heading 1: 24px / line-height 32px / font-weight 600
  - Heading 2: 20px / line-height 28px / font-weight 600
  - Body: 15px / line-height 24px / font-weight 400
  - Small / Caption: 13px / line-height 18px / font-weight 400

## 3. Spacing & Elevation Tokens
- Spacing unit: `4px` base (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`).
- Radius: Card `8px`, Button `6px`, Modal `12px`.
- Shadows: Glassmorphism subtle border with backdrop filter `blur(8px)`.
