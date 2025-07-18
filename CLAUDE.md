# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**hima_calendar** (暇カレンダー) is a Japanese "free time calendar" application built with Next.js 15, React 19, and TypeScript. It allows users to mark their available time slots and see when others are free, facilitating social time coordination.

## Development Commands

```bash
# Development
npm run dev          # Start development server at http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint checks
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.4.1 with App Router
- **UI**: React 19.1.0 with TypeScript
- **Styling**: Tailwind CSS v4 with extensive custom animations
- **Date Handling**: date-fns
- **Icons**: lucide-react
- **State Management**: React hooks with localStorage persistence

### Key Architectural Patterns

1. **Component Structure**: 
   - Calendar components handle both month and day views through a unified interface
   - Heavy use of React.memo for performance optimization
   - Event system built around a central `CalendarEvent` type

2. **State Management**:
   - Custom `useCalendar` hook manages all calendar state
   - localStorage persistence through utility functions
   - No external state management library

3. **Type System**:
   - Strict TypeScript configuration
   - Centralized type definitions in `src/types/`
   - Path alias `@/*` maps to `./src/*`

4. **Styling Approach**:
   - Tailwind CSS with custom animation utilities
   - Retro/playful design system with custom colors and gradients
   - Responsive design with mobile-first approach

### Key Data Structures

```typescript
interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  attendees: string[];
}
```

Events are stored in localStorage and managed through the calendar hook system.

## Important Considerations

- The UI is entirely in Japanese - maintain Japanese text when modifying user-facing strings
- The application uses extensive custom animations defined in tailwind.config.ts
- No testing framework is currently set up
- All data persistence is handled through browser localStorage
- The app uses a playful, retro aesthetic - maintain this style when adding features