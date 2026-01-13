# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture

**JOFO** (Joy of Financing Out) is a Next.js 16 fintech app that turns staying in into compound growth. Users skip the night out, stash the savings for "Future You", and watch compound interest work its magic. "Stash" is the action verb used throughout the app (not "pledge").

### Tech Stack
- Next.js 16 with App Router (React 19)
- TypeScript with strict mode
- Tailwind CSS 4 for styling
- Framer Motion for animations
- Radix UI primitives (Dialog, Slider, Slot)
- Recharts for data visualization
- Anthropic SDK included

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── onboarding/        # Multi-step onboarding flow (email → connect → analyze → insights)
│   ├── pledge/            # Stash creation with amount slider and future value preview (route kept as /pledge for URL simplicity)
│   └── dashboard/         # Main dashboard with projection chart and stash history
├── components/ui/         # Radix-based UI primitives (button, card, input, slider, dialog)
├── lib/
│   ├── utils.ts           # cn() helper for Tailwind class merging
│   └── projections.ts     # Financial calculations (future value, recurring contributions)
└── data/
    └── mock-transactions.ts # Demo spending patterns and transaction generator
```

### Key Patterns

**Path Alias**: Use `@/*` to import from `src/*`

**Client Components**: Pages using hooks or browser APIs are marked `'use client'`

**Data Persistence**: Stashes stored in localStorage key `stashes` (no backend currently)

**Financial Projections**: `src/lib/projections.ts` provides compound interest calculations:
- `calculateFutureValue()` - one-time investment growth
- `calculateRecurringFutureValue()` - weekly contribution growth
- `generateProjectionData()` - chart data points over N years

**Theme Support**: App supports both light and dark modes via ThemeProvider context

## Design System - Light/Dark Mode

**CRITICAL: All new components must support both light and dark themes.** Use the following patterns:

### Theme-Aware CSS Classes (defined in globals.css)

| Class | Purpose |
|-------|---------|
| `app-bg` | Page backgrounds (gradient from slate-50/950) |
| `app-card` | Card backgrounds with borders |
| `app-card-secondary` | Secondary card backgrounds |
| `app-subtle` | Subtle background highlights |
| `app-header` | Header/nav backgrounds |
| `text-primary-app` | Primary text (slate-900/white) |
| `text-secondary-app` | Secondary text (slate-600/slate-400) |
| `text-muted-app` | Muted/subtle text (slate-500) |

### Color Patterns

**Always use `dark:` variants for theme-aware colors:**
```tsx
// Good - supports both themes
className="text-green-600 dark:text-green-400"
className="bg-slate-100/50 dark:bg-slate-800/50"
className="border-slate-200 dark:border-slate-700"

// Bad - only works in dark mode
className="text-green-400"
className="bg-slate-800/50"
```

### Gradient Text
```tsx
// Theme-aware gradient for headings
className="bg-gradient-to-r from-slate-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent"
```

### Components

- **ThemeProvider** (`@/components/ThemeProvider`): Wraps app, provides `useTheme()` hook
- **ThemeToggle** (`@/components/ThemeToggle`): Cycles through light/dark/system modes

### Key Files
- `src/app/globals.css`: Theme CSS variables and utility classes
- `src/components/ThemeProvider.tsx`: Theme context and persistence
- `src/components/ThemeToggle.tsx`: UI for switching themes
