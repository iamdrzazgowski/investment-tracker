# Skill: Nordwell — Design System (Next.js + Tailwind CSS + shadcn/ui)

This document describes the design system of the **Nordwell** investment app,
extracted from the existing React prototype, so it can be rebuilt in a
**Next.js (App Router) + Tailwind CSS + shadcn/ui** stack. It's meant to be a
reference point for new screens so everything stays consistent and
"professional" — i.e. restrained, data-first, no gimmicks.

---

## 1. Design philosophy

- **Fintech / private banking**, not a "crypto app" look. Tone: calm,
  editorial, precise — light background, generous whitespace, a narrow accent
  palette.
- **Data over decoration.** Every element (color, icon, chart) carries
  information (profit/loss, asset category) — nothing is purely ornamental.
- **Monospace for numbers**, grotesk for content — a classic fintech move
  that reads as "stock table," not "marketing page."
- **Minimal color hierarchy**: green = gain, red = loss, everything else in
  the UI is near-monochrome (cream background, near-black ink, grays).
- **No decorative gradients or shadows.** The only "effect" is a subtle
  shadow on modals/tooltips and a fade-to-transparent fill gradient under
  charts.

---

## 2. Color tokens

Define these as CSS variables in `globals.css` and wire them into
`tailwind.config` (`hsl(var(--token))`), following shadcn's convention.

| Token              | Hex       | Role                                       |
|---------------------|-----------|---------------------------------------------|
| `--bg`              | `#FAFAF8` | App background                              |
| `--surface`         | `#FFFFFF` | Cards, sidebar, modals                      |
| `--border`          | `#E7E4DF` | Rules, borders, table grid lines            |
| `--border-strong`   | `#D6D2CB` | Border hover, active states                 |
| `--ink`             | `#15151A` | Primary text, primary buttons               |
| `--sub`             | `#6F6E76` | Secondary text, labels                      |
| `--faint`           | `#A6A4AC` | Tertiary text, inactive icons                |
| `--green`           | `#0C6B4F` | Gain / positive change / positive action     |
| `--green-soft`      | `#E4F1EA` | Background for green badges/legend           |
| `--red`             | `#B8403B` | Loss / negative change                       |
| `--red-soft`        | `#FAEAE8` | Background for red badges                    |
| `--amber`           | `#9C7A2E` | "Crypto" category accent                     |
| `--blue`            | `#3E5C8A` | Secondary/reserve accent                     |

Asset category colors (donut chart, bars, avatars):

| Category | Hex       |
|----------|-----------|
| Stocks   | `#15151A` (ink) |
| ETFs     | `#0C6B4F` (green) |
| Crypto   | `#B08A3E` |
| Cash     | `#D6D2CB` (border-strong) |

**Mapping to the shadcn theme** (example `globals.css`):

```css
:root {
  --background: 60 12% 98%;      /* #FAFAF8 */
  --foreground: 240 8% 9%;       /* #15151A */
  --card: 0 0% 100%;
  --card-foreground: 240 8% 9%;
  --border: 40 10% 90%;          /* #E7E4DF */
  --input: 40 10% 90%;
  --muted-foreground: 260 3% 45%; /* #6F6E76 */
  --primary: 240 8% 9%;          /* ink — primary buttons are black, not blue */
  --primary-foreground: 0 0% 100%;
  --destructive: 3 40% 46%;      /* #B8403B */
  --ring: 240 8% 9%;
  --radius: 0.75rem;             /* 12px, see Radius section */
}
```

Also define `--success` (`142 74% 23%` ≈ `#0C6B4F`) — shadcn doesn't ship one
by default, and it's used here more often than `destructive`.

---

## 3. Typography

- **Display / body:** `Inter` (via `next/font/google`), weights 400–650.
  The app uses a custom `650` weight for headings — in Tailwind add
  `fontWeight: { semibold2: '650' }`, or just use `font-semibold` (600) if
  650 isn't available for the given font.
- **Numbers / data / tickers:** `IBM Plex Mono` (via `next/font/google`) —
  used everywhere a monetary value, percentage, or share quantity appears.
  Helper class `.font-mono` + `tabular-nums` + a slightly negative
  `tracking` (`-0.01em`) for better column alignment.
- **Scale:**
  - Hero value (portfolio balance): `42px / 650 / -0.02em`
  - Page heading (`h1`): `22px / 650 / -0.015em`
  - Chart value: `24px / 650`
  - Card title: `13.5px / 600`
  - Body / table cells: `13px / 400–600`
  - Labels / eyebrow: `12px / uppercase / letter-spacing .06em / faint`
  - Micro (ticker, sub-label): `11.5–12px / faint`

```ts
// tailwind.config.ts (excerpt)
fontFamily: {
  sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
  mono: ['var(--font-ibm-plex-mono)', 'ui-monospace', 'SFMono-Regular'],
},
```

---

## 4. Layout

- **Two-column shell**: `216px` sidebar (fixed, `sticky top-0 h-screen`) +
  a main column with `max-w-[1180px] mx-auto`, padding `32px 40px` (desktop),
  `20px 16px` (mobile).
- **Mobile breakpoint: `768px`** — sidebar disappears, a sticky top bar
  appears (hamburger + page title + search icon) with a `Sheet` (drawer) for
  navigation.
- **Two-column grids** (`grid-cols-[1.55fr_1fr]`) collapse to `grid-cols-1`
  at ≤860px — used e.g. on the Dashboard (chart+movers / donut) and Asset
  Detail (position / trade form).
- **Cards are the base layout unit** — every page follows: `PageHeader` →
  a stack of cards (`gap-[22px]`, `rounded-xl border`, `p-5`).

---

## 5. Mapping to shadcn/ui components

| Prototype element              | shadcn/ui component                                |
|----------------------------------|------------------------------------------------------|
| `.it-card`                       | `Card`, `CardHeader`, `CardContent`                   |
| `it-btn--primary/ghost/outline`  | `Button` (`variant="default"/"outline"/"ghost"`)      |
| `.it-range-tabs`, filter chips   | `Tabs` / `ToggleGroup` (`type="single"`)              |
| `.it-table` (Holdings, TX)       | `Table`, `TableHeader`, `TableRow`, `TableCell`       |
| `.it-modal` (Add funds, order)   | `Dialog`                                              |
| Search (⌘K)                      | `Command` + `CommandDialog` (cmdk)                    |
| Mobile navigation drawer         | `Sheet` (`side="left"`)                               |
| `.it-toast`                      | `sonner` (`toast.success(...)`) or `Toast`            |
| `it-tx-badge` (Buy/Sell)         | `Badge` (`variant="secondary"`, custom color)         |
| Avatar (ticker initials)         | `Avatar`, `AvatarFallback`                            |
| `it-delta` (▲/▼ %)               | custom `<Delta />` on top of `Badge`/`span` + `lucide-react` (`ArrowUpRight/DownRight`) |
| Price-mode segmented control     | `Tabs` (compact variant) or `ToggleGroup`             |
| Forms (amount, qty)              | `Input`, `Label`, `Form` (react-hook-form + zod)      |
| Settings dropdown                | `DropdownMenu` / `Select`                             |
| Charts                           | `recharts` (as in the prototype), wrapped in shadcn's `ChartContainer` (`chart.tsx`) |

Additional packages: `lucide-react` (icons — already used), `recharts`,
`cmdk` (via shadcn `Command`), `sonner`, `class-variance-authority` (for
`Delta`/`Badge` variants), `tailwind-merge` + `clsx` (`cn()` helper).

---

## 6. Component patterns

### Card
- `rounded-xl` (12px), `border border-border`, `bg-card`, `p-5`, `mb-[22px]`
  (in Tailwind terms: use a consistent `space-y-5` on the page instead of
  per-card margins).
- Card title: `text-[13.5px] font-semibold mb-3.5` — **do not** use shadcn's
  default `CardTitle` size (too large); override via `className`.

### Delta / percentage change
- Always icon + value, semantic color (`text-emerald-700` / `text-red-700` —
  use the `--success`/`--destructive` tokens), `font-semibold`, `font-mono`
  for the number.
- Two sizes: `md` (13.5px, in headers) and `sm` (12px, in tables/lists).

### Holdings table
- Headers: `text-[11.5px] uppercase tracking-wide text-muted-foreground`.
- Row: `hover:bg-muted/50 cursor-pointer`, numeric cells `text-right
  font-mono tabular-nums`.
- "Asset" cell = `Avatar` (circle, initials, background tied to category) +
  name (`font-semibold text-sm`) + ticker (`text-muted-foreground text-xs`).

### Performance chart (hero chart)
- Recharts `AreaChart`, fill gradient fading to 0 in the trend's color
  (green if positive, red if negative) — **the line color depends on trend
  direction, it isn't fixed**.
- Above the chart: a large value (`text-4xl font-semibold font-mono`) +
  `Delta` + a `Tabs` range selector `1D / 1W / 1M / 3M / 1Y / All` (pill-style
  `TabsList`, active tab on a white background with `shadow-sm`).

### Allocation donut
- Recharts `PieChart`, `innerRadius=52 outerRadius=70`, no on-chart `label`
  — the legend is separate, on the right (color dot + name + `%`).

### Modals (Add funds / New order / Add to watchlist)
- shadcn `Dialog`; `DialogContent` with no default padding on picker lists
  (picker list = clickable rows: avatar + name + price, `hover:bg-muted`).
- "Add funds" form: a single `Input type="number"` field, `Label` above it
  (`text-xs font-semibold text-muted-foreground`), full-width CTA (`w-full`).

### Trade panel (Buy/Sell)
- "Current market price / Custom price" segmented control → a compact
  `Tabs` variant (2 columns, `grid-cols-2`, active = black background).
- Order total: a `flex justify-between` row above the buttons, top border
  `border-t border-dashed`.
- Two side-by-side CTAs: `Buy` (`variant="default"`, black), `Sell`
  (`variant="outline"`) — both `flex-1`.

### Search / command palette
- Sidebar trigger looks like a disabled input (`bg-muted rounded-lg`,
  `Search` icon + placeholder + `<kbd>⌘K</kbd>`).
- The modal itself = `CommandDialog` with groups by category
  (Stocks/ETFs/Crypto); each result: avatar + name/ticker + "Owned"/
  "Watching" badge + price on the right (`font-mono`).

### Buy/Sell badge
- `Buy`: `--green-soft` background, `--green` text. `Sell`: `--red-soft`
  background, `--red` text. Size `text-[10.5px] uppercase font-bold
  tracking-wide`, shape `rounded-md`, not `rounded-full` (pill shape is
  reserved for filter chips).

### Category breakdown bar
- A thin progress bar (`h-1.5 rounded bg-muted`, fill in the category's
  color) under each row — a pattern for shadcn's `Progress`, but with a
  custom color via `indicatorClassName`/`style`.

---

## 7. Spacing, radius, shadow scale

- **Spacing:** base 4px grid; most common values in the UI: `6, 8, 10, 14,
  16, 20, 22px` → round to Tailwind's `1.5, 2, 2.5, 3.5, 4, 5, 5.5` (or use
  arbitrary values like `p-[22px]` where 1:1 fidelity matters, e.g. spacing
  between cards).
- **Radius:** cards/inputs/modals `12px` (`rounded-xl`), buttons and badges
  `7–8px` (`rounded-lg`), avatar/dot `full` or `rounded-md` (square dot in
  the legend), filter chips `rounded-full`.
- **Shadows:** subtle only — active tab (`shadow-sm`), modal
  (`shadow-[0_12px_40px_rgba(0,0,0,.18)]`). Cards have **no shadow**, only a
  `border`.
- **Border:** `1px solid` everywhere, `--border` by default, `--border-strong`
  on hover.

---

## 8. Responsiveness

- `≤860px`: all 2-column grids → 1 column.
- `≤768px`: sidebar → `Sheet` drawer; sticky mobile header; stat row
  4→2 columns; hero value 42px→32px.
- Keep icon-button hit areas ≥40px on mobile (`.it-icon-btn` is 26px in the
  prototype — bump it to at least 36–40px on mobile for accessibility).

---

## 9. Accessibility & quality (pre-merge checklist)

- [ ] Visible `focus-visible:ring-2 ring-ring` on every interactive element
      (the prototype lacks this — add it during migration).
- [ ] Contrast of `--faint` (#A6A4AC) on white is **borderline** (~2.3:1) —
      only use it for helper text ≥12px, never for meaningful content.
- [ ] Color is never the only signal for gain/loss — it's always paired with
      a directional arrow icon (`ArrowUpRight/DownRight`) and a sign (+/-).
- [ ] Currency values: `Intl.NumberFormat` (locale per user settings),
      currency token `EUR`, always `font-mono tabular-nums`.
- [ ] `prefers-reduced-motion` respected in drawer/dialog animations.
