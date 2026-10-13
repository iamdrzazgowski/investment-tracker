---
name: nordwell-design
description: Nordwell design system and UI/UX guidelines for building, reviewing, and refactoring interfaces. This skill should be used when designing or implementing React and Next.js pages, components, layouts, navigation, dashboards, charts, tables, forms, responsive interfaces, or visual interactions for Nordwell. Ensures consistent branding, typography, colors, spacing, grid layouts, accessibility, and a premium fintech aesthetic inspired by Swiss modernism, editorial design, Scandinavian minimalism, and restrained brutalism.
license: MIT
metadata:
  author: nordwell
  version: "1.0.0"
---

# Nordwell — Investment Tracker Design Skill

## 0. Purpose

This skill defines the complete visual language, UI system, layout rules, component patterns, branding, typography, interaction principles, responsive behavior, and implementation guidance for **Nordwell** — a modern investment tracker for stocks, ETFs, crypto, and cash.

Nordwell should feel like a serious financial instrument rather than a generic SaaS dashboard.

The core aesthetic combines:

- Swiss / International modernism
- contemporary fintech
- editorial typography
- restrained brutalism
- financial-terminal precision
- Scandinavian minimalism

The default authenticated product experience should be **minimal and premium**. Editorial and brutalist treatments can be introduced selectively where they improve the product or brand.

---

# 1. Design Philosophy

## 1.1 Less, but better

Every visible element must have a purpose.

Prefer:

- whitespace
- typography
- alignment
- borders
- clear hierarchy
- restrained color
- simple geometry

Avoid:

- excessive gradients
- glassmorphism
- decorative blobs
- excessive shadows
- huge iconography
- rainbow charts
- unnecessary cards
- visual noise

The interface should remain attractive even when almost all color is removed.

---

## 1.2 Data is the hero

The investment data is the primary visual content.

Priority:

1. Total portfolio value
2. Performance
3. Portfolio history
4. Holdings
5. Allocation
6. Transactions
7. Watchlist
8. Secondary analytics

Charts and metrics must communicate information rather than merely decorate the interface.

---

## 1.3 Premium restraint

Nordwell should look expensive without looking luxurious.

Use:

- off-white backgrounds
- near-black typography
- subtle gray borders
- muted secondary text
- restrained green/red performance colors
- strong typography

Do not use:

- gold
- neon green
- excessive gradients
- glass effects
- glossy cards
- oversized decorative illustrations

---

## 1.4 Modernist structure

Think:

> typography + geometry + whitespace + data

not:

> cards + gradients + shadows + rounded corners

---

# 2. Brand

## 2.1 Name

**Nordwell**

The name should communicate:

- stability
- precision
- long-term thinking
- Scandinavian restraint
- modern financial infrastructure

The brand should not feel like a trading meme product.

---

# 3. Logo System

## 3.1 Logo concept

The Nordwell logo is an abstract geometric **N**.

The mark should suggest:

- growth
- movement
- direction
- continuity
- market movement

It must **not** look like a literal stock-market arrow.

The ideal mark is constructed from a small number of continuous strokes.

Conceptually:

```text
╱╲
╲ ╲
 ╲╱
```

The final logo should remain recognizable at favicon size.

---

## 3.2 Primary lockup

Use:

```text
[ N MARK ] Nordwell
```

Recommended proportions:

```text
Mark:       22–24px
Wordmark:   17–19px
Gap:        8px
Height:     ~24px
```

The wordmark should use **Space Grotesk** with medium weight.

---

## 3.3 Symbol-only version

Use the N mark without the wordmark for:

- mobile navigation
- favicon
- compact sidebar
- app icon
- small metadata areas

Do not invent unrelated symbols for different parts of the application.

---

## 3.4 Logo colors

Light:

```text
#111111
```

Dark:

```text
#F4F4F1
```

The logo should not normally be green.

Green represents performance, not the brand.

---

## 3.5 Suggested SVG direction

The implementation should use an SVG whenever possible.

Example starting point:

```svg
<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M4 18V7L11 14L20 5V17"
    stroke="currentColor"
    stroke-width="2.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
```

This is a starting direction, not a requirement to use the exact path.

The final mark should be visually balanced and work at 16–24px.

---

# 4. Typography

## 4.1 Primary font

Use:

**Space Grotesk**

It should be the primary typeface for the product.

Use it for:

- headings
- navigation
- labels
- buttons
- general UI
- marketing copy

---

## 4.2 Data font

Use:

**IBM Plex Mono**

Use it selectively for:

- prices
- percentages
- ticker symbols
- quantities
- timestamps
- transaction amounts
- financial tables
- technical metadata

This creates a subtle financial-terminal feeling.

---

# 5. Typography Scale

## Portfolio value

Desktop:

```text
48–64px
font-weight: 500–600
letter-spacing: -0.04em
```

Example:

```text
€24,892.34
```

Mobile:

```text
36–44px
```

---

## Page title

```text
32–40px
font-weight: 600
letter-spacing: -0.03em
```

---

## Section heading

```text
18–20px
font-weight: 600
```

---

## Body

```text
14–16px
line-height: 1.5
```

---

## Secondary text

```text
12–14px
```

---

## Financial data

```text
12–14px
IBM Plex Mono
font-variant-numeric: tabular-nums
```

---

# 6. Color System

Nordwell is primarily monochromatic.

## 6.1 Light theme

```text
Background:        #F7F7F5
Surface:           #FFFFFF
Surface subtle:    #F1F1EE

Foreground:        #111111
Muted foreground:  #737373

Border:            #E4E4E0
Strong border:     #CFCFCA
```

---

## 6.2 Dark theme

```text
Background:        #0B0B0B
Surface:           #111111
Surface elevated:  #171717

Foreground:        #F4F4F1
Muted foreground:  #8A8A86

Border:            #292929
Strong border:     #3A3A3A
```

---

## 6.3 Performance colors

Positive:

```text
#2E8B57
```

Negative:

```text
#C94A4A
```

Neutral:

```text
#858585
```

Use these colors only where they communicate performance.

Good:

```text
▲ +2.14%
```

Bad:

```text
Entire card background becomes bright green.
```

---

# 7. Grid System

Use a strict grid.

## Desktop

```text
12 columns
24px gap
32px outer padding
max-width: 1440px
```

## Tablet

```text
8 columns
20px gap
24px outer padding
```

## Mobile

```text
4 columns
16px gap
16px outer padding
```

Do not center every element independently. Alignment should be shared across sections.

---

# 8. Spacing

Use a 4px base unit.

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

Major cards:

```text
24px internal padding
```

Dashboard section spacing:

```text
32–48px
```

Do not default to 16px padding for major cards.

---

# 9. Borders

Borders are more important than shadows.

Default:

```css
border: 1px solid var(--it-border);
```

Use borders to establish structure.

Prefer:

```text
border + whitespace
```

instead of:

```text
shadow + border + large radius
```

---

# 10. Border Radius

Default:

```text
Cards:       8–12px
Buttons:     8px
Inputs:      8px
Controls:    6–8px
Pills:       999px
```

Brutalist mode:

```text
Cards:       0–4px
Buttons:     0–4px
Inputs:      0–4px
```

Not every element should be rounded.

---

# 11. Shadows

Default:

```text
none
```

If elevation is genuinely necessary:

```text
0 2px 10px rgba(0,0,0,0.04)
```

Dark mode should primarily use borders rather than shadows.

---

# 12. Dashboard Information Architecture

Recommended dashboard:

```text
┌─────────────────────────────────────────────┐
│ Navigation / Header                         │
├─────────────────────────────────────────────┤
│                                             │
│ Portfolio Value             Range Selector  │
│ €24,892.34                                  │
│ +12.48%                                     │
│                                             │
│              Portfolio Chart                │
│                                             │
├────────────┬────────────┬───────────┬───────┤
│ Stocks     │ ETFs       │ Crypto    │ Cash  │
├────────────┴────────────┴───────────┴───────┤
│                                             │
│ Holdings                       Allocation   │
│                                             │
├───────────────────────────────┬─────────────┤
│ Recent Transactions            │ Top Movers  │
└───────────────────────────────┴─────────────┘
```

This is a starting structure, not a rigid template.

---

# 13. Navigation

Desktop can use a sidebar.

Example:

```text
N  Nordwell

Dashboard
Portfolio
Watchlist
Transactions
Analytics
Settings

────────────────

Account
```

Recommended width:

```text
220–240px
```

Navigation should remain visually quiet.

Active item:

- subtle background
- strong text
- small icon
- no large accent color

---

# 14. Header

Possible header:

```text
Dashboard                         Search...     ◉  AD
```

Use:

- page context
- search
- notification
- profile

Avoid oversized headers.

---

# 15. Portfolio Hero

The portfolio hero is the strongest element on the dashboard.

Structure:

```text
Portfolio Value

€24,892.34

▲ +12.48% (+€2,758.41)

1D   1W   1M   3M   1Y   ALL
```

The portfolio value should dominate visually.

---

# 16. Portfolio Chart

Preferred:

- thin line
- subtle area fill
- minimal grid
- restrained axis
- hover tooltip
- no unnecessary points

Avoid:

- 3D
- neon gradients
- huge filled areas
- thick lines
- excessive labels

The chart should feel analytical.

---

# 17. Asset Category Cards

Categories:

- Stocks
- ETFs
- Crypto
- Cash

Example:

```text
Stocks

€12,431.20

+0.94%
49.9%
```

Use subtle icons.

Do not make every category a colorful card.

---

# 18. Holdings Table

The holdings table should be one of the strongest components.

Columns:

```text
Asset
Price
24h
Quantity
Avg. Price
Value
Allocation
```

Example:

```text
AAPL     €231.50   +0.84%   42   €168.40   €9,723   28.5%
MSFT     €428.90   -0.32%   18   €320.10   €7,720   23.2%
NVDA     €138.75   +2.14%   65   €45.20    €9,019   18.2%
```

Ticker:

```text
strong
```

Company name:

```text
muted
```

Numerical data:

```text
IBM Plex Mono
```

---

# 19. Watchlist

Watchlist should feel like a compact market terminal.

```text
TSLA     €341.21     +1.32%
META     €758.42     -0.21%
ASML     €687.10     +0.83%
NFLX     €1,284.12   +0.44%
SOL      €192.30     +3.12%
```

Optional:

- sparklines
- market status
- asset type

Do not overload the row.

---

# 20. Transactions

Transactions should be compact.

Example:

```text
NVDA
Buy 5 @ €136.20
2h ago                     +€681.00

AAPL
Sell 8 @ €228.10
Yesterday                 -€1,824.80
```

Types:

```text
BUY
SELL
DEPOSIT
WITHDRAWAL
```

Use subtle labels.

---

# 21. Allocation

Preferred:

1. donut
2. horizontal bars
3. percentage list

Example:

```text
Stocks    ━━━━━━━━━━━━━━━ 49.9%
ETFs      ━━━━━━━━━━━     35.1%
Crypto    ━━━             10.5%
Cash      ━               4.5%
```

Do not show multiple redundant allocation visualizations.

---

# 22. Analytics

Analytics should feel like an investment research tool.

Possible metrics:

```text
Total Return
Annualized Return
Volatility
Best Performer
Worst Performer
Dividend Income
Invested Capital
Cash Ratio
```

Possible charts:

- portfolio growth
- category performance
- contribution to return
- realized vs unrealized gains
- historical allocation
- performance by asset

---

# 23. Asset Detail Page

Example:

```text
AAPL
Apple Inc.

€231.50
▲ +0.84%

1D  1W  1M  3M  1Y  5Y  ALL

Price chart

Position

42 shares
Avg. €168.40
Value €9,723.00
P/L +€2,650.20

Transactions
```

Keep the visual language consistent with the dashboard.

---

# 24. Buttons

## Primary

```text
background: #111111
color: #FFFFFF
```

Example:

```text
+ Add funds
```

## Secondary

```text
background: transparent
border: 1px solid var(--it-border)
```

## Ghost

```text
background: transparent
border: none
```

Avoid oversized pill-shaped CTAs.

---

# 25. Inputs

Simple and functional.

```text
┌──────────────────────────────┐
│ Search assets...             │
└──────────────────────────────┘
```

Use:

- subtle border
- 8px radius
- clear focus state
- no unnecessary shadows

---

# 26. Dialogs

Dialogs should be focused.

Example:

```text
Add funds

Amount
€ 1,000.00

Account
Cash

             Cancel   Add funds
```

Do not use a huge modal for a simple action.

---

# 27. Brutalist Direction

Nordwell can use a restrained brutalist direction.

Characteristics:

- square corners
- thick borders
- oversized typography
- visible grid
- asymmetry
- raw neutral surfaces
- monochrome photography
- large labels
- intentional imperfection

Example:

```text
NORDWELL

TRACK
INVESTMENTS.

BUILD
FREEDOM.

────────────────────────────

€24,892.34

+12.48%

STOCKS     ETFs     CRYPTO     CASH
```

Brutalism should be intentional, not broken-looking.

---

# 28. Brutalist Grid

Allow visible grid lines.

```text
┼────────────┼────────────┼────────────┼
│            │            │            │
│   TRACK    │            │  INVEST    │
│            │            │            │
├────────────┼────────────┼────────────┤
│            │  €24,892   │            │
│            │            │            │
┼────────────┼────────────┼────────────┼
```

Grid lines should align with the actual layout grid.

They should never look like debugging artifacts.

---

# 29. Grid Intersection Marks

A brutalist detail can use small `+` marks at grid intersections.

Example concept:

```text
+
```

The marks should be subtle.

They may be created with CSS pseudo-elements or layered backgrounds.

Do not allow them to interfere with text or controls.

---

# 30. Backgrounds

## Standard

```text
#F7F7F5
```

with white surfaces.

## Editorial

```text
#F1F0EC
```

with monochrome imagery.

## Brutalist

```text
#D9D8D2
```

or similarly neutral concrete-like tones.

Textures must remain subtle.

---

# 31. Imagery

Images should be rare inside the authenticated dashboard.

Good uses:

- landing page
- empty states
- editorial cards
- education
- brand storytelling

Preferred imagery:

- architecture
- brutalist buildings
- concrete
- industrial structures
- abstract geometry
- northern landscapes
- financial infrastructure

Avoid:

- generic businessmen
- generic office meetings
- smiling financial advisors
- floating coins
- generic crypto illustrations

Prefer monochrome or desaturated imagery.

---

# 32. Iconography

Use Lucide-style outline icons.

Recommended stroke:

```text
1.5–2px
```

Examples:

```text
LayoutDashboard
Wallet
Eye
ArrowLeftRight
ChartNoAxesCombined
Settings
Search
Bell
Plus
```

Icons should support hierarchy rather than dominate it.

Do not put an icon into every card simply because space exists.

---

# 33. Tables vs Cards

Use tables for:

- holdings
- transactions
- watchlists
- detailed assets

Use cards for:

- summary metrics
- allocation
- contextual information
- compact dashboard sections

Do not convert every desktop table into cards.

---

# 34. Responsive Design

## Desktop

- full sidebar
- large portfolio chart
- full holdings table
- multi-column dashboard
- generous whitespace

## Tablet

- compact navigation
- 2-column layouts
- reduced secondary data
- responsive charts

## Mobile

Priority:

1. portfolio value
2. performance
3. chart
4. holdings
5. transactions

Secondary data can collapse.

---

# 35. Mobile Navigation

Possible:

```text
Home
Portfolio
Watchlist
Analytics
Settings
```

Bottom navigation can be used if it improves accessibility.

Keep labels short.

---

# 36. Mobile Asset Row

Instead of a dense table:

```text
AAPL

Apple
€231.50

▲ +0.84%              €9,723
```

Use clear vertical hierarchy.

---

# 37. Motion

Motion should communicate state.

Duration:

```text
150–200ms
```

Use:

- hover
- focus
- tab transitions
- dialog transitions
- subtle chart transitions
- expandable rows

Avoid:

- bouncing numbers
- animated gradients
- excessive parallax
- flashy transitions

A finance app should feel stable.

---

# 38. Loading States

Use geometry-matching skeletons.

Example:

```text
Portfolio Value
████████████

████████████████████████████

████████████████
████████████████
```

Prefer section-level loading over blocking the entire application with a spinner.

---

# 39. Empty States

Keep them concise.

```text
Your watchlist is empty.

Add assets you want to follow.

+ Add asset
```

Avoid large illustrations unless onboarding requires one.

---

# 40. Error States

Keep error UI calm.

```text
Market data unavailable

We couldn't refresh prices right now.

Try again
```

Do not use full-screen bright red error states.

---

# 41. Accessibility

Maintain:

- strong contrast
- visible focus
- semantic headings
- accessible controls
- meaningful labels
- keyboard navigation
- reduced-motion support

Performance must not rely solely on color.

Use:

```text
▲ +2.14%
▼ -0.32%
```

rather than color alone.

---

# 42. Financial Formatting

Currency:

```text
€24,892.34
```

Percent:

```text
+12.48%
```

Negative:

```text
-3.21%
```

Ticker:

```text
NVDA
AAPL
BTC
VWCE
```

Use consistent decimal precision.

Use tabular numerals for aligned financial values.

---

# 43. CSS Design Tokens

Use the `it-` prefix for Nordwell-specific tokens.

```css
:root {
  --it-background: #f7f7f5;
  --it-surface: #ffffff;
  --it-surface-subtle: #f1f1ee;

  --it-foreground: #111111;
  --it-muted: #737373;

  --it-border: #e4e4e0;
  --it-border-strong: #cfcfca;

  --it-positive: #2e8b57;
  --it-negative: #c94a4a;

  --it-radius-sm: 6px;
  --it-radius-md: 8px;
  --it-radius-lg: 12px;

  --it-space-1: 4px;
  --it-space-2: 8px;
  --it-space-3: 12px;
  --it-space-4: 16px;
  --it-space-5: 20px;
  --it-space-6: 24px;
  --it-space-8: 32px;
  --it-space-10: 40px;
  --it-space-12: 48px;
  --it-space-16: 64px;
}
```

---

# 44. Component Architecture

Prefer semantic components.

```text
PortfolioHeader
PortfolioChart
PortfolioSummary
AssetCategoryCard
HoldingsTable
HoldingRow
AllocationDonut
TopMovers
WatchlistTable
RecentTransactions
TransactionRow
RangeTabs
AssetSearch
AddFundsDialog
```

Avoid vague names:

```text
Box
Container2
CardThing
Widget
BigCard
```

---

# 45. Layout Freedom

The designer/developer has permission to **add, remove, reorder, resize, merge, split, or completely redesign block-level sections** when doing so improves the product.

The initial dashboard structure is not a rigid template.

Allowed:

- merge sections
- split sections
- move allocation beside the portfolio chart
- create a full-width holdings section
- create an editorial analytics section
- change sidebar to top navigation
- introduce asymmetric layouts
- add metrics
- remove low-value information
- create new dashboard blocks
- change card composition
- use brutalist layouts
- use large typography as a layout element

The objective is not to reproduce a screenshot pixel-for-pixel.

The objective is to preserve the **Nordwell visual language** while producing the best interface.

---

# 46. Design Variants

Nordwell has three primary visual modes.

## A. Minimal

Default authenticated product.

```text
white
gray
black
restrained green/red
8–12px radius
thin borders
large whitespace
```

## B. Editorial

Typography-led.

```text
large headlines
asymmetric layouts
large whitespace
monochrome imagery
oversized numbers
strong vertical rhythm
```

## C. Brutalist

Experimental.

```text
thick borders
square corners
large typography
visible grid
asymmetry
raw textures
monochrome
```

The main dashboard should remain **Minimal** unless there is a deliberate reason to use another mode.

---

# 47. Landing Page Direction

The landing page may be more expressive than the application.

Recommended structure:

```text
NORDWELL

TRACK YOUR
INVESTMENTS.

Stocks.
ETFs.
Crypto.
One place.

[ View portfolio → ]

────────────────────────────────────

Portfolio preview

────────────────────────────────────

Built for long-term thinking.
```

The landing page can use:

- brutalist grid
- oversized typography
- architectural imagery
- asymmetric layouts
- large data visualizations

Do not make it look like a generic AI startup landing page.

---

# 48. Dark Mode

Dark mode should feel like a financial terminal, not a neon trading platform.

Use:

```text
#0B0B0B
#111111
#171717
#292929
#F4F4F1
```

Charts should use restrained contrast.

Avoid neon green chart lines.

---

# 49. Interaction Details

## Hover

Use:

- subtle background change
- slight border change
- minimal transform where appropriate

Avoid dramatic scaling.

For cards:

```text
hover:
  border-color: stronger
```

For interactive rows:

```text
hover:
  background: subtle surface
```

---

# 50. Data Density

Nordwell should support two levels of density.

## Overview

Large:

- values
- charts
- whitespace

## Research

Dense:

- tables
- metrics
- comparison data
- small typography

Users should be able to move from:

> "How is my portfolio doing?"

to:

> "Why is my portfolio performing this way?"

without leaving the product.

---

# 51. Financial Trust

Avoid design patterns that make the application feel like a gambling product.

Do not use:

- flashing numbers
- aggressive red/green backgrounds
- casino-like animations
- excessive real-time movement
- "BUY NOW" style CTAs

The visual tone should communicate:

> long-term investing, clarity, control.

---

# 52. Microcopy

Use short, direct language.

Good:

```text
Portfolio
Holdings
Allocation
Top movers
Recent activity
Add funds
View all
```

Avoid:

```text
Let's supercharge your financial journey!
```

Nordwell should sound confident and quiet.

---

# 53. Product Voice

Brand voice:

- concise
- intelligent
- calm
- direct
- slightly editorial
- never salesy

Example:

```text
Long-term thinking.
Better results.
```

or:

```text
Track investments.
Build freedom.
```

Avoid exaggerated financial promises.

---

# 54. Implementation Rules

When implementing Nordwell:

1. Preserve the grid.
2. Preserve typography hierarchy.
3. Preserve whitespace.
4. Prefer CSS and layout over decorative images.
5. Use reusable components.
6. Keep visual primitives consistent.
7. Avoid one-off styling unless it creates intentional editorial/brutalist character.
8. Use semantic HTML.
9. Make all layouts responsive.
10. Keep financial values aligned.
11. Keep performance colors restrained.
12. Do not introduce a new visual language for individual pages.

---

# 55. When a New Component Is Needed

Before creating a component, ask:

```text
Does this component communicate information?
Does it improve hierarchy?
Does it reduce complexity?
Does it fit the Nordwell grid?
Does it reuse existing visual primitives?
```

If the answer is no, do not add it.

---

# 56. Visual Quality Checklist

Before considering a page complete, verify:

### Typography

- [ ] Space Grotesk is used consistently.
- [ ] IBM Plex Mono is used for appropriate financial data.
- [ ] Heading hierarchy is obvious.
- [ ] Letter spacing is intentional.

### Layout

- [ ] Sections align to the grid.
- [ ] 24px card padding is used for major cards.
- [ ] Spacing is consistent.
- [ ] No unnecessary elements are competing for attention.

### Color

- [ ] Interface is predominantly monochrome.
- [ ] Positive/negative colors are restrained.
- [ ] Contrast is accessible.
- [ ] Brand logo is not confused with performance color.

### Components

- [ ] Borders are subtle.
- [ ] Shadows are rare.
- [ ] Radius is restrained.
- [ ] Icons are secondary.
- [ ] Tables are used where appropriate.

### Responsive

- [ ] Desktop works.
- [ ] Tablet works.
- [ ] Mobile works.
- [ ] Important information remains visible on small screens.
- [ ] Tables have an intentional mobile representation.

### Brand

- [ ] Nordwell logo is consistent.
- [ ] Typography feels modernist.
- [ ] Product feels calm and trustworthy.
- [ ] No generic SaaS visual language has leaked in.

---

# 57. Anti-Patterns

Never default to:

```text
gradient background
glass cards
huge rounded cards
floating blobs
neon green
purple AI gradients
3D crypto coins
excessive shadows
generic stock illustrations
```

If a design begins to resemble a generic:

- crypto exchange
- AI SaaS dashboard
- banking template
- Tailwind UI demo

step back and simplify.

---

# 58. Final Creative Rule

When uncertain between two design choices, choose the one that is:

1. simpler
2. quieter
3. more typographic
4. better aligned
5. easier to scan
6. more data-focused
7. less decorative

Nordwell should feel like:

> **A modern investment instrument, not a generic SaaS dashboard.**

The ideal combination is:

**Swiss modernism + fintech precision + editorial typography + Scandinavian restraint + restrained brutalism.**

The final product should communicate:

```text
NORDWELL

QUIET.
PRECISE.
BUILT FOR THE LONG TERM.
```
