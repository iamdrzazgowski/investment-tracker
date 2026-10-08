Analyze the current `src/app` structure in this Next.js project and simplify the routing structure.

I want to remove the `(app)` route group and have all regular application pages directly under `src/app`. The only route group that should remain is `(auth)` for the login and signup pages.

### Target structure

The final structure should look roughly like this:

```text
src/app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
│
├── dashboard/
│   └── page.tsx
├── portfolio/
│   └── page.tsx
├── watchlist/
│   └── page.tsx
├── analytics/
│   └── page.tsx
├── transactions/
│   └── page.tsx
├── settings/
│   └── page.tsx
│
├── api/
├── globals.css
├── layout.tsx
└── page.tsx
```

The exact application page names should be based on the project's current structure. **Do not create new pages just to match the example above.**

### Required changes

1. Analyze the current `src/app/(app)` structure.

2. Remove the `(app)` route group by moving its contents directly into `src/app`.

For example:

```text
src/app/(app)/portfolio
```

should become:

```text
src/app/portfolio
```

Do the same for every route currently located inside `(app)`.

3. Create:

```text
src/app/(auth)
```

4. Move:

```text
src/app/login
src/app/signup
```

to:

```text
src/app/(auth)/login
src/app/(auth)/signup
```

5. Preserve the public URLs:

```text
/login
/signup
```

The `(auth)` route group must not appear in the URL.

6. Do not create another route group for the regular application pages.

I want:

```text
src/app/<route>
```

instead of:

```text
src/app/(app)/<route>
```

7. Preserve all existing Next.js App Router files and routing behavior, including:

* `page.tsx`
* `layout.tsx`
* `loading.tsx`
* `error.tsx`
* `not-found.tsx`
* `template.tsx`
* dynamic segments such as `[id]`
* catch-all segments such as `[...slug]`
* any other existing routing files

8. Pay special attention to whether `src/app/(app)` currently contains a `layout.tsx`.

If it does, **do not simply delete it**.

Analyze what the layout provides and determine how to preserve its behavior after removing the `(app)` route group. If its functionality belongs at the root level, move the required logic to `src/app/layout.tsx`. If some functionality should remain scoped differently, preserve that behavior using the simplest appropriate structure without reintroducing unnecessary route groups.

9. Also check whether `(auth)` needs its own `layout.tsx`.

Do not create an auth layout unless the existing application structure or behavior actually requires one.

10. Check all routing-related dependencies, including:

* `redirect()`
* `notFound()`
* `Link`
* `router.push()`
* `router.replace()`
* middleware/proxy
* authentication guards
* protected routes
* breadcrumbs
* navigation
* active navigation links
* pathname checks
* route-based conditional rendering

11. Do not change any public URLs.

Removing `(app)` must not change the URLs users access.

For example:

```text
/app/(app)/portfolio
```

should already correspond to:

```text
/portfolio
```

and after the refactor it must still be:

```text
/portfolio
```

Likewise:

```text
/login
/signup
```

must remain unchanged.

12. Do not perform any unrelated refactoring.

Do not refactor components, features, repositories, services, validation, business logic, styling, or other parts of the application unless a change is strictly required to preserve routing behavior.

### Scope restriction

The main scope of this refactor is:

```text
src/app
```

Do not move or reorganize files from:

```text
src/features
src/components
src/lib
src/repositories
```

or other parts of the project.

Only modify files outside `src/app` if they contain routing references that must be updated because of this structural change.

### Important

Before making changes, first inspect the current `src/app` structure and understand how the existing layouts and route groups work.

Then make the smallest set of changes necessary to achieve the target structure.

Do not introduce unnecessary abstractions or new architectural patterns.

### Verification

After completing the refactor, verify that:

1. `src/app/(app)` no longer exists.
2. All routes previously inside `(app)` are directly under `src/app`.
3. `src/app/(auth)/login` exists.
4. `src/app/(auth)/signup` exists.
5. `/login` still resolves correctly.
6. `/signup` still resolves correctly.
7. All existing application URLs remain unchanged.
8. Authentication and protected routes still work correctly.
9. Existing layouts still provide the same functionality.
10. There are no broken imports or route references.

Run the project's available checks, such as:

* typecheck
* lint
* build

Do not fix unrelated pre-existing errors automatically.

### Final report

At the end, provide a concise summary containing:

* directories/files that were moved
* layouts that were changed
* files outside `src/app` that were modified, if any
* typecheck result
* lint result
* build result
* any issues that could not be verified
