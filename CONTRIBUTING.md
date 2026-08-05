# CONTRIBUTING.md — KIBBO Product Manager

## Project Overview

Single-page application built with Next.js 14 (App Router) for managing a product inventory. Users can create, view, edit, delete, sort, and filter products. Data persists in localStorage via Zustand middleware.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14+ (App Router) | Framework |
| TypeScript | ^5 | Type safety |
| Zustand | ^5 | State management + localStorage persistence |
| TailwindCSS | ^3 | Styling |
| Framer Motion | ^13 | Animations |
| next-themes | ^0.4 | Dark/light theme |
| Jest | ^30 | Unit & integration tests |
| React Testing Library | ^16 | Component testing |

## Conventions

### TypeScript
- Always define types/interfaces in `src/types/`. Never use `any`.
- Interface names: PascalCase. Props interfaces: `ComponentNameProps`.
- Use `type` for unions/utilities, `interface` for object shapes.

### Components
- One component per file. File name matches component name: `ProductCard.tsx` → `ProductCard`.
- Use named exports, never default exports.
- Component order inside file: imports → types → component → subcomponents.
- Props destructured in function signature with explicit type.

### Styling (TailwindCSS)
- No custom CSS files except `globals.css` (Tailwind directives only).
- Use Tailwind utility classes exclusively. No inline `style={{}}` unless dynamically computed.
- Responsive: mobile-first (`md:`, `lg:` breakpoints).
- Focus states: every interactive element must have visible `focus:ring-*`.
- Use the `cn()` helper from `src/lib/utils.ts` for composing class strings.

### State Management (Zustand)
- Store files: `src/store/productStore.ts` and `src/store/toastStore.ts`.
- Actions: named with intent verbs (`addProduct`, `updateProduct`, `removeProduct`).
- State updates: immutable patterns.
- Access product store only through the custom hook `useProducts` from `src/hooks/useProducts.ts`.

### Hooks
- All hooks in `src/hooks/`. Export as named functions.
- Prefix with `use`: `useProducts`, `useDebounce`, `useToast`.

### Testing
- Test files in `src/__tests__/` mirroring source structure.
- Naming: `ComponentName.test.tsx` or `functionName.test.ts`.
- Coverage goal: store logic (100%), critical components (product CRUD flow).
- Use `@testing-library/react` queries in this priority: `getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByTestId`.

### Accessibility
- All interactive elements: keyboard navigable + focus visible.
- Form inputs: associated `<label>` with `htmlFor`.
- Icons/buttons: `aria-label` if no visible text.
- Lists: use semantic `<ul>`/`<ol>`/`<li>`.
- Color contrast: text on backgrounds must meet WCAG AA.

### Commits & Code Quality
- No `console.log`, no commented-out code, no dead code.
- No unused imports or variables.
- Run `npm run lint` and `npm run typecheck` before considering a task complete.

## Project Structure

```
kibbo-front/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI: lint + typecheck + tests (Node 20 & 22)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, metadata, fonts, skip link, ToastContainer
│   │   ├── page.tsx            # Main page; ProductList/ProductFilters via next/dynamic
│   │   ├── providers.tsx       # ThemeProvider (next-themes)
│   │   └── globals.css         # Tailwind directives
│   ├── components/
│   │   ├── products/
│   │   │   ├── ProductForm.tsx      # Create/edit form with validation
│   │   │   ├── ProductList.tsx      # Renders cards + ConfirmDialog + AnimatePresence
│   │   │   ├── ProductCard.tsx      # motion.li card, edit/delete, keyboard nav
│   │   │   ├── ProductFilters.tsx   # Debounced search + product count
│   │   │   ├── ProductSort.tsx      # Sort field select + order toggle
│   │   │   ├── ProductHeader.tsx    # App title + inventory summary + ThemeToggle
│   │   │   ├── ProductListSkeleton.tsx # Loading skeleton for dynamic import
│   │   │   └── EmptyState.tsx       # Shown when no products exist or match filter
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── TextArea.tsx
│   │       ├── ConfirmDialog.tsx    # Accessible alertdialog (focus trap, Escape)
│   │       ├── ToastContainer.tsx   # Animated toasts (success/error/info)
│   │       ├── ThemeToggle.tsx      # Light/dark toggle (next-themes)
│   │       └── icons.tsx            # Shared inline SVG icon components
│   ├── hooks/
│   │   ├── useProducts.ts       # Facade over Zustand store
│   │   ├── useDebounce.ts       # Debounces search input
│   │   └── useToast.ts          # success/error/info helpers over toastStore
│   ├── lib/
│   │   └── utils.ts             # cn() helper (clsx + tailwind-merge)
│   ├── store/
│   │   ├── productStore.ts      # Zustand store + filterAndSortProducts
│   │   └── toastStore.ts        # Toast queue (not persisted)
│   ├── types/
│   │   └── product.ts           # Product, ProductFormValues, ProductFormData, SortField, SortOrder
│   ├── utils/
│   │   ├── validators.ts        # Form validation functions
│   │   └── formatters.ts        # Date formatting, number formatting
│   └── __tests__/
│       ├── store/
│       │   ├── productStore.test.ts
│       │   └── toastStore.test.ts
│       ├── hooks/
│       │   ├── useProducts.test.ts
│       │   └── useDebounce.test.ts
│       ├── components/
│       │   ├── ProductForm.test.tsx
│       │   ├── ProductList.test.tsx
│       │   ├── ProductFilters.test.tsx
│       │   ├── ConfirmDialog.test.tsx
│       │   └── ThemeToggle.test.tsx
│       └── utils/
│           ├── validators.test.ts
│           └── formatters.test.ts
├── public/
│   └── logo.png                # Favicon + header logo
├── CONTRIBUTING.md             # This file
├── README.md
├── tailwind.config.ts          # darkMode: "class"
├── tsconfig.json
├── jest.config.ts
├── jest.setup.ts               # ResizeObserver/rAF polyfills for framer-motion
├── next.config.mjs
└── package.json
```

## Key Implementation Details

### Product Type (`src/types/product.ts`)
```typescript
export interface Product {
  codigo: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  creacion: string; // ISO 8601 date string
}

export type ProductFormData = Omit<Product, 'codigo' | 'creacion'>;

export interface ProductFormValues {
  nombre: string;
  descripcion: string;
  cantidad: string; // raw form input before conversion
}

export type SortField = 'codigo' | 'nombre' | 'cantidad' | 'creacion';

export type SortOrder = 'asc' | 'desc';
```

### Zustand Store Pattern
- Use `persist` middleware with `name: 'kibbo-products'` and `storage: createJSONStorage(() => localStorage)`.
- `codigo` is auto-generated (incrementing counter, not random).
- `creacion` is set to `new Date().toISOString()` on creation.
- State shape: `products: Product[]`, `searchTerm: string`, `sortField: SortField`, `sortOrder: SortOrder`, `editingProduct: Product | null`.
- `editingProduct` is excluded from persistence via `partialize`.
- Derived data via a pure function `filterAndSortProducts` combined in `useProducts` with `useMemo`.
- Client components import the store only through `useProducts`.
- Toasts live in a separate non-persisted store `src/store/toastStore.ts`; use `useToast` hook.

### Dark Mode
- Tailwind `darkMode: "class"`; `next-themes` provider in `src/app/providers.tsx`.
- Every color decision must include a `dark:` variant. Palette: neutral-900/950 surfaces, neutral-400/500 secondary text, indigo accents.

### Animations (Framer Motion)
- Cards (`ProductCard` is a `motion.li`) animate enter/exit inside `AnimatePresence mode="popLayout"` in `ProductList`.
- ConfirmDialog and ToastContainer use `AnimatePresence` for enter/exit.
- ProductCard must be a `forwardRef` component (popLayout passes refs).
- jest.setup.ts polyfills `ResizeObserver`/`IntersectionObserver`/rAF for jsdom.

### Validation Rules
- `nombre`: required, min 2 chars, max 100 chars.
- `descripcion`: required, min 5 chars, max 500 chars.
- `cantidad`: required, integer >= 0.

### Accessibility Checklist
- Header with `aria-level` for title hierarchy.
- Skip link to `#main-content` in root layout.
- Form: `aria-required`, `aria-describedby` for error messages.
- Delete buttons: `aria-label="Eliminar {productName}"`.
- Edit buttons: `aria-label="Editar {productName}"`.
- Edit form: shared `ProductForm` pre-filled via `editingProduct`.
- Sort controls: `aria-label` for current sort state.
- Empty state: polite `aria-live` region.
- ConfirmDialog: `role="alertdialog"`, `aria-modal`, focus trap, Escape to cancel, restores focus on close.
- Cards: `tabIndex={0}` + Enter/Space opens edit; buttons stopPropagation.
- Toast container: `aria-live="polite"`.
- Color contrast ratio ≥ 4.5:1 for text (both themes).

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint check
npm run typecheck    # TypeScript type check
npm test            # Run Jest tests
npm test -- --watch  # Jest watch mode
npm test -- --coverage # Test coverage report
```
