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

**JOFO** (Joy of Financing Out) is a Next.js 16 fintech app that turns staying in into compound growth. Users skip the night out, pledge the savings to "Future You", and watch compound interest work its magic. "Stash" is used as the action verb within the app.

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
│   ├── pledge/            # Pledge creation with amount slider and future value preview
│   └── dashboard/         # Main dashboard with projection chart and pledge history
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

**Data Persistence**: Pledges stored in localStorage (no backend currently)

**Financial Projections**: `src/lib/projections.ts` provides compound interest calculations:
- `calculateFutureValue()` - one-time investment growth
- `calculateRecurringFutureValue()` - weekly contribution growth
- `generateProjectionData()` - chart data points over N years

**Dark Theme**: App uses dark mode by default (`className="dark"` on html element)
