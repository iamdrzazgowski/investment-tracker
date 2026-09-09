# Nordwell — Design System Skill

This document is the single source of truth for how Nordwell looks, feels, and
is built. Read this before creating or editing any page, component, or style
in the app. When in doubt, match an existing pattern described here rather
than inventing a new one — consistency beats novelty in this codebase.

## 1. Design philosophy

Nordwell is a **premium, minimal fintech product** — think "Trade Republic ×
modern SaaS dashboard × Bloomberg simplicity," but with its own identity, not
a copy of any of them.

Non-negotiable principles:

- **Calm over decorative.** White/off-white canvas, generous whitespace,
  flat surfaces. No gradients, no glassmorphism, no drop shadows beyond a
  hairline, no neon, no illustrations.
- **One accent color only.** Deep emerald green for anything positive
  (gains, buy actions, confirmations). Muted brick red for anything negative
  (losses, sell actions, destructive states). Every other surface is neutral
  gray/black/white. Never introduce a second "brand" hue.
- **Numbers are the product.** Money, percentages, share counts are always
  set in a monospace font with tabular numerals. This is the single most
  important visual signature of the app — it must never be skipped on a
  financial figure.
- **Every screen answers "what do I own, what changed, what can I do about
  it"** — in that order. Value first, delta second, action last.
- **Flat, not skeuomorphic.** Subtle 1px borders instead of shadows to
  separate surfaces. Border color does the work shadows would normally do.

Reject any request that pushes toward: purple gradients, glassmorphism,
big hero sections, stock photography, colorful multi-hue charts, heavy
animation, or generic "AI SaaS" aesthetics. If asked for these, flag the
conflict with this design system before proceeding.

## 2. Tech stack: shadcn/ui + Tailwind CSS — mandatory, not optional

This is a hard technical constraint, not a style preference. Every screen,
component, and one-off UI tweak in this app is built with **shadcn/ui on top
of Tailwind CSS**. Do not introduce any other component library, CSS
framework, or styling approach — not even for "just one quick thing."

**Tailwind CSS**
- All styling is Tailwind utility classes in JSX `className`. No separate
  `.css`/`.module.css` files, no `styled-components`/`emotion`, no inline
  `style={{ ... }}` objects except for truly dynamic, per-instance values
  that can't be expressed as a class (e.g. a chart's computed gradient `id`,
  a bar's data-driven `width: ${pct}%`, an `AvatarBadge`'s category-derived
  background/foreground color pulled from a token map).
- Compose class strings with the project's `cn()` helper
  (`lib/utils.ts`, `clsx` + `tailwind-merge`) whenever a component accepts a
  `className` prop or merges conditional classes — never string-concatenate
  classes by hand, and never rely on utility order to "win" a conflict.
- Use Tailwind's spacing/sizing/radius scale (`p-5`, `gap-2.5`, `rounded-lg`,
  `text-[13px]` for the handful of off-scale sizes this design calls for)
  rather than arbitrary one-off values where a scale step already fits.
- Colors are **always** the semantic tokens from §3 (`bg-card`,
  `text-muted-foreground`, `border-border`, `text-positive`,
  `text-destructive`, etc.), never a raw Tailwind palette class like
  `bg-gray-100` or `text-red-500`, and never a hardcoded hex/oklch value
  inline. If a token doesn't exist yet for a color you need, add it to
  `globals.css` and `@theme inline` first — don't work around it locally.
- Dark mode, when relevant, is handled purely by the `.dark` token overrides
  already defined — never branch styling logic in JSX for light/dark.

**shadcn/ui**
- Every interactive primitive — button, card, input, label, table, tabs,
  dialog, sheet, badge, separator, command palette — is a shadcn/ui
  component living in `components/ui/`, built on Radix primitives with
  `class-variance-authority` for variants. Before building any new piece of
  UI, check `components/ui/` first; if the primitive you need isn't there
  yet, add it the shadcn way (Radix + `cva` + `cn()`, matching the existing
  files' structure and prop conventions) rather than hand-rolling a plain
  `<div>`/`<button>` with ad hoc classes.
- App-specific components (§7) are always composed *from* these primitives
  (`Card`, `Button`, `Table`, etc.) — never bypass them to write raw markup
  that duplicates what a primitive already does.
- Do not add Radix packages, icon sets, or component libraries that overlap
  with what shadcn/ui already provides (e.g. no Material UI, Chakra, Ant
  Design, Headless UI, Mantine — even for a single component). The one
  approved exception is Recharts for charts (§10), since shadcn/ui has no
  charting primitive of its own.
- New shadcn primitives should match the existing ones' file shape exactly:
  `React.forwardRef`, `displayName` set, variants via `cva` where the
  primitive has more than one visual style, props spread after `className`
  is resolved through `cn()`.

## 3. Color tokens

Colors live as CSS variables in `app/globals.css` (Tailwind v4, `oklch`
color space), consumed via `@theme inline` so both plain CSS (`hsl(var(--x))`
in chart code) and Tailwind utility classes (`bg-primary`, `text-positive`)
resolve to the same values.

| Token | Light value (oklch) | Used for |
|---|---|---|
| `--background` | `0.985 0.004 90` (warm off-white) | Page canvas — never pure white |
| `--card` | `1 0 0` (pure white) | Card/panel surfaces — one step lighter than background |
| `--foreground` | `0.145 0 0` (near-black) | Primary text |
| `--muted-foreground` | `0.556 0 0` | Secondary/label text |
| `--border` | `0.91 0.004 90` | Hairline borders everywhere |
| `--primary` | `0.145 0 0` (near-black) | Sidebar active state, primary buttons, brand mark |
| `--primary-foreground` | `0.985 0 0` (white) | Text/icons on `--primary` |
| `--positive` | `0.45 0.1 162` (deep emerald) | Gains, buy actions, positive deltas |
| `--positive-soft` | `0.94 0.03 162` | Positive badge backgrounds |
| `--destructive` | `0.55 0.15 29` (muted brick red) | Losses, sell actions, destructive buttons |
| `--radius` | `0.75rem` (12px) | Base corner radius for cards, inputs, buttons |

Dark mode variables exist (`.dark` block) and follow the same relationships
inverted — do not hand-roll dark-mode colors elsewhere; always go through
these tokens.

**Rules:**
- Never write a raw hex/oklch value in a component. Always use the token
  (`bg-card`, `text-muted-foreground`, `border-border`, `text-positive`,
  `text-destructive`). A hardcoded hex is the #1 sign a component has drifted
  from the design system and needs fixing.
- Green and red are **only** for gain/loss semantics (`Delta`, badges for
  buy/sell) or their direct affordances (Buy button = neutral primary, not
  green — only outcomes are colored, not the action of buying itself).
- Category colors (Stocks/ETFs/Crypto/Cash in allocation donuts, category
  bars) are a separate small palette, intentionally *not* the positive/
  destructive tokens, since they encode category, not sentiment:
  `Stocks: near-black`, `ETFs: positive green`, `Crypto: amber/gold
  (#B08A3E)`, `Cash: neutral gray border color`.

## 4. Typography

Two typefaces, each with one job:

- **Inter** (`--font-sans`) — all UI text: headings, labels, body copy,
  buttons, navigation.
- **IBM Plex Mono** (`--font-mono`) — **every number that represents money,
  a share count, a percentage, or a price.** Applied via the `font-mono`
  utility (or the app's `.font-tnum` helper for `font-variant-numeric:
  tabular-nums; letter-spacing: -0.01em;`).

Loaded via `next/font/google` in the root `app/layout.tsx`, exposed as CSS
variables consumed by `@theme inline` in `globals.css` — never load fonts
any other way (no `<link>` tags, no `@font-face` by hand).

**The mono-for-numbers rule is absolute.** A price, a P/L figure, a share
count, a percentage delta, a portfolio total — all of it is `font-mono`. A
component that renders a number in the default sans font is a bug. The one
exception the base `Input` component defaults to `font-mono` (because most
inputs in this app are numeric — quantity, price) — inputs that collect
*text*, not numbers (email, name, search query) must explicitly override
with `font-sans`.

Type scale in use (approximate, expand as needed but stay within this
rhythm):

| Use | Size | Weight |
|---|---|---|
| Portfolio hero value | 32–42px | 650–700 |
| Chart headline value | 24px | 650–700 |
| Page title | 20–22px | 650–700 |
| Card title | 13.5–14px | 600 |
| Body / table cell | 13px | 400–600 |
| Label / eyebrow / meta | 11–12.5px | 500–600, often uppercase + `tracking-wide` for eyebrows |

## 5. Spacing, radius, elevation

- Base corner radius is `12px` (`--radius`), used on cards, buttons, inputs,
  dialogs. Never use a sharper or rounder radius elsewhere — no `rounded-full`
  except on true circles (avatars, dots).
- Elevation is **never** a drop shadow. Surfaces are separated by a 1px
  `border-border` only. The single exception is the modal/dialog overlay
  (`shadow-lg`/`shadow-2xl` is acceptable there, since it floats above the
  whole page, not beside another surface).
- Card padding: `p-5` (20px) is the standard card body padding, header gets
  slightly less bottom padding (`pb-3`) before content.
- Page content is capped at `max-w-[1180px]`, centered, with `px-10 py-8` on
  desktop and `px-4 py-6` on mobile.
- Grid gaps between cards: `gap-5` (20px) as the default; the two-column
  dashboard/portfolio layout uses `1.55fr 1fr` as its column ratio (main
  content wider than the side rail), not an even split.

## 6. Core components (`components/ui/`)

Quick lookup — prototype pattern → shadcn/ui primitive to reach for. If a row
in the app calls for something not on this list, check §2's rule before
reaching for a third-party component: extend an existing primitive first.

| Pattern in the app | shadcn/ui primitive |
|---|---|
| Card / panel | `Card`, `CardHeader`, `CardTitle`, `CardContent` |
| Primary / outline / ghost button | `Button` (`variant="default"/"outline"/"ghost"`) |
| Range tabs (`1D 1W 1M...`), category filters | `Tabs`, `TabsList`, `TabsTrigger` |
| Holdings / transactions table | `Table`, `TableHeader`, `TableRow`, `TableCell` |
| Add funds / New order / Add to watchlist | `Dialog` |
| Mobile nav drawer | `Sheet` (`side="left"`) |
| Global search (`⌘K`) | `Command`, `CommandDialog` (cmdk) |
| Buy/Sell, Owned/Watching tag | `Badge` (`variant="positive"/"destructive"/"outline"`) |
| Ticker monogram | `AvatarBadge` (app-specific, §7 — not shadcn's `Avatar`) |
| Amount / quantity / price field | `Input` + `Label` |


These are shadcn/ui primitives on Radix, restyled to the tokens above. Build
new UI out of these — do not create one-off buttons, cards, or inputs.

- **`Button`** — variants `default` (primary, near-black bg), `outline`
  (bordered), `ghost`, `destructive`, `link`. Height `h-9` default, `h-8` for
  `sm`. Always `rounded-lg`, `font-semibold`, `text-sm`.
- **`Card` / `CardHeader` / `CardTitle` / `CardContent`** — the base
  container for every block of content on every page. `CardTitle` is always
  13.5–14px semibold, no larger.
- **`Table`** — headers are `text-[11px] font-semibold uppercase
  tracking-wide text-muted-foreground`; rows get a hover state
  (`hover:bg-muted/60`) when clickable (i.e., navigate to an asset).
- **`Tabs`** — pill-style segmented control (`bg-muted` track, active tab
  gets `bg-card` + `shadow-sm`), used for category filters and time-range
  selectors alike.
- **`Dialog`** — centered modal, `rounded-xl`, used for Add funds, New
  order, Add to watchlist.
- **`Sheet`** — slide-in drawer from the left, used **only** for the mobile
  navigation menu (hamburger trigger). Do not repurpose for anything else
  without reconsidering the mobile nav pattern first.
- **`Command`** (cmdk-based) — the global search palette (`⌘K` / `/`).
  Results are grouped by `CommandGroup` per asset category, each item shows
  avatar, name, ticker, an "Owned"/"Watching" badge if applicable, and price
  right-aligned in mono.
- **`Badge`** — variants `default`, `positive`, `destructive`, `outline`.
  Always uppercase, `text-[10px]`, `font-bold`, used for Buy/Sell tags and
  Owned/Watching indicators.
- **`Input` / `Label`** — form fields. Remember the mono-font override rule
  above for non-numeric inputs.

## 7. App-specific components (`components/`)

These encode Nordwell's own visual signatures — reuse them rather than
rebuilding the pattern inline.

- **`AvatarBadge`** — circular monogram (first 2–3 letters of ticker) with a
  category-tinted background (near-white for stocks, positive-soft green for
  ETFs, warm amber-tinted for crypto). This is the *only* "logo" system in
  the app — never fetch or hardcode real company logo images.
- **`Delta`** — the up/down arrow + signed percentage or currency figure,
  colored `text-positive`/`text-destructive`. Every single price/return
  figure in the app that can move must be wrapped in `Delta`, not
  hand-rolled with a raw `+`/`-` sign.
- **`PerformanceChart`** — the canonical area chart: large headline value,
  `Delta` beneath it, `RangeTabs` (`1D 1W 1M 3M 1Y All`) top-right, gradient
  fill under the line fading to transparent, minimal axes (both `XAxis` and
  `YAxis` hidden — the shape communicates, gridlines don't), custom
  dark-pill tooltip (`bg-foreground text-background`, mono figure). Stroke
  color is `positive` or `destructive` depending on whether the period is up
  or down — never a neutral/brand color for the line itself.
- **`BenchmarkChart`** — same visual language, two lines (solid green =
  portfolio, dashed gray = benchmark), values indexed to 100 rather than
  absolute currency.
- **`Sparkline`** — tiny inline line chart (no axes, no tooltip), used only
  in dense list rows (watchlist trend column).
- **`AllocationDonut`** — inner-radius pie chart, category-colored,
  paired with a text legend showing percentage — never used without the
  legend, since color alone shouldn't carry the meaning.
- **`HoldingsTable`**, **`TransactionsList`**, **`CategoryBreakdown`**,
  **`TopMovers`**, **`HoldingsRanked`** — all follow the same rule: clicking
  a row/item navigates to `/asset/[ticker]`, cursor is `pointer`, and every
  numeric column is right-aligned + mono.
- **`StatRow`** — the 4-up (2-up on mobile) stat grid with hairline
  dividers between cells (`gap-px bg-border` trick, not actual `border`
  classes) — reuse this exact technique for any new stat grid rather than
  adding individual borders per cell.
- **`PageHeader`** — every page starts with an eyebrow label (uppercase,
  muted, `tracking-wide`) + a bold title, optionally a right-aligned action
  button/dialog trigger. Never start a page with anything else.

## 8. Layout & navigation

- **Desktop:** fixed 224px (`w-56`) left sidebar, `border-r`, containing (top
  to bottom): brand mark, global search trigger bar, nav items, user footer
  pinned to the bottom via `mt-auto`. Active nav item gets `bg-primary
  text-primary-foreground`; nothing else in the app uses that "filled
  near-black pill" treatment — it is reserved for the active nav state (and
  primary buttons).
- **Mobile (<768px):** sidebar is hidden entirely. A sticky top header
  replaces it: hamburger button (opens the `Sheet` drawer with the same nav
  list) on the left, current page title centered/left, search icon button on
  the right. **Do not use a bottom tab bar** — that pattern was explicitly
  rejected in favor of the hamburger + drawer.
- **Search** is reachable from both the sidebar (full bar with `⌘K` hint) and
  the mobile header (icon-only), plus the global `⌘K`/`Ctrl+K`/`/` keyboard
  shortcut — wire all three to the same shared open/close state, never
  duplicate the dialog.
- Six nav items, fixed order, do not reorder or rename without explicit
  instruction: **Dashboard, Portfolio, Watchlist, Transactions, Analytics,
  Settings.**
- **Tap targets on mobile must be at least 36–40px**, even where the visual
  icon is small. The current icon-only buttons (hamburger trigger, search
  icon, watchlist remove `X`) render at 26px, which is too small to be a
  reliable touch target — pad the hit area up to at least `h-9 w-9` (36px)
  on mobile via padding/`min-h`/`min-w`, not by enlarging the icon itself.

## 9. Page-level conventions

Each page has a distinct job — do not let pages converge into "chart +
table + donut" copies of each other:

- **Dashboard** — glance/overview. Hero total value + today's delta,
  `StatRow`, one `PerformanceChart`, then `TopMovers` (gainers/losers, not a
  full holdings table) beside `AllocationDonut`.
- **Portfolio** — holdings management. `CategoryBreakdown` bars, category
  filter `Tabs`, then the **full** `HoldingsTable`. This is the only page
  with the complete, filterable holdings list.
- **Watchlist** — followed-but-unowned assets. Table with sparkline trend
  column, add/remove affordances.
- **Transactions** — full buy/sell ledger, filterable by type.
- **Analytics** — insight, not inventory. Two stat rows, `BenchmarkChart`,
  category return + monthly return bar charts, `HoldingsRanked`. Never add a
  plain holdings table here — that duplicates Portfolio's job.
- **Settings** — simple label/value list rows, no cards-within-cards.
- **`/asset/[ticker]`** — back button, asset header (avatar, name, price,
  `Delta`), `PerformanceChart`, then a two-column block: position/market
  details on the left, the `BuySellPanel` on the right.
- **`/login`, `/signup`** — two-column split. Left: centered form card (max
  width `xs`, ~320px) built from `LoginForm`/`SignupForm`. Right (hidden
  below `lg`): `AuthShowcase` — a `bg-primary` (near-black) panel with a
  faint dot/line grid background, brand mark, a headline + subcopy, and a
  **decorative echo of the dashboard's area chart** (same gradient/stroke
  technique, static data) inside a bordered stat card. This right panel
  exists specifically so auth pages don't feel like a generic template —
  never replace it with a stock photo or illustration.

## 10. Charts (Recharts conventions)

- Library: **Recharts**. Don't introduce a second charting library for
  consistency's sake unless a chart type Recharts can't do well is required.
- Area/line charts: hide both axes (`hide` prop), no `CartesianGrid` on the
  hero performance chart (the fill/line alone should read cleanly against
  the white card). Bar charts (category/monthly returns) *do* use a subtle
  horizontal-only `CartesianGrid` (`vertical={false}`, `stroke="hsl(var(--border))"`).
- Every chart gets a custom `Tooltip` `content` — never the default Recharts
  tooltip box. Style: `bg-foreground text-background`, small, `rounded-md`,
  mono figure inside.
- Bar chart cells are colored per-value with `Cell` (`positive` if ≥0 else
  `destructive`), radius `[5,5,5,5]` (fully rounded bar ends, not just top).
- Gradients: `linearGradient` from the line's stroke color at `0.16`
  opacity down to `0` — this exact fade is the "signature" chart fill, reuse
  it rather than a flatter/heavier fill.

## 11. Formatting conventions (`lib/format.ts`)

Never format a number inline with `toFixed`/`toLocaleString` ad hoc — always
go through these helpers so the whole app stays byte-for-byte consistent:

- `fmtEUR(v)` — `Intl.NumberFormat('en-IE', { style: 'currency', currency:
  'EUR' })`. EUR is the app's base currency; don't hardcode `$` anywhere.
- `fmtNum(v, decimals)` — plain number, decimals default to `2`, but pass
  `3` for crypto share counts and `0` for stock/ETF share counts (fractional
  shares aren't modeled for equities in this app).
- `fmtPct(v)` — always signed (`+1.86%` / `-0.42%`), two decimals.
- `fmtSigned(v)` — signed currency (`+€1,204.00` / `-€312.50`).

## 12. Icons

**lucide-react** only, `strokeWidth={2}` (the library default — don't
override unless matching an existing exception). Standard sizes: `14–15px`
inside buttons/badges, `16–17px` in nav items, `18px` in the mobile bottom
elements. Never mix in a second icon set.

## 13. Interaction & motion

- Hover states are subtle: background shifts to `bg-muted`/`bg-accent`,
  border darkens one step (`border-border` → `hover:border-foreground/25`
  or similar) — no scale transforms, no shadows appearing on hover.
- Disabled buttons: `opacity-50`, `pointer-events-none` — never hide a
  disabled action, gray it out so the affordance stays visible (this matters
  a lot for Buy/Sell buttons, which are frequently in a disabled state
  pending valid input).
- Dialogs/Sheets use the built-in Radix `data-[state=open|closed]` animate-in/
  animate-out utilities (`tw-animate-css` / `tailwindcss-animate`) — keep
  animation durations short (150–300ms), never add bespoke easing curves.
- A successful action (buy, sell) shows a small inline confirmation chip
  (`bg-positive-soft text-positive`, checkmark icon) directly in the panel
  that triggered it — not a global toast system.

## 14. Content & data rules

- All monetary examples in mock/seed data are EUR-denominated, formatted per
  §10.
- Company/asset "logos" are always the `AvatarBadge` monogram system (§6) —
  never a fetched image, never a placeholder photo.
- Never invent a real, identifiable brand's exact visual identity (logo
  mark, exact brand color) for a fictional asset — tickers/company names in
  seed data (AAPL, VWCE, BTC, etc.) are for realism, not for pixel-matching
  the real company's press-kit branding.

## 15. File/naming conventions

- One component per file, PascalCase export matching a kebab-case filename
  (`AvatarBadge` → `avatar-badge.tsx`).
- shadcn primitives live in `components/ui/`; everything app-specific lives
  flat in `components/`. Don't create deeper nesting (no
  `components/dashboard/`, `components/charts/` subfolders) — the flat
  structure is intentional for this project's size.
- Shared formatting/data helpers live in `lib/` (`lib/format.ts`,
  `lib/data.ts`, `lib/utils.ts`, `lib/portfolio-context.tsx`) — a component
  should never redefine a formatter or duplicate seed data locally.

## 16. Accessibility & quality

These are gaps in the current implementation, not yet-solved theory — treat
them as required fixes when you touch a component, not optional polish:

- **Every interactive element needs a visible focus state**
  (`focus-visible:ring-2 ring-ring`, using the existing `--ring` token). The
  current components mostly rely on `:hover` only — don't ship a new
  interactive element without also handling keyboard focus.
- **`text-muted-foreground` (the "faint" tier) has borderline contrast on
  the light background** (roughly 2.3:1 against `--background`/`--card`).
  Only use it for helper/meta text at **12px or larger** — never for
  anything that carries meaning on its own (a number, a label someone must
  read to understand the screen). If in doubt, promote the text to
  `text-foreground` or bump its size.
- **Color is never the only signal for gain/loss.** `Delta` already pairs
  color with a directional arrow icon (`ArrowUpRight`/`ArrowDownRight`) and
  an explicit `+`/`-` sign — never add a plain color-only indicator (e.g. a
  colored dot with no icon/sign) anywhere else in the app for the same kind
  of data.
- **Respect `prefers-reduced-motion`** in `Dialog`/`Sheet` open/close
  animations and any future transition — Radix's data-state animations
  should degrade to an instant show/hide rather than a full slide/fade for
  users who've opted out of motion.
- Currency values always go through `Intl.NumberFormat` via `fmtEUR` (§11),
  never a manually concatenated `€` + number — locale-correct formatting is
  part of accessibility too (screen readers and browser number handling
  depend on it), not just visual consistency.

## 17. Before you ship a new page or component

Checklist — go through this every time:

1. Does every number use `font-mono` / the mono helper? Is every currency
   value routed through `fmtEUR`/`fmtSigned`, every percentage through
   `fmtPct`?
2. Is every gain/loss figure wrapped in `Delta`, not a hand-rolled `+`/`-`?
3. Are all colors coming from tokens (`bg-card`, `text-muted-foreground`,
   `border-border`, `text-positive`/`text-destructive`) — zero hardcoded hex?
4. Is the corner radius consistent (12px base, via the shared `Card`/
   `Button`/`Input` components rather than a one-off `rounded-*` value)?
5. Does the page open with `PageHeader` (eyebrow + title [+ action])?
6. If it's a list of assets, does each row navigate to `/asset/[ticker]`
   and use `AvatarBadge` for the icon?
7. On mobile, does nothing rely on a bottom tab bar, and does the hamburger
   `Sheet` still reach this page?
8. Have you reused an existing chart component/pattern instead of hand-
   rolling a new Recharts config from scratch?
9. Is everything styled with Tailwind utility classes (via `cn()` where
   applicable) and built from `components/ui/` shadcn primitives — no
   separate CSS file, no inline `style` for anything that could be a class,
   no competing UI/component library pulled in?
10. Does every new interactive element have a visible `focus-visible` state,
    and does nothing rely on `text-muted-foreground` below 12px for
    meaningful content (§16)?

If any answer is "no," fix it before considering the work done — small
drifts here compound quickly into an inconsistent product.
