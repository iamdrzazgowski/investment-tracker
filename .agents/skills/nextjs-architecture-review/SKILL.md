# Next.js Architecture Review & Refactor

## Purpose

Analyze and improve the directory and code architecture of a Next.js application without introducing unnecessary abstraction or blindly applying a predefined folder structure.

The goal is to make the project:

* easier to understand
* easier to navigate
* easier to maintain
* easier to extend
* consistent with modern Next.js App Router conventions
* appropriately separated between routing, UI, business logic, data access and infrastructure

The skill is primarily designed for projects using:

* Next.js 16+
* App Router
* TypeScript
* React
* Server Components
* Client Components
* Server Actions
* Route Handlers
* Prisma
* PostgreSQL
* Better Auth
* Zod
* React Hook Form
* shadcn/ui
* Tailwind CSS
* external APIs

The project does **not** need to use all of these technologies.

The skill must adapt to the actual project instead of assuming that a particular library or architectural pattern is present.

---

# Core Principles

## 1. Understand before changing

Never reorganize the project based only on folder names.

Before proposing changes:

1. inspect the project structure
2. inspect `package.json`
3. inspect `tsconfig.json`
4. inspect `next.config.*`
5. inspect relevant source files
6. identify the application's architectural boundaries
7. identify how data flows through the application
8. identify server/client boundaries
9. identify database and external API access
10. identify authentication and authorization boundaries

Do not assume that a popular architecture is automatically appropriate.

---

# 2. Avoid architecture for architecture's sake

Do NOT introduce folders such as:

```text
services/
repositories/
use-cases/
controllers/
adapters/
interfaces/
domain/
application/
infrastructure/
```

just because they are common in other projects.

Create a layer only when the current codebase has a real reason for it.

Prefer:

```text
simple
```

over:

```text
abstract
```

when both solve the problem equally well.

---

# 3. Prefer feature-oriented organization when justified

When a project becomes large, consider organizing domain-specific code around features.

For example:

```text
src/
├── app/
├── components/
├── features/
│   ├── auth/
│   ├── portfolio/
│   ├── transactions/
│   ├── watchlist/
│   └── analytics/
├── lib/
└── types/
```

However, do **NOT** introduce `features/` automatically.

Use it only when:

* feature boundaries are clear
* several files belong to the same feature
* the current global folders are becoming difficult to navigate
* feature ownership would become clearer

For a small application, a simpler structure may be better.

---

# 4. Keep `app/` focused on routing and route composition

The `app/` directory should primarily contain:

* routes
* layouts
* loading states
* error boundaries
* route-specific pages
* route handlers
* route-level composition
* route-local code when it genuinely belongs to that route

Avoid turning `app/` into a generic dumping ground.

Avoid structures such as:

```text
app/
├── components/
├── utils/
├── services/
├── helpers/
└── random-component.tsx
```

unless those files are genuinely local to a route.

A healthy structure might look like:

```text
app/
├── dashboard/
│   └── page.tsx
├── settings/
│   └── page.tsx
├── transactions/
│   └── page.tsx
├── api/
│   └── ...
└── layout.tsx
```

---

# 5. Distinguish global and feature-local code

A component should not automatically be placed in:

```text
components/
```

just because it is a React component.

Ask:

> Is this component genuinely shared across multiple unrelated parts of the application?

If a component is only used by one feature, prefer keeping it close to that feature.

For example:

```text
features/
└── portfolio/
    ├── components/
    │   ├── portfolio-chart.tsx
    │   ├── portfolio-summary.tsx
    │   └── asset-table.tsx
    └── ...
```

Global reusable UI can remain in:

```text
components/
├── ui/
└── shared/
```

Do not move feature-specific components into `components/` simply because `components/` already exists.

---

# 6. Respect Server / Client boundaries

Pay particular attention to:

```tsx
"use client"
```

Identify:

* unnecessary Client Components
* server-only code imported into Client Components
* client components containing excessive business logic
* browser-only APIs leaking into server code
* server actions mixed excessively with UI code
* data fetching that could happen on the server
* unnecessary client-side state
* components that could remain Server Components

Do not convert Server Components to Client Components merely to make code easier.

Prefer the smallest possible Client Component boundary.

For example, prefer:

```text
Server Component
├── static/server-rendered UI
└── Client Component
    └── interactive part
```

over turning the entire page into a Client Component.

---

# 7. Understand the actual data flow

Before reorganizing data-related code, determine how data currently flows.

Possible patterns include:

```text
Server Component
    ↓
data-access
    ↓
Prisma
    ↓
PostgreSQL
```

or:

```text
Client Component
    ↓
fetch()
    ↓
Route Handler
    ↓
data-access
    ↓
Prisma
```

or:

```text
Client Component
    ↓
Server Action
    ↓
data-access
    ↓
Prisma
```

or:

```text
Server Component
    ↓
external API
```

The skill must **not force all data fetching into one pattern**.

Instead:

1. identify the existing pattern
2. identify inconsistencies
3. determine whether those inconsistencies create a real problem
4. propose the smallest change that improves consistency

---

# 8. Server Actions

Server Actions deserve special attention.

Inspect whether Server Actions:

* are colocated appropriately
* contain too much logic
* duplicate validation
* duplicate authorization
* directly access Prisma in many unrelated places
* mix business logic with transport/UI concerns
* are reused in situations where a Route Handler would be more appropriate

A reasonable structure may be:

```text
features/
└── transactions/
    ├── actions/
    │   └── create-transaction.ts
    ├── components/
    ├── schemas/
    └── ...
```

But this may also be completely appropriate:

```text
app/
└── transactions/
    ├── actions.ts
    └── page.tsx
```

Do not create an `actions/` directory merely because Server Actions exist.

---

# 9. Server Actions vs Route Handlers

Do not assume that Server Actions and Route Handlers are interchangeable.

Use the following reasoning.

### Server Actions are generally appropriate when:

* the operation is triggered by application UI
* the caller is the Next.js application itself
* the operation is a mutation
* the action benefits from server-only execution

### Route Handlers may be appropriate when:

* an HTTP endpoint is required
* an external client needs to access the endpoint
* the API needs explicit HTTP semantics
* the endpoint is consumed independently from the React UI

Do not create Route Handlers just to wrap Server Actions.

Do not create Server Actions just to avoid creating an appropriate HTTP endpoint.

---

# 10. Data-access layer

Inspect where database and external API access lives.

Look for code such as:

```tsx
const data = await prisma.transaction.findMany(...)
```

inside many unrelated UI components.

Determine whether this is:

* acceptable direct server-side access
* duplicated logic
* business logic that should be centralized
* a candidate for a small data-access module

Do **not** automatically create repositories.

For a small application, this may be perfectly reasonable:

```text
lib/
└── prisma.ts
```

with direct Prisma calls from server-side application code.

For a more complex feature, this may become appropriate:

```text
features/
└── portfolio/
    ├── data/
    │   └── portfolio.ts
    └── ...
```

or:

```text
features/
└── portfolio/
    └── repositories/
        └── portfolio-repository.ts
```

Only introduce a repository when it solves a concrete problem.

---

# 11. Prisma

Inspect:

* Prisma client initialization
* database queries
* duplicated queries
* transactions
* relation loading
* database access from Client Components
* server/client boundary violations
* business logic embedded directly in Prisma calls

Ensure Prisma code remains server-only.

Do not move every Prisma query into a repository merely for the sake of abstraction.

---

# 12. External APIs

Identify integrations such as:

* financial APIs
* market-data APIs
* weather APIs
* authentication providers
* third-party services

Keep secrets and server-only API clients on the server.

For example:

```text
lib/
├── yahoo-finance.ts
├── coingecko.ts
└── ...
```

may be reasonable if these integrations are genuinely shared.

If an integration belongs exclusively to one feature, consider keeping it local:

```text
features/
└── portfolio/
    └── data/
        └── market-data.ts
```

Do not create a generic `services/` directory containing every external integration without considering ownership.

---

# 13. Authentication and authorization

Inspect authentication boundaries, especially when using Better Auth or another authentication system.

Look for:

* auth logic inside UI components
* repeated session checks
* duplicated authorization rules
* server-only auth code imported into client code
* feature-specific authorization mixed into generic auth utilities

A reasonable global structure might be:

```text
lib/
└── auth.ts
```

while feature-specific authorization may belong closer to the feature.

Do not duplicate authentication logic simply to avoid importing a shared auth module.

---

# 14. Validation with Zod

When using Zod, inspect:

* duplicated schemas
* schemas far away from the feature they validate
* server/client schema usage
* validation duplicated in forms and Server Actions
* schemas containing unrelated domain concepts

Feature-specific schemas may live near the feature:

```text
features/
└── transactions/
    └── schemas/
        └── transaction-schema.ts
```

For very small projects, this may be unnecessary:

```text
features/
└── transactions/
    └── schema.ts
```

is perfectly acceptable.

Do not create a global:

```text
schemas/
```

folder automatically.

---

# 15. React Hook Form

Inspect forms for:

* duplicated validation
* excessive component size
* business logic inside form components
* unnecessary client boundaries
* feature-specific form components placed globally

A form that belongs exclusively to one feature should usually remain close to that feature.

Example:

```text
features/
└── transactions/
    ├── components/
    │   └── transaction-form.tsx
    ├── schemas/
    │   └── transaction-schema.ts
    └── actions/
        └── create-transaction.ts
```

Do not create a generic form abstraction unless multiple forms genuinely share the same behavior.

---

# 16. `lib/`

Do not allow `lib/` to become a junk drawer.

Flag structures such as:

```text
lib/
├── helpers.ts
├── utils.ts
├── misc.ts
├── stuff.ts
└── common.ts
```

when these files contain unrelated functionality.

Keep genuinely cross-cutting infrastructure in `lib`, for example:

```text
lib/
├── auth.ts
├── prisma.ts
├── env.ts
├── utils.ts
└── integrations/
```

But each file should have a clear responsibility.

If functionality belongs to a specific feature, consider moving it closer to that feature.

---

# 17. Types

Avoid a huge global:

```text
types/
```

folder containing every type in the application.

Prefer feature-local types when a type belongs to one domain:

```text
features/
└── portfolio/
    ├── types.ts
    └── ...
```

Global types are appropriate when they are genuinely shared across unrelated features.

Do not duplicate types merely because two files happen to need them.

---

# 18. Hooks

Do not put every custom hook into:

```text
hooks/
```

Ask whether the hook is:

* globally reusable
* feature-specific
* route-specific

Feature-specific:

```text
features/
└── portfolio/
    └── hooks/
        └── use-portfolio-filter.ts
```

Global:

```text
hooks/
└── use-media-query.ts
```

Do not create a hook for logic that is only used once and does not benefit from isolation.

---

# 19. Components

Analyze components based on ownership.

Potential categories:

### Global UI

```text
components/
└── ui/
```

Examples:

* Button
* Dialog
* Input
* Select

### Shared application components

```text
components/
└── shared/
```

Examples:

* Header
* Sidebar
* UserMenu

### Feature-specific components

```text
features/
└── portfolio/
    └── components/
```

Examples:

* PortfolioSummary
* AssetTable
* AllocationChart

### Route-specific components

These may remain close to the route in `app/` when appropriate.

Do not force every component into a global folder.

---

# 20. Avoid excessive nesting

Do not transform a simple project into:

```text
components/
└── portfolio/
    └── ui/
        └── components/
            └── tables/
                └── asset/
                    └── ...
```

without a strong reason.

Prefer the shallowest structure that clearly communicates ownership.

---

# 21. Naming consistency

Check:

* kebab-case vs camelCase
* singular vs plural folder names
* component naming
* file naming
* feature naming
* route naming
* schema naming
* action naming
* repository/data-access naming

Do not perform mass renaming unless it materially improves consistency.

---

# 22. Barrel files

Inspect usage of:

```text
index.ts
```

Flag barrel files that:

* create circular dependencies
* hide import origins
* unnecessarily increase coupling
* export unrelated modules

Do not automatically remove all barrel files.

A barrel is acceptable when it provides a meaningful public boundary.

---

# 23. Circular dependencies

Look for architecture that creates cycles such as:

```text
feature A
    ↓
shared
    ↓
feature B
    ↓
feature A
```

Feature-specific modules should generally not depend on unrelated features.

Avoid structures where:

```text
portfolio → transactions → portfolio
```

unless the dependency is deliberate and justified.

Prefer clear dependency directions.

For example:

```text
app
 ↓
features
 ↓
shared infrastructure
```

when appropriate.

---

# 24. Feature-to-feature dependencies

If one feature imports internal implementation details from another feature, investigate it.

For example:

```text
features/
├── portfolio/
└── transactions/
```

If:

```text
transactions/
└── ...
    ↓
portfolio/components/internal-component.tsx
```

exists, determine whether:

* the component is actually shared
* the dependency should be inverted
* a shared module is appropriate
* the feature boundaries are incorrect

Do not automatically merge the features.

---

# 25. Avoid generic Clean Architecture

Do NOT automatically transform the project into:

```text
domain/
application/
infrastructure/
presentation/
```

or:

```text
controllers/
services/
repositories/
entities/
use-cases/
```

This skill does not impose:

* Clean Architecture
* Hexagonal Architecture
* DDD
* MVC
* layered architecture

These patterns may be valid, but they should only be introduced when the application's complexity justifies them.

---

# Analysis Procedure

When invoked, follow this workflow.

## Phase 1 — Inspect

Inspect:

```text
package.json
tsconfig.json
next.config.*
src/
app/
```

where they exist.

Then inspect the source tree.

Use available tools to understand:

* imports
* exports
* component usage
* server/client boundaries
* database access
* API access
* Server Actions
* validation
* hooks
* shared utilities
* authentication
* external integrations

Do not read every file blindly if the project is large.

Start with the tree and configuration, then inspect files relevant to architectural decisions.

---

# Phase 2 — Build an architectural map

Build an internal map such as:

```text
Routes
  ↓
Page / Layout
  ↓
Feature UI
  ↓
Server Action / Data Access
  ↓
Prisma / External API
  ↓
Database / External Service
```

Also identify:

```text
Shared UI
Shared infrastructure
Authentication
Validation
Domain-specific logic
```

---

# Phase 3 — Identify problems

Look specifically for:

## Structural problems

* misplaced files
* oversized directories
* duplicated functionality
* unclear ownership
* unrelated code grouped together
* excessive nesting

## Dependency problems

* circular dependencies
* feature → feature coupling
* server → client violations
* infrastructure leaking into UI
* client code importing server-only modules

## Responsibility problems

* pages containing too much logic
* components containing database logic
* utilities containing domain logic
* hooks containing unrelated concerns
* Server Actions doing too many things
* schemas duplicated across layers

## Maintainability problems

* duplicated types
* duplicated schemas
* duplicated API calls
* duplicated validation
* inconsistent naming
* unclear module boundaries

---

# Phase 4 — Classify findings

Every finding must be classified as:

### Critical

The architecture creates a real bug risk, invalid dependency, or server/client boundary problem.

### Important

The architecture materially makes the project harder to maintain or extend.

### Optional

A possible improvement, but the current structure is valid.

Do not present personal stylistic preferences as architectural problems.

---

# Phase 5 — Propose a target structure

Show:

```text
CURRENT
```

and:

```text
PROPOSED
```

For example:

```text
CURRENT

src/
├── app/
├── components/
├── hooks/
├── lib/
├── services/
└── types/
```

Possible proposal:

```text
PROPOSED

src/
├── app/
├── components/
│   └── ui/
├── features/
│   ├── auth/
│   ├── portfolio/
│   └── transactions/
└── lib/
```

For every meaningful move, explain:

* what moves
* where it moves
* why it moves
* what dependency boundary it improves

Do not propose changes merely to make the tree look different.

---

# Phase 6 — Minimize changes

Prefer the smallest architectural change that solves the identified problem.

For example:

If:

```text
components/
└── portfolio-chart.tsx
```

is only used by portfolio pages, moving it to:

```text
features/
└── portfolio/
    └── components/
        └── portfolio-chart.tsx
```

may be enough.

Do not simultaneously introduce:

```text
domain/
application/
infrastructure/
repositories/
services/
use-cases/
```

unless there is clear evidence that they are necessary.

---

# Phase 7 — Present the plan before modifying files

When the user asks for an architecture review or refactor, do not immediately perform a large structural rewrite.

First present:

```text
I found X architectural issues.

Proposed changes:

1. ...
2. ...
3. ...

Files affected:

- ...
- ...
- ...

No files have been changed yet.
```

Wait for approval before executing a substantial refactor.

If the user explicitly tells you to apply the changes immediately, follow that instruction.

---

# Phase 8 — Execute the refactor

After approval:

1. create necessary directories
2. move files
3. update imports
4. update exports
5. preserve functionality
6. remove obsolete files
7. fix circular dependencies where identified
8. preserve Server/Client boundaries
9. preserve route behavior
10. run formatting
11. run lint
12. run typecheck
13. run tests if available
14. run build if practical

Never silently change business logic during a structural refactor.

If a logic change appears necessary, explain it separately before making it.

---

# Verification

After refactoring, inspect `package.json` and use the project's actual scripts.

Possible commands include:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

For pnpm:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For Bun:

```bash
bun run lint
bun run typecheck
bun test
bun run build
```

Do not assume these scripts exist.

Use the project's actual package manager and scripts.

If the project uses another package manager, follow the existing project configuration.

---

# Final Report

After the refactor, report:

## Changed

* files moved
* folders created
* folders removed
* import changes
* dependency-boundary changes

## Intentionally Unchanged

Mention architecture that was reviewed but intentionally left untouched because it was already reasonable.

## Verification

Report the actual commands executed and their results.

Example:

```text
✓ TypeScript
✓ ESLint
✓ Tests
✓ Production build
```

If something fails:

```text
✗ Production build

Reason:
...
```

Never claim a command passed if it was not actually executed.

---

# Important Constraints

Never:

* rewrite the whole application
* change business logic during a structural refactor
* introduce abstractions without justification
* create folders simply because they are conventional
* move everything into `features/`
* move everything into `lib/`
* move everything into `services/`
* introduce repositories for trivial database operations
* convert Server Components to Client Components unnecessarily
* introduce Clean Architecture automatically
* create hooks for one-off logic
* create global types for feature-specific types
* create global schemas for feature-specific validation
* add barrel files merely to shorten imports
* delete code without verifying references
* duplicate authentication logic unnecessarily
* create API routes only to wrap Server Actions
* create Server Actions only to avoid a legitimate HTTP endpoint
* introduce a data-fetching library that the project does not currently use
* assume React Query/TanStack Query is installed or desirable

---

# Decision Rules

When choosing between two valid structures, prefer the one that:

1. has fewer unnecessary files
2. has fewer abstraction layers
3. makes ownership obvious
4. keeps related code together
5. keeps unrelated code separated
6. minimizes cross-feature dependencies
7. preserves server/client boundaries
8. is easy for a new developer to understand
9. matches the existing project rather than an external template
10. can evolve without requiring another large refactor

---

# Desired Outcome

After the refactor, a developer opening the repository for the first time should be able to quickly answer:

1. Where do routes live?
2. Where does shared UI live?
3. Where does each feature live?
4. Where does business logic live?
5. Where does database access live?
6. Where do external API integrations live?
7. Where is authentication handled?
8. Where is validation handled?
9. Which code is server-only?
10. Which code is client-only?
11. Which modules are genuinely shared?

The architecture should remain understandable to a junior/mid-level developer.

Prefer:

```text
obvious ownership
+
low coupling
+
shallow structure
+
minimal abstraction
```

over:

```text
maximum abstraction
+
maximum folder count
+
architecture for its own sake
```
