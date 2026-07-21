# NovaEdge Academy — Global Design System
**Version:** v1.0 | **Theme:** Dark Premium EdTech | **Status:** Living Document
**Stack:** Next.js 15 (App Router) · Tailwind CSS · Framer Motion · GSAP · Lenis

---

# PART 1 — FOUNDATION

---

## 1.1 Design Philosophy

**Concept:** "Dark Academic Premium" — the aesthetic intersection of a high-end SaaS product
and an elite learning institution. Not Udemy's marketplace clutter, not Coursera's corporate
sterility. NovaEdge Academy feels like a product that respects the learner's intelligence.

**Three design principles:**
1. **Depth over flatness** — Layered dark surfaces with subtle light to create dimension
2. **Earned attention** — Animations reveal meaning, never decorate for decoration's sake
3. **Information hierarchy** — Every screen has one primary action; nothing competes equally

**Aesthetic keywords:** Obsidian · Electric · Precise · Warm darkness · Professional energy

---

## 1.2 Color System

### Background Scale — 5-layer depth model
```
--bg-base:      #08080E    Root page background. Set once on <html>.
--bg-surface:   #0E0E18    Cards, panels, sidebars — primary content containers.
--bg-elevated:  #141420    Elements raised above surface: inputs, secondary cards.
--bg-overlay:   #1C1C2E    Modals, drawers, tooltips — floating above everything.
--bg-hover:     #1F1F32    Hover state for interactive surface items.
```

### Brand — Primary Purple
```
--primary-200:  #DDD6FE
--primary-300:  #C084FC    Tints, subtle highlights, secondary text accents
--primary-400:  #A855F7    Secondary actions, links, icon accents
--primary-500:  #9333EA    ★ MAIN — CTAs, active states, brand moments
--primary-600:  #7C3AED    Pressed states, darker fills
--primary-700:  #6D28D9    Deepest purple, text on light purple bg
--primary-glow: rgba(147,51,234,0.20)   Ambient glow for hero, spotlights
```

### Secondary — Cyan (Learning & Progress)
```
--cyan-300:     #67E8F9    Light tint, subtle bg
--cyan-400:     #22D3EE    Info states, live indicators, links
--cyan-500:     #06B6D4    ★ MAIN — Progress bars, course completion, live badge
--cyan-600:     #0891B2    Pressed cyan, text on cyan bg
```

### Accent — Gold (Gamification)
```
--gold-300:     #FCD34D    Stars, light tint
--gold-400:     #FBBF24    ★ MAIN — Ratings, XP bar, badge shine
--gold-500:     #F59E0B    Cert borders, achievement cards
--gold-600:     #D97706    Pressed gold
```

### Text Scale
```
--text-1:       #F2F2FF    Primary — headings, body text, important data
--text-2:       #9494AF    Secondary — descriptions, meta info, labels
--text-3:       #5A5A74    Muted — placeholders, timestamps, captions
--text-4:       #35354A    Disabled — inactive elements, divider text
```

### System / Semantic
```
--success:      #10B981    Enrolled, completed, correct answer
--success-bg:   rgba(16,185,129,0.10)
--warning:      #F59E0B    Pending review, expiring trial
--warning-bg:   rgba(245,158,11,0.10)
--error:        #F43F5E    Errors, failed payment, wrong answer
--error-bg:     rgba(244,63,94,0.10)
--info:         #06B6D4    Informational, live class, notification
--info-bg:      rgba(6,182,212,0.10)
```

### Borders
```
--border-subtle:  rgba(255,255,255,0.05)   Dividers, very light separation
--border-default: rgba(255,255,255,0.09)   Default card/input border
--border-strong:  rgba(255,255,255,0.16)   Hover state, emphasized elements
--border-active:  rgba(147,51,234,0.50)    Active/focused inputs, selected items
```

### Gradients
```css
--grad-primary:   linear-gradient(135deg, #9333EA 0%, #4F46E5 100%)
--grad-learn:     linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%)
--grad-gold:      linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)
--grad-card:      linear-gradient(145deg, #141420 0%, #0E0E18 100%)
--grad-hero-mesh: radial-gradient(ellipse at 15% 20%, rgba(147,51,234,0.45) 0%, transparent 50%),
                  radial-gradient(ellipse at 85% 80%, rgba(6,182,212,0.25) 0%, transparent 50%)
--grad-text-main: linear-gradient(135deg, #C084FC, #06B6D4)   /* gradient text effect */
```

---

## 1.3 Typography System

**Font Loading:** Use `next/font/google` — never CDN in production.

```typescript
// lib/fonts.ts
import { Syne, Outfit, Figtree, JetBrains_Mono } from 'next/font/google'

export const syne    = Syne({ subsets: ['latin'], weight: ['700','800'], variable: '--font-display' })
export const outfit  = Outfit({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-ui' })
export const figtree = Figtree({ subsets: ['latin'], weight: ['300','400','500','600'], variable: '--font-body' })
export const mono    = JetBrains_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-mono' })
```

### Font Roles
|
 Token 
|
 Font 
|
 Use 
|
|
-------
|
------
|
-----
|
|
`--font-display`
|
 Syne 
|
 Hero headlines, page H1s, marketing moments 
|
|
`--font-ui`
|
 Outfit 
|
 Navigation, buttons, labels, H2–H4, badges, UI copy 
|
|
`--font-body`
|
 Figtree 
|
 Body paragraphs, descriptions, captions, course content 
|
|
`--font-mono`
|
 JetBrains Mono 
|
 Code blocks, terminal, technical IDs 
|

### Type Scale (Desktop → Tablet → Mobile)
```
Display:  72px / 800  →  48px  →  36px    line-height: 1.05   letter-spacing: -2px
H1:       48px / 700  →  36px  →  28px    line-height: 1.15   letter-spacing: -1px
H2:       36px / 700  →  28px  →  24px    line-height: 1.2    letter-spacing: -0.5px
H3:       24px / 600  →  22px  →  20px    line-height: 1.3
H4:       20px / 600  →  18px  →  17px    line-height: 1.35
H5:       17px / 600  →  16px  →  16px    line-height: 1.4
Body L:   18px / 400  →  17px  →  16px    line-height: 1.7
Body M:   16px / 400  →  15px  →  15px    line-height: 1.65
Body S:   14px / 400  →  14px  →  14px    line-height: 1.6
Label:    12px / 500  →  12px  →  12px    line-height: 1.4    letter-spacing: 0.5px
Caption:  12px / 400  →  12px  →  12px    line-height: 1.5
Code:     13px / 400  →  13px  →  12px    line-height: 1.7
```

### Usage Rules
- `--font-display` (Syne) only for Display + H1. Never for body or UI.
- `--font-ui` (Outfit) for H2–H5, navigation, buttons, badges, form labels, all uppercase labels.
- `--font-body` (Figtree) for all paragraph text, course descriptions, reviews, blog content.
- Uppercase labels: `letter-spacing: 1–1.5px`, always `--font-ui`, max 13px.
- Gradient text: use `background: var(--grad-text-main); -webkit-background-clip: text; color: transparent` — sparingly, only on hero headlines and section accents.

---

## 1.4 Spacing System

Based on 4px grid. Tailwind defaults map correctly.

```
4px   (1)   — Icon internal padding, tight chip gaps
8px   (2)   — Component internal gap (icon→text), small padding
12px  (3)   — Element gaps within a component
16px  (4)   — Standard component padding, card inner padding
20px  (5)   — Comfortable padding, list item spacing
24px  (6)   — Section element gaps, card padding (comfortable)
32px  (8)   — Large card padding, between components
40px  (10)  — Small section padding (mobile)
48px  (12)  — Medium section padding
64px  (16)  — Standard section padding (tablet)
80px  (20)  — Section padding desktop
96px  (24)  — Large section padding desktop
128px (32)  — Hero padding
```

---

## 1.5 Grid & Layout System

```
Max Content Width:  1280px
Container Padding:  24px (mobile) → 40px (tablet) → 80px (desktop)
Column Grid:        12-column, 24px gap (desktop) → 16px (mobile)
```

### Breakpoints
```
xs:   0–479px     Small mobile
sm:   480–767px   Mobile
md:   768–1023px  Tablet
lg:   1024–1279px Small desktop
xl:   1280px+     Desktop (design target)
```

### Layout Templates (used across all pages)
```
PUBLIC_FULL:        Navbar + main content + Footer
PUBLIC_CENTERED:    Navbar + centered card/form + Footer  (auth, policies)
DASHBOARD_SIDEBAR:  Fixed sidebar (240px) + main scrollable content area
ADMIN_SIDEBAR:      Fixed sidebar (256px) + main scrollable content area
LMS_PLAYER:         Fixed top navbar + fixed sidebar (course outline) + main video area
FULLSCREEN:         No navbar/footer (e.g., live class, fullscreen quiz)
```

---

## 1.6 Elevation & Depth

Depth is created through **background layering**, not box-shadows. Shadows are used sparingly
and only for floating elements (modals, dropdowns, tooltips).

```
Level 0 — Root:        bg-base    (#08080E)     Page background
Level 1 — Surface:     bg-surface (#0E0E18)     Cards, panels
Level 2 — Elevated:    bg-elevated (#141420)    Inputs inside cards, chips inside panels
Level 3 — Overlay:     bg-overlay (#1C1C2E)     Floating menus, modals
Level 4 — Top:         #242436                  Tooltips, top-priority alerts

Shadow scale (for floating elements only):
  sm:  0 4px 12px rgba(0,0,0,0.4)
  md:  0 8px 24px rgba(0,0,0,0.5)
  lg:  0 16px 48px rgba(0,0,0,0.6)
  xl:  0 32px 64px rgba(0,0,0,0.7)
  glow:0 0 40px rgba(147,51,234,0.25)   (only for primary action emphasis)
```

---

## 1.7 Animation System

**Philosophy:** Motion should feel like the UI has mass and momentum. Reveal things as if a curtain
is being drawn back, not things popping in from nothing. Every animation answers the question:
"Does this help the user understand what just happened?"

### Timing Standards
```
Micro (hover, toggle):   150ms
Standard (reveal, fade): 400ms
Page transition:         250ms
Count-up / draw:         1800ms
Scroll parallax:         continuous
```

### Easing Standards
```javascript
// Standard ease-out — use for most reveals
const ease = [0.22, 1, 0.36, 1]

// Snappy — use for micro-interactions
const snap = [0.34, 1.56, 0.64, 1]

// Linear — use for progress bars, loading
const linear = 'linear'
```

### Shared Framer Motion Variants (`lib/animations.ts`)
```typescript
export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
}

export const slideInLeft = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
}

export const staggerContainer = (stagger = 0.08, delay = 0.1) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } }
})
```

### Scroll Reveal Rule
Use `whileInView` + `viewport={{ once: true, margin: "-80px" }}` on every section.
**Never** animate on first paint except the Hero section.

### Hover Micro-interactions (apply globally via CSS)
```css
/* Cards */
.card-interactive { transition: transform 200ms ease, border-color 200ms ease; }
.card-interactive:hover { transform: translateY(-4px); border-color: var(--border-strong); }

/* Primary buttons */
.btn-primary:hover  { filter: brightness(1.08); transform: scale(1.02); }
.btn-primary:active { transform: scale(0.98); }

/* Ghost/outline buttons */
.btn-ghost:hover  { background: var(--bg-elevated); }
.btn-ghost:active { transform: scale(0.98); }

/* Nav links */
.nav-link::after { content: ''; display: block; height: 2px; background: var(--primary-500);
  transform: scaleX(0); transform-origin: left; transition: transform 200ms ease; }
.nav-link:hover::after { transform: scaleX(1); }
```

### Lenis Smooth Scroll
```typescript
// app/layout.tsx — wrap entire app
// dampening: 0.1, lerp: 0.1
// Disable on mobile (< 768px) for performance
```

---

## 1.8 Iconography

**Icon Library:** Lucide React (primary) + custom SVGs for brand-specific icons.
**Size standards:** 16px (inline), 20px (button/nav), 24px (section headers), 32px (feature cards).
**Color:** Inherit from parent text color. Never hardcode icon colors — use `currentColor`.

---

---

# PART 2 — COMPONENT LIBRARY

---

## 2.1 Atoms

### Button

**5 Variants:**

```
primary   — --grad-primary bg, white text, 10px radius
secondary — --bg-elevated bg, --border-default border, --text-1 text
ghost     — transparent bg, no border, --text-2 text (text-only, no box)
outline   — transparent bg, --border-strong border, --text-1 text
danger    — --error-bg bg, --error border, --error text
```

**3 Sizes:**
```
sm:  height 32px, padding 0 14px, font 13px (Outfit 500)
md:  height 40px, padding 0 20px, font 14px (Outfit 500)  ← default
lg:  height 48px, padding 0 28px, font 15px (Outfit 600)
```

**States:** default / hover / active / disabled (opacity 0.4, pointer-events none) / loading (spinner replaces text).

**Loading state:** Replace text with 16px spinner. Keep button width fixed (min-width).

**Icon support:** `iconLeft` or `iconRight` prop — 16px Lucide icon, gap 8px from text.

```
Button variants:
[Primary]   [Secondary]   [Ghost]   [Outline]   [Danger]
Gradient    Dark bg+border  Text    Border only  Red tones
```

---

### Badge

**Variants & Colors:**
```
default   — --bg-elevated bg, --text-2 text, --border-default border
primary   — rgba(147,51,234,0.12) bg, --primary-300 text, rgba(147,51,234,0.25) border
cyan      — --info-bg bg, --cyan-400 text, rgba(6,182,212,0.25) border
gold      — rgba(251,191,36,0.12) bg, --gold-400 text, rgba(251,191,36,0.25) border
success   — --success-bg bg, --success text, rgba(16,185,129,0.25) border
warning   — --warning-bg bg, --warning text, rgba(245,158,11,0.25) border
danger    — --error-bg bg, --error text, rgba(244,63,94,0.25) border
```

**Sizes:** `sm` (10px, 4px v-pad), `md` (12px, 6px v-pad) ← default, `lg` (13px, 8px v-pad)

**Shape:** `pill` (99px radius) ← default | `rounded` (6px radius) for category badges on cards

---

### Avatar

**Sizes:** `xs` 24px · `sm` 32px · `md` 40px · `lg` 56px · `xl` 80px

**States:**
- Image available: `object-fit: cover`, circular border
- Fallback: `--bg-elevated` bg, initials in `--font-ui`, 500 weight, `--primary-300` color

**Online indicator:** 10px dot bottom-right, `--success` color, white 2px ring. Toggle via `isOnline` prop.

**Ring variant:** 2px solid `--border-strong` ring around avatar (for stacked avatars in social proof).

---

### Input / Textarea / Select

```
Height:       40px (input/select), auto (textarea — min 80px)
Background:   --bg-elevated
Border:       1px solid --border-default
Border-radius:10px
Font:         Figtree 400, 15px, --text-1
Placeholder:  --text-3

Focus:   border-color → --border-active (purple), box-shadow: 0 0 0 3px rgba(147,51,234,0.12)
Error:   border-color → --error, box-shadow: 0 0 0 3px --error-bg
Success: border-color → --success
Disabled:opacity 0.5, cursor not-allowed
```

**Anatomy:** Label (Outfit 500, 13px, --text-2, uppercase, 1px tracking) above input. Error/hint message below (Figtree 400, 12px, --error or --text-3).

**Search Input:** Left icon (Search, 16px, --text-3) + input + optional clear button right. Background: --bg-surface.

---

### Toggle / Checkbox / Radio

**Toggle:** 44px × 24px track. Off: `--bg-elevated` bg, `--border-default` border. On: `--primary-500` bg. Thumb: white circle, 20px, with spring animation.

**Checkbox:** 18px × 18px. Off: `--bg-elevated`, `--border-default`. On: `--primary-500` bg, white checkmark icon. Indeterminate: `--primary-500` bg, white dash.

**Radio:** Same sizing. Circle indicator instead of checkmark.

---

### Progress Bar

**Variants:**
- `linear`: full-width, 6px height, --bg-elevated track, --grad-primary fill, animated on mount
- `slim`: 4px height, --bg-surface track, --cyan-500 fill (used in course cards)
- `ring` (ProgressRing): SVG circle, configurable size, `--grad-primary` stroke, center text for % value

---

### Skeleton / Loading State

Background: `--bg-elevated`. Animated with shimmer: `linear-gradient(90deg, --bg-elevated, --bg-overlay, --bg-elevated)` moving left→right, 1.5s infinite.

Use skeleton shapes matching actual content: line (1-3 lines), card, avatar+lines, table row.

---

### Toast / Alert

**Position:** Fixed, top-right, 16px from edge. Z-index: 9999. Stack multiple toasts with 8px gap.
**Variants:** success / error / warning / info — each with icon + message + optional action.
**Auto-dismiss:** 4000ms with a shrinking progress bar at bottom.
**Animation:** slide in from right (x: 100% → 0), slide out upward.

---

### Tooltip

Trigger: hover (desktop), tap (mobile). Delay: 400ms appear, immediate hide.
Background: `--bg-overlay`. Text: Figtree 400, 12px, `--text-1`. Padding: 6px 10px. Radius: 6px. Max-width: 200px.
Arrow: 6px CSS triangle pointing toward trigger. Z-index: 1000.

---

## 2.2 Molecules

### CourseCard

The single most important molecule in the app. Used on 10+ pages.

```
Container:  --bg-surface bg, --border-default border, 16px radius, overflow hidden
Hover:      translateY(-4px), border → --border-strong, transition 200ms

┌─────────────────────────────┐
│  [Thumbnail 16:9]           │  aspect-ratio: 16/9, object-fit: cover
│  [Hover overlay: ▶ Preview] │  semi-dark scrim + play button, 200ms fade
├─────────────────────────────┤
│  [Category Badge]  [Level]  │  --cyan badge (category), --gold badge (level)
│  [Title — 2 line clamp]     │  Outfit 600, 16px, --text-1
│  [Mentor: avatar + name]    │  Avatar xs + Figtree 400, 13px, --text-2
│  ─────────────────────────  │
│  [⭐ 4.8 (1.2k)] [12.5 hrs] │  --gold-400 star, Figtree 13px, --text-2 / --text-3
├─────────────────────────────┤
│  [₹999  ~~₹2999~~] [Enroll] │  Outfit 700 price + grad button
└─────────────────────────────┘
```

**Variants:**
- `default` — as above
- `horizontal` — thumbnail left (120px), info right (for list views)
- `enrolled` — hide price row, show ProgressBar instead + "Continue" button
- `mini` — no footer price row, compact (for sidebar recommendations)

---

### MentorCard

```
Container:  --bg-surface, --border-default, 16px radius, 24px padding, text-center
Hover:      translateY(-4px), border → --border-strong

[Avatar lg — 72px]
[Online indicator dot]
[Name — Outfit 600, 17px]
[Expertise — Figtree 400, 13px, --text-2]
[Company — Outfit 400, 12px, --primary-300]
─────────────────────────
[Courses: N] [⭐ 4.9] [12k Students]
[View Profile button — outline, full-width]
```

---

### PlanCard

```
Container:  --bg-surface, 20px radius, 32px padding
Featured:   --primary-500 border (1.5px), rgba(147,51,234,0.06) bg + "MOST POPULAR" badge at top

[Plan Name — Outfit 700, 20px]
[Price — Syne 800, 40px + /month Outfit 14px, --text-3]
[Description — Figtree 14px, --text-2]
────────────────────────────
[Feature List — ✓/✗ icons + Figtree 14px, --text-2]
[CTA Button — full-width, lg size]
```

---

### CourseReviewCard

```
[Header: avatar + name + role + date + stars]
[Review text — Figtree 400, 15px, --text-1]
[Helpful? Yes/No counter]
```

---

### StatCard (Dashboard)

```
Container: --bg-surface, --border-default, 16px radius, 24px padding

[Icon block 40px — gradient bg, white icon]
[Label — Outfit 400, 13px, --text-3, uppercase]
[Value — Syne 700, 32px, --text-1]
[Change — +12% Figtree 400, 13px, --success or --error with arrow icon]
```

---

### Modal / Dialog

```
Backdrop:   rgba(0,0,0,0.7), blur(8px), z-index: 200
Container:  --bg-overlay, --border-default, 20px radius
Sizes:      sm (400px) / md (560px) / lg (720px) / xl (900px) / fullscreen
Animation:  backdrop fadeIn + container scaleIn (0.95→1) simultaneously

Header: title (Outfit 600, 18px) + optional subtitle + close button (X icon, top-right)
Body:   padding 24px, scrollable if overflow
Footer: padding 16px 24px, border-top --border-subtle, right-aligned buttons
```

---

### Dropdown Menu

```
Trigger: any button or element
Panel:   --bg-overlay, --border-default, 10px radius, shadow-lg
         min-width: 180px, max-width: 280px
         Animation: scaleIn from trigger point, 150ms
Items:   Figtree 400, 14px, --text-1, 36px height, 10px h-padding
         Hover: --bg-hover bg
Dividers: --border-subtle, 1px
Icons:   16px Lucide, --text-3, 8px gap from text
```

---

### Tabs

**Two styles:**

`underline` — for page-level navigation (dashboard, settings, profile):
- Tab labels: Outfit 500, 14px. Active: --text-1 + 2px --primary-500 bottom border. Inactive: --text-3.
- Animated indicator: sliding bottom border using layout animation.

`pill` — for content switching (course player, admin sections):
- Tab labels: Outfit 500, 13px. Active: --bg-elevated bg + --text-1. Inactive: transparent + --text-3.
- 8px radius pill.

---

### DataTable (Admin pages)

```
Container: --bg-surface, --border-default, 16px radius, overflow hidden

Header row:  --bg-elevated bg, Outfit 500, 12px, --text-3, uppercase, 1.2px tracking
             Sort icon: 14px, appears on hover. Sorted: --primary-400
Data rows:   Figtree 400, 14px, --text-1. 52px row height.
             Hover: --bg-hover
             Selected: rgba(147,51,234,0.06) bg

Pagination:  Below table. Page size selector (left) + page nav (right).
             Outfit 500, 13px. Page buttons: --bg-elevated, active: --primary-500 bg.

Bulk actions: Appears above table when rows selected. Slide down animation.
Column types: text / badge / avatar+text / actions (icon buttons) / number / date
```

---

### SearchBar

Full-width, used on `/courses`, `/search`, and admin pages.

```
Height: 52px (large) / 40px (compact)
Background: --bg-elevated (standalone) / --bg-surface (in navbar)
Border: --border-default → --border-active on focus
Border-radius: 12px (standalone) / 8px (compact)
Left icon: Search (20px, --text-3)
Right: optional filter icon + keyboard shortcut hint (⌘K)
Dropdown results panel: --bg-overlay, shadow-xl, 12px radius, max-height 480px
```

---

### Notification Item

```
Container: --bg-surface, --border-default, hover --bg-hover
Layout: [dot indicator 8px] + [icon 32px circle] + [content] + [timestamp]
Unread: dot is --primary-500. Background: rgba(147,51,234,0.04)
Read: dot is --bg-elevated.
Text: Figtree 400, 14px, --text-1 (unread) / --text-2 (read)
Timestamp: Figtree 400, 12px, --text-3
```

---

## 2.3 Organisms

### Navbar

**Variants:** `public` (transparent→blur), `dashboard` (solid --bg-surface), `player` (minimal, dark).

```
Public Navbar:
[Logo]                    [Nav Links]                 [Sign In] [Get Started]
  ↓ scroll 40px: background: rgba(8,8,14,0.85), backdrop-filter: blur(20px)

Dashboard Navbar (top bar in sidebar layout):
[Hamburger (mobile only)]  [Page Title]  [Search]  [Notifications]  [Avatar+dropdown]

Player Navbar (minimal):
[← Back to Course]         [Course Title]            [Progress %]   [Notes icon]
```

**Logo:** "NovaEdge" Syne 700, 20px, --text-1 + " Academy" Outfit 500, 14px, --primary-400.

**Mobile:** Hamburger at right. Slide-in drawer from right: full-height, --bg-overlay bg, 280px width.

---

### Sidebar (Dashboard)

```
Width: 240px fixed (desktop), hidden (mobile — opens as drawer)
Background: --bg-surface
Border-right: --border-subtle
Padding: 24px 0

[Logo area — top 20px]
[Nav Sections — with section labels]
  [NavItem: icon + label + optional badge]
    Default: Outfit 500, 14px, --text-2, icon --text-3
    Active:  --primary-500 left border (3px), --primary-bg bg, --text-1, icon --primary-400
    Hover:   --bg-hover
[Bottom: User profile card + settings link]
```

**Dashboard Sections:**
- Main: Dashboard, My Courses, Learning Paths, Live Classes
- Learning: Assignments, Quizzes, Certificates, Badges
- Community: Feed, Network, Messages
- Account: Profile, Settings, Referrals, Help

---

### Admin Sidebar

```
Width: 256px. Background: --bg-base.
Groups with labels. Each item: 16px Lucide icon + Outfit 500, 13px label.
Active: --primary-500 bg pill spanning full width (8px h-padding), rounded 8px.
Danger items (logs, system): --error color.
```

---

### Footer

See landing page spec. Consistent across all public pages.

---

### Video Player (LMS)

See LMS Player page spec (Section 4.6).

---

---

# PART 3 — PATTERN LIBRARY

---

## 3.1 Form Patterns

**All forms:** max-width 480px (auth forms), full-width in settings, modal-constrained for inline forms.

**Form group:**
```
Label    — Outfit 500, 13px, --text-2, uppercase, 1px tracking, mb-2
Input    — 40px height, full-width
Hint     — Figtree 400, 12px, --text-3, mt-1 (helper text)
Error    — Figtree 400, 12px, --error, mt-1 with AlertCircle icon 12px
```

**Form sections:** Group related fields with a section label (Outfit 600, 15px, --text-1) and a --border-subtle bottom divider.

**Submit button:** Always last. Full-width on mobile, right-aligned on desktop. Show loading spinner on submit.

---

## 3.2 Empty States

Every list/grid/table needs an empty state.

```
Container: centered, padding 64px 24px
[Illustration or icon — 80px, --text-4, centered]
[Title — Outfit 600, 18px, --text-1]
[Description — Figtree 400, 14px, --text-2]
[Optional CTA button]
```

**Examples:**
- No courses enrolled → "You haven't enrolled yet. Browse courses →"
- Empty wishlist → "Your wishlist is empty. Find something you love →"
- No notifications → "You're all caught up!"
- No search results → "No results for '[query]'. Try different keywords."

---

## 3.3 Loading States

**Page load:** Show Skeleton components matching the expected layout. Never show a full-page spinner.
**Data fetch:** Skeleton for the specific data section (cards, table rows).
**Button submit:** Inline spinner inside button. Keep button size unchanged.
**Page transition:** Lenis handles scroll. Optional: top-of-page progress bar (3px, --primary-500, fixed).

---

## 3.4 Error States

**404 page:** See Misc pages section.
**500 page:** See Misc pages section.
**Inline errors:** Alert component with `danger` variant above form or below the failing section.
**Empty search:** Empty state component (see above).
**API failure on data section:** Replace section with ErrorCard showing "Failed to load" + retry button.

---

## 3.5 Confirmation Dialogs

Any destructive action (delete, unenroll, cancel subscription) must show a Modal:
- Title: "Are you sure?"
- Description: explain the consequence clearly.
- Buttons: [Cancel] (ghost) + [Yes, Delete] (danger) — right-aligned.
- Animation: scaleIn, 150ms.

---

---

# PART 4 — PAGE SPECIFICATIONS

---

## 4.1 Public Pages

### `/` — Landing Page

**Template:** PUBLIC_FULL | **Background:** --bg-base with --grad-hero-mesh

Sections (in order):
1. Navbar — transparent → blur on scroll
2. Hero — split 7/5, Display headline, CTA buttons, floating card mockup, social proof
3. Stats Bar — 4 metrics strip, count-up animation
4. Featured Courses — 6 cards, filter pills
5. Learning Paths — 4 path cards
6. How It Works — 3-step with line animation
7. AI Superpowers — split content + 3 feature cards
8. Featured Mentors — 4 mentor cards
9. Community Preview — split, feed mockup
10. Testimonials — 3 cards
11. Pricing Preview — 3 plan cards (Pro featured)
12. Final CTA Banner — --grad-primary bg, white text
13. Footer

**Key design notes:**
- Hero background: --grad-hero-mesh layered over 60px grid pattern (rgba(255,255,255,0.018))
- Hero headline "Hired." has --grad-text-main gradient text treatment
- Announcement badge before headline: purple pill with "🎓 India's #1 EdTech Platform"
- Alternating section backgrounds: base → surface (bg variation via radial-gradient overlay)

**Mobile:** Hero collapses to single column. Floating card hidden. Stats goes 2×2. All grids to 1-col.

---

### `/about` — About Us

**Template:** PUBLIC_FULL | **Layout:** Full-width sections

Sections:
1. **Hero:** H1 "Built by Developers, for Developers." + subtext + team photo grid
2. **Mission Block:** Split — large quote left, mission text right
3. **Our Story:** Timeline (founded → milestones, vertical line with dots)
4. **Stats:** Same Stats Bar component from landing
5. **Values:** 3-column card grid (icon + name + description)
6. **Team:** Grid of team member cards (photo + name + role + LinkedIn)
7. **Partners/Investors:** Logo row, grayscale → color on hover
8. **Join Us CTA:** Link to `/careers`

**Design notes:**
- Mission quote: Syne 800, 40px, --text-1, with large decorative quotation marks in --primary-700
- Timeline dots: 16px circle, --primary-500 bg for milestones, --bg-elevated for others
- Team cards: square photo crop (object-fit: cover), name Outfit 600, role --text-2

---

### `/contact` — Contact Us

**Template:** PUBLIC_FULL (centered content) | **Layout:** 2-column split

Left col (col-7): Contact form
- Fields: Name, Email, Subject, Message (textarea), Submit
- On success: replace form with success message (CheckCircle icon + "We'll get back to you in 24hrs")

Right col (col-5): Contact info card
- Address (Indore, MP)
- Email: contact@novaedgedigitallabs.tech
- Phone
- Business hours
- Social links (icon buttons)
- Map embed (if available) or decorative city illustration

**Background:** Subtle --grad-hero-mesh (lower opacity, 0.2)

---

### `/pricing` — Pricing & Subscriptions

**Template:** PUBLIC_FULL

Sections:
1. **Hero:** H1 "Simple, transparent pricing." + billing toggle (Monthly / Annual — Annual saves 30%)
2. **Plan Cards:** 3 columns — Free / Pro / Business. Pro is featured (see PlanCard spec).
3. **Feature Comparison Table:** Full breakdown. Rows = features, columns = plans. ✓ / ✗ / text value cells.
4. **FAQ:** Accordion, 6–8 questions about billing, refunds, team plans
5. **CTA:** "Not sure? Start free, upgrade when ready."

**Billing toggle:** Pill toggle. When Annual selected → show savings badges on plan cards ("Save ₹2,400/yr").

**Plan data:**
```
Free   — ₹0       5 courses, community, basic quizzes, no cert
Pro    — ₹499/mo  All courses, AI features, certs, mentor chat, 1:1 sessions
Business — Custom  Team seats, custom paths, admin, analytics, SSO
```

**FAQ Accordion:** --bg-surface bg, --border-default border, 12px radius. Question Outfit 600 15px, answer Figtree 400 15px --text-2. Animated height expand.

---

### `/careers` — Careers

**Template:** PUBLIC_FULL

Sections:
1. **Hero:** "Work on India's most ambitious learning platform." + subtext
2. **Values:** 4 culture cards
3. **Open Positions:** Filter by department (Engineering / Design / Marketing / Operations). Job listing cards.
4. **Perks:** Icon grid (Remote, Health insurance, Learning budget, etc.)
5. **Apply CTA**

**Job Card:**
```
--bg-surface, --border-default, 14px radius, padding 20px
[Role — Outfit 600, 17px] [Department badge] [Remote badge]
[Description — 2-line Figtree 400, 14px, --text-2]
[Location + Type] [Apply button →]
```

---

### `/business` — NovaEdge for Business

**Template:** PUBLIC_FULL | **Tone:** More corporate/B2B than the student-facing pages

Sections:
1. **Hero:** Split — Headline + B2B CTA (left) + Dashboard mockup (right)
2. **Trusted By:** Company logo strip
3. **Features:** 3-col grid (Team management, Custom paths, Analytics, SSO, Invoicing, Support)
4. **How it works for teams:** 3-step
5. **ROI Stats:** Impact numbers (% faster onboarding, etc.)
6. **Testimonials:** Corporate testimonials (HR managers, CTOs)
7. **Pricing:** "Contact Sales" CTA — no visible price for B2B
8. **Contact Sales Form:** Company name, team size, email, phone

---

### `/help-center` — Help Center

**Template:** PUBLIC_FULL

Sections:
1. **Hero:** Centered search bar — "How can we help you?" — large (52px height), prominent
2. **Categories:** 6–8 category cards (icon + label + article count). Click goes to filtered view.
3. **Popular Articles:** List of 5–6 most viewed help articles
4. **Contact Support:** If no answer found, show support ticket form or live chat CTA

**Category Card:** Icon (32px), label Outfit 600 15px, article count Figtree 400 13px --text-3. --bg-surface. 12px radius.

**Article list items:** Figtree 400, 15px, --text-1. File icon left. Arrow right. Hover → --text-primary.

---

### `/documentation` — Docs

**Template:** Custom — 3-panel layout: sidebar nav + content + optional right ToC

```
[240px left sidebar: doc tree nav] | [Main content, max-width 720px] | [200px right: table of contents]
```

**Left sidebar:** Collapsible sections, Figtree 400 14px. Active item: --primary-400. Nested items indented 12px.

**Content:** Prose styling — headings use font scale, body Figtree 400 16px 1.7 lh. Code blocks: --bg-elevated, JetBrains Mono 13px, 16px radius. Inline code: --bg-elevated, --cyan-400 text, 4px radius. Tables: --bg-surface bg, --border-default borders.

**Right ToC:** Sticky, Figtree 400 13px, --text-3 → active item --primary-400.

---

### `/privacy` & `/terms`

**Template:** PUBLIC_FULL (centered, narrow) | **Layout:** Single column, max-width 720px

Navbar + [Last updated date] + prose content + Footer.

Content styling: same as docs prose. Outfit 600 H2/H3 headers as section breaks.
No special design elements needed — clean, readable typography is the design.

---

## 4.2 Auth Pages

**Template for all auth pages:** PUBLIC_CENTERED — Navbar (simplified, just logo) + centered card + no footer.

**Auth Card:**
```
Width: 440px (max), centered vertically+horizontally
Background: --bg-surface
Border: --border-default
Border-radius: 20px
Padding: 40px
```

**Logo/Brand mark** above card. Page background: --bg-base with subtle --grad-hero-mesh (0.15 opacity).

---

### `/login`

**Card Content:**
- H2 "Welcome back" (Syne 700, 28px)
- Subtext "Don't have an account? [Register →]" (link in --primary-400)
- Google SSO button (white icon on --bg-elevated)
- Divider "or continue with email"
- Email input + Password input (with show/hide toggle)
- Row: [Remember me toggle] + [Forgot Password? link]
- Submit button "Sign In" (primary, full-width, lg)
- Below card: "By signing in, you agree to our Terms & Privacy Policy." (Caption, --text-3)

---

### `/register`

Same card pattern.

**Multi-step or single form — single form preferred:**
- Full Name + Username (inline 2-col)
- Email
- Password + Confirm Password
- Role toggle: "I am a Student" / "I am a Mentor" (pill selector)
- Terms checkbox
- Submit "Create Account" (primary, full-width)

**Progress indicator** if multi-step: dots at top of card.

---

### `/verify` — Verify Email/OTP

Centered card. Icon (MailCheck, 48px, --primary-400) at top.

H2 "Check your email". Subtext with email address shown.

**OTP Input:** 6 individual character inputs (40px × 52px each), inline, 8px gap, Syne 700, 24px.
Auto-focus next on input, auto-submit on last digit.

"Didn't receive it? [Resend in 0:45]" — countdown timer.

---

### 2FA Page

Same pattern as OTP verify. Options: Authenticator app code OR backup code. Tab switcher between the two.

---

### `/forgot-password` & `/reset-password`

Two separate screens. Forgot: just email input + "Send Reset Link". Reset: new password + confirm.

Reset page: Add password strength indicator (thin progress bar under input — red/orange/green).

---

## 4.3 Course Discovery Pages

### `/courses` — Course Catalog

**Template:** PUBLIC_FULL | **Layout:** Sidebar filter + main content grid

```
[Full-width search bar at top]
────────────────────────────────────────────────
[Filter Sidebar 260px] | [Results grid — 3 col]
  Categories (accordion)   Sort: [dropdown]
  Level                    Active filters chips
  Duration                 [Course cards]
  Price range (slider)     [Pagination]
  Rating                   
  Language                 
```

**Filter Sidebar:** --bg-surface, --border-right, sticky. Accordion sections (Outfit 600 14px headers). Each filter: checkbox + label (Figtree 400 14px) + count badge.

**Active Filters Row:** Horizontal chips above results. Each chip: applied filter + X to remove. "Clear All" link right.

**Sort dropdown:** "Most Popular / Newest / Highest Rated / Price: Low→High / Price: High→Low"

**Results header:** "Showing 47 courses for 'React'" — Figtree 400 14px --text-2

**Mobile:** Filter sidebar in a bottom sheet / drawer triggered by "Filters" button.

---

### `/search` — Search Results

Same as `/courses` but with search query prominently shown and search bar pre-filled.

Show result tabs: Courses | Mentors | Learning Paths | Blog Posts — with counts.

**No results state:** Show "No results for 'xyz'" + suggestions (similar terms, popular courses).

---

### `/courses/[id]` — Course Detail Page

**Template:** PUBLIC_FULL | Most complex public page.

```
[Sticky top bar on scroll: Course title + CTA + Progress (if enrolled)]
─────────────────────────────────────────────────────────────
[Breadcrumb: Courses > Category > Course Name]

[LEFT CONTENT — col-8]          [RIGHT SIDEBAR — col-4, sticky]
  Hero banner (16:9 img)          ┌─────────────────────────┐
  Title (H1)                      │ [Course Preview Card]   │
  Rating row + meta               │  Thumbnail + Play btn   │
  Tags/badges                     │  Price                  │
  Description                     │  Enroll button          │
  What you'll learn (checklist)   │  ──────────────────────  │
  Course Curriculum (accordion)   │  Includes:              │
  Instructor section              │  • 12.5 hrs video       │
  Reviews section                 │  • Certificate          │
  Related courses                 │  • AI Notes             │
                                  │  • Lifetime access      │
                                  └─────────────────────────┘
```

**Course Preview Card:** Fixed sidebar card. On scroll past hero → becomes `position: sticky; top: 88px`.

**Curriculum Accordion:**
- Section headers: Outfit 600, 15px, --bg-elevated bg. Expand/collapse.
- Lecture rows: icon (Play/Lock/Quiz), title (Figtree 400 14px), duration, preview badge if free.
- Locked lectures: Lock icon, --text-4.

**What You'll Learn:** 2-col checklist. CheckCircle icon (--success), Figtree 400 14px.

**Instructor section:** Large avatar (80px), name H3, bio, stats, link to mentor profile.

**Reviews:** Rating breakdown bar chart (5★→1★ with proportional bars in --gold-400) + individual review cards.

**Mobile:** Sidebar card collapses below hero. Sticky bottom bar with price + enroll.

---

### `/learning-paths` — Learning Paths Catalog

**Template:** PUBLIC_FULL

Hero: H1 + subtext + path count badge.

Filter row: difficulty level pills (Beginner / Intermediate / Advanced).

**Path Detail Card (expanded version):**
```
--bg-surface, 20px radius, 28px padding, hover lift

[Icon 52px] [Name H3] [Difficulty badge]
[Description — 2-line clamp, Figtree 400 15px]
[Course Count] [Total Hours] [Enrolled Count]
[Skill chips row]
[Progress bar (if in progress)] or [Start Path button]
```

---

### `/mentors` — Mentor Directory

**Template:** PUBLIC_FULL

Hero: search bar + "Browse [N] Mentors"
Filter: expertise (tags), rating, language

**Grid:** 4-col desktop. MentorCard component.

Show "Book a Session" badge on mentors who offer live 1:1 sessions.

---

### `/mentor/[id]` — Mentor Profile

**Template:** PUBLIC_FULL

```
[Mentor Hero: bg with mesh, avatar xl, name, expertise, stats, "Message" + "Book Session" buttons]

Tabs: About | Courses (N) | Reviews (N) | Schedule

About tab: Bio, skills, education, social links
Courses tab: Grid of CourseCards by this mentor
Reviews tab: Student reviews of mentor sessions
Schedule tab: Available time slots (calendar widget or simple list)
```

---

### `/hashtag/[tag]` — Tag/Category Page

**Template:** PUBLIC_FULL

Similar to `/courses` but filtered by tag. Show tag title as H1, description, course count.
Breadcrumb: Categories > [Tag Name].

---

## 4.4 E-Commerce Pages

### `/checkout` — Cart & Checkout

**Template:** PUBLIC_CENTERED | **Layout:** 2-column (items + order summary)

```
[LEFT — col-7: Checkout Steps]    [RIGHT — col-5: Order Summary Card]
  Step 1: Course(s) in cart          Sticky card
  Step 2: Account (if guest)         [Items list]
  Step 3: Payment                    [Subtotal]
                                     [Coupon input + Apply]
                                     [Discount row]
                                     [Total]
                                     [Secure payment badge]
```

**Cart Item Row:**
Thumbnail (60px) + title + mentor + remove icon. Price right-aligned.

**Coupon Input:** Input + "Apply" button inline. On success: green badge with savings amount.

**Progress steps:** Numbered step indicator at top (Outfit 500, 14px). Completed: --success. Active: --primary-500. Upcoming: --text-4.

---

### `/payment` — Payment Processing

Step 3 of checkout. Payment method selector:
- Cards (default): UPI | Card | Net Banking | EMI tabs.
- Card form: card number, expiry, CVV — styled with card issuer logo auto-detection.
- UPI: UPI ID input + QR code.
- "Pay ₹999 →" large primary button.
- After submit: fullscreen loading state → success/failure screen.

**Success screen:** CheckCircle (64px, --success), "Payment Successful!", receipt summary, CTA to "Start Learning".

---

### `/subscription` — Subscription Management

**Template:** DASHBOARD_SIDEBAR | **Accessible only when logged in**

Current plan card (status, renewal date, features). Upgrade/downgrade options. Payment history table. Cancel plan option (trigger confirmation modal).

---

## 4.5 Student Dashboard Pages

All pages use `DASHBOARD_SIDEBAR` template. Sidebar is persistent.

---

### `/user/dashboard` — Student Dashboard

```
[Welcome header: "Good morning, Amit 👋" + date]
[Stats row: 4 StatCards — Courses enrolled / Hours learned / Streak / Certificates]
[Continue Learning: 2-3 CourseCards with progress, horizontal scroll on mobile]
[Upcoming: Next live class card]
[Achievements: 3 recent badges earned]
[Activity chart: 7-day/30-day learning activity bar chart]
[Recommended for you: 3 CourseCards]
```

---

### `/enrollments` — My Courses

Filter tabs: All | In Progress | Completed | Archived.

Grid (3-col) of CourseCard (enrolled variant — shows progress bar + Continue button).

Sort: Last accessed / Most progress / Alphabetical.

---

### `/wishlist`

Grid of CourseCards with heart icon (filled --error) in top-right corner of thumbnail. "Enroll Now" replaces "Preview" on hover.

Empty state: "Your wishlist is empty. [Browse Courses]"

---

### `/profile` — My Profile (Edit)

**Layout:** 2-column. Left col: profile card preview. Right col: edit form.

Sections:
- Basic info (avatar upload, name, username, bio)
- Professional (headline, company, LinkedIn URL)
- Skills (tag input with autocomplete)
- Preferences (notifications, language, timezone)

**Avatar upload:** Click to upload area. Circular crop preview. Drag + drop support.

---

### `/[username]` — Public User Profile

**Template:** PUBLIC_FULL (viewable without login)

```
[Profile Hero: cover image + avatar + name + headline + stats + action buttons]
Tabs: About | Courses | Achievements | Posts

About: bio, skills, social links
Courses: enrolled/completed courses (only public ones)
Achievements: badges, certificates
Posts: community posts
```

---

### `/settings` — Account Settings

**Layout:** Left nav (settings categories) + right content panel.

Settings categories: Account · Password & Security · Notifications · Privacy · Billing · Connected Accounts · Delete Account.

Each section: form with section heading. Save button per section (not one global save). Toast on save.

**Danger Zone (Delete Account):** Red section at bottom with red border, explicit warning text, requires typing "DELETE" to confirm.

---

### `/referrals` — Referrals & Rewards

```
[Hero card: Your referral link + copy button + share buttons]
[Stats: Total referred / Earnings / Pending / Paid out]
[How it works: 3 steps]
[Leaderboard: Top referrers this month]
[Withdrawal: Earnings balance + Withdraw button]
[History table: referral events, status, amount]
```

---

### `/certificate` — My Certificates

Grid of certificate cards. Each card: course name, completion date, credential ID, Download (PDF) + Share (LinkedIn) buttons.

**Certificate Preview:** A-4 landscape. --bg-base with --grad-primary border accent. Syne 700 for name + course. Gold seal graphic.

---

### `/badges` — Badges & Gamification

Two sections:
1. **Earned badges** (grid, colorful)
2. **Locked badges** (grid, grayscale, with "X more to unlock" text)

Each badge: 80px illustration, name (Outfit 600, 14px), description (Figtree 400, 12px, --text-2).

**XP Progress:** Top section — XP bar, current level (e.g., "Level 7: Architect"), XP to next level.

**Streak tracker:** Calendar heatmap showing daily learning activity. Today highlighted.

---

### Purchase History / Invoices

DataTable: Date | Course | Amount | Status | Invoice.

Status badge: "Paid" (--success) / "Refunded" (--warning) / "Failed" (--error).

Download invoice: PDF download trigger.

---

## 4.6 LMS Player Pages

**Template:** LMS_PLAYER — No standard Navbar/Footer. Full-screen learning environment.

```
┌──────────────────── Top Bar (56px, --bg-base) ─────────────────────────┐
│  [← Course]   [Course Title truncated]           [Progress] [Notes] [⋮]│
└──────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────┬──────────────────────────────┐
│                                 │  [Curriculum Sidebar]        │
│   [Video Player / Content Area] │   Section 1 (3 lectures)    │
│                                 │     ✓ Intro (3:42)          │
│                                 │     ▶ React Basics (14:22)  │ 
│                                 │     ○ Hooks Deep Dive        │
│                                 │   Section 2...              │
│                                 │  [Toggle sidebar button]    │
└─────────────────────────────────┴──────────────────────────────┘
┌──────────────────── Bottom Tab Bar ─────────────────────────────┐
│  Overview | Q&A | Notes | Resources | Reviews | Transcript      │
└─────────────────────────────────────────────────────────────────┘
```

**Video Player:**
- Custom controls bar (not native browser). Background: gradient-to-top from black.
- Controls: Play/Pause | Progress scrubber | Volume | Speed (0.75x, 1x, 1.25x, 1.5x, 2x) | Quality | Captions | Fullscreen.
- Scrubber: --primary-500 progress, preview thumbnail on hover.
- 5-second forward/backward double-tap on mobile.

**Curriculum Sidebar:**
- Completed lectures: CheckCircle (--success).
- Current lecture: --primary-400 text + left bar indicator.
- Locked lectures: Lock icon, --text-4.
- Toggle: slide in/out animation (width: 0 → 320px).

**Bottom Tabs:**
- `Overview`: Course + current section description.
- `Q&A`: Thread-based discussion. Post question, reply, upvote.
- `Notes`: Personal notes editor. Auto-saves. Timestamped (jumps to video position on click).
- `Resources`: Downloadable files attached to lecture.
- `Reviews`: Write/edit your review. See all reviews.
- `Transcript`: Scrolling transcript, auto-highlights current word. Click to jump.

---

### Assignment Submission

Replace video area with:
- Assignment prompt (rendered markdown)
- File upload drop zone (PDF, ZIP, images, code files)
- Text submission area (optional)
- Submission deadline badge
- Submit button
- If submitted: submission preview + "submitted on [date]" + feedback section

---

### Quiz / Assessment

Replace video area with quiz UI:
- Question N of N header + progress bar
- Question text (Outfit 600, 18px)
- Answer options: card radio buttons (--bg-surface, hover --bg-elevated, selected --primary-bg with --border-active)
- For code questions: Monaco editor embed
- Timer (if timed): top-right countdown, turns --error when < 20% remaining
- Submit answer → next question → final score screen

**Score screen:** Large circular progress ring (--grad-primary), score %, pass/fail badge, "Review answers" + "Continue course" buttons.

---

### Live Class View

Full screen. Embedded Zoom/WebRTC player (primary) or iframe.
- Custom overlay bar: attendee count, hand raise, chat toggle, leave button.
- Chat panel: slide-in from right, 280px.
- Pre-class countdown screen if class hasn't started.

---

## 4.7 Community & Social Pages

### `/community` — Community Feed

**Template:** DASHBOARD_SIDEBAR | **Layout:** 3-column (desktop)

```
[240px Sidebar] | [Feed 560px] | [Right panel 280px — Who to follow, trending topics]
```

**Feed:**
- Create Post bar at top (avatar + "Share something..." input). Click expands composer modal.
- Post cards: avatar + name + timestamp + content (text/image/code snippet) + like/comment/share actions.
- Filter tabs: For You / Following / All

**Post Card:**
- Background: --bg-surface, --border-default, 14px radius, 20px padding.
- Like button: heart icon, --text-3 → --error on liked. Count.
- Comment button: MessageCircle icon. Count.
- Share: Link icon.
- Author avatar click → public profile.

**Composer Modal:** Title "Create Post". Textarea (min-height 120px). Attach image, code, link. Audience selector (Public / Connections). Post button.

**Right Panel:**
- "Who to follow" — 3 MentorCard mini items with Follow button.
- "Trending Tags" — tag pills with post count.

---

### `/network` — Connections / Friends

**Tabs:** My Connections | Pending Requests | Discover People

**Discover grid:** UserCard (avatar + name + role + mutual connections count + Connect button).
Filter: by skill, location, batch.

**Pending:** Two sections — Received requests (Accept/Decline) + Sent requests (Withdraw).

---

### `/messages` — Real-time Chat

**Template:** Full custom layout (no standard sidebar).

```
[Conversation list 300px] | [Chat window flex-1] | [User info panel 260px optional]
```

**Conversation List:** Search input + sorted by latest. Active item: --bg-elevated. Unread: bold name + count badge.

**Chat Window:**
- Messages: bubble layout. Own: right-aligned, --primary-bg bg. Other: left-aligned, --bg-elevated.
- Figtree 400, 14px. Timestamps on hover. Seen indicator.
- Input bar: textarea + send button + attach + emoji.
- Typing indicator: "..." animated dots.

**Mobile:** Conversation list is the default view. Tap to open chat. Back button to return.

---

### Post Details (`/community/[postId]`)

Full post expanded + full comment thread. Nested comments (2 levels max). Comment composer at top. Breadcrumb: Community > Post.

---

### Notifications (`/notifications`)

Full-page version of notification dropdown. Grouped by: Today / Yesterday / This Week. Mark all read button. Each item: NotificationItem component.

---

## 4.8 Blog Pages

### `/blog` — Blog Listing

**Template:** PUBLIC_FULL

Hero: H1 "From Our Tech Labs." + subtext + featured post card (full-width horizontal, big thumbnail).

Filter row: topic tag pills.

Grid: 3-col cards. BlogCard: thumbnail + category badge + title (H3) + excerpt (2-line) + author + date + read time.

---

### `/blog/[slug]` — Blog Post

**Template:** PUBLIC_FULL | **Layout:** Narrow content + sticky right ToC (same as docs)

```
Content max-width: 720px, centered
Right sidebar: ToC (sticky, 200px) — disappears on mobile
```

**Post Header:** category badge + H1 + excerpt + author card (avatar + name + date + read time) + cover image.

**Prose content:** Same as docs prose styling. Code blocks with syntax highlight (Shiki/Prism with dark theme).

**Footer:** Author bio card + share buttons + "Related Posts" (3 cards).

---

## 4.9 Admin Dashboard Pages

All admin pages use `ADMIN_SIDEBAR` template.

**Admin Layout:**
```
[256px dark sidebar] | [Main content area]
                        [Topbar: page title + breadcrumb + actions]
                        [Page content]
```

Topbar: Page title (Syne 700, 22px) + breadcrumb (Figtree 400, 13px, --text-3) + right-side action buttons (Export, Add New, etc.)

---

### `/admin/dashboard` — Overview

```
[Stats row: 4 StatCards — Total users, Active courses, Revenue (₹), New enrollments today]
[Charts row]
  Left: Revenue line chart (7d/30d/90d toggle)
  Right: Enrollment donut chart by category
[Recent activity table: last 10 actions across platform]
[Quick actions: Create Course, Add User, Send Announcement, Generate Report]
```

---

### `/admin/users` — User Management

DataTable: Avatar+Name | Email | Role | Status | Joined | Actions.

Actions: View profile, Edit role, Suspend, Delete.

Top: search + filter (Role / Status) + "Add User" button.

User detail panel: slide-in right drawer (or modal) with full user info + activity log.

---

### `/admin/courses` — Course Management

DataTable: Thumbnail | Title | Instructor | Category | Enrolled | Status | Actions.

Status badges: Published / Draft / Under Review / Archived.

"Add Course" → multi-step form (Details → Content → Pricing → Review).

---

### `/admin/enrollments`

DataTable: User | Course | Date | Progress | Payment | Status.

Filter: date range picker + course filter + status filter.

Export to CSV button.

---

### `/admin/mentors`

DataTable: Avatar+Name | Expertise | Courses | Students | Rating | Status | Actions.

"Approve Mentor Application" section if there are pending applications.

---

### `/admin/blogs` — Content Management

DataTable: Title | Author | Category | Status | Published Date | Views | Actions.

"New Post" → full-screen markdown editor (MDX support) with live preview split.

---

### `/admin/certificates` & `/admin/badges`

DataTable with bulk actions. Certificate: User | Course | Issued Date | ID | Revoke.
Badge: Name | Icon | Criteria | Awarded Count | Edit/Delete.

---

### `/admin/testimonials`

DataTable: User | Content | Rating | Status (Pending/Approved/Rejected) | Source.

Approve/reject with one click. Preview testimonial card before approving.

---

### `/admin/careers` — Applications

Jobs list + applications table. Per-job: open/close toggle, applicant count.

Application detail: resume download, interview status update, notes.

---

### `/admin/support` — Support Tickets

DataTable: Ticket ID | User | Subject | Priority | Status | Assigned To | Created.

Priority badges: Low/Medium/High/Critical.

Ticket detail: full conversation thread (like `/messages` but in drawer). Status + assign dropdowns.

---

### `/admin/analytics` — Analytics & Reports

Rich dashboard:
- Traffic section: page views, sessions, bounce rate, avg session duration
- Revenue: MRR, ARR, new subscriptions, churn rate — line charts
- Content: top courses by enrollment, completion rates, avg rating
- User behavior: feature usage heatmap, funnel (Visit → Register → Enroll → Complete)

Date range: presets (7d, 30d, 90d, custom). All charts have export (PNG/CSV).

---

### `/admin/audit` — System Audit Logs

Searchable, filterable log table: Timestamp | User | Action | Resource | IP | Status.

Read-only. No actions possible (audit integrity). Color-coded actions: Create (--success), Update (--info), Delete (--error), Login (--text-2).

Filter: user, action type, date range, status (success/failure).

---

## 4.10 Misc / Utility Pages

### 404 — Not Found

**Template:** Fullscreen centered. No Navbar/Footer (just logo + single link home).

Large illustrated "404" or ghost illustration. "Oops, this page doesn't exist." H1.
Subtext. Two buttons: "Go Home" (primary) + "Browse Courses" (ghost).

Background: --bg-base with --grad-hero-mesh.

---

### 500 — Server Error

Same structure. "Something went wrong on our end." Message + "Try again" (reloads) + "Go Home".

---

### `/drive-upload` — File Upload UI

Centered card. Large drop zone area:
- Dashed border --border-strong, 20px radius
- Upload icon (48px, --text-4) + "Drop files here or click to browse"
- Drag active state: --border-active, --primary-bg bg tint
- File list below with progress bars and remove icons

---

---

# PART 5 — IMPLEMENTATION GUIDE

---

## 5.1 File & Folder Structure

```
src/
├── app/
│   ├── (public)/          ← public layout group
│   │   ├── layout.tsx     ← Navbar + Footer wrapper
│   │   ├── page.tsx       ← /
│   │   ├── about/
│   │   ├── pricing/
│   │   └── ...
│   ├── (auth)/            ← auth layout group (no footer, minimal nav)
│   │   ├── login/
│   │   ├── register/
│   │   └── ...
│   ├── (dashboard)/       ← authenticated layout group
│   │   ├── layout.tsx     ← Sidebar + Topbar wrapper
│   │   ├── user/
│   │   ├── enrollments/
│   │   └── ...
│   ├── (admin)/           ← admin layout group
│   │   ├── layout.tsx     ← Admin sidebar
│   │   └── admin/
│   ├── courses/[id]/
│   │   └── learn/         ← LMS player (own layout)
│   └── ...
│
├── components/
│   ├── ui/                ← Atoms (Button, Badge, Avatar, Input...)
│   ├── shared/            ← Molecules (CourseCard, MentorCard, Modal...)
│   ├── layout/            ← Organisms (Navbar, Footer, Sidebar...)
│   └── sections/          ← Landing page sections, reused marketing sections
│
├── lib/
│   ├── fonts.ts
│   ├── animations.ts
│   ├── utils.ts
│   └── api/               ← API call wrappers
│
└── styles/
    └── globals.css        ← All tokens + base styles
```

---

## 5.2 globals.css Architecture

```css
/* 1. TOKENS — all CSS custom properties */
:root {
  /* backgrounds */
  --bg-base: #08080E;
  /* ... all tokens ... */

  /* typography */
  --font-display: var(--font-syne), system-ui, sans-serif;
  --font-ui:      var(--font-outfit), system-ui, sans-serif;
  --font-body:    var(--font-figtree), system-ui, sans-serif;
  --font-mono:    var(--font-jetbrains), monospace;

  /* transitions */
  --transition-fast:     150ms ease;
  --transition-default:  200ms ease;
  --transition-slow:     400ms ease;
  --ease-out-expo:       cubic-bezier(0.22, 1, 0.36, 1);
}

/* 2. RESET — minimal */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg-base);
  color: var(--text-1);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

/* 3. TYPOGRAPHY BASE */
h1, h2 { font-family: var(--font-display); }
h3, h4, h5, h6 { font-family: var(--font-ui); }
p, li, span { font-family: var(--font-body); }
code, pre { font-family: var(--font-mono); }
a { color: var(--primary-400); text-decoration: none; }
a:hover { color: var(--primary-300); }

/* 4. UTILITY CLASSES */
.container { max-width: 1280px; margin: 0 auto; padding: 0 80px; }
.section-padding { padding: 96px 0; }
.grad-text { background: var(--grad-text-main); -webkit-background-clip: text; color: transparent; }

/* 5. SCROLLBAR */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-surface); }
::-webkit-scrollbar-thumb { background: var(--bg-elevated); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--border-strong); }

/* 6. SELECTION */
::selection { background: rgba(147,51,234,0.3); color: var(--text-1); }
```

---

## 5.3 Tailwind Config Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-base':      'var(--bg-base)',
        'bg-surface':   'var(--bg-surface)',
        'bg-elevated':  'var(--bg-elevated)',
        'bg-overlay':   'var(--bg-overlay)',
        'primary':      { 300: 'var(--primary-300)', 400: 'var(--primary-400)', 500: 'var(--primary-500)', 600: 'var(--primary-600)' },
        'cyan-accent':  { 400: 'var(--cyan-400)', 500: 'var(--cyan-500)' },
        'gold':         { 400: 'var(--gold-400)', 500: 'var(--gold-500)' },
        'text':         { 1: 'var(--text-1)', 2: 'var(--text-2)', 3: 'var(--text-3)', 4: 'var(--text-4)' },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        ui:      ['var(--font-ui)'],
        body:    ['var(--font-body)'],
        mono:    ['var(--font-mono)'],
      },
      backgroundImage: {
        'grad-primary':   'var(--grad-primary)',
        'grad-learn':     'var(--grad-learn)',
        'grad-gold':      'var(--grad-gold)',
        'grad-hero-mesh': 'var(--grad-hero-mesh)',
      },
    },
  },
}
```

---

## 5.4 Priority Build Order

Build in this exact sequence to avoid rework:

```
Phase 1 — Foundation (do these FIRST, everything depends on them)
  [ ] globals.css with all tokens
  [ ] lib/fonts.ts
  [ ] lib/animations.ts
  [ ] tailwind.config.js extension
  [ ] components/ui/Button.tsx
  [ ] components/ui/Badge.tsx
  [ ] components/ui/Avatar.tsx
  [ ] components/ui/Input.tsx
  [ ] components/layout/Navbar.tsx
  [ ] components/layout/Footer.tsx

Phase 2 — Core Molecules
  [ ] components/shared/CourseCard.tsx   (most reused)
  [ ] components/shared/MentorCard.tsx
  [ ] components/shared/Modal.tsx
  [ ] components/shared/DataTable.tsx    (admin dependency)
  [ ] components/ui/Skeleton.tsx

Phase 3 — Public Pages
  [ ] / (Landing) — all sections
  [ ] /courses (catalog)
  [ ] /courses/[id] (detail)
  [ ] /pricing

Phase 4 — Auth
  [ ] /login, /register, /verify, /reset-password

Phase 5 — Dashboard
  [ ] layout: Sidebar
  [ ] /user/dashboard
  [ ] /enrollments
  [ ] LMS Player

Phase 6 — Community
  [ ] /community, /messages, /network

Phase 7 — Admin
  [ ] Admin Sidebar layout
  [ ] /admin/dashboard
  [ ] All admin CRUD pages

Phase 8 — Remaining
  [ ] /about, /careers, /blog, /help-center, /docs
  [ ] 404, 500, utility pages
```

---

*End of DESIGN.md — v1.0*
*This is a living document. Update as decisions change.*
*Keep page specs in sync with backend API contracts.*
Done
